import React, { useState, useEffect } from "react";
import axios from "axios";
import RegisterStudent from "./registerStudent";
import RegisterTeacher from "./registerTeacher";
import Classcomponent from "./classcomponent";
import ScheduleComponent from "./schedule";
import FeeAnalysisComponent from "./feesAnalysis";
import ClassAnalytics from "./classAnalysis";
import { BiSolidEdit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constant.js";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [viewingClassId, setViewingClassId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State to control the edit modal
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    schoolName: "",
    password: "",
  });

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (adminId) {
      const fetchProfileData = async () => {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/api/auth/profile/${adminId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          setProfileData(response.data);
        } catch (err) {
          console.error("Error fetching profile data:", err);
          setError("Failed to fetch profile data.");
        } finally {
          setLoading(false);
        }
      };

      fetchProfileData();
    } else {
      setError("Admin ID not found.");
      setLoading(false);
    }
  }, []);

  const handleEdit = () => {
    if (profileData) {
      setEditData({
        name: profileData.name,
        email: profileData.email,
        schoolName: profileData.schoolName,
        password: "",
      });
    }
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    const adminId = localStorage.getItem("adminId");
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/auth/editprofile/${adminId}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setProfileData(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile data:", err);
      alert("Failed to update profile data.");
    }
  };

  const renderActiveSection = () => {
    if (viewingClassId) {
      return (
        <ClassAnalytics
          classId={viewingClassId}
          onBack={() => setViewingClassId(null)}
        />
      );
    }
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-lg font-semibold text-pink-400">
                Loading profile...
              </p>
            ) : error ? (
              <p className="text-center text-lg font-semibold text-red-500">
                {error}
              </p>
            ) : profileData ? (
              <div className="text-xl font-semibold text-white">
                <p className="text-5xl">
                  <span className="font-bold">Welcome to </span>{" "}
                  {profileData.schoolName}
                </p>
                <p>
                  <span className="font-bold">School Admin:</span>{" "}
                  {profileData.name}
                </p>
                <p>
                  <span className="font-bold">Email Id:</span>{" "}
                  {profileData.email}
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-200 text-black rounded-full hover:bg-blue-500"
                  onClick={handleEdit}
                >
                  <BiSolidEdit />
                </button>
              </div>
            ) : (
              <p className="text-center text-lg font-semibold text-pink-400">
                No profile data available.
              </p>
            )}
          </div>
        );
      case "classes":
        return <Classcomponent onViewClass={(classId) => setViewingClassId(classId)} />;
      case "student":
        return <RegisterStudent />;
      case "teacher":
        return <RegisterTeacher />;
      case "schedule":
        return <ScheduleComponent />;
      case "fees":
        return <FeeAnalysisComponent />;
      case "logout":
         return <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <p className="text-lg font-bold mb-4">are you sure! want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleLogout}>yes</button>
              <button
               className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
               onClick={() => setActiveSection("profile")}
              >no</button>
            </div>
          </div>
         </div>
      default:
        return <div className="text-white">Profile data here</div>;
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("authToken");
    navigate("/"); // Navigate to the root route
  };
  return (
    <div className="flex flex-row w-screen h-screen bg-black">
      <div className="w-1/4 h-full bg-pink-700 shadow-lg flex justify-center items-center p-6">
        <nav className="space-y-4">
          <button
            onClick={() => setActiveSection("profile")}
            className={`w-full text-[20px] py-2 px-4 text-white font-bold rounded-lg transition-all ${
              activeSection === "profile" ? "bg-pink-500" : "hover:bg-pink-600"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveSection("classes")}
            className={`w-full text-[20px] py-2 px-4 text-white font-bold rounded-lg transition-all ${
              activeSection === "classes" ? "bg-pink-500" : "hover:bg-pink-600"
            }`}
          >
            Classes
          </button>
          <button
            onClick={() => setActiveSection("schedule")}
            className={`w-full text-[20px] py-2 px-4 text-white font-bold rounded-lg transition-all ${
              activeSection === "schedule" ? "bg-pink-500" : "hover:bg-pink-600"
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveSection("student")}
            className={`w-full text-[20px] py-2 px-4 text-white font-bold rounded-lg transition-all ${
              activeSection === "student" ? "bg-pink-500" : "hover:bg-pink-600"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveSection("teacher")}
            className={`w-full text-[20px] py-2 px-4 text-white font-bold rounded-lg transition-all ${
              activeSection === "teacher" ? "bg-pink-500" : "hover:bg-pink-600"
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => setActiveSection("fees")}
            className={`w-full text-[20px] py-2 px-4 text-white font-bold rounded-lg transition-all ${
              activeSection === "fees" ? "bg-pink-500" : "hover:bg-pink-600"
            }`}
          >
            Fee Analysis
          </button>
          <button
            onClick={() => setActiveSection("logout")}
            className={`w-full text-[20px] py-2 px-4 text-white font-bold rounded-lg transition-all ${
              activeSection === "logout" ? "bg-pink-500" : "hover:bg-pink-600"
            }`}
          >
           logout
          </button>
        </nav>
      </div>
      <div className="w-3/4 h-full bg-gray-400 p-8 overflow-y-auto">
        {renderActiveSection()}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Name:</label>
                <input
                  type="text"
                  value={editData.name}
                  placeholder="Enter your name"
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Email:</label>
                <input
                  type="email"
                  value={editData.email}
                  placeholder="Enter your email"
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">School Name:</label>
                <input
                  type="text"
                  value={editData.schoolName}
                  placeholder="Enter your school name"
                  onChange={(e) =>
                    setEditData({ ...editData, schoolName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Password:</label>
                <input
                  type="password"
                  value={editData.password}
                  placeholder="Enter new password"
                  onChange={(e) =>
                    setEditData({ ...editData, password: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
