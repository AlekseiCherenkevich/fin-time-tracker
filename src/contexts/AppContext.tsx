import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Category, ExpenseRecord, TaskRecord, ActiveTimer, GamificationState } from '../types';
import { generateId, DEFAULT_CATEGORIES } from '../utils/helpers';

interface AppState {
  taskCategories: Category[];
  expenseCategories: Category[];
  expenses: ExpenseRecord[];
  tasks: TaskRecord[];
  activeTimer: ActiveTimer | null;
  gamification: GamificationState;
}

type AppAction =
  | { type: 'SET_TASK_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_TASK_CATEGORY'; payload: Category }
  | { type: 'UPDATE_TASK_CATEGORY'; payload: Category }
  | { type: 'DELETE_TASK_CATEGORY'; payload: string }
  | { type: 'SET_EXPENSE_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_EXPENSE_CATEGORY'; payload: Category }
  | { type: 'UPDATE_EXPENSE_CATEGORY'; payload: Category }
  | { type: 'DELETE_EXPENSE_CATEGORY'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: ExpenseRecord }
  | { type: 'UPDATE_EXPENSE'; payload: ExpenseRecord }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_TASK'; payload: TaskRecord }
  | { type: 'UPDATE_TASK'; payload: TaskRecord }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_ACTIVE_TIMER'; payload: ActiveTimer | null }
  | { type: 'UPDATE_GAMIFICATION'; payload: Partial<GamificationState> }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialGamification: GamificationState = {
  streak: 0,
  totalPoints: 0,
  level: 1,
  dailyGoalMinutes: 120,
  weeklyGoalMinutes: 840,
  completedTasks: 0,
  achievements: [
    { id: '1', name: 'First Task', description: 'Complete your first task', icon: '🌟', requirement: 1, current: 0 },
    { id: '2', name: '10 Tasks', description: 'Complete 10 tasks', icon: '🎯', requirement: 10, current: 0 },
    { id: '3', name: '100 Tasks', description: 'Complete 100 tasks', icon: '🏆', requirement: 100, current: 0 },
    { id: '4', name: 'Week Streak', description: 'Maintain a 7-day streak', icon: '🔥', requirement: 7, current: 0 },
    { id: '5', name: 'Time Master', description: 'Track 1000 minutes', icon: '⏰', requirement: 1000, current: 0 },
  ]
};

