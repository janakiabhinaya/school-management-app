import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const ClassAnalytics = ({ classId, onBack }) => {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/classes/${classId}`);
        setClassData(response.data);
      } catch (err) {
        console.error("Error fetching class data:", err);
        setError("Failed to fetch class data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId]);

  if (loading) return <p className="text-center text-lg font-semibold text-gray-500">Loading class data...</p>;
  if (error) return <p className="text-center text-lg font-semibold text-red-500">{error}</p>;

  // Calculate male and female student count
  const studentGenderData = classData?.students?.reduce(
    (acc, student) => {
      if (student.gender === 'Male') {
        acc.male += 1;
      } else if (student.gender === 'Female') {
        acc.female += 1;
      }
      return acc;
    },
    { male: 0, female: 0 }
  );

  const chartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Student Gender Distribution',
        data: [studentGenderData?.male || 0, studentGenderData?.female || 0],
        backgroundColor: ['#36A2EB', '#FF6384'],
        borderColor: ['#36A2EB', '#FF6384'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Class Analytics</h2>
      {classData ? (
        <div className="space-y-4">
          <div className="text-xl font-semibold">
            <p><span className="font-bold">Class Name:</span> {classData.classData.className}</p>
            <p><span className="font-bold">Year:</span> {classData.classData.year}</p>
          </div>

          <div>
            <p className="font-bold">Students:</p>
            <ul className="list-disc pl-5">
              {classData.students?.map((student) => (
                <li key={student._id}>
                  {student.name} ({student.gender})
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold">Teachers:</p>
            <ul className="list-disc pl-5">
              {classData.teachers?.map((teacher) => (
                <li key={teacher._id}>
                  {teacher.name} ({teacher.gender})
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-bold">class Fees:</p>
            <p>₹ {classData.classData.studentFees}</p>
          </div>

          <div className="mt-6 w-full max-w-xl mx-auto">
            <Bar data={chartData} />
          </div>
        </div>
      ) : (
        <p className="text-center text-lg font-semibold text-gray-500">No data available for this class.</p>
      )}
      <div className="mt-6 flex justify-center">
        <button 
          onClick={onBack} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ClassAnalytics;
