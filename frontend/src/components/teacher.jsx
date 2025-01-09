import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";

function Teacher() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    contact: "",
    email: "",
    password: "",
    salary: "",
    school: "",
  });
  const [isLogin, setIsLogin] = useState(false); // For toggling between register and login
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [schools, setSchools] = useState([]);
  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    }

    if (!isLogin) {
      if (!formData.name) {
        errors.name = "Name is required.";
      }

      if (!formData.salary) {
        errors.salary = "Salary is required.";
      }

      if (!formData.gender) {
        errors.gender = "Gender is required.";
      }

      if (!formData.dateOfBirth) {
        errors.dateOfBirth = "Date of birth is required.";
      }

      if (!formData.contact) {
        errors.contact = "Contact is required.";
      }

      if (!formData.school) {
        errors.school = "School is required.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/schools") // Replace with your API endpoint to fetch school names
      .then((response) => {
        setSchools(response.data);
      })
      .catch((error) => {
        console.error("Error fetching schools:", error);
      });
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const endpoint = isLogin
      ? "http://localhost:5000/api/auth/login-teacher" // Endpoint for teacher login
      : "http://localhost:5000/api/auth/register-teacher"; // Endpoint for teacher registration

    try {
      const response = await axios.post(endpoint, formData);
      if (isLogin) {
        // Handle login
        const token = response.data.token;
        const teacherId = response.data.teacherId;
        localStorage.setItem("authToken", token);
        localStorage.setItem("teacherId", teacherId)
        navigate("/teacherdetails"); 
      } else {
        // Handle registration
        alert("Teacher registered successfully!");
        setFormData({
          name: "",
          gender: "",
          dateOfBirth: "",
          contact: "",
          email: "",
          password: "",
          salary: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Teacher Management</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        onClick={() => setIsLogin(false)} // Show register form
      >
        Register Teacher
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 ml-4"
        onClick={() => setIsLogin(true)} // Show login form
      >
        Login Teacher
      </button>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <button
                type="button"
                onClick={() => navigate("/")}
                
              >
                <IoArrowBackCircleOutline className="w-8 h-8 text-blue-500"/>
              </button>
        <div className="flex">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email:</label>
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
        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password:</label>
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
        </div>
        {!isLogin && (
          <>
          <div className="flex">
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
           {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
        </div>
            <div>
              <label htmlFor="salary" className="block text-sm font-medium">Salary:</label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
               {formErrors.salary && <p className="text-red-500 text-sm">{formErrors.salary}</p>}
            </div>
            </div>
            <div className="flex">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium">Gender:</label>
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
            <div>
                <label htmlFor="schoolId" className="block font-medium">School:</label>
                <select
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select School</option>
                  {schools.map((school) => (
                    <option key={school._id} value={school._id}>
                      {school.schoolName}
                    </option>
                  ))}
                </select>
                {formErrors.school && <p className="text-red-500 text-sm">{formErrors.school}</p>}
              </div>
              </div>
              <div className="flex">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium">Date of Birth:</label>
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
              <label htmlFor="contact" className="block text-sm font-medium">Contact:</label>
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
          </>
        )}
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}

export default Teacher;
