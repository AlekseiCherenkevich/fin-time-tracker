import { useState, useCallback, useEffect, useRef } from 'react';
import { tasksAPI, taskCategoriesAPI } from '../services/api';
import type { Category, TaskRecord, ActiveTimer } from '../types';

// Transform API response to frontend type
const toCategory = (data: { id: string; name: string; color: string; icon: string }): Category => ({
  id: data.id,
  name: data.name,
  color: data.color,
  icon: data.icon
});

const toTask = (data: { id: string; categoryId: string; duration: number; date?: string; timerStarted?: boolean; timerFinished?: boolean }): TaskRecord => ({
  id: data.id,
  categoryId: data.categoryId,
  duration: data.duration,
  date: data.date || new Date().toISOString(),
  timerStarted: data.timerStarted,
  timerFinished: data.timerFinished
});

export function useTasks() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load data from API on mount
  useEffect(() => {
    loadData();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, categoriesData] = await Promise.all([
        tasksAPI.getAll(),
        taskCategoriesAPI.getAll()
      ]);
      setTasks(tasksData.map(toTask));
      setCategories(categoriesData.map(toCategory));
    } catch (err) {
      console.error('Failed to load tasks data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = useCallback(async (categoryId: string, duration: number) => {
    // Stop any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    try {
      // Save to API first
      const savedTask = await tasksAPI.create({ 
        categoryId, 
        duration,
        timerStarted: true,
        timerFinished: false
      });
      
      // Create task with API response for proper ID matching
      const newTask: TaskRecord = {
        id: savedTask.id,
        categoryId: savedTask.categoryId,
        duration: savedTask.duration,
        date: savedTask.date || new Date().toISOString(),
        timerStarted: true,
        timerFinished: false
      };

      setTasks(prev => [...prev, newTask]);
      
      const timer: ActiveTimer = {
        recordId: newTask.id,
        categoryId,
        startTime: Date.now(),
        duration
      };

      setActiveTimer(timer);

      // Auto-complete timer
      timerRef.current = setTimeout(() => {
        stopTimer();
      }, duration * 1000);
    } catch (err) {
      console.error('Failed to start timer:', err);
      setError(err instanceof Error ? err.message : 'Failed to start timer');
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (activeTimer) {
      setTasks(prev => prev.map(t => 
        t.id === activeTimer.recordId 
          ? { ...t, timerFinished: true, duration: activeTimer.duration }
          : t
      ));
    }

    setActiveTimer(null);
  }, [activeTimer]);

  const cancelTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (activeTimer) {
      setTasks(prev => prev.filter(t => t.id !== activeTimer.recordId));
    }

    setActiveTimer(null);
  }, [activeTimer]);

  const addTask = useCallback(async (categoryId: string, duration: number) => {
    try {
      setError(null);
      // Save to API first
      const savedTask = await tasksAPI.create({ categoryId, duration });
      
      // Create task with API response for proper ID matching
      const newTask: TaskRecord = {
        id: savedTask.id,
        categoryId: savedTask.categoryId,
        duration: savedTask.duration,
        date: savedTask.date || new Date().toISOString(),
        timerStarted: savedTask.timerStarted,
        timerFinished: savedTask.timerFinished
      };
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      console.error('Failed to add task:', err);
      setError(err instanceof Error ? err.message : 'Failed to add task');
    }
  }, []);

  const updateTask = useCallback(async (task: TaskRecord) => {
    try {
      setError(null);
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
      
      // Also update in API
      await tasksAPI.update(task.id, { 
        categoryId: task.categoryId,
        duration: task.duration,
        timerStarted: task.timerStarted,
        timerFinished: task.timerFinished 
      });
    } catch (err) {
      console.error('Failed to update task:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      setError(null);
      setTasks(prev => prev.filter(t => t.id !== id));
      
      // Also delete from API
      await tasksAPI.delete(id);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  }, []);

  const addCategory = useCallback(async (name: string, color: string, icon: string) => {
    try {
      setError(null);
      const newCategory = await taskCategoriesAPI.create({ name, color, icon });
      setCategories(prev => [...prev, toCategory(newCategory)]);
    } catch (err) {
      console.error('Failed to add category:', err);
      setError(err instanceof Error ? err.message : 'Failed to add category');
    }
  }, []);

  const updateCategory = useCallback(async (category: Category) => {
    try {
      setError(null);
      const updated = await taskCategoriesAPI.update(category.id, category);
      setCategories(prev => prev.map(c => c.id === updated.id ? toCategory(updated) : c));
    } catch (err) {
      console.error('Failed to update category:', err);
      setError(err instanceof Error ? err.message : 'Failed to update category');
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setError(null);
      const categoryId = id;
      await taskCategoriesAPI.delete(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  }, []);

  return {
    tasks,
    categories,
    activeTimer,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    addCategory,
    updateCategory,
    deleteCategory,
    startTimer,
    stopTimer,
    cancelTimer,
    refreshData: loadData
  };
}
