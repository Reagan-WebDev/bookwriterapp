const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open',
    },
    isCompiled: {
        type: Boolean,
        default: false,
    },
    thresholdType: {
        type: String,
        enum: ['submissions', 'wordCount'],
        required: true,
    },
    thresholdValue: {
        type: Number,
        required: true,
    },
    currentSubmissions: {
        type: Number,
        default: 0,
    },
    currentWordCount: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Topic', TopicSchema);
