import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ date: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { categoryId, duration, date, timerStarted, timerFinished } = req.body;
    const task = new Task({ 
      categoryId, 
      duration, 
      date: date || new Date(),
      timerStarted: timerStarted || false,
      timerFinished: timerFinished || false
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { categoryId, duration, date, timerStarted, timerFinished } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { categoryId, duration, date, timerStarted, timerFinished },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
