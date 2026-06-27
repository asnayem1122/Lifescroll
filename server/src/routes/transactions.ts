import { Router, Response } from 'express';
import mongoose, { QueryFilter } from 'mongoose';
import Transaction, { ITransaction } from '../models/Transaction';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

const sanitizeString = (str: unknown): string | undefined => {
  if (typeof str !== 'string') return undefined;
  return str.replace(/<[^>]*>/g, '').trim();
};

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, amount, type, category, date, note, recurring, recurringInterval } = req.body;
    const transaction = await Transaction.create({
      userId: req.userId,
      title: sanitizeString(title),
      amount,
      type,
      category,
      date: date || new Date(),
      note: sanitizeString(note),
      recurring: recurring || false,
      recurringInterval: recurring ? (recurringInterval || 'monthly') : undefined,
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { type, category, startDate, endDate, page = '1', limit = '10' } = req.query;
    const filter: QueryFilter<ITransaction> = { userId: req.userId };

    if (typeof type === 'string') filter.type = type as 'income' | 'expense';
    if (typeof category === 'string') filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (typeof startDate === 'string') filter.date.$gte = new Date(startDate);
      if (typeof endDate === 'string') filter.date.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ date: -1 }).skip(skip).limit(limitNum),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      transactions,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.get('/summary', async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [monthlySummary, yearlySummary, categoryBreakdown] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.userId), date: { $gte: startOfMonth } } },
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.userId), date: { $gte: startOfYear } } },
        {
          $group: {
            _id: { $month: '$date' },
            income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
            expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.userId), type: 'expense', date: { $gte: startOfYear } } },
        {
          $group: {
            _id: '$category',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),
    ]);

    const income = monthlySummary.find((s) => s._id === 'income')?.total || 0;
    const expense = monthlySummary.find((s) => s._id === 'expense')?.total || 0;

    res.json({
      monthly: { income, expense, balance: income - expense },
      yearlyTrend: yearlySummary,
      categoryBreakdown,
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const updates = { ...req.body };
    if (updates.title !== undefined) updates.title = sanitizeString(updates.title);
    if (updates.note !== undefined) updates.note = sanitizeString(updates.note);
    if (updates.recurring !== undefined) updates.recurring = Boolean(updates.recurring);
    if (updates.recurringInterval !== undefined && updates.recurring) {
      updates.recurringInterval = updates.recurringInterval;
    } else if (updates.recurring === false) {
      updates.recurringInterval = undefined;
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Generate recurring transactions for the current period
router.post('/generate-recurring', async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const recurringTxs = await Transaction.find({
      userId: req.userId,
      recurring: true,
    });

    const created: string[] = [];
    for (const tx of recurringTxs) {
      const txDate = new Date(tx.date);
      let nextDate: Date | null = null;

      switch (tx.recurringInterval) {
        case 'daily':
          nextDate = new Date(txDate);
          nextDate.setDate(nextDate.getDate() + 1);
          while (nextDate <= endOfMonth) {
            const exists = await Transaction.findOne({
              userId: req.userId,
              title: tx.title,
              amount: tx.amount,
              category: tx.category,
              date: {
                $gte: new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate()),
                $lt: new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 1),
              },
            });
            if (!exists) {
              await Transaction.create({
                userId: req.userId,
                title: tx.title,
                amount: tx.amount,
                type: tx.type,
                category: tx.category,
                date: new Date(nextDate),
                note: tx.note,
                recurring: true,
                recurringInterval: tx.recurringInterval,
              });
              created.push(tx.title);
            }
            nextDate.setDate(nextDate.getDate() + 1);
          }
          break;
        case 'weekly':
          nextDate = new Date(txDate);
          nextDate.setDate(nextDate.getDate() + 7);
          while (nextDate <= endOfMonth) {
            const exists = await Transaction.findOne({
              userId: req.userId,
              title: tx.title,
              amount: tx.amount,
              category: tx.category,
              date: {
                $gte: new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate()),
                $lt: new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 1),
              },
            });
            if (!exists) {
              await Transaction.create({
                userId: req.userId,
                title: tx.title,
                amount: tx.amount,
                type: tx.type,
                category: tx.category,
                date: new Date(nextDate),
                note: tx.note,
                recurring: true,
                recurringInterval: tx.recurringInterval,
              });
              created.push(tx.title);
            }
            nextDate.setDate(nextDate.getDate() + 7);
          }
          break;
        case 'monthly':
          nextDate = new Date(txDate.getFullYear(), txDate.getMonth() + 1, txDate.getDate());
          if (nextDate <= endOfMonth) {
            const exists = await Transaction.findOne({
              userId: req.userId,
              title: tx.title,
              amount: tx.amount,
              category: tx.category,
              date: {
                $gte: new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate()),
                $lt: new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 1),
              },
            });
            if (!exists) {
              await Transaction.create({
                userId: req.userId,
                title: tx.title,
                amount: tx.amount,
                type: tx.type,
                category: tx.category,
                date: new Date(nextDate),
                note: tx.note,
                recurring: true,
                recurringInterval: tx.recurringInterval,
              });
              created.push(tx.title);
            }
          }
          break;
        case 'yearly':
          nextDate = new Date(txDate.getFullYear() + 1, txDate.getMonth(), txDate.getDate());
          if (nextDate <= endOfMonth) {
            const exists = await Transaction.findOne({
              userId: req.userId,
              title: tx.title,
              amount: tx.amount,
              category: tx.category,
              date: {
                $gte: new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate()),
                $lt: new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate() + 1),
              },
            });
            if (!exists) {
              await Transaction.create({
                userId: req.userId,
                title: tx.title,
                amount: tx.amount,
                type: tx.type,
                category: tx.category,
                date: new Date(nextDate),
                note: tx.note,
                recurring: true,
                recurringInterval: tx.recurringInterval,
              });
              created.push(tx.title);
            }
          }
          break;
      }
    }

    res.json({ created: created.length, titles: [...new Set(created)] });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
