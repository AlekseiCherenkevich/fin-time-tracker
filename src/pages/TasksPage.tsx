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
    addTask,
    startTimer,
    addCategory,
    updateCategory,
    deleteCategory
  } = useTasks();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [duration, setDuration] = useState('25');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📋');
  const [showTimerPopup, setShowTimerPopup] = useState(false);

  const openAddModal = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowAddModal(true);
  };

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

  const handleAddTaskWithoutTimer = () => {
    if (!selectedCategory || !duration) return;
    
    const durationNum = parseInt(duration);
    setShowAddModal(false);
    // Add task directly without timer
    addTask(selectedCategory, durationNum * 60);
  };

  const handleDeleteTask = (task: TaskRecord) => {
    deleteTask(task.id);
  };

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    
    if (editingCategoryId) {
      const existingCategory = categories.find(c => c.id === editingCategoryId);
      if (existingCategory) {
        updateCategory({
          ...existingCategory,
          name: newCategoryName,
          icon: newCategoryIcon
        });
      }
    } else {
      const color = COLORS[categories.length % COLORS.length];
      addCategory(newCategoryName, color, newCategoryIcon);
    }
    
    setNewCategoryName('');
    setNewCategoryIcon('📋');
    setEditingCategoryId(null);
    setShowCategoryModal(false);
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setEditingCategoryId(categoryId);
      setNewCategoryName(category.name);
      setNewCategoryIcon(category.icon);
      setShowCategoryModal(true);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Daily Tasks</h1>
        <p className={styles.subtitle}>Track your time on different activities</p>
      </header>

      {activeTimer && <Timer />}

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
              <button 
                className={styles.categoryClickArea}
                onClick={() => openAddModal(cat.id)}
              >
                <span className={styles.catIcon}>{cat.icon}</span>
                <span className={styles.catName}>{cat.name}</span>
              </button>
              <div className={styles.categoryActions}>
                <button 
                  className={styles.editCatBtn}
                  onClick={() => handleEditCategory(cat.id)}
                  title="Edit category"
                >
                  ✎
                </button>
                <button 
                  className={styles.deleteCatBtn}
                  onClick={() => deleteCategory(cat.id)}
                >
                  ×
                </button>
              </div>
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
            <h2>Add Task</h2>
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
              <button onClick={handleAddTaskWithoutTimer} className={styles.addDirectBtn}>
                Add Task
              </button>
              <button onClick={handleAddTask} className={styles.confirmBtn}>
                Add Task with Timer
              </button>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{editingCategoryId ? 'Edit Category' : 'Add Category'}</h2>
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
              <button onClick={() => {
                setShowCategoryModal(false);
                setEditingCategoryId(null);
                setNewCategoryName('');
                setNewCategoryIcon('📋');
              }} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleAddCategory} className={styles.confirmBtn}>
                {editingCategoryId ? 'Save' : 'Add'}
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
