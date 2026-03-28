import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  timerStarted: {
    type: Boolean,
    default: false
  },
  timerFinished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);
