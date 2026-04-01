const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    wordCount: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
