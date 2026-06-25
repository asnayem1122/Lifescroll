import { Router, Response } from 'express';
import Habit from '../models/Habit';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

const sanitizeString = (str: unknown): string | undefined => {
  if (typeof str !== 'string') return undefined;
  return str.replace(/<[^>]*>/g, '').trim();
};

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ order: 1 });
    res.json(habits);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, timeOfDay, order } = req.body;
    const maxOrder = await Habit.findOne({ userId: req.userId }).sort({ order: -1 });
    const newOrder = order ?? (maxOrder ? maxOrder.order + 1 : 0);

    const habit = await Habit.create({
      userId: req.userId,
      name: sanitizeString(name),
      category,
      timeOfDay,
      order: newOrder,
      active: true,
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.put('/reorder', async (req: AuthRequest, res: Response) => {
  try {
    const { orders } = req.body;
    const updates = orders.map(({ id, order }: { id: string; order: number }) =>
      Habit.updateOne({ _id: id, userId: req.userId }, { order })
    );
    await Promise.all(updates);
    res.json({ message: 'Reordered successfully' });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const updates = { ...req.body };
    if (updates.name !== undefined) updates.name = sanitizeString(updates.name);

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );
    if (!habit) {
      res.status(404).json({ error: 'Habit not found' });
      return;
    }
    res.json(habit);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!habit) {
      res.status(404).json({ error: 'Habit not found' });
      return;
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
