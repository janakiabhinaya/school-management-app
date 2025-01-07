const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the admin's user ID
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class", // Refers to the class ID
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher", // Refers to the teacher's ID
      required: true,
    },
    subject: {
      type: String, // Stores the name of the subject
      required: true,
    },
    timings: [
      {
        startTime: {
          type: String, // Start time in HH:mm format
          required: true,
        },
        endTime: {
          type: String, // End time in HH:mm format
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
