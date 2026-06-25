import { Router, Response } from 'express';
import mongoose, { QueryFilter } from 'mongoose';
import HabitLog, { IHabitLog } from '../models/HabitLog';
import Habit from '../models/Habit';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { habitId, date, completed } = req.body;
    const habit = await Habit.findOne({ _id: habitId, userId: req.userId });
    if (!habit) {
      res.status(404).json({ error: 'Habit not found' });
      return;
    }

    const log = await HabitLog.findOneAndUpdate(
      { userId: req.userId, habitId, date },
      {
        userId: req.userId,
        habitId,
        date,
        completed,
        completedAt: completed ? new Date() : undefined,
      },
      { upsert: true, new: true }
    );

    res.json(log);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;
    const filter: QueryFilter<IHabitLog> = { userId: req.userId };
    if (date) filter.date = date as string;

    const logs = await HabitLog.find(filter);
    res.json(logs);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const startOfMonthDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfMonth = `${startOfMonthDate.getFullYear()}-${String(startOfMonthDate.getMonth() + 1).padStart(2, '0')}-01`;
    const thirtyDaysAgoDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = `${thirtyDaysAgoDate.getFullYear()}-${String(thirtyDaysAgoDate.getMonth() + 1).padStart(2, '0')}-${String(thirtyDaysAgoDate.getDate()).padStart(2, '0')}`;

    const habits = await Habit.find({ userId: req.userId, active: true });
    const habitIds = habits.map((h) => h._id.toString());

    const [todayLogs, monthLogs, recentLogs] = await Promise.all([
      HabitLog.find({ userId: req.userId, date: today, habitId: { $in: habitIds } }),
      HabitLog.find({
        userId: req.userId,
        date: { $gte: startOfMonth },
        habitId: { $in: habitIds },
      }),
      HabitLog.find({
        userId: req.userId,
        habitId: { $in: habitIds },
      }).sort({ date: -1 }).limit(1000),
    ]);

    const todayCompleted = todayLogs.filter((l) => l.completed).length;
    const todayTotal = habits.length;
    const todayRate = todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0;

    const monthCompletedLogs = monthLogs.filter((l) => l.completed).length;
    const daysInMonthSoFar = Math.floor((now.getTime() - startOfMonthDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalExpectedMonthLogs = habits.length * daysInMonthSoFar;
    const overallRate = totalExpectedMonthLogs > 0 ? Math.round((monthCompletedLogs / totalExpectedMonthLogs) * 100) : 0;

    const streaks: Record<string, { current: number; longest: number }> = {};
    for (const habit of habits) {
      const logs = recentLogs
        .filter((l) => l.habitId.toString() === habit._id.toString())
        .sort((a, b) => b.date.localeCompare(a.date));

      let current = 0;
      let longest = 0;
      let tempStreak = 0;
      let currentStreakBroken = false;
      const checkDate = new Date();

      for (let i = 0; i < 365; i++) {
        const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        const log = logs.find((l) => l.date === dateStr);
        if (log?.completed) {
          tempStreak++;
          longest = Math.max(longest, tempStreak);
          if (!currentStreakBroken) {
            current = tempStreak;
          }
        } else {
          if (i > 0) {
            currentStreakBroken = true;
          }
          tempStreak = 0;
        }
        checkDate.setDate(checkDate.getDate() - 1);
      }

      streaks[habit._id.toString()] = { current, longest };
    }

    const weeklyData: { day: string; rate: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLogs = recentLogs.filter((l) => l.date === ds);
      const dayCompleted = dayLogs.filter((l) => l.completed).length;
      const dayTotal = habits.length;
      weeklyData.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        rate: dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0,
      });
    }

    const monthlyTrend: { date: string; rate: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLogs = recentLogs.filter((l) => l.date === ds);
      const dayCompleted = dayLogs.filter((l) => l.completed).length;
      const dayTotal = habits.length;
      monthlyTrend.push({
        date: ds,
        rate: dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0,
      });
    }

    const perHabitStats = habits.map((h) => {
      const habitLogs = recentLogs.filter(
        (l) => l.habitId.toString() === h._id.toString() && l.date >= thirtyDaysAgo
      );
      const completed = habitLogs.filter((l) => l.completed).length;
      return {
        habitId: h._id,
        name: h.name,
        category: h.category,
        total: 30,
        completed,
        rate: Math.round((completed / 30) * 100),
      };
    });

    res.json({
      today: { completed: todayCompleted, total: todayTotal, rate: todayRate },
      overall: { rate: overallRate },
      streaks,
      weeklyData,
      monthlyTrend,
      perHabitStats,
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

router.get('/stats/:habitId', async (req: AuthRequest, res: Response) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.habitId, userId: req.userId });
    if (!habit) {
      res.status(404).json({ error: 'Habit not found' });
      return;
    }

    const logs = await HabitLog.find({
      userId: req.userId,
      habitId: req.params.habitId,
    }).sort({ date: -1 });

    const total = logs.length;
    const completed = logs.filter((l) => l.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({ total, completed, rate, logs });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

export default router;
