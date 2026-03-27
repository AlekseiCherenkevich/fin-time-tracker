import { useState, useEffect, useRef, useCallback } from 'react';
import { useTasks } from '../hooks';
import { formatTime } from '../utils/helpers';
import styles from './Timer.module.css';

export function Timer() {
  const { activeTimer, categories, stopTimer, cancelTimer } = useTasks();
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [editingDuration, setEditingDuration] = useState(false);
  const [newDuration, setNewDuration] = useState('');
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  const tick = useCallback(() => {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTimeRef.current) / 1000);
    const remainingSeconds = durationRef.current - elapsedSeconds;
    
    setElapsed(elapsedSeconds);
    setRemaining(remainingSeconds);
    
    if (remainingSeconds <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Send notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const category = categories.find(c => c.id === activeTimer?.categoryId);
        new Notification('⏰ Timer Finished!', {
          body: `${category?.name || 'Task'} timer has finished`,
          icon: '/favicon.svg'
        });
      }
      stopTimer();
    }
  }, [categories, activeTimer, stopTimer]);

  useEffect(() => {
    if (activeTimer) {
      startTimeRef.current = activeTimer.startTime;
      durationRef.current = activeTimer.duration;
      setRemaining(activeTimer.duration);
      setElapsed(0);
      
      intervalRef.current = window.setInterval(tick, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeTimer?.recordId, tick]);

  if (!activeTimer) return null;

  const category = categories.find(c => c.id === activeTimer.categoryId);
  const progress = activeTimer.duration > 0 ? (elapsed / activeTimer.duration) * 100 : 0;

  const handleEditDuration = () => {
    setEditingDuration(true);
    setNewDuration(String(activeTimer.duration));
  };

  const handleSaveDuration = () => {
    const newValue = parseInt(newDuration);
    if (!isNaN(newValue) && newValue > 0) {
      durationRef.current = newValue;
    }
    setEditingDuration(false);
  };

  return (
    <div className={styles.timer}>
      <div className={styles.header}>
        <span className={styles.categoryIcon}>{category?.icon}</span>
        <span className={styles.categoryName}>{category?.name}</span>
      </div>
      
      <div className={styles.display}>
        <div className={styles.time}>{formatTime(Math.max(0, remaining))}</div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        <div className={styles.elapsed}>Elapsed: {formatTime(elapsed)}</div>
      </div>

      <div className={styles.actions}>
        <button 
          className={styles.editBtn}
          onClick={handleEditDuration}
          title="Change timer duration"
        >
          ✏️ Edit
        </button>
        <button 
          className={styles.stopBtn}
          onClick={stopTimer}
        >
          ✓ Done
        </button>
        <button 
          className={styles.cancelBtn}
          onClick={cancelTimer}
        >
          ✕ Cancel
        </button>
      </div>

      {editingDuration && (
        <div className={styles.editModal}>
          <input
            type="number"
            value={newDuration}
            onChange={(e) => setNewDuration(e.target.value)}
            min="1"
            className={styles.durationInput}
            placeholder="Duration (seconds)"
          />
          <button onClick={handleSaveDuration}>Save</button>
          <button onClick={() => setEditingDuration(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
