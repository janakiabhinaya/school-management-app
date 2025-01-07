import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditTeacher() {
  const { id } = useParams(); // Get teacher ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    contact: "",
    email: "",
    salary: "",
    oldPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    contact: "",
    email: "",
    salary: "",
    oldPassword: "",
    newPassword: "",
  });
  const formatDate = (isoDate) => {
    const date = new Date(isoDate); // Convert the ISO string to a Date object
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1) and pad
    const year = date.getFullYear(); // Get full year
    return `${year}-${month}-${day}`; // Return formatted date
  };
  // Fetch teacher details by ID
  useEffect(() => {
    const fetchTeacher = async () => {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        setError("Unauthorized access. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/teacher/${id}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const teacherData = response.data.teacher || {};
      setFormData({
        name: teacherData.name || "",
        gender: teacherData.gender || "",
        dateOfBirth: teacherData.dateOfBirth || "",
        contact: teacherData.contact || "",
        email: teacherData.email || "",
        salary: teacherData.salary || "",
        oldPassword: "",
        newPassword: "",
      });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch teacher data.");
      }
    };

    fetchTeacher();
  }, [id]);

  // Handle form field changes
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
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };
  // Form validation
  const validateForm = () => {
    let isValid = true;
    let errors = { ...formErrors };

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
    if (!formData.salary) {
      errors.salary = "Salary is required";
      isValid = false;
    }
    if (formData.newPassword && !formData.oldPassword) {
        errors.oldPassword = "Old password is required to set a new password";
        isValid = false;
      }
    setFormErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return; // If validation fails, don't submit the form
    }

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      alert("Unauthorized access. Please log in.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/auth/teacher/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      alert("Teacher updated successfully!");
      navigate(-1); // Navigate back to teacher list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update teacher data.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Teacher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          {formErrors.name && (
            <span className="text-red-500 text-sm">{formErrors.name}</span>
          )}
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium">
            Gender:
          </label>
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
          {formErrors.gender && (
            <span className="text-red-500 text-sm">{formErrors.gender}</span>
          )}
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium">
            Date of Birth:
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formatDate(formData.dateOfBirth)}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          {formErrors.dateOfBirth && (
            <span className="text-red-500 text-sm">{formErrors.dateOfBirth}</span>
          )}
        </div>
        <div>
          <label htmlFor="contact" className="block text-sm font-medium">
            Contact:
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          {formErrors.contact && (
            <span className="text-red-500 text-sm">{formErrors.contact}</span>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          {formErrors.email && (
            <span className="text-red-500 text-sm">{formErrors.email}</span>
          )}
        </div>
        <div>
          <label htmlFor="oldPassword" className="block text-sm font-medium">
            Old Password:
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <span className="text-red-500 text-sm">{formErrors.oldPassword}</span>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium">
            New Password:
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="salary" className="block text-sm font-medium">
            Salary:
          </label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
          {formErrors.salary && (
            <span className="text-red-500 text-sm">{formErrors.salary}</span>
          )}
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-4"
        >
          Cancel
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default EditTeacher;
