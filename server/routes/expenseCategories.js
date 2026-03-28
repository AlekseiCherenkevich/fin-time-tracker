import express from 'express';
import ExpenseCategory from '../models/ExpenseCategory.js';

const router = express.Router();

// Get all expense categories
router.get('/', async (req, res) => {
  try {
    const categories = await ExpenseCategory.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create expense category
router.post('/', async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    const category = new ExpenseCategory({ name, color, icon });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update expense category
router.put('/:id', async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    const category = await ExpenseCategory.findByIdAndUpdate(
      req.params.id,
      { name, color, icon },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete expense category
router.delete('/:id', async (req, res) => {
  try {
    const category = await ExpenseCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
