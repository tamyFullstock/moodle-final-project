import React, {useState, useEffect} from 'react'
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../../../../style/pages/lecturer/detailsHw.css';

function HwCompletionGraph({StudentsTasksList}) {

    const [completedStudents, setCompletedStudents] = useState([]); // List of students who completed the homework
    const [completionRate, setCompletionRate] = useState(0); // Completion rate for the homework

    useEffect(
        ()=>{
            // List of all students who completed the hw
            const completedStudentsList = StudentsTasksList.filter(s => s.completed === 1);  
            setCompletedStudents(completedStudentsList);
            // Percentage of students who did the hw
            setCompletionRate(((completedStudentsList.length / StudentsTasksList.length) * 100).toFixed(2));
        },[StudentsTasksList]
    )
    

  return (
    <div className="completion-rate-container">
        <h4>Homework Completion Rate:</h4>
        <div className="chart-container">
        <Pie
            data={{
                labels: ['Completed', 'Not Completed'],
                datasets: [{
                data: [completionRate, 100 - completionRate],
                backgroundColor: ['#4caf50', '#f44336'],
                }],
            }}
            options={{
                plugins: {
                    legend: {
                    display: true,
                    position: 'bottom',
                    },
                },
                maintainAspectRatio: false,
            }}
        />
        </div>
        <p>{completionRate}% of students have completed this homework</p>
    </div>
  )
}

export default HwCompletionGraph