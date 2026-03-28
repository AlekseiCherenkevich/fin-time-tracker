import { useState, useCallback, useEffect } from 'react';
import { expensesAPI, expenseCategoriesAPI } from '../services/api';
import type { Category, ExpenseRecord } from '../types';

// Transform API response to frontend type
const toCategory = (data: { id: string; name: string; color: string; icon: string }): Category => ({
  id: data.id,
  name: data.name,
  color: data.color,
  icon: data.icon
});

const toExpense = (data: { id: string; categoryId: string; amount: number; currency: string; date: string; note?: string }): ExpenseRecord => ({
  id: data.id,
  categoryId: data.categoryId,
  amount: data.amount,
  currency: data.currency,
  date: data.date,
  note: data.note
});

export function useExpenses() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from API on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [expensesData, categoriesData] = await Promise.all([
        expensesAPI.getAll(),
        expenseCategoriesAPI.getAll()
      ]);
      setExpenses(expensesData.map(toExpense));
      setCategories(categoriesData.map(toCategory));
    } catch (err) {
      console.error('Failed to load expenses data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = useCallback(async (categoryId: string, amount: number, currency: string, note?: string) => {
    try {
      setError(null);
      const newExpense = await expensesAPI.create({
        categoryId,
        amount,
        currency,
        date: new Date().toISOString(),
        note
      });
      setExpenses(prev => [...prev, toExpense(newExpense)]);
    } catch (err) {
      console.error('Failed to add expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    }
  }, []);

  const updateExpense = useCallback(async (expense: ExpenseRecord) => {
    try {
      setError(null);
      const updated = await expensesAPI.update(expense.id, expense);
      setExpenses(prev => prev.map(e => e.id === updated.id ? toExpense(updated) : e));
    } catch (err) {
      console.error('Failed to update expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to update expense');
    }
  }, []);

  const deleteExpense = useCallback(async (id: string) => {
    try {
      setError(null);
      const expenseId = id;
      await expensesAPI.delete(expenseId);
      setExpenses(prev => prev.filter(e => e.id !== expenseId));
    } catch (err) {
      console.error('Failed to delete expense:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete expense');
    }
  }, []);

  const addCategory = useCallback(async (name: string, color: string, icon: string) => {
    try {
      setError(null);
      const newCategory = await expenseCategoriesAPI.create({ name, color, icon });
      setCategories(prev => [...prev, toCategory(newCategory)]);
    } catch (err) {
      console.error('Failed to add category:', err);
      setError(err instanceof Error ? err.message : 'Failed to add category');
    }
  }, []);

  const updateCategory = useCallback(async (category: Category) => {
    try {
      setError(null);
      const updated = await expenseCategoriesAPI.update(category.id, category);
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
      await expenseCategoriesAPI.delete(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (err) {
      console.error('Failed to delete category:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  }, []);

  return {
    expenses,
    categories,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshData: loadData
  };
}
