export interface Habit {
  _id: string;
  userId: string;
  name: string;
  category: 'prayer' | 'study' | 'cp' | 'health' | 'other';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  order: number;
  active: boolean;
  createdAt: string;
}

export interface HabitLog {
  _id: string;
  userId: string;
  habitId: string;
  date: string;
  completed: boolean;
  completedAt?: string;
}

export interface HabitStats {
  today: { completed: number; total: number; rate: number };
  overall: { rate: number };
  streaks: Record<string, { current: number; longest: number }>;
  weeklyData: { day: string; rate: number }[];
  monthlyTrend: { date: string; rate: number }[];
  perHabitStats: {
    habitId: string;
    name: string;
    category: string;
    total: number;
    completed: number;
    rate: number;
  }[];
}

export interface HabitFormData {
  name: string;
  category: 'prayer' | 'study' | 'cp' | 'health' | 'other';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}
