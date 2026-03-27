import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { TasksPage, ExpensesPage, TaskStatsPage, ExpenseStatsPage } from './pages';
import './index.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<TasksPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/stats/tasks" element={<TaskStatsPage />} />
            <Route path="/stats/expenses" element={<ExpenseStatsPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