const initialState: AppState = {
  taskCategories: DEFAULT_CATEGORIES.tasks,
  expenseCategories: DEFAULT_CATEGORIES.expenses,
  expenses: [],
  tasks: [],
  activeTimer: null,
  gamification: initialGamification,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TASK_CATEGORIES':
      return { ...state, taskCategories: action.payload };
    case 'ADD_TASK_CATEGORY':
      return { ...state, taskCategories: [...state.taskCategories, action.payload] };
    case 'UPDATE_TASK_CATEGORY':
      return {
        ...state,
        taskCategories: state.taskCategories.map(c =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'DELETE_TASK_CATEGORY':
      return {
        ...state,
        taskCategories: state.taskCategories.filter(c => c.id !== action.payload)
      };
    case 'SET_EXPENSE_CATEGORIES':
      return { ...state, expenseCategories: action.payload };
    case 'ADD_EXPENSE_CATEGORY':
      return { ...state, expenseCategories: [...state.expenseCategories, action.payload] };
    case 'UPDATE_EXPENSE_CATEGORY':
      return {
        ...state,
        expenseCategories: state.expenseCategories.map(c =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'DELETE_EXPENSE_CATEGORY':
      return {
        ...state,
        expenseCategories: state.expenseCategories.filter(c => c.id !== action.payload)
      };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(e =>
          e.id === action.payload.id ? action.payload : e
        )
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(e => e.id !== action.payload)
      };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? action.payload : t
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
        activeTimer: state.activeTimer?.recordId === action.payload ? null : state.activeTimer
      };
    case 'SET_ACTIVE_TIMER':
      return { ...state, activeTimer: action.payload };
    case 'UPDATE_GAMIFICATION':
      return { ...state, gamification: { ...state.gamification, ...action.payload } };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

const STORAGE_KEY = 'fin-time-tracker-data';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Helper hooks
export function useExpenses() {
  const { state, dispatch } = useApp();
  
  const addExpense = (categoryId: string, amount: number, currency: string, note?: string) => {
    const expense: ExpenseRecord = {
      id: generateId(),
      categoryId,
      amount,
      currency,
      date: new Date().toISOString(),
      note
    };
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  };

  const updateExpense = (expense: ExpenseRecord) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
  };

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  };

  return {
    expenses: state.expenses,
    categories: state.expenseCategories,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory: (name: string, color: string, icon: string) => {
      dispatch({ type: 'ADD_EXPENSE_CATEGORY', payload: { id: generateId(), name, color, icon } });
    },
    updateCategory: (category: Category) => {
      dispatch({ type: 'UPDATE_EXPENSE_CATEGORY', payload: category });
    },
    deleteCategory: (id: string) => {
      dispatch({ type: 'DELETE_EXPENSE_CATEGORY', payload: id });
    }
  };
}

export function useTasks() {
  const { state, dispatch } = useApp();
  
  const addTask = (categoryId: string, duration: number) => {
    const task: TaskRecord = {
      id: generateId(),
      categoryId,
      duration,
      date: new Date().toISOString()
    };
    dispatch({ type: 'ADD_TASK', payload: task });
  };

  const updateTask = (task: TaskRecord) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  };

  const startTimer = (categoryId: string, duration: number) => {
    const timer: ActiveTimer = {
      recordId: generateId(),
      categoryId,
      startTime: Date.now(),
      duration
    };
    dispatch({ type: 'SET_ACTIVE_TIMER', payload: timer });
    
    // Add task with timer started flag
    const task: TaskRecord = {
      id: timer.recordId,
      categoryId,
      duration,
      date: new Date().toISOString(),
      timerStarted: true
    };
    dispatch({ type: 'ADD_TASK', payload: task });
    
    return timer;
  };

  const stopTimer = () => {
    if (state.activeTimer) {
      dispatch({ type: 'UPDATE_TASK', payload: {
        id: state.activeTimer.recordId,
        categoryId: state.activeTimer.categoryId,
        duration: state.activeTimer.duration,
        date: new Date(state.activeTimer.startTime).toISOString(),
        timerStarted: true,
        timerFinished: true
      }});
      dispatch({ type: 'SET_ACTIVE_TIMER', payload: null });
    }
  };

  const cancelTimer = () => {
    if (state.activeTimer) {
      dispatch({ type: 'DELETE_TASK', payload: state.activeTimer.recordId });
      dispatch({ type: 'SET_ACTIVE_TIMER', payload: null });
    }
  };

  return {
    tasks: state.tasks,
    categories: state.taskCategories,
    activeTimer: state.activeTimer,
    addTask,
    updateTask,
    deleteTask,
    startTimer,
    stopTimer,
    cancelTimer,
    addCategory: (name: string, color: string, icon: string) => {
      dispatch({ type: 'ADD_TASK_CATEGORY', payload: { id: generateId(), name, color, icon } });
    },
    updateCategory: (category: Category) => {
      dispatch({ type: 'UPDATE_TASK_CATEGORY', payload: category });
    },
    deleteCategory: (id: string) => {
      dispatch({ type: 'DELETE_TASK_CATEGORY', payload: id });
    }
  };
}

export function useGamification() {
  const { state, dispatch } = useApp();
  
  const updatePoints = (points: number) => {
    const newTotal = state.gamification.totalPoints + points;
    const newLevel = Math.floor(newTotal / 1000) + 1;
    dispatch({ type: 'UPDATE_GAMIFICATION', payload: { totalPoints: newTotal, level: newLevel }});
  };

  const updateStreak = () => {
    dispatch({ type: 'UPDATE_GAMIFICATION', payload: { streak: state.gamification.streak + 1 }});
  };

  const updateAchievement = (id: string, current: number) => {
    const achievements = state.gamification.achievements.map(a =>
      a.id === id ? { ...a, current, unlockedAt: current >= a.requirement ? new Date().toISOString() : undefined } : a
    );
    dispatch({ type: 'UPDATE_GAMIFICATION', payload: { achievements }});
  };

  return {
    gamification: state.gamification,
    updatePoints,
    updateStreak,
    updateAchievement
  };
}
