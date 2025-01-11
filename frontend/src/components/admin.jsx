import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { BACKEND_URL } from "../constant.js";

function Admin() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    schoolName: "",
  });
  const [error, setError] = useState(null);
  const [isAdminCreated, setIsAdminCreated] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isAdminCreated) {
      // Admin creation logic
      const missingFields = [];
      if (!formData.name) missingFields.push("Name");
      if (!formData.email) missingFields.push("Email");
      if (!formData.password) missingFields.push("Password");
      if (!formData.schoolName) missingFields.push("School Name");

      if (missingFields.length > 0) {
        alert(`Please fill in the following fields: ${missingFields.join(", ")}`);
        return;
      }

      try {
        await axios.post(`${BACKEND_URL}/api/auth/adminregister`, formData);
        alert("Admin created successfully!");
        setFormData({ name: "", email: "", password: "", schoolName: "" }); // Clear form fields
        setIsAdminCreated(true); // Switch to login form
      } catch (err) {
        setError(err.response?.data?.message || "Failed to create admin try again");
      }
    } else {
      // Login logic
      if (!formData.email || !formData.password) {
        alert("Please fill in both email and password to login.");
        return;
      }

      try {
        const response = await axios.post(`${BACKEND_URL}/api/auth/adminlogin`, {
          email: formData.email,
          password: formData.password,
        });

        const Token = response.data.token;
        const adminid = response.data.user.id;
  
        // Store the token in localStorage
        localStorage.setItem("authToken", Token);
        localStorage.setItem("adminId", adminid);
        axios.defaults.headers['Authorization'] = `Bearer ${Token}`;

        alert("Login successful!");
        navigate("/dashboard"); // Navigate to the dashboard or any other page
      } catch (err) {
        setError(err.response?.data?.message || "Failed to login");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:underline focus:outline-none"
        >
          <IoArrowBackCircleOutline className="w-14 h-14 text-blue-500"/>
        </button>
      </div>
      
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        {isAdminCreated ? "Login" : "Register"}
      </h2>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-4">
        {!isAdminCreated && (
          <>
            <div>
              <label htmlFor="name" className="block text-gray-700">Admin Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                // required
              />
            </div>

            <div>
              <label htmlFor="schoolName" className="block text-gray-700">School Name:</label>
              <input
                type="text"
                id="schoolName"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                // required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block text-gray-700">Email ID:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            // required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            // required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {isAdminCreated ? "Login" : "Register"}
        </button>

        {/* Show login button only when creating admin */}
        {!isAdminCreated && (
          <button
            onClick={() => setIsAdminCreated(true)}
            className="w-full py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Already have an account? Login
          </button>
        )}
      </form>
    </div>
  );
}

export default Admin;
