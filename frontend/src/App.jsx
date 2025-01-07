import { Routes, Route, useNavigate } from 'react-router-dom';
import Logo from './images/sma icon.png'; // Import Logo
import Admin from './components/admin'; // Import Admin Component
import Student from './components/student'; // Import Student Component
import Teacher from './components/teacher'; // Import Teacher Component
import { Dashboard } from './components/adminHomepage';
import ClassAnalytics from './components/classAnalysis';
import EditStudent from './components/editStudent';
import EditTeacher from './components/editteacher';
import StudentDashboard from './components/studentdashboard';
import Teacherdata from'./components/teacherdetails';
function App() {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div>
      <Routes>
        {/* Main Route / (Home) */}
        <Route 
          path="/" 
          element={
            <div>
              <div className="h-screen flex flex-col">
                <h1 className="text-[50px] text-center text-grey-800 bg-purple-400 h-[15vh] flex items-center justify-center">
                 School Management App
                </h1>
                <div className="flex">
                <img src={Logo} alt="logo" className="w-1/2 h-[85vh] object-cover" />
                <div className='w-1/2 bg-blue-100 flex flex-col justify-around'>
                <h1 className='text-[25px] font-bold text-center'>Register/Login as </h1>
                <div className='flex justify-around'>
                <div className="w-[200px] h-[200px] bg-yellow-500 border-40 border-pink-500 rounded-xl flex items-center justify-center cursor-pointer" onClick={() => navigate('/admin')}>
                 <p className='text-[20px] text-pink-800 font-semibold'> Admin</p>
                </div>
                <div className="w-[200px] h-[200px] bg-green-700 border-40 border-pink-500 rounded-xl flex items-center justify-center cursor-pointer"
                onClick={() => navigate('/student')}>
                   <p className='text-[20px] text-yellow-600 font-semibold'> Student</p>
                </div>
                </div>
                <div className='flex justify-around'>
                <div onClick={() => navigate('/teacher')} className="w-[200px] h-[200px] bg-gray-500 border-40 border-pink-500 rounded-xl flex items-center justify-center cursor-pointer">
                <p className='text-[20px] font-semibold'> Teacher</p>
                </div>
                </div>
               </div>
               </div>
               </div>
                {/* Using navigate function on click */}
              </div>
          }
        />
        
        {/* Other Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/student" element={<Student />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/class/:classId" element={<ClassAnalytics />} />
        <Route path='/edit-student/:id' element={< EditStudent/>}/>
        <Route path="/edit-teacher/:id" element={<EditTeacher />} />
        <Route path="/student-dashboard" element={<StudentDashboard />}/>
        <Route path="/teacherdetails" element={<Teacherdata />}/>
      </Routes>
    </div>
  );
}

export default App;
