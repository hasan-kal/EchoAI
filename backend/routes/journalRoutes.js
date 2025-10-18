import express from 'express';
import Journal from '../models/Journal.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Function to generate AI response using HuggingFace API
const generateAIResponse = async (userContent) => {
  const API_KEY = process.env.HUGGINGFACE_API_KEY;
  if (!API_KEY) {
    throw new Error('HuggingFace API key not found');
  }

  const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: `Reflect on this journal entry: ${userContent}. Provide a short, thoughtful response.`,
      parameters: {
        max_length: 100,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate AI response');
  }

  const data = await response.json();
  return data[0]?.generated_text || 'AI reflection not available.';
};

// POST /journal/create
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const aiResponse = await generateAIResponse(content);

    const journalEntry = new Journal({
      userId: req.user.id,
      content,
      aiResponse,
    });

    await journalEntry.save();
    res.status(201).json({ message: 'Journal entry created', entry: journalEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /journal/all
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
