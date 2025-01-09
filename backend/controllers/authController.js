const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Student = require("../models/student");
const Class = require("../models/class");
const Teacher = require("../models/teacher");
const generateAuthToken = require("../helpers/generateAuthToken");
const Schedule = require('../models/schedule');
// Register User
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, schoolName } = req.body;

        // Validate input
        if (!name || !email || !password || !schoolName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            schoolName,
        });

        await newUser.save();

        res.status(201).json({ message: "Admin created successfully", user: { id: newUser._id } });
    } catch (error) {
        next(error);
    }
};

// Login User
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = generateAuthToken(user._id, user.role);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
};
//login student
const loginstudent = async (req, res, next) => {
  try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
          return res.status(400).json({ message: "All fields are required" });
      }

      // Find user
      const student = await Student.findOne({ email });
      if (!student) {
          return res.status(400).json({ message: "student does not exist" });
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, student.password);
      if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate token
      const token = generateAuthToken(student._id, student.role);

      res.status(200).json({
          message: "Login successful",
          token,
          student: {
              id: student._id,
              name: student.name,
              email: student.email,
              role: student.role,
          },
      });
  } catch (error) {
      next(error);
  }
};
// edit user data
const profileedit = async (req, res) => {
  const { adminId } = req.params;
  const { name, email, schoolName, password } = req.body;

  try {
    const admin = await User.findById(adminId);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    if (name) admin.name = name;
    if (email) admin.email = email;
    if (schoolName) admin.schoolName = schoolName;
    if (password) {
      admin.password = await bcrypt.hash(password, 10);
    } // Make sure to hash the password if storing it.

    await admin.save();
    res.json(admin);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile." });
  }
}
// fetch school data
const getProfileData = async (req, res) => {
  const { adminId } = req.params; // Get the adminId from the request parameters

  try {
    const user = await User.findById(adminId); // Fetch user by adminId
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Send back user profile data
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile data' });
  }
};
//create class
const classcreation = async (req, res) => {
  const { className, year, classsize, studentFees, school } = req.body;

  if (!className || !year || !classsize || !school) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newClass = new Class({
      className,
      year,
      classsize,
      studentFees,
      teachers: [],
      students: [],
      school,
    });

    await newClass.save();
    res.status(201).json({ message: "Class created successfully.", newClass });
  } catch (err) {
    res.status(500).json({ message: "Failed to create class.", error: err });
  }
};

//fetch all schools
const fetchschools = async (req, res) => {
  try {
    const schools = await User.find();
    res.json(schools);
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ error: "Error fetching schools" });
  }
}
// fetch classes data
const fetchClasses =  async (req, res) => {
    const { schoolId } = req.params;
  
    try {
      // Fetch classes where the school ID matches
      const classes = await Class.find({ school: schoolId });
  
      // If no classes found, return an empty array
      if (!classes.length) {
        return res.status(404).json({ message: 'No classes found for this school.' });
      }
  
      res.status(200).json({ classes });
    } catch (error) {
      console.error('Error fetching classes:', error);
      res.status(500).json({ message: 'Failed to fetch classes.' });
    }
  };
// fetch all classes of school
const fetchallclasseswithschool = async (req, res) => {
  const { schoolId } = req.params;  // Expecting schoolId as parameter in the URL

  try {
    // Query the Class model to find classes that match the schoolId
    const classes = await Class.find({ school: schoolId }).exec();  // Assuming 'school' field in Class model stores schoolId

    if (!classes || classes.length === 0) {
      return res.status(404).json({ message: "No classes found for the provided schoolId" });
    }

    // Return the matching classes in the response
    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Server error" });
  }
}
//fetch classes by id 
const fetchClassesbyid = async (req, res) => {
  const { schoolId } = req.params;
  console.log("Received schoolId:", schoolId);

  try {
    const classes = await Class.find({ school: schoolId });
    if (!classes.length) {
      console.log("No classes found for schoolId:", schoolId);
      return res.status(200).json([]); 
    }
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Failed to fetch classes." });
  }
};

