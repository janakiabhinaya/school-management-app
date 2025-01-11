import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constant.js";

const FeeAnalysisComponent = () => {
  const [view, setView] = useState("monthly"); // "monthly" or "yearly"
  const [month, setMonth] = useState("1");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [totalTeacherSalaries, setTotalTeacherSalaries] = useState(0);
  const [totalFees, setTotalFees] = useState(0);

  const schoolId = localStorage.getItem("adminId");
  const authToken = localStorage.getItem("authToken")

  // Fetch Teachers and Students Data
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/auth/analytics/${schoolId}`, 
        {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

      const teachersData = response.data.teachers;
      const studentsData = response.data.students;
      // console.log(response.data);
      setTeachers(teachersData);
      setStudents(studentsData);
      let totalSalaries = 0;
      teachersData.forEach(teacher => {
        if (view === "monthly") {
          totalSalaries += teacher.salary; // Monthly salary
        } else if (view === "yearly") {
          totalSalaries += teacher.salary * 12; // Yearly salary
        }
      });
      setTotalTeacherSalaries(totalSalaries);
     // Calculate total fees
     let total = 0;
     studentsData.forEach(student => {
       student.feesPaid.forEach(fee => {
         const feeDate = new Date(fee.date);
         const feeYear = feeDate.getFullYear();
         const feeMonth = feeDate.getMonth() + 1; // Months are 0-indexed

         if (
           (view === "monthly" && feeYear === parseInt(year) && feeMonth === parseInt(month)) ||
           (view === "yearly" && feeYear === parseInt(year))
         ) {
           total += fee.amount;
         }
       });
     });
     setTotalFees(total);
   } catch (error) {
     console.error("Error fetching data:", error);
   }
 };

 useEffect(() => {
   fetchData();
 }, [view, month, year]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>

      {/* Toggle View */}
<div className="mb-4 flex items-center">
  <label className="mr-4 text-lg">View:</label>
  <div className="relative inline-block w-16 mr-2 align-middle select-none">
    <input
      type="checkbox"
      id="viewToggle"
      checked={view === "yearly"}
      onChange={() => setView(view === "monthly" ? "yearly" : "monthly")}
      className="toggle-checkbox absolute block w-10 h-6 bg-gray-300 border-2 border-gray-400 rounded-full appearance-none cursor-pointer"
    />
    <label
      htmlFor="viewToggle"
      className="toggle-label block overflow-hidden h-6 mb-1 transition-all duration-300 ease-in-out"
    >
      <div
        className={`dot w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${
          view === "yearly" ? "translate-x-4" : "translate-x-0"
        }`}
      ></div>
    </label>
  </div>
  <span className="text-lg">{view === "monthly" ? "Monthly" : "Yearly"}</span>
</div>



      {/* Select Month and Year */}
      {view === "monthly" && (
        <div className="mb-4">
          <label className="mr-2">Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-2 py-1"
          >
            {[...Array(12).keys()].map((m) => (
              <option key={m + 1} value={m + 1}>
                {m + 1}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="mr-2">Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border px-2 py-1"
        />
      </div>

      {/* Display Data */}
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-bold">Analytics Data:</h2>
        <p>Total Teacher Salaries: ₹{totalTeacherSalaries}</p>
        <p>Total Fees Collected: ₹{totalFees}</p>
        <p>View: {view === "monthly" ? `Monthly (${month}/${year})` : `Yearly (${year})`}</p>
      </div>
    </div>
  );
};

export default FeeAnalysisComponent;
