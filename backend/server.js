import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);

// POST /api/reflect
app.post('/api/reflect', (req, res) => {
  const { entry } = req.body;
  if (!entry) {
    return res.status(400).json({ message: 'Journal entry is required' });
  }
  const response = "I understand how you feel. Let's explore that emotion further.";
  res.json({ response });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'EchoAI Backend API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
