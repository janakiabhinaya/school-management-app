import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constant.js";

const ScheduleComponent = () => {
  const [formData, setFormData] = useState({
    school: localStorage.getItem("adminId") || "",
    class: "",
    teacher: "",
    subject: "",
    timings: [{ startTime: "", endTime: "" }],
  });
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    class: "",
    teacher: "",
    subject: "",
    timings: "",
});
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const schoolId = localStorage.getItem("adminId");
  const token = localStorage.getItem("authToken");

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    if (name === "startTime" || name === "endTime") {
      const updatedTimings = [...formData.timings];
      updatedTimings[index][name] = value;
      setFormData({ ...formData, timings: updatedTimings });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear specific field error when user updates the field
    }));
  };
  const handleEditClick = (id) => {
    setIsEditFormOpen(true);
    setEditingScheduleId(id);
    fetchScheduleById(id);
    
  };
  const fetchClasses = async () => {

    if (!schoolId || !token) {
      setError("Authorization required. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/auth/getclasses/${schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setClasses(response.data.classes);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch classes.");
    }
  };
  const fetchTeachers = async () => {
    if (!schoolId || !token) {
      setError("Authorization required. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/auth/teachers/${schoolId}`,
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
  const fetchSchedules = async () => {
    if (!schoolId || !token) {
      setError("Authorization required. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/auth/schedules/${schoolId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchedules(response.data.schedules);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch schedules.");
    }
  };
  const fetchScheduleById = async (id) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/auth/schedule/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const schedule = response.data.schedule;
      setFormData({
        school: schedule.school || schoolId,
        class: schedule.class._id || "",
        teacher: schedule.teacher?._id || "",
        subject: schedule.subject || "",
        timings: schedule.timings || [{ startTime: "", endTime: "" }],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch schedule details.");
    }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) {
      return; // If validation fails, don't submit the form
    }
    try {
      await axios.patch(
        `${BACKEND_URL}/api/auth/schedule/${editingScheduleId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Schedule updated successfully!");
      fetchSchedules();
      setIsEditFormOpen(false);
      setFormData({
        school: localStorage.getItem("adminId") || "",
        class: "",
        teacher: "",
        subject: "",
        timings: [{ startTime: "", endTime: "" }],
      });
      setFormErrors({
        class: "",
        teacher: "",
        subject: "",
        timings: "",
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update schedule.");
    }
  };
   useEffect(() => {
      fetchClasses();
      fetchTeachers();
      fetchSchedules();
    }, []);
  const validateForm = () => {
    let isValid = true;
    let errors = { ...formErrors };

    // Check each required field
    if (!formData.class) {
      errors.class = "class is required";
      isValid = false;
    }
    if (!formData.teacher) {
      errors.teacher = "teacher is required";
      isValid = false;
    }
    if (!formData.subject) {
      errors.subject = "subject is required";
      isValid = false;
    }
    const timingErrors = [];
    formData.timings.forEach((timing, index) => {
      if (!timing.startTime || !timing.endTime) {
        timingErrors[index] = "Start time and end time are required";
        isValid = false;
      } else if (timing.startTime >= timing.endTime) {
        timingErrors[index] = "Start time must be earlier than end time";
        isValid = false;
      }
    });
  
    if (timingErrors.length > 0) {
      errors.timings = timingErrors;
    } else {
      errors.timings = ""; // Clear errors if no issues
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
    try {
      // console.log("Form data being sent:", formData); // Debug log
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/schedule`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({
        school: localStorage.getItem("adminId") || "",
        class: "",
        teacher: "",
        subject: "",
        timings: [{ startTime: "", endTime: "" }],
      });
      setFormErrors({
        class: "",
        teacher: "",
        subject: "",
        timings: "",
      });
      setError(null);
      alert("Schedule created successfully!");
      fetchSchedules(); // Refresh schedule list
      setIsFormOpen(false);
    } catch (error) {
      setMessage("Failed to create schedule. Please try again.");
      console.error(error.response?.data || error.message);
    }
  };
  const handleCreateScheduleClick = () => {
    setIsFormOpen(true);
  };
const handlecancel = ()=>{
  setFormData({
    school: localStorage.getItem("adminId") || "",
    class: "",
    teacher: "",
    subject: "",
    timings: [{ startTime: "", endTime: "" }],
  });
  setFormErrors({
    class: "",
    teacher: "",
    subject: "",
    timings: "",
  });
  setError(null);
  setIsEditFormOpen(false)
}
const handleformcancel = ()=>{
  setFormData({
    school: localStorage.getItem("adminId") || "",
    class: "",
    teacher: "",
    subject: "",
    timings: [{ startTime: "", endTime: "" }],
  });
  setFormErrors({
    class: "",
    teacher: "",
    subject: "",
    timings: "",
  });
  setError(null);
  setIsFormOpen(false);
}
const handleDeleteschedule = async (scheduleId) => {
  const schoolId = localStorage.getItem("adminId");
  const token = localStorage.getItem("authToken");

  if (!schoolId || !token) {
    setError("Authorization required. Please log in.");
    return;
  }

  try {
    await axios.delete(`${BACKEND_URL}/api/auth/deleteschedule/${scheduleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("schedule deleted successfully!");
    fetchSchedules();
  } catch (err) {
    setError(err.response?.data?.message || "Failed to delete class.");
  }
};
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
       <button
        onClick={handleCreateScheduleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-5"
      >
        Create Schedule
      </button>
      {isFormOpen && (
       <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-5 rounded shadow-lg max-w-lg mx-auto">
          <h2 className="text-xl mb-4">Create Schedule</h2>
      <form onSubmit={handleSubmit}>
      <div className="mb-4">
          <label className="block">Class:</label>
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
             className="w-full p-2 border cursor-pointer rounded"
          >
            <option value="">Select a class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className} - Year: {cls.year}
              </option>
            ))}
          </select>
          {formErrors.class && <span className="text-red-500 text-sm">{formErrors.class}</span>}
        </div>
        <div className="mb-4">
          <label className="block">Teacher:</label>
          <select
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
             className="w-full p-2 border cursor-pointer rounded"
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
          {formErrors.teacher && <span className="text-red-500 text-sm">{formErrors.teacher}</span>}
        </div>

        <div className="mb-4">
          <label className="block">Subject:</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {formErrors.subject && <span className="text-red-500 text-sm">{formErrors.subject}</span>}
        </div>

        <div className="mb-4">
          <label className="block">Timings:</label>
          {formData.timings.map((timing, index) => (
            <div key={index} className="flex gap-4 mb-3">
              <input
                type="time"
                name="startTime"
                value={timing.startTime}
                onChange={(e) => handleChange(e, index)}
                 className="p-2 border rounded"
              />
              <input
                type="time"
                name="endTime"
                value={timing.endTime}
                onChange={(e) => handleChange(e, index)}
                 className="p-2 border rounded"
              />
            </div>
          ))}
          {formErrors.timings && <span className="text-red-500 text-sm">{formErrors.timings}</span>}
        </div>
        <div className="flex justify-between">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded">Create</button>
        <button className="bg-gray-500 text-white cursor-pointer px-4 py-2 rounded" onClick={handleformcancel}>cancel</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
    </div>
     )}
      <h3 className="text-lg mt-5 mb-2">Schedules:</h3>
      <div className="flex flex-wrap gap-4 mt-6">
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div key={schedule._id} className="bg-white p-4 border border-gray-300 rounded-lg shadow-md w-60">
              <div className="font-semibold text-lg">
                Class: {schedule.class.className}, year-{schedule.class.year}
              </div>
              <div className="text-sm text-gray-600">
                Teacher: {schedule.teacher && schedule.teacher.name ? schedule.teacher.name : ""}
              </div>
              <div className="text-sm text-gray-600">
                Subject: {schedule.subject}
              </div>
              <div className="text-sm text-gray-600">
                Timings: {schedule.timings.map(t => `${t.startTime} - ${t.endTime}`).join(", ")}
              </div>
              <div className="mt-4 flex gap-2">
        <button
           onClick={() => handleEditClick(schedule._id)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteschedule(schedule._id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
        >
          Delete
        </button>
        </div>
            </div>
          ))
        ) : (
          <p>No schedules available</p>
        )}
      </div>
      {isEditFormOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded shadow-lg max-w-lg mx-auto">
            <h2 className="text-xl mb-4">Edit Schedule</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block">Class:</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.className} - Year: {cls.year}
                    </option>
                  ))}
                </select>
                {formErrors.class && <span className="text-red-500 text-sm">{formErrors.class}</span>}
              </div>
              <div className="mb-4">
                <label className="block">Teacher:</label>
                <select
                  name="teacher"
                  value={formData.teacher || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                {formErrors.teacher && <span className="text-red-500 text-sm">{formErrors.teacher}</span>}
              </div>
              <div className="mb-4">
                <label className="block">Subject:</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                 {formErrors.subject && <span className="text-red-500 text-sm">{formErrors.subject}</span>}
              </div>
              <div className="mb-4">
                <label className="block">Timings:</label>
                {formData.timings.map((timing, index) => (
                  <div key={index} className="flex gap-4 mb-3">
                    <input
                      type="time"
                      name="startTime"
                      value={timing.startTime}
                      onChange={(e) => handleChange(e, index)}
                      className="p-2 border rounded"
                    />
                    <input
                      type="time"
                      name="endTime"
                      value={timing.endTime}
                      onChange={(e) => handleChange(e, index)}
                      className="p-2 border rounded"
                    />
                  </div>
                ))}
                {formErrors.timings && <span className="text-red-500 text-sm">{formErrors.timings}</span>}
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handlecancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleComponent;
