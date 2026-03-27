import { useState } from 'react';
import { useTasks } from '../hooks';
import { Timer } from '../components/Timer';
import { formatDuration, formatDate, COLORS } from '../utils/helpers';
import type { TaskRecord } from '../types';
import styles from './TasksPage.module.css';

export function TasksPage() {
  const { 
    tasks, 
    categories, 
    activeTimer, 
    deleteTask, 
    startTimer,
    addCategory,
    deleteCategory
  } = useTasks();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [duration, setDuration] = useState('25');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📋');
  const [showTimerPopup, setShowTimerPopup] = useState(false);

  const handleAddTask = () => {
    if (!selectedCategory || !duration) return;
    
    const durationNum = parseInt(duration);
    setShowAddModal(false);
    setShowTimerPopup(true);
    
    // After showing popup briefly, start timer
    setTimeout(() => {
      setShowTimerPopup(false);
      startTimer(selectedCategory, durationNum * 60); // Convert minutes to seconds
    }, 100);
  };

  const handleAddQuickTask = (categoryId: string, minutes: number) => {
    startTimer(categoryId, minutes * 60);
  };

  const handleDeleteTask = (task: TaskRecord) => {
    deleteTask(task.id);
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    const color = COLORS[categories.length % COLORS.length];
    addCategory(newCategoryName, color, newCategoryIcon);
    setNewCategoryName('');
    setNewCategoryIcon('📋');
    setShowCategoryModal(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Daily Tasks</h1>
        <p className={styles.subtitle}>Track your time on different activities</p>
      </header>

      {activeTimer && <Timer />}

      {!activeTimer && (
        <>
          <section className={styles.quickActions}>
            <h2>Quick Start</h2>
            <div className={styles.quickButtons}>
              <button onClick={() => setShowAddModal(true)} className={styles.addBtn}>
                + New Task
              </button>
            </div>
            <div className={styles.presetButtons}>
              {categories.slice(0, 4).map(cat => (
                <button 
                  key={cat.id} 
                  className={styles.presetBtn}
                  onClick={() => handleAddQuickTask(cat.id, 25)}
                  style={{ borderColor: cat.color }}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      <section className={styles.categories}>
        <div className={styles.sectionHeader}>
          <h2>Categories</h2>
          <button onClick={() => setShowCategoryModal(true)} className={styles.smallBtn}>
            + Add
          </button>
        </div>
        <div className={styles.categoryList}>
          {categories.map(cat => (
            <div key={cat.id} className={styles.categoryItem} style={{ borderColor: cat.color }}>
              <span className={styles.catIcon}>{cat.icon}</span>
              <span className={styles.catName}>{cat.name}</span>
              <button 
                className={styles.deleteCatBtn}
                onClick={() => deleteCategory(cat.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.history}>
        <h2>Recent Tasks</h2>
        <div className={styles.taskList}>
          {tasks.length === 0 ? (
            <p className={styles.empty}>No tasks yet. Start your first task!</p>
          ) : (
            tasks.slice().reverse().map(task => {
              const category = categories.find(c => c.id === task.categoryId);
              return (
                <div key={task.id} className={styles.taskItem} style={{ borderColor: category?.color }}>
                  <div className={styles.taskInfo}>
                    <span className={styles.taskIcon}>{category?.icon}</span>
                    <div className={styles.taskDetails}>
                      <span className={styles.taskName}>{category?.name}</span>
                      <span className={styles.taskMeta}>
                        {formatDuration(task.duration)} • {formatDate(task.date)}
                        {task.timerFinished && <span className={styles.completed}> ✓</span>}
                      </span>
                    </div>
                  </div>
                  <button 
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteTask(task)}
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>New Task</h2>
            <div className={styles.formGroup}>
              <label>Category</label>
              <div className={styles.categorySelect}>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`${styles.catOption} ${selectedCategory === cat.id ? styles.selected : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{ borderColor: cat.color }}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="480"
                className={styles.input}
              />
              <div className={styles.presets}>
                {[15, 25, 45, 60].map(m => (
                  <button
                    key={m}
                    className={`${styles.presetChip} ${duration === String(m) ? styles.active : ''}`}
                    onClick={() => setDuration(String(m))}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowAddModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleAddTask} className={styles.confirmBtn}>
                Start with Timer
              </button>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add Category</h2>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className={styles.input}
                placeholder="e.g., Reading"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Icon</label>
              <div className={styles.iconPicker}>
                {['📋', '💼', '📚', '🏃', '🍳', '🎨', '🎮', '🎵', '💪', '🧘', '🌱', '✍️'].map(icon => (
                  <button
                    key={icon}
                    className={`${styles.iconOption} ${newCategoryIcon === icon ? styles.selected : ''}`}
                    onClick={() => setNewCategoryIcon(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowCategoryModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleAddCategory} className={styles.confirmBtn}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showTimerPopup && (
        <div className={styles.timerPopup}>
          <div className={styles.timerPopupContent}>
            <p>⏱️ Timer ready!</p>
            <p>Your timer will start automatically.</p>
          </div>
        </div>
      )}
    </div>
  );
}
