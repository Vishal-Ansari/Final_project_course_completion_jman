
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import mermaid from "mermaid";

export default function EmployeeLearningPath() {
    const [learningPaths, setLearningPaths] = useState([]);
    const [mermaidDiagram, setMermaidDiagram] = useState('');

    useEffect(() => {
        const fetchLearningPaths = async () => {
            const decodedToken = jwtDecode(Cookie.get('accessToken'));
            const employeeId = decodedToken._id;
            const response = await axios.get(`http://localhost:4000/api/learningpath/${employeeId}/get-learningpath`);
            setLearningPaths(response.data);
        };

        fetchLearningPaths();
    }, []);

    useEffect(() => {
        if (learningPaths.length > 0) {
            const diagram = createMermaidDiagram(learningPaths);
            setMermaidDiagram(diagram);
        }
    }, [learningPaths]);


    useEffect(() => {
        if (mermaidDiagram) {
            // Initialize mermaid with custom styles
            mermaid.initialize({
                startOnLoad: true,
                themeVariables: {
                    // Customize the colors for different types of nodes
                    learningPath: {
                        fill: '#4CAF50',
                        stroke: '#2E7D32',
                    },
                    assigned: {
                        fill: '#FFEB3B',
                        stroke: '#FBC02D',
                    },
                }
            });
            mermaid.contentLoaded();  // This ensures the diagram is rendered
        }
    }, [mermaidDiagram]);


    const createMermaidDiagram = (paths) => {
        let mermaidData = 'graph TD\n';

        // Add the main node for Learning Path
        mermaidData += 'MainLearningPath["Learning Path"]\n';

        // Loop through learning paths and connect them to the main node
        paths.forEach((path, pathIndex) => {
            const pathNodeId = `LP${pathIndex}`;
            mermaidData += `${pathNodeId}["${path.learningPathTitle}"]\n`;

            // Connect the learning path to the main node
            mermaidData += `MainLearningPath --> ${pathNodeId}\n`;


            path.courses.forEach((course, courseIndex) => {
                const courseNodeId = `C${pathIndex}-${courseIndex}`;

                // Include the assigned status and completion percentage in the node label
                let courseLabel = `${course.title}`;
                if (course.assigned) {
                    courseLabel += ` (Assigned: ${course.completionPercentage}%)`;
                }

                // Add the course node
                mermaidData += `${courseNodeId}["${courseLabel}"]\n`;

                // Connect the course to its respective learning path
                mermaidData += `${pathNodeId} --> ${courseNodeId}\n`;

                // Style if the course is assigned (using Mermaid classes)
                if (course.assigned) {
                    mermaidData += `style ${courseNodeId} fill:#FFEB3B,stroke:#FBC02D,stroke-width:2px;\n`;
                }
            });
        });

        return mermaidData;
    };



    return (
        <div className="p-4 flex  justify-center flex-col">
            <h1 className="text-2xl font-bold mb-4 text-center">Employee Learning Paths</h1>
            <div style={{ height: '40vh', width: '40%' }} className="border border-gray-300 rounded-lg shadow-lg p-4 flex justify-center ml-96">
                {mermaidDiagram ? (
                    <div className="mermaid h-64">
                        {mermaidDiagram}
                    </div>
                ) : (
                    <p>No Learning Path Assigned</p>
                )}
            </div>
        </div>
    );
}
