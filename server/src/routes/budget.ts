import { Router, Response } from 'express';
import mongoose from 'mongoose';
import Budget from '../models/Budget';
import Transaction from '../models/Transaction';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const budget = await Budget.findOne({ userId: req.userId, month });

    const spending = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          type: 'expense',
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' },
        },
      },
    ]);

    const spendingMap: Record<string, number> = {};
    spending.forEach((s) => { spendingMap[s._id] = s.spent; });

    const limits = budget?.limits || [];

    const budgetWithSpending = limits.map((l) => ({
      category: l.category,
      limit: l.limit,
      spent: spendingMap[l.category] || 0,
      percentage: l.limit > 0 ? Math.min((spendingMap[l.category] || 0) / l.limit * 100, 100) : 0,
    }));

    res.json({ month, budgets: budgetWithSpending });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.put('/', async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const { limits } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { userId: req.userId, month },
      { userId: req.userId, month, limits },
      { upsert: true, new: true, runValidators: true }
    );

    res.json(budget);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.get('/heatmap', async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const data = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.userId),
          type: 'expense',
          date: { $gte: startOfYear },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
