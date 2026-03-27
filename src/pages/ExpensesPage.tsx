import { useState } from 'react';
import { useExpenses } from '../hooks';
import { formatDate, getCurrencySymbol, CURRENCIES, COLORS } from '../utils/helpers';
import type { ExpenseRecord } from '../types';
import styles from './ExpensesPage.module.css';

export function ExpensesPage() {
  const { 
    expenses, 
    categories, 
    addExpense, 
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory
  } = useExpenses();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [note, setNote] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('💳');

  const handleAddExpense = () => {
    if (!selectedCategory || !amount) return;
    
    addExpense(selectedCategory, parseFloat(amount), currency, note || undefined);
    setShowAddModal(false);
    setSelectedCategory('');
    setAmount('');
    setNote('');
  };

  const handleDeleteExpense = (expense: ExpenseRecord) => {
    deleteExpense(expense.id);
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
    setNewCategoryIcon('💳');
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

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Money Expenses</h1>
        <p className={styles.subtitle}>Track where your money goes</p>
      </header>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>
            {getCurrencySymbol(currency)}{totalExpenses.toFixed(2)}
          </span>
          <span className={styles.statLabel}>Total Expenses</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{expenses.length}</span>
          <span className={styles.statLabel}>Transactions</span>
        </div>
      </div>

      <section className={styles.actions}>
        <button onClick={() => setShowAddModal(true)} className={styles.addBtn}>
          + Add Expense
        </button>
      </section>

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
        <h2>Recent Expenses</h2>
        <div className={styles.expenseList}>
          {expenses.length === 0 ? (
            <p className={styles.empty}>No expenses yet. Add your first expense!</p>
          ) : (
            expenses.slice().reverse().map(expense => {
              const category = categories.find(c => c.id === expense.categoryId);
              return (
                <div key={expense.id} className={styles.expenseItem} style={{ borderColor: category?.color }}>
                  <div className={styles.expenseInfo}>
                    <span className={styles.expenseIcon}>{category?.icon}</span>
                    <div className={styles.expenseDetails}>
                      <span className={styles.expenseName}>{category?.name}</span>
                      <span className={styles.expenseMeta}>
                        {formatDate(expense.date)}
                        {expense.note && <span className={styles.note}> • {expense.note}</span>}
                      </span>
                    </div>
                  </div>
                  <div className={styles.expenseRight}>
                    <span className={styles.expenseAmount}>
                      {getCurrencySymbol(expense.currency)}{expense.amount.toFixed(2)}
                    </span>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteExpense(expense)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Add Expense</h2>
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
              <label>Amount</label>
              <div className={styles.amountRow}>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  className={styles.input}
                  placeholder="0.00"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={styles.currencySelect}
                >
                  {CURRENCIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Note (optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={styles.input}
                placeholder="Add a note..."
              />
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowAddModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleAddExpense} className={styles.confirmBtn}>
                Add
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
                placeholder="e.g., Groceries"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Icon</label>
              <div className={styles.iconPicker}>
                {['💳', '🛒', '🍔', '🚗', '🎮', '🎬', '👔', '💊', '🏠', '✈️', '📱', '💰'].map(icon => (
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
                setNewCategoryIcon('💳');
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
    </div>
  );
}
