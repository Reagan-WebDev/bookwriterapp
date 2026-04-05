const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/auth');
const Topic = require('../models/Topic');

// @route   POST /api/ai/generate
// @desc    Generate text continuation using Gemini AI
// @access  Private
router.post('/generate', protect, async (req, res) => {
    const { topicId, currentText } = req.body;

    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'Gemini API Key is missing in backend .env' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are a creative writing assistant helping an author write a chapter for a collaborative book.
        Book Topic: ${topic.title}
        Description: ${topic.description}

        The author has written the following text so far:
        "${currentText || ''}"

        Please write the next 2-3 sentences to logically and creatively continue the story. 
        Do not add any conversational filler like "Here are the next sentences:", just return the raw continuation text.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        res.json({ generatedText: text.trim() });
    } catch (error) {
        console.error('AI Generation Error:', error.message || error);
        // Include some error details for the frontend to display
        res.status(500).json({ message: 'Drafting failed. ' + (error.message || 'The AI might be currently unavailable.') });
    }
});

module.exports = router;
