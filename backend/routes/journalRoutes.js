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

// Function to analyze mood using HuggingFace API
const analyzeMood = async (userContent) => {
  const API_KEY = process.env.HUGGINGFACE_API_KEY;
  if (!API_KEY) {
    throw new Error('HuggingFace API key not found');
  }

  const response = await fetch('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: userContent,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze mood');
  }

  const data = await response.json();
  const sentiment = data[0]?.label; // POSITIVE or NEGATIVE

  // Map sentiment to mood categories
  if (sentiment === 'POSITIVE') {
    return 'happy';
  } else if (sentiment === 'NEGATIVE') {
    // For more granularity, we could use another model, but for now, classify as sad or stressed
    return 'sad'; // Default to sad for negative
  } else {
    return 'neutral';
  }
};

// POST /journal/create
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const aiResponse = await generateAIResponse(content);
    const mood = await analyzeMood(content);

    const journalEntry = new Journal({
      userId: req.user.id,
      content,
      aiResponse,
      mood,
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

// Function to generate AI insights summary
const generateInsightsSummary = async (moodCounts) => {
  const API_KEY = process.env.HUGGINGFACE_API_KEY;
  if (!API_KEY) {
    throw new Error('HuggingFace API key not found');
  }

  const moodSummary = Object.entries(moodCounts).map(([mood, count]) => `${mood}: ${count}`).join(', ');

  const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: `Based on mood counts: ${moodSummary}. Provide a short summary of the user's emotional state.`,
      parameters: {
        max_length: 50,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate insights summary');
  }

  const data = await response.json();
  return data[0]?.generated_text || 'Insights summary not available.';
};

// GET /journal/insights
router.get('/insights', authMiddleware, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.user.id });

    const moodCounts = {
      happy: 0,
      sad: 0,
      stressed: 0,
      calm: 0,
      neutral: 0,
    };

    entries.forEach(entry => {
      if (moodCounts[entry.mood] !== undefined) {
        moodCounts[entry.mood]++;
      }
    });

    const summary = await generateInsightsSummary(moodCounts);

    res.json({
      moodCounts,
      summary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
