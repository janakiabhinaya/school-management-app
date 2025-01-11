import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { BACKEND_URL } from "../constant.js";

function Student() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    contact: "",
    email: "",
    password: "",
    school: "",
    classId: "",
    feesPaid: [],
  });
  const [selectedClassFee, setSelectedClassFee] = useState("");
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [feeDetails, setFeeDetails] = useState({ amount: "", date: "" });
  const [isLogin, setIsLogin] = useState(false);
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } 

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required.";
      }

      if (!formData.email) {
        newErrors.email = "email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format.";
      }
  

      if (!formData.password) {
        newErrors.password = "password is required.";
      }

      if (!formData.gender) {
        newErrors.gender = "Gender is required.";
      }

      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "Date of birth is required.";
      }

      if (!formData.contact) {
        newErrors.contact = "Contact is required.";
      }

      if (!formData.school) {
        newErrors.school = "School selection is required.";
      }

      if (!formData.classId) {
        newErrors.classId = "Class selection is required.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    const fetchClassFee = async () => {
      if (!formData.classId) {
        setSelectedClassFee(null);
        return;
      }
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/auth/class/${formData.classId}/fee`,
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
  // Fetch schools on component mount
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/auth/schools`) // Replace with your API endpoint to fetch school names
      .then((response) => {
        setSchools(response.data);
      })
      .catch((error) => {
        console.error("Error fetching schools:", error);
      });
  }, []);

  // Fetch classes when a school is selected
  useEffect(() => {
    if (formData.school) {
      axios
        .get(`${BACKEND_URL}/api/auth/filteredclasses/${formData.school}`) // Replace with your API endpoint
        .then((response) => {
          setClasses(response.data);
        })
        .catch((error) => {
          console.error("Error fetching classes:", error);
        });
    } else {
      setClasses([]);
    }
  }, [formData.school]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (isLogin) {
        // Login logic
        const response = await axios.post(
          `${BACKEND_URL}/api/auth/login-student`, // Use the correct endpoint for student login
          { email: formData.email, password: formData.password }
        );
        const Token = response.data.token;
        const studentid = response.data.student.id;
  
        // Store the token in localStorage
        localStorage.setItem("authToken", Token);
        localStorage.setItem("studentId", studentid);
        axios.defaults.headers['Authorization'] = `Bearer ${Token}`;
        alert("Login successful!");
        navigate("/student-dashboard"); // Navigate to the student's dashboard or appropriate page
      } else {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/register-student`, // Ensure the URL is correct
        formData
      );
      alert("Student registered successfully!");
      navigate("/");
    }
    } catch (error) {
      console.error("Error registering student:", error);
      alert(isLogin ? "Failed to login. Please try again." : "Failed to register. Please try again.");
    }
  };
  

  return (
    <div>
      <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-[45%]">
          <div className="flex space-x-10">
        <button
                type="button"
                onClick={() => navigate("/")}
                
              >
                <IoArrowBackCircleOutline className="w-8 h-8 text-blue-500"/>
              </button>
          <h3 className="text-xl font-semibold mb-6">{isLogin ? "Login Student" : "Register Student"}</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
          {isLogin ? (
              <>
                <div>
                  <label htmlFor="email" className="block font-medium">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                   {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

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
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
              </>
            ) : (
              <>
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
                 {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
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
                {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
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
                 {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
              </div>
            </div>
            <div className="flex justify-around">
            <div>
              <label htmlFor="email" className="block font-medium">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
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
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              </div>
              <div className="flex justify-around">
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
                {errors.school && <p className="text-red-500 text-sm">{errors.school}</p>}
              </div>
            <div>
              <label htmlFor="classId" className="block font-medium">Class:</label>
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                disabled={!formData.school}
              >
                <option value="">Select Class</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.className} - {classItem.year}
                  </option>
                ))}
              </select>
              {errors.classId && <p className="text-red-500 text-sm">{errors.classId}</p>}
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
              </>
            )}
            <div className="flex justify-around">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                 {isLogin ? "Login" : "Register"}
              </button>
              <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="px-4 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {isLogin ? "dont have account? Register" : "have alredy account? Login"}
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Student;
