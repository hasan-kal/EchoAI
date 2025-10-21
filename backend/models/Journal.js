import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  aiResponse: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'stressed', 'calm', 'neutral'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Journal = mongoose.model('Journal', journalSchema);

export default Journal;
