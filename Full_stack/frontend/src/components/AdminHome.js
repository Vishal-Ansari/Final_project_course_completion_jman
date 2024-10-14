import React, { useEffect, useState, useContext } from 'react';
import { alertContext } from '../context/alertContext';
import axios from 'axios';
import Cookie from 'js-cookie';
import { Checkbox, Label, Modal } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag'
import EmployeePerformance from './EmployeePerformance';
import AdminLearningPaths from './AdminLearningPaths';
import { Pie } from 'react-chartjs-2';
import Sidebar from './Sidebar'; // Import the Sidebar
// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend);

const AdminHome = () => {
  const [courses, setCourses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [showAssignCourseModal, setShowAssignCourseModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseStats, setCourseStats] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState('All');
  const [sortOrder, setSortOrder] = useState('Top');
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeCoursesStats, setEmployeesCoursesStats] = useState([])
  const [expandedRows, setExpandedRows] = useState([]);

  const navigate = useNavigate();

  let { showAlert } = useContext(alertContext);

  // Fetch all courses
  const fetchCourses = async () => {
    const response = await axios.get('http://localhost:4000/api/admin/get-courses', {
      headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
    });
    setCourses(response.data);
  };

  // Fetch all employees
  const fetchEmployees = async () => {
    const response = await axios.get('http://localhost:4000/api/admin/getAllEmployees', {
      headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
    });
    setEmployees(response.data);
  };

  // Fetch employee performance data
  const fetchPerformanceData = async () => {
    const response = await axios.get('http://localhost:4000/api/admin/performance', {
      headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
    });
    setPerformanceData(response.data);
  };

  const fetchCourseStats = async (courseId) => {
    if (!courseId) return;
    try {
      const response = await axios.get(`http://localhost:4000/api/admin/course/${courseId}/stats`, {
        headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
      });
      setCourseStats(response.data);
    } catch (error) {
      console.error('Error fetching course stats:', error);
    }
  };

  const fetchEmployeeCourses = async () => {
    const response = await axios.get('http://localhost:4000/api/admin/employee-courses', {
      headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
    });
    setEmployeesCoursesStats(response.data);
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    fetchCourseStats(courseId);
  };

  useEffect(() => {
    if (!Cookie.get('accessToken')) {
      navigate("/login");
    }
    if (Cookie.get('role') === "employee") {
      navigate("/")
    }
    fetchCourses();
    fetchEmployees();
    fetchPerformanceData();
    fetchEmployeeCourses();

  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      setSelectedCourse(courses[0]._id);
      fetchCourseStats(courses[0]._id);
    }
  }, [courses]);



  const getFilteredData = () => {
    let filteredData = performanceData;

    if (selectedDesignation !== 'All') {
      filteredData = filteredData.filter(emp => emp.designation === selectedDesignation);
    }
    filteredData.sort((a, b) => {
      return sortOrder === 'Top' ? b.performance_score - a.performance_score : a.performance_score - b.performance_score;
    });

    return filteredData.slice(0, 5);
  };




  const filteredData = getFilteredData();

  const chartData = {
    labels: filteredData.map(emp => emp.employee),
    datasets: [
      {
        label: 'Performance Score',
        data: filteredData.map(emp => emp.performance_score),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };


  const courseChartData = courseStats ? {
    labels: ['Assigned', 'Completed'],
    datasets: [
      {
        label: 'Course Stats',
        data: [courseStats.assignedCount, courseStats.completedCount],
        backgroundColor: ['rgba(255, 128, 0, 0.6)', 'rgba(81, 247, 164, 0.6)'], // Grey colors
      },
    ],
  } : null;





  const chartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
        color: '#f1f1f',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value) => value.toFixed(2),
      }
    },

    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + "%";
          }
        }
      },
    }
  };


  const courseTemplate = (data) => {
    return (
      <div className="pl-3">
        <table className="w-full border-separate border-spacing-2">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-center">Course Name</th>
              <th className="p-2 text-center">Tag</th>
              <th className="p-2 text-center">Total Modules</th>
              <th className="p-2 text-center">Modules Completed</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2 text-center">Completion Percentage</th>
            </tr>
          </thead>
          <tbody>
            {data.courses.map((course, index) => (
              <tr key={index} className="bg-white border-b">
                <td className="p-2 text-center">{course.course_title}</td>
                <td className="p-2 text-center">{course.course_tag}</td>
                <td className="p-2 text-center">{course.totalModules}</td>
                <td className="p-2 text-center">{course.modulesCompleted}</td>
                <td className="p-2 text-center">
                  <Tag value={course.status} severity={getSeverity(course.status)} />
                </td>
                <td className="p-2 text-center">{course.completion_percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Utility function for status severity
  const getSeverity = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'warning';
      default:
        return null;
    }
  };


  return (
    <>
      <div className={`Side_bar fixed h-screen w-[15%]`}>
        <Sidebar />
      </div>
      <div className="right_side_bar ml-[15rem]">
        <div className={`p-5 ${showAssignCourseModal ? 'blur-sm opacity-50' : ''} `}>

          <div>
            <h1 className="text-3xl font-bold mb-9 mt-10  text-center uppercase ">Admin Dashboard</h1>
            <div className='flex'>


            </div>
          </div>




          <div className='shadow-lg m-4 p-4 py-6 flex justify-between'>
            <div className=" mt-8 w-[48%] h-[670px] border-2 rounded-md p-4  mx-4">

              <div className='p-5'>
                {/* Dropdowns */}
                <h1 className='text-center text-2xl font-bold mb-4'>Performance Rate of Employees</h1>
                <div className="flex justify-between mb-4">
                  {/* Designation Dropdown */}
                  <div>
                    <label htmlFor="designation" className="mr-2 font-bold">Designation:</label>

                  

                    <select
                      id="designation"
                      className="border p-2 rounded"
                      value={selectedDesignation}
                      onChange={(e) => setSelectedDesignation(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Web Developer">Web Developer</option>
                      <option value="Data Engineer">Data Engineer</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="AI Specialist">AI Specialist</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                      <option value="Cybersecurity Specialist">Cybersecurity Specialist</option>
                      <option value="Mobile Developer">Mobile Developer</option>
                      <option value="UI/UX Designer">UI/UX Designer</option>
                      <option value="Software Tester">Software Tester</option>
                    </select>
                  </div>



                    


                  {/* Top/Bottom Dropdown */}
                  <div>
                    <label htmlFor="sortOrder" className=" mr-2 font-bold ">Top/Bottom:</label>
                    <select
                      id="sortOrder"
                      className="border p-2 rounded  "
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="Top">Top 5</option>
                      <option value="Bottom">Bottom 5</option>
                    </select>
                  </div>
                </div>

                {/* Performance Chart */}
                <div
                  className="mt-8 w-full h-[500px] border-10 rounded-md p-4"
                // style={{ backgroundColor: '#f4f4f4' }}
                >
                  <h2 className="text-center text-2xl font-bold mb-4">Performance Score</h2>
                  <Bar
                    data={chartData}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>



            <div className="mt-8 w-[48%] h-[670px] flex flex-col items-center border-2 rounded-md p-4  mx-4" >
              <h1 className='text-center text-2xl font-bold mb-8'>Completion Rate of Courses</h1>
              <div className='' >
                <label className="w-1/2 font-bold">Select Course:</label>
                <select
                  id="course"
                  className="mb-8 bg-gray-50 border max-w-md border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  onChange={handleCourseChange}  // Updated handler
                >
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.title} - {course.tag}</option>
                  ))}
                </select>
              </div>
              {/* Course Stats Chart */}
              {courseStats && (
                <div className="mt-8 w-full max-w-4xl mx-auto h-96 flex justify-center items-center ">
                  <Pie
                    data={courseChartData} // Change this line to use Pie component
                    options={{
                      responsive: true,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              return `${label}: ${value}`;
                            },
                          },
                        },
                        legend: {
                          display: true,
                          position: 'top',
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <div>
          <EmployeePerformance />
        </div> */}


        <div className="card border-2 mx-8 mb-8">
          <h1 className='text-center text-2xl font-bold my-4'>Employee Course Details Table</h1>
          <DataTable value={employeeCoursesStats} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={courseTemplate} dataKey="employee_id"
            tableStyle={{ minWidth: '60rem' }} className="shadow-md text-center">

            <Column expander style={{ width: '3em' }} />
            <Column field="name" header="Employee Name" className="p-2 text-center" style={{ width: '20%' }} alignHeader={'center'} sortable />
            <Column field="designation" header="Designation" className="p-2 text-center" style={{ width: '20%' }} alignHeader={'center'} sortable />
            <Column field="totalCourses" header="Total Courses" className="p-2 text-center" style={{ width: '20%' }} alignHeader={'center'} sortable />
            <Column field="completedCourses" header="Courses Completed" className="p-2 text-center" style={{ width: '20%' }} alignHeader={'center'} sortable />
            <Column sortable field="performanceScore" header="Performance Score" className="p-2 text-center" style={{ width: '20%' }}
              body={(rowData) => rowData.performanceScore?.toFixed(2)} alignHeader={'center'} />
          </DataTable>
        </div>


        {/* Assign Course Modal */}
        
      </div>

    </>
  );
};

export default AdminHome;

