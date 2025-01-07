const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
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
            required: true,
            unique: true,  // Make email unique
        },
        password: {
            type: String,
            required: true,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        feesPaid: [
            {
              amount: {
                type: Number,
                required: true,
              },
              date: {
                type: Date,
                required: true,
              },
            },
          ],
        role: {
            type: String,
            default: "Student",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
