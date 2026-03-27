import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTasks } from '../hooks';
import { filterByDateRange, formatDuration } from '../utils/helpers';
import type { TimePeriod } from '../types';
import styles from './TaskStatsPage.module.css';

export function TaskStatsPage() {
  const { tasks, categories } = useTasks();
  const [period, setPeriod] = useState<TimePeriod>('week');

  const chartData = useMemo(() => {
    const filteredTasks = filterByDateRange(tasks.filter(t => t.timerFinished), period);
    const categoryTotals: Record<string, number> = {};
    
    filteredTasks.forEach(task => {
      categoryTotals[task.categoryId] = (categoryTotals[task.categoryId] || 0) + task.duration;
    });

    const totalSeconds = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    
    return categories
      .filter(cat => categoryTotals[cat.id] > 0)
      .map(cat => ({
        name: cat.name,
        value: categoryTotals[cat.id] || 0,
        color: cat.color,
        icon: cat.icon,
        percentage: totalSeconds > 0 ? Math.round((categoryTotals[cat.id] / totalSeconds) * 100) : 0
      }))
      .sort((a, b) => b.value - a.value);
  }, [tasks, categories, period]);

  const totalTime = useMemo(() => {
    const filteredTasks = filterByDateRange(tasks.filter(t => t.timerFinished), period);
    return filteredTasks.reduce((sum, t) => sum + t.duration, 0);
  }, [tasks, period]);

  const completedCount = useMemo(() => {
    return filterByDateRange(tasks.filter(t => t.timerFinished), period).length;
  }, [tasks, period]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Task Statistics</h1>
        <p className={styles.subtitle}>See how you spend your time</p>
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
          <span className={styles.statValue}>{formatDuration(totalTime)}</span>
          <span className={styles.statLabel}>Total Time</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{completedCount}</span>
          <span className={styles.statLabel}>Tasks Done</span>
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
                  formatter={(value) => formatDuration(value as number)}
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
                  <span className={styles.legendValue}>{formatDuration(item.value)}</span>
                  <span className={styles.legendPercent}>{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <p>📊 No completed tasks for this period</p>
          <p className={styles.emptyHint}>Complete tasks to see your statistics!</p>
        </div>
      )}
    </div>
  );
}
