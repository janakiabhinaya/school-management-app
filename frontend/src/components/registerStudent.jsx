import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterStudent() {
  const navigate = useNavigate();
  const handleEdit = (studentId) => {
    navigate(`/edit-student/${studentId}`);  // Navigate to edit route with student ID
  };
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    contact: "",
    email: "",
    password: "",
    classId: "",
    feesPaid: [],
  });
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [feeDetails, setFeeDetails] = useState({ amount: "", date: "" });
  const [selectedClassFee, setSelectedClassFee] = useState("");
  const [formErrors, setFormErrors] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    contact: "",
    email: "",
    password: "",
    classId: "",
  });
  const adminId = localStorage.getItem("adminId");
  const token = localStorage.getItem("authToken");
  const fetchClasses = async () => {
  
    if (!adminId || !token) {
      setError("Authorization required. Please log in.");
      return;
    }
  
    try {
      const classResponse = await axios.get(
        `http://localhost:5000/api/auth/getclasses/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClasses(classResponse.data.classes);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch classes.");
    }
  };
  const fetchStudents = async () => {
  
    if (!adminId || !token) {
      setError("Authorization required. Please log in.");
      return;
    }
  
    try {
      const studentResponse = await axios.get(
        `http://localhost:5000/api/auth/students/${adminId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(studentResponse.data.students);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch students.");
    }
  };
    
  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);
  useEffect(() => {
    const fetchClassFee = async () => {
      if (!formData.classId) {
        setSelectedClassFee(null);
        return;
      }
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/class/${formData.classId}/fee`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSelectedClassFee(response.data.studentFees);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch class fee.");
        setSelectedClassFee(null);
      }
    };

    fetchClassFee();
  }, [formData.classId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFeeChange = (e) => {
    const { name, value } = e.target;
    setFeeDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  const addFee = () => {
    if (!feeDetails.amount || !feeDetails.date) {
      alert("Please fill out both fee amount and date.");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      feesPaid: [...prevData.feesPaid, feeDetails],
    }));

    setFeeDetails({ amount: "", date: "" });
  };
  const validateForm = () => {
    let isValid = true;
    let errors = { ...formErrors };

    // Check each required field
    if (!formData.name) {
      errors.name = "Name is required";
      isValid = false;
    }
    if (!formData.gender) {
      errors.gender = "Gender is required";
      isValid = false;
    }
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
      isValid = false;
    }
    if (!formData.contact) {
      errors.contact = "Contact is required";
      isValid = false;
    }
    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    }
    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    }
    if (!formData.classId) {
      errors.classId = "Class is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // If validation fails, don't submit the form
    }

  if (formData.name.length > 27) {
    setFormErrors(prev => ({ ...prev, name: "Name must be less than 27 characters long." }));
    return;
  }

  // Validate email format (example: user@example.com)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(formData.email)) {
    setFormErrors(prev => ({ ...prev, email: "Please enter a valid email address." }));
    return;
  }

    const adminId = localStorage.getItem("adminId");
    const token = localStorage.getItem("authToken");

    if (!adminId || !token) {
      setError("Authorization required. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/student/register",
        {
          ...formData,
          school: adminId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.message) {
        alert("Student registered successfully!");
        setFormData({
          name: "",
          gender: "",
          dateOfBirth: "",
          contact: "",
          email: "",
          password: "",
          classId: "",
          feesPaid: [],
        });
        setFormErrors({
          name: "",
          gender: "",
          dateOfBirth: "",
          contact: "",
          email: "",
          password: "",
          classId: "",
        })
        setError(null);
        setShowPopup(false);
        setStudents((prev) => [...prev, response.data.student]);
        fetchClasses();
        fetchStudents();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register student.");
    }
  };
  const handleDelete = async (studentId) => {

    if (!adminId || !token) {
      setError("Authorization required. Please log in.");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/auth/deletestudent/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("student deleted successfully!");
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete class.");
    }
  };
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <button
        onClick={() => setShowPopup(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Student
      </button>
      {/* {error && <p className="text-red-500 mt-4">{error}</p>} */}
      <h2 className="text-2xl font-bold mb-4">Students List</h2>
      <div className="flex flex-wrap gap-4 mt-6">
      {students.length > 0 ? (
      students.map((student) => (
    <div
      key={student._id}
      className="bg-white p-4 border border-gray-300 rounded-lg shadow-md w-60"
    >
      <div className="font-semibold text-lg">{student.name}</div>
      <div className="text-sm text-gray-600">{student.gender}</div>
      <div className="text-sm text-gray-600">
        Class: {student.classId?.className || ""} year: {student.classId?.year || ""}  
      </div>
      <div className="text-sm text-gray-600">Email: {student.email}</div>
      <div className="text-sm text-gray-600">Contact: {student.contact}</div>
      
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => handleEdit(student._id)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(student._id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  ))
) : (
  <div className="text-center text-gray-600 mt-4">No students found</div>
)}
</div>


      {showPopup && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[45%]">
            <h3 className="text-xl font-semibold mb-6">Register Student</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-around">
              <div>
                <label htmlFor="name" className="block font-medium">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
                 {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="gender" className="block font-medium">Gender:</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {formErrors.gender && <p className="text-red-500 text-sm">{formErrors.gender}</p>}
              </div>
              </div>
              <div className="flex justify-around">
              <div>
                <label htmlFor="dateOfBirth" className="block font-medium">Date of Birth:</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
                 {formErrors.dateOfBirth && <p className="text-red-500 text-sm">{formErrors.dateOfBirth}</p>}
              </div>
              <div>
                <label htmlFor="contact" className="block font-medium">Contact:</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
                {formErrors.contact && <p className="text-red-500 text-sm">{formErrors.contact}</p>}
              </div>
              </div>
                <div className="items-center">
                <label htmlFor="email" className="block font-medium">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
                {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
              </div>
              <div className="flex justify-around">
              <div>
                <label htmlFor="password" className="block font-medium">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                />
                 {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
              </div>
              <div>
                <label htmlFor="classId" className="block font-medium">Class:</label>
                <select
                  id="classId"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select Class</option>
                  {classes.map((classItem) => (
                    <option key={classItem._id} value={classItem._id}>
                      {classItem.className} - Year: {classItem.year}
                    </option>
                  ))}
                </select>
                {formErrors.classId && <p className="text-red-500 text-sm">{formErrors.classId}</p>}
              </div>
              </div>
              <div>
                <label className="block font-medium">Class Fees:</label>
                <p className="text-gray-600">
                  {selectedClassFee !== null
                    ? `Your selected class fee is: ₹${selectedClassFee}`
                    : "0"}
                </p>
                <div>
                <label htmlFor="feesPaid" className="block font-medium">
                  Fees Paid:
                </label>
                <div className="flex space-x-2 items-center">
                  <input
                    type="number"
                    name="amount"
                    value={feeDetails.amount}
                    onChange={handleFeeChange}
                    placeholder="Amount"
                    className="w-1/2 p-2 border rounded-md"
                  />
                   <input
                    type="date"
                    name="date"
                    value={feeDetails.date}
                    onChange={handleFeeChange}
                    className="w-1/2 p-2 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addFee}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPopup(false);
                    setFormErrors({
                      name: "",
                      gender: "",
                      dateOfBirth: "",
                      contact: "",
                      email: "",
                      password: "",
                      classId: "",
                    })
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterStudent;
