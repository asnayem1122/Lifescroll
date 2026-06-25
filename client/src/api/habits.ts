import api from './axios';
import type { Habit, HabitFormData, HabitLog, HabitStats } from '../types/habit';

export async function getHabits(): Promise<Habit[]> {
  const { data } = await api.get('/habits');
  return data;
}

export async function createHabit(form: HabitFormData): Promise<Habit> {
  const { data } = await api.post('/habits', form);
  return data;
}

export async function updateHabit(id: string, form: Partial<Habit>): Promise<Habit> {
  const { data } = await api.put(`/habits/${id}`, form);
  return data;
}

export async function deleteHabit(id: string): Promise<void> {
  await api.delete(`/habits/${id}`);
}

export async function reorderHabits(orders: { id: string; order: number }[]): Promise<void> {
  await api.put('/habits/reorder', { orders });
}

export async function toggleHabitLog(habitId: string, date: string, completed: boolean): Promise<HabitLog> {
  const { data } = await api.post('/habits/log', { habitId, date, completed });
  return data;
}

export async function getHabitLogs(date: string): Promise<HabitLog[]> {
  const { data } = await api.get(`/habits/log?date=${date}`);
  return data;
}

export async function getHabitStats(): Promise<HabitStats> {
  const { data } = await api.get('/habits/log/stats');
  return data;
}
