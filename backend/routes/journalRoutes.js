import express from 'express';
import Journal from '../models/Journal.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// In-memory cache for AI responses (simple implementation with TTL)
const aiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Function to generate AI response using HuggingFace API with caching
const generateAIResponse = async (userContent) => {
  const cacheKey = `response_${userContent}`;
  const cached = aiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Using cached AI response');
    return cached.data;
  }

  const API_KEY = process.env.HUGGINGFACE_API_KEY;
  if (!API_KEY) {
    console.log('No HuggingFace API key, using default response');
    return 'AI reflection not available (API key missing)';
  }

  try {
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
      throw new Error(`AI response API failed with status ${response.status}`);
    }

    const data = await response.json();
    const result = data[0]?.generated_text || 'AI reflection not available.';

    // Cache the result
    aiCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
};

// Function to analyze mood using HuggingFace API with caching
const analyzeMood = async (userContent) => {
  const cacheKey = `mood_${userContent}`;
  const cached = aiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Using cached mood analysis');
    return cached.data;
  }

  const API_KEY = process.env.HUGGINGFACE_API_KEY;
  if (!API_KEY) {
    console.log('No HuggingFace API key, using default mood');
    return 'neutral';
  }

  try {
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
      throw new Error(`Mood analysis API failed with status ${response.status}`);
    }

    const data = await response.json();
    const sentiment = data[0]?.label; // POSITIVE or NEGATIVE

    // Map sentiment to mood categories
    let mood;
    if (sentiment === 'POSITIVE') {
      mood = 'happy';
    } else if (sentiment === 'NEGATIVE') {
      mood = 'sad'; // Default to sad for negative
    } else {
      mood = 'neutral';
    }

    // Cache the result
    aiCache.set(cacheKey, { data: mood, timestamp: Date.now() });

    return mood;
  } catch (error) {
    console.error('Error analyzing mood:', error);
    throw new Error('Failed to analyze mood');
  }
};

// POST /journal/create
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    let aiResponse = 'AI reflection not available (API key missing)';
    let mood = 'neutral';

    try {
      aiResponse = await generateAIResponse(content);
      mood = await analyzeMood(content);
    } catch (aiError) {
      console.error('AI API error:', aiError.message);
      // Continue with default values if AI fails
    }

    const journalEntry = new Journal({
      userId: req.user.userId || req.user.id,
      content,
      aiResponse,
      mood,
    });

    await journalEntry.save();
    res.status(201).json({ message: 'Journal entry created', entry: journalEntry });
  } catch (error) {
    console.error('Database error:', error);
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

// Function to generate AI insights summary with caching
const generateInsightsSummary = async (moodCounts) => {
  const cacheKey = `insights_${JSON.stringify(moodCounts)}`;
  const cached = aiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('Using cached insights summary');
    return cached.data;
  }

  const API_KEY = process.env.HUGGINGFACE_API_KEY;
  if (!API_KEY) {
    console.log('No HuggingFace API key, using default insights summary');
    return 'Insights summary not available (API key missing)';
  }

  try {
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
      throw new Error(`Insights summary API failed with status ${response.status}`);
    }

    const data = await response.json();
    const result = data[0]?.generated_text || 'Insights summary not available.';

    // Cache the result
    aiCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.error('Error generating insights summary:', error);
    throw new Error('Failed to generate insights summary');
  }
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

    let summary = 'Insights summary not available (API key missing)';
    try {
      summary = await generateInsightsSummary(moodCounts);
    } catch (aiError) {
      console.error('AI API error for insights:', aiError.message);
      // Continue with default summary if AI fails
    }

    res.json({
      moodCounts,
      summary,
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
