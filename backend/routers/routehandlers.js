const express = require("express");
const {deleteclass, deleteschedules, deletestudent, deleteteacher} = require("../controllers/deleteController");
const authenticateToken = require("../middleware/auth");
const router = express.Router();
router.delete("/deleteschedule/:scheduleId", authenticateToken, deleteschedules);
router.delete("/deleteclass/:classId", authenticateToken, deleteclass);
router.delete("/deletestudent/:studentId", authenticateToken, deletestudent);
router.delete("/deleteteacher/:teacherId", authenticateToken, deleteteacher);
module.exports = router;
