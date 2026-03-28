import mongoose from 'mongoose';

const taskCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('TaskCategory', taskCategorySchema);
