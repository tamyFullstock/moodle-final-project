import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Globals from '../../../../Globals.js';
import '../../../../style/pages/lecturer/detailsHw.css';
import UpdateHwForm from './updateHwsForm.js';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

function DetailsHw() {
  const { homeworkId } = useParams(); // Extract homework ID from the URL
  const navigate = useNavigate();
  const port = Globals.PORT_SERVER; // Port of the server
  const [homework, setHomework] = useState(null); // Details of the homework
  const [isLoading, setIsLoading] = useState(true); // Still not get the data yet
  const [showUpdateHwForm, setShowUpdateHwForm] = useState(false); // State to control form visibility (make a new hw)
  const [students, setStudents] = useState([]); // List of all students
  const [completedStudents, setCompletedStudents] = useState([]); // List of students who completed the homework
  const [completionRate, setCompletionRate] = useState(0); // Completion rate for the homework

  useEffect(() => {
    async function getHomeworkDetails() {
      try {
        const response = await fetch(`http://localhost:${port}/homeworks/${homeworkId}`);
        if (!response.ok) {
          throw new Error(`Error getting details for homework with ID ${homeworkId}`);
        }
        const hw = await response.json();
        setHomework(hw);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getHomeworkDetails();
  }, [homeworkId, port]);

  //get a list with all the students (and their details) in the course have this hw (task associated to it)
  useEffect(() => {
    async function getStudents() {
      try {
        const tasksResponse = await fetch(`http://localhost:${port}/tasks?homework=${homeworkId}`);
        if (!tasksResponse.ok) {
          throw new Error('Error getting homework tasks');
        }
        const hwTasks = await tasksResponse.json();  //all tasks object related to this hw

        // Fetch student details for each student ID. make a list of objects with usernames and id
        const studentDetailsPromises = hwTasks.map(t =>
          fetch(`http://localhost:${port}/users/${t.student_id}`).then(response => response.json())
          .then(data=>{
            return {id: data.id,
                    student_name: `${data.first_name} ${data.last_name}`,
                    username: data.tz,
                    completed: t.completed,
                    }})
        );
        const studentsDetailsList = await Promise.all(studentDetailsPromises); //list with all students have this task (student in the course) with their details
        setStudents(studentsDetailsList);
        const completedStudentsList = studentsDetailsList.filter(s => s.completed === 1);  //list of all students fullfilled the hw
        setCompletedStudents(completedStudentsList);
        const completionRate = (completedStudentsList.length / studentsDetailsList.length) * 100; //percentage of students did the hw
        setCompletionRate(completionRate.toFixed(2));
      } catch (err) {
        console.log(err);
      }
    }
    getStudents();
  }, [homeworkId, port]);

  //update the completedStudents list who did the homework if the list of students get changed
  useEffect(() => {
    setCompletedStudents(students.filter(s => s.completed === 1));
  }, [students]);

  //delete the hw
  async function deleteHw() {
    try {
      const response = await fetch(`http://localhost:${port}/homeworks/${homeworkId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Error while trying to delete homework with ID ${homeworkId}`);
      }
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="homework-details-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {!showUpdateHwForm && (
            <div>
              <h2>Homework:  {homework.description}<br /><br /></h2>
              <h4>Students' Hw State:</h4>
              <ul className="student-list">
                {students.map(student => (
                  <li key={student.id} className={student.completed === 1 ? 'completed' : 'not-completed'}>
                    {student.student_name} {student.completed === 1 ? '✔️' : '❌'}
                  </li>
                ))}
              </ul>
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
              <a href={homework.file_url} download target="_blank">
                <button className="pdf-button">Open PDF file</button>
              </a>
              <button className="delete-button" onClick={deleteHw}>Delete Homework</button>
              <button className="update-button" onClick={() => setShowUpdateHwForm(true)}>Update Homework</button>
              <button className="back-button2" onClick={() => navigate(-1)}>Back</button>
            </div>
          )}
          {showUpdateHwForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <UpdateHwForm
                  onClose={() => setShowUpdateHwForm(false)}
                  setHomework={setHomework}
                  hwToUpdate={homework}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DetailsHw;