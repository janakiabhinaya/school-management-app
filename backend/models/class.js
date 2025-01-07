const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
    {
        className: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        classsize: {
            type: Number,
            required: true,
        },
        teachers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Teacher",
            },
        ],
        studentFees: {
            type: Number,
            required: true,
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        school: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
