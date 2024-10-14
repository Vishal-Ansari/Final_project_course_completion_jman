import React, { useEffect,useState } from 'react';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';
import Cookie from 'js-cookie';

// Register Chart.js components
Chart.register(...registerables);

const PerformanceStat = () => {

  const [completionStats, setCompletionStats] = useState({ totalCourses: 0, completedCourses: 0, completionRate: 0 });
  // Example data
   const fetchCompletionStats = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/user/stats/completion', {
          headers: { Authorization: `Bearer ${Cookie.get('accessToken')}` },
        });
        setCompletionStats(response.data);
      } catch (error) {
        console.error('Error fetching completion stats:', error);
      }
    };

    useEffect(() => {
      fetchCompletionStats()
    }, [])
    

  useEffect(() => {
    
    const ctx = document.getElementById('performanceChart').getContext('2d');

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Performance Score', 'Total Courses Assigned', 'Courses Completed'],
        datasets: [{
          label: 'Stats',
          data: [
            completionStats.completionRate.toFixed(2),
            completionStats.totalCourses,
            completionStats.completedCourses
          ],
          backgroundColor: [
            'rgba(248, 113, 113, 0.6)',
            'rgba(248, 113, 113, 0.6)',
            'rgba(248, 113, 113, 0.6)'
          ],
          borderColor: [
            'rgba(248, 113, 113, 1)',
            'rgba(248, 113, 113, 1)',
            'rgba(248, 113, 113, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Cleanup chart instance on component unmount
    return () => {
      myChart.destroy();
    };
  }, [completionStats]);

  return (
    <div id="performanceStats" className="mb-6 rounded-lg">
      <div className="p-6  bg-white rounded-lg md:p-8 dark:bg-gray-800">
        <canvas id="performanceChart" width="400" height="400"></canvas>
      </div>
    </div>
  );
};

export default PerformanceStat;
