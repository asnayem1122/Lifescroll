import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { Habit, HabitFormData, HabitLog } from '../types/habit';
import * as api from '../api/habits';
import { today } from '../utils/date';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const [h, l] = await Promise.all([
        api.getHabits(),
        api.getHabitLogs(today()),
      ]);
      setHabits(h);
      setLogs(l);
    } catch {
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const toggleLog = async (habitId: string) => {
    setToggling(habitId);
    try {
      const existing = logs.find((l) => l.habitId === habitId);
      const completed = !existing?.completed;
      await api.toggleHabitLog(habitId, today(), completed);
      setLogs((prev) => {
        const filtered = prev.filter((l) => l.habitId !== habitId);
        return [...filtered, { _id: existing?._id || '', habitId, date: today(), completed, completedAt: completed ? new Date().toISOString() : undefined } as HabitLog];
      });
      if (completed) {
        toast.success('Seal stamped');
      }
    } catch {
      toast.error('Failed to update habit');
    } finally {
      setToggling(null);
    }
  };

  const create = async (form: HabitFormData) => {
    try {
      await api.createHabit(form);
      toast.success('Habit created');
      fetch();
    } catch {
      toast.error('Failed to create habit');
    }
  };

  const update = async (id: string, form: Partial<Habit>) => {
    try {
      await api.updateHabit(id, form);
      toast.success('Habit updated');
      fetch();
    } catch {
      toast.error('Failed to update habit');
    }
  };

  const remove = async (id: string) => {
    try {
      await api.deleteHabit(id);
      toast.success('Habit deleted');
      fetch();
    } catch {
      toast.error('Failed to delete habit');
    }
  };

  const reorder = async (orders: { id: string; order: number }[]) => {
    try {
      await api.reorderHabits(orders);
    } catch {
      toast.error('Failed to reorder');
    }
  };

  const completedCount = logs.filter((l) => l.completed).length;
  const completionRate = habits.filter((h) => h.active).length > 0
    ? Math.round((completedCount / habits.filter((h) => h.active).length) * 100)
    : 0;

  const getLog = (habitId: string) => logs.find((l) => l.habitId === habitId);

  const activeHabits = habits.filter((h) => h.active);

  return {
    habits, activeHabits, logs, loading, toggling,
    completedCount, completionRate, getLog,
    toggleLog, create, update, remove, reorder, refresh: fetch,
  };
}
