import { useApp } from '../contexts/AppContext';
import type { Category, ExpenseRecord } from '../types';
import { generateId } from '../utils/helpers';
import { useCallback } from 'react';

export function useExpenses() {
  const { state, dispatch } = useApp();
  
  const addExpense = useCallback((categoryId: string, amount: number, currency: string, note?: string) => {
    const expense: ExpenseRecord = {
      id: generateId(),
      categoryId,
      amount,
      currency,
      date: new Date().toISOString(),
      note
    };
    dispatch({ type: 'ADD_EXPENSE', payload: expense });
  }, [dispatch]);

  const updateExpense = useCallback((expense: ExpenseRecord) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
  }, [dispatch]);

  const deleteExpense = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
  }, [dispatch]);

  const addCategory = useCallback((name: string, color: string, icon: string) => {
    dispatch({ type: 'ADD_EXPENSE_CATEGORY', payload: { id: generateId(), name, color, icon } });
  }, [dispatch]);

  const updateCategory = useCallback((category: Category) => {
    dispatch({ type: 'UPDATE_EXPENSE_CATEGORY', payload: category });
  }, [dispatch]);

  const deleteCategory = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EXPENSE_CATEGORY', payload: id });
  }, [dispatch]);

  return {
    expenses: state.expenses,
    categories: state.expenseCategories,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory
  };
}
