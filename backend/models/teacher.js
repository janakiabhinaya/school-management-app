const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    assignedClasses: [{
        type: String, // Change from ObjectId to String
    }],
    role: {
        type: String,
        default: "Teacher",
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);
