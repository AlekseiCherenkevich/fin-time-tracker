import { useApp } from '../contexts/AppContext';
import type { Category, TaskRecord, ActiveTimer } from '../types';
import { generateId } from '../utils/helpers';
import { useCallback } from 'react';

export function useTasks() {
  const { state, dispatch } = useApp();
  
  const addTask = useCallback((categoryId: string, duration: number) => {
    const task: TaskRecord = {
      id: generateId(),
      categoryId,
      duration,
      date: new Date().toISOString()
    };
    dispatch({ type: 'ADD_TASK', payload: task });
  }, [dispatch]);

  const updateTask = useCallback((task: TaskRecord) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  }, [dispatch]);

  const deleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, [dispatch]);

  const startTimer = useCallback((categoryId: string, duration: number) => {
    const timer: ActiveTimer = {
      recordId: generateId(),
      categoryId,
      startTime: Date.now(),
      duration
    };
    dispatch({ type: 'SET_ACTIVE_TIMER', payload: timer });
    
    const task: TaskRecord = {
      id: timer.recordId,
      categoryId,
      duration,
      date: new Date().toISOString(),
      timerStarted: true
    };
    dispatch({ type: 'ADD_TASK', payload: task });
    
    return timer;
  }, [dispatch]);

  const stopTimer = useCallback(() => {
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
  }, [state.activeTimer, dispatch]);

  const cancelTimer = useCallback(() => {
    if (state.activeTimer) {
      dispatch({ type: 'DELETE_TASK', payload: state.activeTimer.recordId });
      dispatch({ type: 'SET_ACTIVE_TIMER', payload: null });
    }
  }, [state.activeTimer, dispatch]);

  const addCategory = useCallback((name: string, color: string, icon: string) => {
    dispatch({ type: 'ADD_TASK_CATEGORY', payload: { id: generateId(), name, color, icon } });
  }, [dispatch]);

  const updateCategory = useCallback((category: Category) => {
    dispatch({ type: 'UPDATE_TASK_CATEGORY', payload: category });
  }, [dispatch]);

  const deleteCategory = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK_CATEGORY', payload: id });
  }, [dispatch]);

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
    addCategory,
    updateCategory,
    deleteCategory
  };
}
