export const generateId = (): string => {
  return crypto.randomUUID ? crypto.randomUUID() : 
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const getDateRange = (period: 'day' | 'week' | 'month' | 'year'): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date();
  const end = new Date();
  
  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week': {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
};

export const filterByDateRange = <T extends { date: string }>(
  items: T[],
  period: 'day' | 'week' | 'month' | 'year'
): T[] => {
  const { start, end } = getDateRange(period);
  return items.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate >= start && itemDate <= end;
  });
};

export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    RUB: '₽',
    BYN: 'Br',
    JPY: '¥',
    CNY: '¥',
    KRW: '₩',
    INR: '₹',
  };
  return symbols[currency] || currency;
};

export const DEFAULT_CATEGORIES = {
  tasks: [
    { id: '1', name: 'Work', color: '#3B82F6', icon: '💼' },
    { id: '2', name: 'Study', color: '#8B5CF6', icon: '📚' },
    { id: '3', name: 'Exercise', color: '#10B981', icon: '🏃' },
    { id: '4', name: 'Cooking', color: '#F59E0B', icon: '🍳' },
    { id: '5', name: 'Hobby', color: '#EC4899', icon: '🎨' },
    { id: '6', name: 'Rest', color: '#6366F1', icon: '😴' },
  ],
  expenses: [
    { id: '1', name: 'Food', color: '#EF4444', icon: '🍔' },
    { id: '2', name: 'Transport', color: '#3B82F6', icon: '🚗' },
    { id: '3', name: 'Entertainment', color: '#8B5CF6', icon: '🎮' },
    { id: '4', name: 'Shopping', color: '#EC4899', icon: '🛍️' },
    { id: '5', name: 'Health', color: '#10B981', icon: '💊' },
    { id: '6', name: 'Other', color: '#6B7280', icon: '📦' },
  ]
};

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'RUB', 'BYN', 'JPY', 'CNY', 'KRW', 'INR'];

export const COLORS = [
  '#ef4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', 
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'
];

// Get ID from object that may have either 'id' or '_id' (MongoDB uses _id)
export function getId(obj: { id?: string; _id?: string }): string {
  return obj._id || obj.id || '';
}
