import React, { useState, useEffect } from "react";
import axios from "axios";

const ClassComponent = ({ onViewClass }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [year, setYear] = useState("");
  const [classsize, setClassSize] = useState("");
  const [studentFees, setStudentFees] = useState("");
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [editingClassId, setEditingClassId] = useState(null);

  const fetchClasses = async () => {
    const schoolId = localStorage.getItem("adminId");
    const token = localStorage.getItem("authToken");

    if (!schoolId || !token) {
      setError("Authorization required. Please log in.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/getclasses/${schoolId}`,
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

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClassName("");
    setYear("");
    setClassSize("");
    setStudentFees("");
    setError("");
    setFormErrors({});
    setEditingClassId(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!className.trim()) errors.className = "Class Name is required.";
    if (!year) errors.year = "Year is required.";
    if (!classsize) errors.classsize = "Class Size is required.";
    return errors;
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const schoolId = localStorage.getItem("adminId");
    const token = localStorage.getItem("authToken");

    if (!schoolId) {
      setError("School ID is not found");
      return;
    }

    if (!token) {
      setError("Authorization token is missing.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/createclass",
        {
          className,
          year: parseInt(year, 10),
          classsize: parseInt(classsize, 10),
          studentFees: studentFees === "" ? 0 : parseFloat(studentFees),
          school: schoolId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Class created successfully!");
      handleCloseModal();
      fetchClasses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create class.");
    }
  };

  const handleEditClass = (classItem) => {
    setClassName(classItem.className);
    setYear(classItem.year);
    setClassSize(classItem.classsize);
    setStudentFees(classItem.studentFees || "");
    setEditingClassId(classItem._id);
    setIsModalOpen(true);
  };

  const handleDeleteClass = async (classId) => {
    const schoolId = localStorage.getItem("adminId");
    const token = localStorage.getItem("authToken");

    if (!schoolId || !token) {
      setError("Authorization required. Please log in.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/auth/deleteclass/${classId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Class deleted successfully!");
      fetchClasses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete class.");
    }
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const schoolId = localStorage.getItem("adminId");
    const token = localStorage.getItem("authToken");

    if (!schoolId) {
      setError("School ID is not found");
      return;
    }

    if (!token) {
      setError("Authorization token is missing.");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/auth/updateclass/${editingClassId}`,
        {
          className,
          year: parseInt(year, 10),
          classsize: parseInt(classsize, 10),
          studentFees: studentFees === "" ? 0 : parseFloat(studentFees),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Class updated successfully!");
      handleCloseModal();
      fetchClasses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update class.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Class Management</h2>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleOpenModal}
      >
        Add Class
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingClassId ? "Edit Class" : "Create New Class"}
            </h3>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={editingClassId ? handleUpdateClass : handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Class Name <span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                {formErrors.className && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.className}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Year <span className="text-red-500">*</span>:
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                {formErrors.year && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.year}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Class Size <span className="text-red-500">*</span>:
                </label>
                <input
                  type="number"
                  value={classsize}
                  onChange={(e) => setClassSize(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                {formErrors.classsize && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.classsize}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Student Fees:
                </label>
                <input
                  type="number"
                  value={studentFees}
                  onChange={(e) => setStudentFees(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editingClassId ? "Save Changes" : "Create Class"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold mb-2">All Classes</h3>
        {classes.length === 0 ? (
          <p>No classes found for this school.</p>
        ) : (
          <div className="space-y-2">
            {classes.map((classItem) => (
              <div
                key={classItem._id}
                className="p-4 border rounded-lg cursor-pointer flex justify-between items-center"
              >
                <div onClick={() => onViewClass(classItem._id)} className="hover:text-white">
                  <strong>{classItem.className}</strong> - Year: {classItem.year}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditClass(classItem)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClass(classItem._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassComponent;
