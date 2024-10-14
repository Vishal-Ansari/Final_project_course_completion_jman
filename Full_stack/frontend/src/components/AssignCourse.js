// // AssignCourse.js
// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import Cookie from 'js-cookie'; // Ensure you have the cookie library
// import { useNavigate } from 'react-router-dom';
// import { alertContext } from '../context/alertContext';

// const AssignCourse = () => {
//     const [employees, setEmployees] = useState([]);
//     const [courses, setCourses] = useState([]);
//     const [selectedCourse, setSelectedCourse] = useState('');
//     const [selectedEmployees, setSelectedEmployees] = useState([]);
//     const { showAlert } = useContext(alertContext);
//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchEmployees();
//         fetchCourses();
//     }, []);

//     const fetchEmployees = async () => {
//         const response = await axios.get('http://localhost:4000/api/admin/getAllEmployees', {
//             headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
//         });
//         setEmployees(response.data);
//     };

//     const fetchCourses = async () => {
//         const response = await axios.get('http://localhost:4000/api/admin/get-courses', {
//             headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
//         });
//         setCourses(response.data);
//     };

//     const handleAssignCourse = async () => {
//         if (!selectedCourse || selectedEmployees.length === 0) return;

//         try {
//             await axios.post(
//                 `http://localhost:4000/api/admin/assign-courses/${selectedCourse}/assign`,
//                 { employee_ids: selectedEmployees },
//                 {
//                     headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
//                 }
//             );
//             showAlert('Course assigned successfully');
//             setSelectedEmployees([]);
//             navigate('/'); // Redirect to home or another route after success
//         } catch (error) {
//             console.error('Error assigning course:', error);
//         }
//     };

//     return (
//         <div className="container bg-[#f1f1f1] w-[500px] mx-auto mt-36 border border-gray-300">
//             <h3 className="text-lg p-2 font-semibold text-center text-gray-900">Assign Course</h3>
//             <form className="p-4 md:p-5 ">
//                 <div className="mb-4">
//                     <label htmlFor="course" className="block mb-2 text-sm font-medium text-gray-900">Select Course</label>
//                     <select
//                         id="course"
//                         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
//                         onChange={(e) => setSelectedCourse(e.target.value)}
//                     >
//                         <option value="">Select Course</option>
//                         {courses.map(course => (
//                             <option key={course._id} value={course._id}>{course.title} - {course.tag}</option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="mb-4">
//                     <h3 className="text-lg text-gray-900">Select Employees</h3>
//                     {employees.map(employee => (
//                         <div key={employee._id} className="flex items-center mb-2">
//                             <input
//                                 id={employee._id}
//                                 type="checkbox"
//                                 className="w-4 h-4"
//                                 checked={selectedEmployees.includes(employee._id)}
//                                 onChange={() => {
//                                     setSelectedEmployees((prev) => {
//                                         if (prev.includes(employee._id)) {
//                                             return prev.filter(id => id !== employee._id);
//                                         } else {
//                                             return [...prev, employee._id];
//                                         }
//                                     });
//                                 }}
//                             />
//                             <label htmlFor={employee._id} className="ml-2 text-sm font-medium">{employee.name} - {employee.designation}</label>
//                         </div>
//                     ))}
//                 </div>

//                 <button
//                     type='button'
//                     onClick={handleAssignCourse}
//                     className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5"
//                 >
//                     Assign Course
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AssignCourse;


import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie'; // Ensure you have the cookie library
import { useNavigate } from 'react-router-dom';
import { alertContext } from '../context/alertContext';

