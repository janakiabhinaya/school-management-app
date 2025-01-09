const express = require("express");
const { registerUser, loginUser, registerStudent, registerTeacher, classcreation, fetchClasses, fetchclassdata, 
    profileedit, getProfileData, editclass, Getstudents, classfee, getstudent, 
    getTeachersBySchoolId, updatedata, getteacher, createSchedule, getschedules, getschedulebyid, updateschedulebyid,
    updateTeacher, feesanalysis, fetchschools, fetchClassesbyid, loginstudent, fetchstudentbyId,
    fetchallclasseswithschool, updatestudent,schedules, teacherregister, loginteacher, getschedulesofteacher} = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Test Route
router.get("/", (req, res) => res.status(200).send("Auth API"));

// Auth Routes
router.post("/adminregister", registerUser);
router.post("/adminlogin", loginUser);
router.post("/student/register", authenticateToken, registerStudent);
router.post("/teacher/register", authenticateToken, registerTeacher);
router.post("/createclass", authenticateToken, classcreation);
router.get("/getclasses/:schoolId", authenticateToken, fetchClasses);
router.get("/getclassesdata/:schoolId", authenticateToken, fetchallclasseswithschool);
router.get("/profile/:adminId", authenticateToken, getProfileData);
router.put("/editprofile/:adminId",authenticateToken,profileedit);
router.get("/students/:schoolId", authenticateToken, Getstudents);
router.patch("/updateclass/:id", authenticateToken, editclass);
router.get("/class/:classId/fee", classfee);
router.get("/student/:id", getstudent);
router.patch("/student/:id", authenticateToken, updatedata);
router.get("/classes/:id", fetchclassdata);
router.get("/teachers/:schoolId", authenticateToken, getTeachersBySchoolId);
router.get('/teacher/:id', authenticateToken, getteacher);
router.patch('/teacher/:id', authenticateToken, updateTeacher);
router.post('/schedule', authenticateToken,createSchedule);
router.get('/schedules/:schoolId', authenticateToken,getschedules);
router.get('/schedule/:id',authenticateToken, getschedulebyid);
router.patch('/schedule/:id',authenticateToken, updateschedulebyid);
router.get("/analytics/:schoolId",authenticateToken, feesanalysis);
router.get('/schools', fetchschools);
router.get("/fetchclasses/:schoolId", fetchClassesbyid);
router.post("/register-student", registerStudent); 
router.post("/login-student", loginstudent);
router.get("/getstudent/:id", authenticateToken, fetchstudentbyId);
router.patch("/editstudent/:studentId",authenticateToken,updatestudent);
router.get("/schedules",schedules);
router.post("/register-teacher", teacherregister);
router.post("/login-teacher",loginteacher);
router.get("/getschedules/:teacherId", getschedulesofteacher);
module.exports = router;
