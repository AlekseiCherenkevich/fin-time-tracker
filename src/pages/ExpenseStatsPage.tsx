import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useExpenses } from '../hooks';
import { filterByDateRange, getCurrencySymbol } from '../utils/helpers';
import type { TimePeriod } from '../types';
import styles from './ExpenseStatsPage.module.css';

export function ExpenseStatsPage() {
  const { expenses, categories } = useExpenses();
  const [period, setPeriod] = useState<TimePeriod>('week');

  const chartData = useMemo(() => {
    const filteredExpenses = filterByDateRange(expenses, period);
    const categoryTotals: Record<string, number> = {};
    
    filteredExpenses.forEach(expense => {
      categoryTotals[expense.categoryId] = (categoryTotals[expense.categoryId] || 0) + expense.amount;
    });

    const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    
    return categories
      .filter(cat => categoryTotals[cat.id] > 0)
      .map(cat => ({
        name: cat.name,
        value: categoryTotals[cat.id] || 0,
        color: cat.color,
        icon: cat.icon,
        percentage: total > 0 ? Math.round((categoryTotals[cat.id] / total) * 100) : 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, categories, period]);

  const totalExpenses = useMemo(() => {
    const filteredExpenses = filterByDateRange(expenses, period);
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, period]);

  const transactionCount = useMemo(() => {
    return filterByDateRange(expenses, period).length;
  }, [expenses, period]);

  // Get the most common currency for display
  const displayCurrency = expenses.length > 0 ? expenses[0].currency : 'USD';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Expense Statistics</h1>
        <p className={styles.subtitle}>Track where your money goes</p>
      </header>

      <div className={styles.periodSelector}>
        {(['day', 'week', 'month', 'year'] as TimePeriod[]).map(p => (
          <button
            key={p}
            className={`${styles.periodBtn} ${period === p ? styles.active : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>
            {getCurrencySymbol(displayCurrency)}{totalExpenses.toFixed(2)}
          </span>
          <span className={styles.statLabel}>Total Spent</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{transactionCount}</span>
          <span className={styles.statLabel}>Transactions</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{chartData.length}</span>
          <span className={styles.statLabel}>Categories</span>
        </div>
      </div>

      {chartData.length > 0 ? (
        <>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${getCurrencySymbol(displayCurrency)}${(value as number).toFixed(2)}`}
                  contentStyle={{ 
                    backgroundColor: '#374151', 
                    border: 'none', 
                    borderRadius: '0.5rem',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.legend}>
            {chartData.map(item => (
              <div key={item.name} className={styles.legendItem}>
                <div className={styles.legendLeft}>
                  <span 
                    className={styles.legendColor} 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={styles.legendIcon}>{item.icon}</span>
                  <span className={styles.legendName}>{item.name}</span>
                </div>
                <div className={styles.legendRight}>
                  <span className={styles.legendValue}>
                    {getCurrencySymbol(displayCurrency)}{item.value.toFixed(2)}
                  </span>
                  <span className={styles.legendPercent}>{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <p>📊 No expenses for this period</p>
          <p className={styles.emptyHint}>Add expenses to see your statistics!</p>
        </div>
      )}
    </div>
  );
}
