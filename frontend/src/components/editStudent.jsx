import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function EditStudent() {
  const { id } = useParams(); 
  const [studentData, setStudentData] = useState(null);
  const [classes, setClasses] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    name: "",
    gender: "",
    dateOfBirth: "",
    contact: "",
    email: "",
  });
  const [classFee, setclassFee] = useState("0");
  const [selectedClassFee, setselectedClassFee] = useState(null);
  const formatDate = (isoDate) => {
    const date = new Date(isoDate); // Convert the ISO string to a Date object
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1) and pad
    const year = date.getFullYear(); // Get full year
    return `${year}-${month}-${day}`; // Return formatted date
  };
  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    const selectedClass = classes.find((classItem) => classItem._id === selectedClassId);
    setStudentData((prevData) => ({
      ...prevData,
      classId: selectedClassId,
    }));
    setselectedClassFee(selectedClass ? selectedClass.studentFees : "");
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear specific field error when user updates the field
    }));
  };
  const validateForm = () => {
    let isValid = true;
    let errors = { ...formErrors };

    if (!studentData.name) {
      errors.name = "Name is required";
      isValid = false;
    }
    if (!studentData.gender) {
      errors.gender = "Gender is required";
      isValid = false;
    }
    if (!studentData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
      isValid = false;
    }
    if (!studentData.contact) {
      errors.contact = "Contact is required";
      isValid = false;
    }
    if (!studentData.email) {
      errors.email = "Email is required";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };
  const handleFeeChange = (index, field, value) => {
    setStudentData((prevData) => {
      const updatedFees = [...prevData.feesPaid];
      updatedFees[index][field] = field === "amount" ? Number(value) : value;
      return {
        ...prevData,
        feesPaid: updatedFees,
      };
    });
  };
  const addFee = () => {
    setStudentData((prevData) => ({
      ...prevData,
      feesPaid: [...prevData.feesPaid, { amount: "", date: "" }],
    }));
  };
  const deleteFee = (index) => {
    setStudentData((prevData) => {
      const updatedFees = prevData.feesPaid.filter((_, i) => i !== index);
      return {
        ...prevData,
        feesPaid: updatedFees,
      };
    });
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    // Check if any fee is empty
    if (!validateForm()) {
      return; // If validation fails, don't submit the form
    }
  const invalidFee = studentData.feesPaid.some((fee) => fee.amount === "" || fee.date === "");

  if (invalidFee) {
    alert("Please fill all fee paid details before updating.");
    return; // Stop the function from proceeding
  }

    try {
      // Assume you have a token stored in localStorage or a context
      const token = localStorage.getItem("authToken");
  
      // Make the PATCH request with authentication headers
      await axios.patch(
        `http://localhost:5000/api/auth/student/${id}`,
        studentData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Replace with your auth header format
            "Content-Type": "application/json", // Optional, ensures JSON payload
          },
        }
      );
  
      navigate(-1); // Navigate back to the previous page
    } catch (err) {
      setError("Failed to update student data.");
    }
  };
  
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/student/${id}`  // Fetch student data by ID
        );
        const fetchedStudent = response.data.student;
      const fetchedClasses = response.data.classes;

      setStudentData(fetchedStudent);
      setClasses(fetchedClasses);
      console.log(studentData);
      console.log(classes);
      // Find and set the default class fee
      const defaultClass = fetchedClasses.find(
        (classItem) => classItem._id === fetchedStudent.classId
      );
      setselectedClassFee(defaultClass ? defaultClass.studentFees : 0);
      } catch (err) {
        setError("Failed to fetch student data.");
      }
    };
    fetchStudentData();
  }, [id]);
const handleBackClick = () => {
    navigate(-1);  // Navigate back to the previous page
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Edit Student data</h2>
      <button
        onClick={handleBackClick}
        className="bg-gray-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Back
      </button>
      {studentData ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex justify-around">
          <div>
            <div>
            <label htmlFor="name" className="block font-medium">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={studentData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          {formErrors.name && (
            <span className="text-red-500 text-sm">{formErrors.name}</span>
          )}
          <div>
            <label htmlFor="gender" className="block font-medium">Gender:</label>
            <select
              id="gender"
              name="gender"
              defaultValue={studentData.gender}
              onChange={handleInputChange}
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

          </div>
          <div className="flex gap-8">
        <div>
            <label htmlFor="dateOfBirth" className="block font-medium">Date of Birth:</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              defaultValue={formatDate(studentData.dateOfBirth)}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            {formErrors.dateOfBirth && (
            <span className="text-red-500 text-sm">{formErrors.dateOfBirth}</span>
          )}
          </div>
          <div>
            <label htmlFor="contact" className="block font-medium">Contact:</label>
            <input
              type="text"
              id="contact"
              name="contact"
              defaultValue={studentData.contact}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
            {formErrors.contact && (
            <span className="text-red-500 text-sm">{formErrors.contact}</span>
          )}
          </div>
          </div>
          <div>
        <div className="items-center">
          <label htmlFor="email" className="block font-medium">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={studentData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md"
          />
           {formErrors.email && (
            <span className="text-red-500 text-sm">{formErrors.email}</span>
          )}
        </div>
          <span className="text-red-500 text-sm">{formErrors.oldPassword}</span>
          <div className="flex justify-around">
            <label htmlFor="password" className="block font-medium">new password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleInputChange}
              defaultValue=""
              className="w-full p-2 border rounded-md"
            />
          </div>
          </div>
          <div>

      <label htmlFor="classId" className="block font-medium">Class:</label>
      <select
        id="classId"
        name="classId"
        defaultValue={studentData.classId}
        onChange={handleClassChange}
        className="w-full p-2 border rounded-md"
      >
        <option value="">Select Class</option>
        {classes.map((classItem) => (
          <option key={classItem._id} value={classItem._id}>
            {classItem.className} - Year: {classItem.year}
          </option>
        ))}
      </select>
    </div>
  </div>

  <div>
    <label className="block font-medium">Class Fees:</label>
    <p className="text-gray-600">{selectedClassFee ? `₹${selectedClassFee}` : `₹${classFee}` }
    </p>
    <div>
      <label htmlFor="feesPaid" className="block font-medium">Fees Paid:</label>
      {studentData.feesPaid.map((fee, index) => (
              <div key={index} className="flex space-x-2 items-center mb-2">
                <input
                  type="number"
                  name="amount"
                  value={fee.amount}
                  onChange={(e) => handleFeeChange(index, "amount", e.target.value)}
                  placeholder="Amount"
                  className="w-1/2 p-2 border rounded-md"
                />
                <input
                  type="date"
                  name="date"
                  value={formatDate(fee.date)}
                  onChange={(e) => handleFeeChange(index, "date", e.target.value)}
                  className="w-1/2 p-2 border rounded-md"
                />
                <button
                    type="button"
                    onClick={() => deleteFee(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFee}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Fee
            </button>
    </div>
  </div>
  <div className="flex justify-between mt-4">
    <button
      type="submit"
      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
    >
      Update
    </button>
  </div>
      </form>
      
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default EditStudent;
