import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Expense', expenseSchema);
