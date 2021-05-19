const mongoose = require('mongoose');
const slugify = require('slugify')

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
    },
    slug: {
      type: String,
      required: true,
      unique: true
    }
})

TaskSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true })
    }

    next()
})

const Task = mongoose.model('Task', TaskSchema)

module.exports = { Task }