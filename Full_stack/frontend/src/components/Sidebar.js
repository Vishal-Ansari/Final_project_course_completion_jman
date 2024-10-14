// Sidebar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="w-64 z-50 bg-[#ec87ba]  text-white h-full p-6 -mt-24 pt-14">
            <h2 className="text-2xl font-bold mb-4 ml-2   text-black">Admin Menu</h2>
            <ul className="space-y-4">
                <li>
                    <button
                        onClick={() => navigate('/create-course')}
                        className="w-full mt-8 text-black text-left p-2 border border-gray-500 bg-white hover:bg-[#98cdec]  rounded"
                    >
                        Create Course
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => navigate('/assign-course')}
                        className="w-full text-left text-black p-2 border border-gray-500 bg-white hover:bg-[#98cdec] rounded"
                    >
                        Assign Courses
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => navigate('/create-learningpath')}
                        className="w-full text-left text-black p-2 border border-gray-500 bg-white hover:bg-[#98cdec] rounded"
                    >
                        Create Learning-Path
                    </button>
                </li>
                <li>
                    <button
                        onClick={() => navigate('/assign-learningpath')}
                        className="w-full text-left text-black p-2 border border-gray-500 bg-white hover:bg-[#98cdec] rounded"
                    >
                        Assign Learning-Path
                    </button>
                </li>
            </ul>
        </div>
    );

};

export default Sidebar;