// fetch classdata
const fetchclassdata = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the class data by its ID
    const classData = await Class.findById(id);

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Fetch all students whose classId matches the class ID
    const students = await Student.find({ classId: id })
      .select('name email contact gender');  // Select only required fields

    // Fetch all schedules related to the class ID
    const schedules = await Schedule.find({ class: id })
      .select('subject timings teacher');  // Select relevant fields for schedules

    // Fetch all teachers related to the schedules
    const teacherIds = schedules.map(schedule => schedule.teacher);
    const teachers = await Teacher.find({ _id: { $in: teacherIds } })
      .select('name email contact gender');  // Select relevant teacher details

    // Return all the fetched data
    res.json({
      classData,        // Class details
      students,         // Student details for the class
      schedules,        // Schedule details for the class
      teachers,         // Teacher details for each schedule
    });
  } catch (error) {
    console.error('Error fetching class data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// edit class data
const editclass = async (req, res) => {
  const { id } = req.params;
  const { className, year, classsize, studentFees } = req.body;

  try {
    // Find the class by ID
    const classToUpdate = await Class.findById(id);

    if (!classToUpdate) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    // Update class data
    classToUpdate.className = className || classToUpdate.className;
    classToUpdate.year = year || classToUpdate.year;
    classToUpdate.classsize = classsize || classToUpdate.classsize;
    classToUpdate.studentFees = studentFees || classToUpdate.studentFees;

    // Save the updated class
    await classToUpdate.save();

    return res.status(200).json({ message: 'Class updated successfully', class: classToUpdate });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update class.' });
  }
}
// get students data for school
const Getstudents = async (req, res) => {
  try {
    const { schoolId } = req.params;

    // Find students and populate classId with className and year from the Class model
    const students = await Student.find({ school: schoolId })
      .populate("classId", "className year") // Populate classId with fields from Class schema
      .exec();

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students." });
  }
}
//fetch classfee
const classfee = async (req, res) => {
  try {
      const { classId } = req.params;

      // Find the class by its ID
      const classData = await Class.findById(classId).select("studentFees");

      if (!classData) {
          return res.status(404).json({ error: "Class not found" });
      }

      // Return the studentFees field
      res.json(classData);
      console.log(classData);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
  }
}
// Register student
const registerStudent = async (req, res) => {
  const { name, gender, dateOfBirth, contact, email, password, classId, school, feesPaid } = req.body;

  if (!name || !gender || !dateOfBirth || !contact || !email || !password || !classId || !school) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if the student email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Hash the student's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student
    const newStudent = new Student({
      name,
      gender,
      dateOfBirth,
      contact,
      email,
      password: hashedPassword,
      classId,
      school,
      feesPaid, // Optional, depending on whether the fees are provided during registration
    });

    // Save the student to the database
    await newStudent.save();
    res.status(201).json({
      message: "Student registered successfully!",
      student: newStudent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register student." });
  }
}
// get particular student data
const getstudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch all classes related to the student's school
    const classes = await Class.find({ school: student.school }, "className studentFees year classsize");

    // Filter classes by comparing class size with the number of students
    const filteredClasses = await Promise.all(
      classes.map(async (classData) => {
        const studentCount = await Student.countDocuments({
          classId: classData._id,
        });

        // Include the class only if the student count is less than the class size
        if (studentCount < classData.classsize) {
          return classData;
        }

        return null; // Exclude classes where the count exceeds or equals the class size
      })
    );

    // Remove null values from the filteredClasses array
    const result = filteredClasses.filter((classData) => classData !== null);

    res.json({ student, classes: result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// fetch student data by id
const fetchstudentbyId = async (req, res) => {
  const studentId = req.params.id; // Use correct destructuring

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Initialize classData and schoolData as null (if not found)
    let classData = null;
    let schoolData = null;

    if (student.classId) {
      classData = await Class.findById(student.classId);
      if (!classData) {
        classData = null; // Set classData to null if not found
      }
    }

    if (student.school) {
      schoolData = await User.findById(student.school);
      if (!schoolData) {
        schoolData = null; // Set schoolData to null if not found
      }
    }

    // Return student data along with classData and schoolData (which may be null)
    res.status(200).json({
      student,
      classData,
      schoolData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Server error while fetching data" });
  }
};

//fetch classes by id and filter based on class size
const filteredclasses = async (req, res) => {
  try {
      const { schoolId } = req.params;

      // Fetch all classes for the given school ID
      const classes = await Class.find({ school: schoolId });

      // Filter classes by comparing class size with the number of students
      const filteredClasses = await Promise.all(
          classes.map(async (classData) => {
              const studentCount = await Student.countDocuments({
                  classId: classData._id,
              });

              // Include the class only if the student count is less than the class size
              if (studentCount < classData.classsize) {
                  return classData;
              }

              return null; // Exclude classes where the count exceeds or equals the class size
          })
      );

      // Remove null values from the filteredClasses array
      const result = filteredClasses.filter((classData) => classData !== null);

      res.status(200).json(result);
  } catch (error) {
      console.error("Error fetching and filtering classes:", error);
      res.status(500).json({ error: "Internal server error" });
  }
}

// edit student data
const updatedata = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    if (updateData.password) {
      const saltRounds = 10; // Number of salt rounds for bcrypt
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }
    // Find the student by ID and update
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: updateData }, // Update with new data
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.status(200).json({ message: 'Student updated successfully.', student: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Failed to update student.', error: error.message });
  }
}
// update student by id
const updatestudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const updatedData = req.body; // This will contain the data you want to update

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update the student's data (handle feesPaid separately if needed)
    // Check that each fee is filled properly
    if (updatedData.feesPaid) {
      const invalidFee = updatedData.feesPaid.some(fee => !fee.amount || !fee.date);
      if (invalidFee) {
        return res.status(400).json({ message: 'Please fill all fee paid details before updating.' });
      }
    }

    // Update student fields, but leave feesPaid unchanged unless explicitly passed
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        $set: updatedData, // Update with the data sent in the request body
      },
      { new: true } // Return the updated document
    );

    // Return updated student data
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: 'Server error' });
  }
}
//fetch schedules 
const schedules =  async (req, res) => {
  const { classId } = req.query; // Get classId from query parameters

  if (!classId) {
    return res.status(400).json({ message: "classId is required" });
  }

  try {
    // Fetch schedules for the specific classId
    const schedules = await Schedule.find({ class: classId });

    // Populate class and teacher details manually
    const schedulesWithDetails = await Promise.all(
      schedules.map(async (schedule) => {
        // Get class details by classId
        const classDetails = await Class.findById(schedule.class);
        // Get teacher details by teacherId
        const teacherDetails = await Teacher.findById(schedule.teacher);

        return {
          ...schedule.toObject(),
          className: classDetails?.className,
          year: classDetails?.year,
          teacherName: teacherDetails?.name,
        };
      })
    );

    res.status(200).json(schedulesWithDetails);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Error fetching schedules" });
  }
}
// login teacher
const loginteacher = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find teacher by email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: "Teacher not found" });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: teacher._id, email: teacher.email },
      process.env.JWT_SECRET, // Add a JWT secret in your environment variables
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, teacherId: teacher._id, });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
// get all schedules of teacher
const getschedulesofteacher = async (req, res) => {
  const { teacherId } = req.params;

  try {
    // Find schedules for the teacher and populate class and teacher details
    const schedules = await Schedule.find({ teacher: teacherId })
      .populate("class", "className year");

    if (!schedules.length) {
      return res.status(404).json({ message: "No schedules found for this teacher." });
    }

    res.json(schedules);
    console.log(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
// register individual teacher
const teacherregister = async (req, res) => {
  const { name, gender, dateOfBirth, contact, email, password, salary, school } = req.body;

  try {
    // Check if the teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new teacher
    const teacher = new Teacher({
      name,
      gender,
      dateOfBirth,
      contact,
      email,
      password: hashedPassword,
      salary,
      school,
    });

    // Save the teacher to the database
    await teacher.save();

    res.status(201).json({ message: "Teacher registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
//register teacher
const registerTeacher = async (req, res) => {
    const { name, gender, dateOfBirth, contact, email, password, salary, assignedClasses, schoolId } = req.body;
  
    // Validate if schoolId is present in the request
    if (!schoolId) {
      return res.status(400).json({ message: "School ID is required" });
    }
  
    // Check if the teacher already exists by email
    try {
      const existingTeacher = await Teacher.findOne({ email });
      if (existingTeacher) {
        return res.status(400).json({ message: "Teacher already exists with this email" });
      }
  
    //   // Validate the request data
    //   const errors = validationResult(req);
    //   if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    //   }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new teacher
      const newTeacher = new Teacher({
        name,
        gender,
        dateOfBirth,
        contact,
        email,
        password: hashedPassword,
        salary,
        assignedClasses,
        school: schoolId, // Use the schoolId sent from the frontend
      });
  
      // Save the teacher to the database
      await newTeacher.save();
  
      // Send success response
      res.status(201).json({ message: "Teacher registered successfully", teacher: newTeacher });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  const getTeachersBySchoolId = async (req, res) => {
    const { schoolId } = req.params;
  
    try {
      // Find all teachers with the matching schoolId
      const teachers = await Teacher.find({ school: schoolId });
  
      if (!teachers || teachers.length === 0) {
        return res.status(404).json({ message: "No teachers found for this school." });
      }
  
      res.status(200).json({ teachers });
    } catch (error) {
      console.error("Error fetching teachers:", error.message);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  //get teacher
  const getteacher = async (req, res) => {
    try {
      const teacher = await Teacher.findById(req.params.id);
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
      res.status(200).json({ teacher });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch teacher data' });
    }
  }
  //update teacher
  const updateTeacher = async (req, res) => {
    const { name, gender, dateOfBirth, contact, email, salary, oldPassword, newPassword } = req.body;
    const { id } = req.params;
  
    try {
      // Fetch the teacher by ID
      const teacher = await Teacher.findById(id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found." });
      }
  
      // Update teacher details if provided
      if (name) teacher.name = name;
      if (gender) teacher.gender = gender;
      if (dateOfBirth) teacher.dateOfBirth = dateOfBirth;
      if (contact) teacher.contact = contact;
      if (email) teacher.email = email;
      if (salary) teacher.salary = salary;
  
      // Update password if oldPassword and newPassword are provided
      if (oldPassword && newPassword) {
        const isMatch = await bcrypt.compare(oldPassword, teacher.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Old password is incorrect." });
        }
  
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        teacher.password = hashedPassword;
      }
  
      // Save the updated teacher details
      const updatedTeacher = await teacher.save();
  
      res.status(200).json({ message: "Teacher updated successfully", teacher: updatedTeacher });
    } catch (error) {
      console.error(error);
      if (error.code === 11000 && error.keyPattern.email) {
        return res.status(400).json({
          message: `The email '${email}' is already in use.`,
        });
      }
      res.status(500).json({ message: "Failed to update teacher data." });
    }
  };
  // create schedule
  const createSchedule = async (req, res) => {
    try {
      const { school, class: classId, teacher, subject, timings } = req.body;
  
      // Validate required fields
      if (!school || !classId || !teacher || !subject || !timings || !timings.length) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      // Validate timings structure
      timings.forEach((timing, index) => {
        if (!timing.startTime || !timing.endTime) {
          throw new Error(`Timing entry ${index + 1} must have both startTime and endTime.`);
        }
        if (new Date(`1970-01-01T${timing.startTime}:00Z`) >= new Date(`1970-01-01T${timing.endTime}:00Z`)) {
          throw new Error(`Timing entry ${index + 1}: startTime must be earlier than endTime.`);
        }
      });
  
      // Save schedule to the database
      const schedule = new Schedule({
        school,
        class: classId,
        teacher,
        subject,
        timings,
      });
  
      const savedSchedule = await schedule.save();
      res.status(201).json({ message: 'Schedule created successfully!', schedule: savedSchedule });
    } catch (error) {
      console.error('Error creating schedule:', error);
      res.status(500).json({ message: error.message });
    }
  };
const getschedules = async (req, res) => {
  const { schoolId } = req.params; // Extract schoolId from the route parameter

  try {
    // Fetch schedules that belong to the specified school (adminId)
    const schedules = await Schedule.find({ school: schoolId })
      .populate("class", "className year") // Populate class information
      .populate("teacher", "name") // Populate teacher information
      .exec();

    if (!schedules) {
      return res.status(404).json({ message: "No schedules found for this school." });
    }
    console.log(schedules);
    return res.status(200).json({ schedules });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch schedules." });
  }
}  
const getschedulebyid = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('class', 'className year')
      .populate('teacher', 'name');
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.status(200).json({ schedule });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching schedule', error: err.message });
  }
}
const updateschedulebyid = async (req, res) => {
  try {
    const { class: classId, teacher, subject, timings } = req.body;
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { class: classId, teacher, subject, timings },
      { new: true }
    );
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.status(200).json({ message: 'Schedule updated successfully', schedule });
  } catch (err) {
    res.status(500).json({ message: 'Error updating schedule', error: err.message });
  }
}
const feesanalysis = async (req, res) => {
  try {
    const { schoolId } = req.params;

    if (!schoolId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    // Fetch all teachers and students for the given school
    const teachers = await Teacher.find({ school: schoolId });
    const students = await Student.find({ school: schoolId });

    // Send the data to the frontend
    return res.json({ teachers, students });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { registerUser, profileedit, loginUser, registerStudent, registerTeacher, classcreation, 
  fetchClasses, fetchclassdata, getProfileData, editclass, Getstudents, updatedata, classfee, 
  getTeachersBySchoolId, getstudent, getteacher, updateTeacher, createSchedule, getschedules, getschedulebyid,
  updateschedulebyid, feesanalysis, fetchschools, updatestudent, fetchClassesbyid, loginstudent, fetchstudentbyId, 
  schedules, fetchallclasseswithschool, teacherregister, loginteacher, getschedulesofteacher, filteredclasses};
