const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Student = require("../models/student");
const Class = require("../models/class");
const Teacher = require("../models/teacher");
const generateAuthToken = require("../helpers/generateAuthToken");
const Schedule = require('../models/schedule');

//delete class data
const deleteclass = async (req, res) => {
    const { classId } = req.params;
  
    try {
      // 1. Delete the class
      const deletedClass = await Class.findByIdAndDelete(classId);
      if (!deletedClass) {
        return res.status(404).json({ message: "Class not found." });
      }
  
      // 2. Delete all schedules associated with the class
      const deletedSchedules = await Schedule.deleteMany({ "class": classId });
  
    //   // 3. Update all students who were part of this class
    //   const updatedStudents = await Student.updateMany(
    //     { "classId": classId },
    //     { $set: { "classId": null } }
    //   );
  
      // Response with success
      res.status(200).json({
        message: "Class and all associated data deleted successfully.",
        deletedClass,
        deletedSchedulesCount: deletedSchedules.deletedCount,
        // updatedStudentsCount: updatedStudents.modifiedCount,
      });
    } catch (err) {
      console.error("Error deleting class:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  };
// delete schedules
const deleteschedules = async (req, res) => {
    const scheduleId = req.params.scheduleId; // Get the schedule ID from the request params
  
    try {
      // Check if the schedule exists
      const schedule = await Schedule.findByIdAndDelete(scheduleId);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
  
      return res.status(200).json({ message: "Schedule deleted successfully!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete schedule." });
    }
  };
// delete student
const deletestudent = async (req, res) => {
    const studentId = req.params.studentId; // Get the schedule ID from the request params
  
    try {
      // Check if the schedule exists
      const student = await Student.findByIdAndDelete(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      return res.status(200).json({ message: "Student deleted successfully!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete student." });
    }
  };
// delete teacher
const deleteteacher = async (req, res) => {
    const teacherId = req.params.teacherId; // Get the schedule ID from the request params
  
    try {
      // Check if the schedule exists
      const teacher = await Teacher.findByIdAndDelete(teacherId);
      if (!teacher) {
        return res.status(404).json({ message: "teacher not found" });
      }
  
      return res.status(200).json({ message: "teacher deleted successfully!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete teacher." });
    }
  };
module.exports = {deleteclass, deleteschedules, deletestudent, deleteteacher};