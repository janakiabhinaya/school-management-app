import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState(null);
  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("authToken");
  const fetchSchedules = async (classId) => {
    try {
      if (!classId) {
        setSchedules([]); // If classId is null or undefined, don't fetch schedules
        return;
      }
      const response = await axios.get(
        `http://localhost:5000/api/auth/schedules?classId=${classId}` // Pass classId as a query param
      );
      const filteredSchedules = response.data; // No need to filter here as backend does that
      setSchedules(filteredSchedules);
      console.log(filteredSchedules); // log the fetched schedules
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSchedules([]); 
    }
  };
  
  useEffect(() => {
    
    // Fetch student data by studentId
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/getstudent/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setStudentData(response.data);
        console.log(studentData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    
    // Fetch schedules using classId from student data

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId, token]);
  const calculateTotalFeesPaid = () => {
    return studentData.student.feesPaid?.reduce(
      (total, fee) => total + parseFloat(fee.amount || 0),
      0
    ) || 0;
  };

  useEffect(() => {
    if (studentData) {
      const classId = studentData.classData?._id;
      fetchSchedules(classId); // Fetch schedules when student data is available
    }
  }, [studentData]);

  const handleEditProfile = () => {
    navigate(`/edit-student/${studentId}`)
  };
  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/deletestudent/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("student deleted successfully!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete class.");
    }
  };
  return (
    <div className="bg-gray-100 min-h-screen py-8 px-6">
      {studentData ? (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, {studentData.student.name}</h2>
          <p className="text-lg text-gray-600 mb-2">Email: {studentData.student.email}</p>
          {studentData.classData ? (
    <>
      <p className="text-lg text-gray-600 mb-2">Class: {studentData.classData.className} - year: {studentData.classData.year}</p>
      <p className="text-lg text-gray-600 mb-4">Class Fees: {studentData.classData.studentFees}</p>
    </>
  ) : (
    <p  className="text-lg text-gray-600 mb-2">Class data not available</p>
  )}

  {/* Conditionally render school data if available */}
  {studentData.schoolData ? (
    <p className="text-lg text-gray-600 mb-4">School: {studentData.schoolData.schoolName}</p>
  ) : (
    <p className="text-lg text-gray-600 mb-4">School data not available</p>
  )}

          <p className="text-lg text-gray-600 mb-4">fees paid: {calculateTotalFeesPaid()}</p>
          <button onClick={ handleEditProfile}   className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition">
           edit profile
          </button>
          <button onClick={() => handleDelete(studentId)} className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition">
           delete profile
          </button>
          <button  onClick={()=>{
           localStorage.removeItem("studentId");
           localStorage.removeItem("token");
           navigate("/");
        }} className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition">
           logout
          </button>
          <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Your Schedule</h3>
          <div>
            {schedules.length > 0 ? (
              schedules.map((schedule) => (
                <div key={schedule._id} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                  <p  className="text-lg text-gray-700 mb-2">subject: {schedule.subject}</p>
                  <p className="text-lg text-gray-700 mb-2">Teacher: {schedule.teacherName}</p>
                  <div className="timings">
                    {schedule.timings.map((time, index) => (
                      <div key={index} className="bg-gray-200 p-3 rounded-lg mb-2">
                        <p className="text-gray-700">Start Time: {time.startTime}</p>
                        <p className="text-gray-700">End Time: {time.endTime}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-700">No schedules found for your class.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-600">Loading student data...</p>
      )}
    </div>
  );
}

export default StudentDashboard;
