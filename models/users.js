const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required'],
        minLength: 2
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required'],
        minLength: 2
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match:[ /^\S+@\S+\.\S$/, 'Please provide a valid email address (e.g email@example.com)']
    },
    role: {
        type: String,
        enum: ["admin", "member"],
        default: "member"
    }
});

module. exports = mongoose.model("users", userSchema)