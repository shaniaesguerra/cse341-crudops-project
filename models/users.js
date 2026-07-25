const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
        match:[ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address (e.g email@example.com)']
    },
    password: {
        type: String,
        default:null,
    },
    googleId: {
        type: String,
        default: null,
    },
    authMethod: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    role: {
        type: String,
        enum: ["admin", "member"],
        default: "member"
    }
}, {versionKey: false});

userSchema.pre("save", async function () {
  try {
    if (this.authMethod !== "local") return;
    if (!this.isModified("password") || !this.password) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
});

module.exports = mongoose.model("users", userSchema)