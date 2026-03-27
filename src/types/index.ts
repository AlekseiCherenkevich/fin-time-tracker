export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ExpenseRecord {
  id: string;
  categoryId: string;
  amount: number;
  currency: string;
  date: string;
  note?: string;
}

export interface TaskRecord {
  id: string;
  categoryId: string;
  duration: number; // in seconds
  date: string;
  timerStarted?: boolean;
  timerFinished?: boolean;
}

export interface ActiveTimer {
  recordId: string;
  categoryId: string;
  startTime: number;
  duration: number; // in seconds
}

export interface GamificationState {
  streak: number;
  totalPoints: number;
  level: number;
  dailyGoalMinutes: number;
  weeklyGoalMinutes: number;
  completedTasks: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: number;
  current: number;
}

export type TimePeriod = 'day' | 'week' | 'month' | 'year';

export interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}
