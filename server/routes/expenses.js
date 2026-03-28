import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create expense
router.post('/', async (req, res) => {
  try {
    const { categoryId, amount, currency, date, note } = req.body;
    const expense = new Expense({ 
      categoryId, 
      amount, 
      currency: currency || 'USD', 
      date: date || new Date(), 
      note 
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const { categoryId, amount, currency, date, note } = req.body;
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { categoryId, amount, currency, date, note },
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
