import express from 'express';
import TaskCategory from '../models/TaskCategory.js';

const router = express.Router();

// Get all task categories
router.get('/', async (req, res) => {
  try {
    const categories = await TaskCategory.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create task category
router.post('/', async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    const category = new TaskCategory({ name, color, icon });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update task category
router.put('/:id', async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    const category = await TaskCategory.findByIdAndUpdate(
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

// Delete task category
router.delete('/:id', async (req, res) => {
  try {
    const category = await TaskCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
