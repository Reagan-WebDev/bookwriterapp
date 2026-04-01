const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Topic = require('../models/Topic');
const { protect } = require('../middleware/auth');

// @route   POST /api/submissions
// @desc    Create a submission
// @access  Private
router.post('/', protect, async (req, res) => {
    const { topicId, content, wordCount } = req.body;

    try {
        // Validate word count
        if (wordCount < 1000) {
            return res.status(400).json({ message: 'Submission must be at least 1000 words.' });
        }

        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        if (topic.status === 'closed') {
            return res.status(400).json({ message: 'This topic is closed for submissions.' });
        }

        // Create submission
        const newSubmission = new Submission({
            user: req.user.id,
            topic: topicId,
            content,
            wordCount
        });

        const submission = await newSubmission.save();

        // Update topic counts
        topic.currentSubmissions += 1;
        topic.currentWordCount += wordCount;

        // Check if thresholds are met to auto-close
        let shouldClose = false;
        if (topic.thresholdType === 'submissions' && topic.currentSubmissions >= topic.thresholdValue) {
            shouldClose = true;
        } else if (topic.thresholdType === 'wordCount' && topic.currentWordCount >= topic.thresholdValue) {
            shouldClose = true;
        }

        if (shouldClose) {
            topic.status = 'closed';
        }

        await topic.save();

        res.json(submission);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/submissions/:topicId
// @desc    Get submissions by topic
// @access  Public
router.get('/topic/:topicId', async (req, res) => {
    try {
        const submissions = await Submission.find({ topic: req.params.topicId }).populate('user', 'name');
        res.json(submissions);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/submissions/user/:userId
// @desc    Get submissions by user
// @access  Public
router.get('/user/:userId', async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.params.userId }).populate('topic', 'title');
        res.json(submissions);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
