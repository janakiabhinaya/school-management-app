import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Teacherdata(){
    const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");
    const teacherId = localStorage.getItem("teacherId");
    const [teacher, setTeacher] = useState(null);
    const formatDate = (isoDate) => {
        const date = new Date(isoDate); // Convert the ISO string to a Date object
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if necessary
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so +1) and pad
        const year = date.getFullYear(); // Get full year
        return `${year}-${month}-${day}`; // Return formatted date
      };
      const handleEditClick = () => {
        if (teacher) {
          navigate(`/edit-teacher/${teacherId}`);
        }
      };
    const fetchTeacher = async () => {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          setError("Unauthorized access. Please log in.");
          return;
        }
  
        try {
          const response = await axios.get(
            `http://localhost:5000/api/auth/teacher/${teacherId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setTeacher(response.data);
          console.log(teacher);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch teacher data.");
        }
      };
      useEffect(() => {
        if (teacherId) {
          fetchTeacher();
        } else {
          setError("Teacher ID not found.");
        }
      }, [teacherId]);
    useEffect(() => {
        if (teacher && teacherId) {
          axios
            .get(`http://localhost:5000/api/auth/getschedules/${teacherId}`)
            .then((response) => {
              setSchedules(response.data);
              console.log(schedules);
            })
            .catch((err) => {
              setError("Failed to fetch schedules.");
              console.error(err);
            });
        } else {
          setError("Teacher ID not found.");
        }
      }, [teacher, teacherId]);

      // if (error) {
      //   return <div className="text-red-500 text-center mt-5">{error}</div>;
      // }
      if (!teacher) {
        return <div className="text-gray-600 text-center mt-5">Loading teacher data...</div>;
      }
     
return(
      <div className="bg-gray-100 min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome, {teacher.teacher.name}
        </h2>
        <p className="text-lg text-gray-600 mb-2">Email: {teacher.teacher.email}</p>
        <p className="text-lg text-gray-600 mb-2">Salary: {teacher.teacher.salary}</p>
        <p className="text-lg text-gray-600 mb-4">
          Date of Birth: {formatDate(teacher.teacher.dateOfBirth)}
        </p>
        <button
          onClick={handleEditClick}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
        >
          Edit Profile
        </button>

        <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Your Schedule</h3>
        <div>
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <div key={schedule._id} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                <p className="text-lg text-gray-700 mb-2">Subject: {schedule.subject}</p>
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
    </div>
  );
}
export default Teacherdata;