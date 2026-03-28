const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    method: options.method,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Internal API response type (MongoDB format with _id)
interface RawCategoryResponse {
  _id: string;
  name: string;
  color: string;
  icon: string;
}

interface RawExpenseResponse {
  _id: string;
  categoryId: string;
  amount: number;
  currency: string;
  date: string;
  note?: string;
}

interface RawTaskCategoryResponse {
  _id: string;
  name: string;
  color: string;
  icon: string;
}

interface RawTaskResponse {
  _id: string;
  categoryId: string;
  duration: number;
  date: string;
  timerStarted: boolean;
  timerFinished: boolean;
}

// Transform _id to id for frontend compatibility
function transformCategory(data: RawCategoryResponse) {
  return { id: data._id, _id: data._id, name: data.name, color: data.color, icon: data.icon };
}

function transformExpense(data: RawExpenseResponse) {
  return { id: data._id, _id: data._id, categoryId: data.categoryId, amount: data.amount, currency: data.currency, date: data.date, note: data.note };
}

function transformTaskCategory(data: RawTaskCategoryResponse) {
  return { id: data._id, _id: data._id, name: data.name, color: data.color, icon: data.icon };
}

function transformTask(data: RawTaskResponse) {
  return { id: data._id, _id: data._id, categoryId: data.categoryId, duration: data.duration, date: data.date, timerStarted: data.timerStarted, timerFinished: data.timerFinished };
}

// Public response types (with id instead of _id)
export interface CategoryResponse {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ExpenseResponse {
  id: string;
  categoryId: string;
  amount: number;
  currency: string;
  date: string;
  note?: string;
}

export interface TaskCategoryResponse {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface TaskResponse {
  id: string;
  categoryId: string;
  duration: number;
  date: string;
  timerStarted: boolean;
  timerFinished: boolean;
}

// Expense Categories API
export const expenseCategoriesAPI = {
  getAll: (): Promise<CategoryResponse[]> => 
    fetchAPI('/expense-categories').then((data: RawCategoryResponse[]) => data.map(transformCategory)),
  create: (data: { name: string; color: string; icon: string }): Promise<CategoryResponse> => 
    fetchAPI('/expense-categories', { method: 'POST', body: data }).then(transformCategory),
  update: (id: string, data: Partial<CategoryResponse>): Promise<CategoryResponse> => 
    fetchAPI(`/expense-categories/${id}`, { method: 'PUT', body: data }).then(transformCategory),
  delete: (id: string): Promise<void> => 
    fetchAPI(`/expense-categories/${id}`, { method: 'DELETE' }),
};

// Expenses API
export const expensesAPI = {
  getAll: (): Promise<ExpenseResponse[]> => 
    fetchAPI('/expenses').then((data: RawExpenseResponse[]) => data.map(transformExpense)),
  create: (data: Omit<ExpenseResponse, 'id'>): Promise<ExpenseResponse> => 
    fetchAPI('/expenses', { method: 'POST', body: data }).then(transformExpense),
  update: (id: string, data: Partial<ExpenseResponse>): Promise<ExpenseResponse> => 
    fetchAPI(`/expenses/${id}`, { method: 'PUT', body: data }).then(transformExpense),
  delete: (id: string): Promise<void> => 
    fetchAPI(`/expenses/${id}`, { method: 'DELETE' }),
};

// Task Categories API
export const taskCategoriesAPI = {
  getAll: (): Promise<TaskCategoryResponse[]> => 
    fetchAPI('/task-categories').then((data: RawTaskCategoryResponse[]) => data.map(transformTaskCategory)),
  create: (data: { name: string; color: string; icon: string }): Promise<TaskCategoryResponse> => 
    fetchAPI('/task-categories', { method: 'POST', body: data }).then(transformTaskCategory),
  update: (id: string, data: Partial<TaskCategoryResponse>): Promise<TaskCategoryResponse> => 
    fetchAPI(`/task-categories/${id}`, { method: 'PUT', body: data }).then(transformTaskCategory),
  delete: (id: string): Promise<void> => 
    fetchAPI(`/task-categories/${id}`, { method: 'DELETE' }),
};

// Tasks API
export const tasksAPI = {
  getAll: (): Promise<TaskResponse[]> => 
    fetchAPI('/tasks').then((data: RawTaskResponse[]) => data.map(transformTask)),
  create: (data: { categoryId: string; duration: number; date?: string; timerStarted?: boolean; timerFinished?: boolean }): Promise<TaskResponse> => 
    fetchAPI('/tasks', { method: 'POST', body: data }).then(transformTask),
  update: (id: string, data: Partial<TaskResponse>): Promise<TaskResponse> => 
    fetchAPI(`/tasks/${id}`, { method: 'PUT', body: data }).then(transformTask),
  delete: (id: string): Promise<void> => 
    fetchAPI(`/tasks/${id}`, { method: 'DELETE' }),
};
