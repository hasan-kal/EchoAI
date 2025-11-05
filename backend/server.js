import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Memory array to store messages
let memory = [];

// Load memory from journal.json if it exists
if (fs.existsSync('journal.json')) {
  try {
    memory = JSON.parse(fs.readFileSync('journal.json', 'utf8'));
  } catch (error) {
    console.error('Error loading journal.json:', error);
    memory = [];
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
// connectDB(); // Commented out for testing reflect API without DB

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);

// POST /api/reflect
app.post('/api/reflect', async (req, res) => {
  const { entry } = req.body;
  if (!entry) {
    return res.status(400).json({ message: 'Journal entry is required' });
  }
  try {
    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: entry }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`
        }
      }
    );
    const aiMessage = geminiResponse.data.candidates[0].content.parts[0].text;

    // Store messages in memory
    memory.push({ role: "user", content: entry });
    memory.push({ role: "assistant", content: aiMessage });

    // Save to journal.json
    fs.writeFileSync('journal.json', JSON.stringify(memory, null, 2));

    res.json({ response: aiMessage });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ message: 'Failed to get AI response' });
  }
});

// GET /api/messages
app.get('/api/messages', (req, res) => {
  res.json({ messages: memory });
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
