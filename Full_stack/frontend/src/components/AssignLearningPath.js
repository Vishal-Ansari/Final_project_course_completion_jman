import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { alertContext } from '../context/alertContext';
import { useNavigate } from 'react-router-dom';

export default function AssignLearningPath() {
    const [employees, setEmployees] = useState([]);
    const [learningPaths, setLearningPaths] = useState([]);
    const [assignment, setAssignment] = useState({
        selectedEmployees: [],
        selectedLearningPaths: [],
    });
    const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
    const [showLearningPathDropdown, setShowLearningPathDropdown] = useState(false);

    let { showAlert } = useContext(alertContext);
    let navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await axios.get('http://localhost:4000/api/admin/getAllEmployees', {
                headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
            });
            setEmployees(response.data);
        };

        const fetchLearningPaths = async () => {
            const response = await axios.get('http://localhost:4000/api/learningpath/get-learningpath');
            setLearningPaths(response.data);
        };

        fetchEmployees();
        fetchLearningPaths();
    }, []);

    const handleAssignLearningPath = async () => {
        try {
            await axios.post('http://localhost:4000/api/learningpath/assign-learningpath', assignment);
            showAlert('Learning path assigned successfully');
            navigate("/admin");
        } catch (error) {
            console.error('Error assigning learning path:', error);
        }
    };

    const toggleEmployeeSelection = (id) => {
        const updatedSelection = assignment.selectedEmployees.includes(id)
            ? assignment.selectedEmployees.filter(employeeId => employeeId !== id)
            : [...assignment.selectedEmployees, id];
        
        setAssignment({ ...assignment, selectedEmployees: updatedSelection });
    };

    const toggleLearningPathSelection = (id) => {
        const updatedSelection = assignment.selectedLearningPaths.includes(id)
            ? assignment.selectedLearningPaths.filter(pathId => pathId !== id)
            : [...assignment.selectedLearningPaths, id];

        setAssignment({ ...assignment, selectedLearningPaths: updatedSelection });
    };

    return (
        <div className="pt-24 bg-gray-50 min-h-screen">
            <div className="max-w-xl border border-gray-300 mx-auto bg-white p-10 shadow-md rounded-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Assign Learning Paths to Employees</h1>

                {/* Select Employees */}
                <div className="mb-4">
                    <label
                        className="text-gray-600 cursor-pointer border-2 p-2 flex justify-between items-center"
                        onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                    >
                        <span>Select Employees</span>
                        <span className={`transform transition-transform ${showEmployeeDropdown ? 'rotate-180' : ''}`}>&#9660;</span>
                    </label>

                    {showEmployeeDropdown && (
                        <div className="border border-gray-300 p-2 mt-1 w-full max-h-48 overflow-auto">
                            {employees.map((employee) => (
                                <div key={employee._id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={assignment.selectedEmployees.includes(employee._id)}
                                        onChange={() => toggleEmployeeSelection(employee._id)}
                                        className="mr-2"
                                    />
                                    <label className="text-gray-600">{employee.name}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Select Learning Paths */}
                <div className="mb-4">
                    <label
                        className="text-gray-600 cursor-pointer border-2 p-2 flex justify-between items-center"
                        onClick={() => setShowLearningPathDropdown(!showLearningPathDropdown)}
                    >
                        <span>Select Learning Paths</span>
                        <span className={`transform transition-transform ${showLearningPathDropdown ? 'rotate-180' : ''}`}>&#9660;</span>
                    </label>

                    {showLearningPathDropdown && (
                        <div className="border border-gray-300 p-2 mt-1 w-full max-h-48 overflow-auto">
                            {learningPaths.map((path) => (
                                <div key={path._id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={assignment.selectedLearningPaths.includes(path._id)}
                                        onChange={() => toggleLearningPathSelection(path._id)}
                                        className="mr-2"
                                    />
                                    <label className="text-gray-600">{path.title}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleAssignLearningPath}
                    className="w-full text-white bg-[#0369a1] focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6"
                >
                    Assign Learning Path
                </button>
            </div>
        </div>
    );
}
