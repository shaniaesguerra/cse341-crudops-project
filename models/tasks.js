const mongoose = require('mongoose');

//Make a schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    description: {
        type: String,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "done"],
        default: "todo"
    },
    priority: {
        type: String,
        enum: ["low", "meduim", "high"],
        default: "medium"
    },
    dueDate: {
        type: Date,
        validate: {
            //Check if Due date is appropriate
            validator: function(value) {
                return value > new Date();
            },
            message: "Due date must be in the future."
        }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
});

module.exports = mongoose.model('tasks', taskSchema);