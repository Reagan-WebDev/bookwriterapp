const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/topics
// @desc    Get all topics
// @access  Public
router.get('/', async (req, res) => {
    try {
        const topics = await Topic.find().sort({ createdAt: -1 });
        res.json(topics);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/topics
// @desc    Create a topic
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    const { title, description, thresholdType, thresholdValue } = req.body;

    try {
        const newTopic = new Topic({
            title,
            description,
            thresholdType,
            thresholdValue
        });

        const topic = await newTopic.save();
        res.json(topic);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/topics/:id
// @desc    Get a topic by id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });
        res.json(topic);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/topics/:id/close
// @desc    Manually close a topic
// @access  Private/Admin
router.put('/:id/close', protect, admin, async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });

        topic.status = 'closed';
        await topic.save();
        res.json(topic);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