const AssignCourse = () => {
   
    const [employees, setEmployees] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [showCourseDropdown, setShowCourseDropdown] = useState(false); // State to control dropdown visibility
    const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false); // State to control dropdown visibility
    const { showAlert } = useContext(alertContext);
    const navigate = useNavigate();
    



    useEffect(() => {
        fetchEmployees();
        fetchCourses();
    }, []);

    const fetchEmployees = async () => {
        const response = await axios.get('http://localhost:4000/api/admin/getAllEmployees', {
            headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
        });
        setEmployees(response.data);
    };

    const fetchCourses = async () => {
        const response = await axios.get('http://localhost:4000/api/admin/get-courses', {
            headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
        });
        setCourses(response.data);
    };

    const handleAssignCourse = async () => {
        if (!selectedCourse || selectedEmployees.length === 0) return;

        try {
            await axios.post(
                `http://localhost:4000/api/admin/assign-courses/${selectedCourse}/assign`,
                { employee_ids: selectedEmployees },
                {
                    headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
                }
            );
            showAlert('Course assigned successfully');
            setSelectedEmployees([]);
            navigate('/'); // Redirect to home or another route after success
        } catch (error) {
            console.error('Error assigning course:', error);
        }
    };

    return (
        // <div className="container bg-[#f1f1f1] w-[500px] mx-auto mt-36 border border-gray-300">
        //     <h3 className="text-lg p-2 font-semibold text-center text-gray-900">Assign Course</h3>
        //     <form className="p-4 md:p-5 ">
        //         <div className="mb-4">
        //             <label htmlFor="course" className="block mb-2 text-sm font-medium text-gray-900">Select Course</label>
        //             <select
        //                 id="course"
        //                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
        //                 onChange={(e) => setSelectedCourse(e.target.value)}
        //             >
        //                 <option value="">Select Course</option>
        //                 {courses.map(course => (
        //                     <option key={course._id} value={course._id}>{course.title} - {course.tag}</option>
        //                 ))}
        //             </select>

        //             {/* {showCourseDropdown && (
        //                 <div className="border border-gray-300 p-2 mt-1 w-full max-h-48 overflow-auto">
        //                     {courses.map(course => (
        //                         <div key={course._id} className="flex items-center mb-2">
        //                             <input
        //                                 id={course._id}
        //                                 type="checkbox"
        //                                 className="w-4 h-4"
        //                                 checked={selectedCourse === course._id}
        //                                 onChange={() => {
        //                                     setSelectedCourse(prev => 
        //                                         prev === course._id ? '' : course._id
        //                                     );
        //                                 }}
        //                             />
        //                             <label htmlFor={course._id} className="ml-2 text-sm font-medium">
        //                                 {course.title} - {course.tag}
        //                             </label>
        //                         </div>
        //                     ))}
        //                 </div>
        //             )} */}


        //         </div>

        //         <div className="mb-4">
        //             <label
        //                 className="text-gray-600 cursor-pointer border-2 p-2 flex justify-between items-center"
        //                 onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
        //             >
        //                 <span>{selectedEmployees.length > 0 ? `${selectedEmployees.length} Employees Selected` : "Select Employees"}</span>
        //                 <span className={`transform transition-transform ${showEmployeeDropdown ? 'rotate-180' : ''}`}>&#9660;</span>
        //             </label>

        //             {showEmployeeDropdown && (
        //                 <div className="border border-gray-300 p-2 mt-1 w-full max-h-48 overflow-auto">
        //                     {employees.map(employee => (
        //                         <div key={employee._id} className="flex items-center mb-2">
        //                             <input
        //                                 id={employee._id}
        //                                 type="checkbox"
        //                                 className="w-4 h-4"
        //                                 checked={selectedEmployees.includes(employee._id)}
        //                                 onChange={() => {
        //                                     setSelectedEmployees((prev) => {
        //                                         if (prev.includes(employee._id)) {
        //                                             return prev.filter(id => id !== employee._id);
        //                                         } else {
        //                                             return [...prev, employee._id];
        //                                         }
        //                                     });
        //                                 }}
        //                             />
        //                             <label htmlFor={employee._id} className="ml-2 text-sm font-medium">{employee.name} - {employee.designation}</label>
        //                         </div>
        //                     ))}
        //                 </div>
        //             )}
        //         </div>

        //         <button
        //             type='button'
        //             onClick={handleAssignCourse}
        //             className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5"
        //         >
        //             Assign Course
        //         </button>
        //     </form>
        // </div>

<div className="pt-24 bg-gray-50 min-h-screen">
    <div className="max-w-xl border border-gray-300 mx-auto bg-white p-10 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Assign Course to Employees</h1>

        {/* Select Employees */}
        <div className="mb-4">
            <label
                className="text-gray-600 cursor-pointer border-2 p-2 flex justify-between items-center"
                onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
            >
                <span>{selectedEmployees.length > 0 ? selectedEmployees.map(id => {
                    const employee = employees.find(emp => emp._id === id);
                    return employee ? employee.name : '';
                }).join(', ') : "Select Employees"}</span>
                <span className={`transform transition-transform ${showEmployeeDropdown ? 'rotate-180' : ''}`}>&#9660;</span>
            </label>

            {showEmployeeDropdown && (
                <div className="border border-gray-300 p-2 mt-1 w-full max-h-48 overflow-auto">
                    {employees.map(employee => (
                        <div key={employee._id} className="flex items-center mb-2">
                            <input
                                id={employee._id}
                                type="checkbox"
                                className="w-4 h-4"
                                checked={selectedEmployees.includes(employee._id)}
                                onChange={() => {
                                    setSelectedEmployees((prev) => {
                                        if (prev.includes(employee._id)) {
                                            return prev.filter(id => id !== employee._id);
                                        } else {
                                            return [...prev, employee._id];
                                        }
                                    });
                                }}
                            />
                            <label htmlFor={employee._id} className="ml-2 text-gray-600">{employee.name} - {employee.designation}</label>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Select Course */}
        <div className="mb-4">
            <label
                className="text-gray-600 cursor-pointer border-2 p-2 flex justify-between items-center"
                onClick={() => setShowCourseDropdown(!showCourseDropdown)}
            >
                <span>{selectedCourse ? courses.find(course => course._id === selectedCourse)?.title : "Select Course"}</span>
                <span className={`transform transition-transform ${showCourseDropdown ? 'rotate-180' : ''}`}>&#9660;</span>
            </label>

            {showCourseDropdown && (
                <div className="border border-gray-300 p-2 mt-1 w-full max-h-48 overflow-auto">
                    {courses.map(course => (
                        <div key={course._id} className="flex items-center mb-2">
                            <input
                                type="radio"
                                id={course._id}
                                name="course"
                                className="w-4 h-4"
                                checked={selectedCourse === course._id}
                                onChange={() => setSelectedCourse(course._id)}
                            />
                            <label htmlFor={course._id} className="ml-2 text-gray-600">{course.title} - {course.tag}</label>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <button
            type='button'
            onClick={handleAssignCourse}
            className="w-full text-white bg-[#0369a1] focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"
        >
            Assign Course
        </button>
    </div>
</div>




    );
};

export default AssignCourse;
