import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? styles.active : ''}>
          <span className={styles.icon}>⏱️</span>
          <span className={styles.label}>Tasks</span>
        </NavLink>
        <NavLink to="/expenses" className={({ isActive }) => isActive ? styles.active : ''}>
          <span className={styles.icon}>💰</span>
          <span className={styles.label}>Expenses</span>
        </NavLink>
        <NavLink to="/stats/tasks" className={({ isActive }) => isActive ? styles.active : ''}>
          <span className={styles.icon}>📊</span>
          <span className={styles.label}>Task Stats</span>
        </NavLink>
        <NavLink to="/stats/expenses" className={({ isActive }) => isActive ? styles.active : ''}>
          <span className={styles.icon}>📈</span>
          <span className={styles.label}>Expense Stats</span>
        </NavLink>
      </nav>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
