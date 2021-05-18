const { isInteger } = require('lodash');
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    completeBy: {
        type: Date,
        required: true
    },
    priority: {
        type: Number,
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    completed: {
        type: Boolean,
        default: false
    }
})

const Task = mongoose.model('Task', TaskSchema);

module.exports = { Task }