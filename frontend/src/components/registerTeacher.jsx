import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterTeacher() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    contact: "",
    email: "",
    password: "",
    salary: "",
    assignedClasses: [], // Added assignedClasses as an array
  });
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
        name: "",
        gender: "",
        dateOfBirth: "",
        contact: "",
        email: "", 
        password: "",
        salary: ""
  });
  const adminId = localStorage.getItem("adminId");
  const token = localStorage.getItem("authToken");
  const fetchTeachers = async () => {
    const schoolId = localStorage.getItem("adminId");
    const token = localStorage.getItem("authToken");

    if (!schoolId || !token) {
      setError("Authorization required. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/teachers/${schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTeachers(response.data.teachers);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch teachers.");
    }
  };
  useEffect(() => {
    fetchTeachers();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear specific field error when user updates the field
    }));
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
    if (!formData.salary) {
      errors.salary = "salary is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
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
    const authToken = localStorage.getItem("authToken");
    const schoolId = localStorage.getItem("adminId"); // Assuming adminId is used as schoolId

    if (!authToken || !schoolId) {
      alert("Unauthorized access. Please log in as an admin.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/teacher/register",
        {
          ...formData,
          schoolId, // Send schoolId from localStorage
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      alert("Teacher registered successfully!");
      setFormData({
        name: "",
        gender: "",
        dateOfBirth: "",
        contact: "",
        email: "", // Reset email field
        password: "",
        salary: "",
        assignedClasses: [], // Reset assignedClasses
      });
      setShowPopup(false);
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register teacher");
    }
  };
  const handleDelete = async (teacherId) => {

    if (!adminId || !token) {
      setError("Authorization required. Please log in.");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/auth/deleteteacher/${teacherId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("teacher deleted successfully!");
      await fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete class.");
    }
  };
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Teacher Management</h2>
      <button 
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      onClick={() => setShowPopup(true)}>Register Teacher</button>
      {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
         <div className="bg-white p-6 rounded-lg shadow-lg w-[45%]">
        <h3 className="text-lg font-bold mb-4">Register a New Teacher</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-around">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
             className= "w-full p-2 border rounded-md"
          />
           {formErrors.name && <span className="text-red-500 text-sm">{formErrors.name}</span>}
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className= "w-full p-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {formErrors.gender && (
            <span className="text-red-500 text-sm">{formErrors.gender}</span>
          )}
        </div>
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className= "w-full p-2 border rounded-md"
          />
          {formErrors.dateOfBirth && (
            <span className="text-red-500 text-sm">{formErrors.dateOfBirth}</span>
          )}
        </div>
        <div>
          <label htmlFor="contact">Contact:</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className= "w-full p-2 border rounded-md"
          />
           {formErrors.contact && (
            <span className="text-red-500 text-sm">{formErrors.contact}</span>
          )}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className= "w-full p-2 border rounded-md"
          />
          {formErrors.email && <span className="text-red-500 text-sm">{formErrors.email}</span>}
        </div>
        <div className="flex justify-around">
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className= "w-full p-2 border rounded-md"
          />
           {formErrors.password && (
            <span className="text-red-500 text-sm">{formErrors.password}</span>
          )}
        </div>
        <div>
          <label htmlFor="salary">Salary:</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className= "w-full p-2 border rounded-md"
          />
          {formErrors.salary && (
            <span className="text-red-500 text-sm">{formErrors.salary}</span>
          )}
        </div>
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Register Teacher</button>
        <button type="button" onClick={() => setShowPopup(false)}
           className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
              Cancel
            </button>
      </form>
      </div>
    </div>
      )}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Teachers List</h3>
        <div className="grid gap-4">
        {teachers.length > 0 ? (
        teachers.map((teacher) => (
          <div key={teacher._id} className="p-4 border rounded-md shadow-md flex justify-between items-center">
            <p>{teacher.name}</p>
            <div className="flex justify-between space-x-2">
            <button onClick={() => navigate(`/edit-teacher/${teacher._id}`)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">
              Edit</button>
              <button
          onClick={() => handleDelete(teacher._id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
        >
          Delete
        </button>
        </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No teachers found for this school</p>
      )}
      </div>
      {/* {error && <p className="text-red-500 mt-4">{error}</p>} */}
    </div>
    </div>
  );
}

export default RegisterTeacher;
