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

  useEffect(() => {
    async function getStudents() {
      try {
        const tasksResponse = await fetch(`http://localhost:${port}/tasks?hw_id=${homeworkId}`);
        if (!tasksResponse.ok) {
          throw new Error('Error getting homework tasks');
        }
        const hwTasks = await tasksResponse.json();
        const CourseStudentIds = hwTasks.map(task => task.student_id);
        const CompletedStudentIds = hwTasks.filter(t=>t.completed==1).map(task => task.student_id);
        setStudents(CourseStudentIds);
        setCompletedStudents(CompletedStudentIds);

        const completionRate = (completedStudents.length / students.length) * 100;
        setCompletionRate(completionRate.toFixed(2));
      } catch (err) {
        console.log(err);
      }
    }
    getStudents();
  }, [homeworkId, port]);

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
              <p>{homework.description}</p>
              <a href={homework.file_url} download target="_blank">
                <button className="pdf-button">Open PDF file</button>
              </a>
              <button className="delete-button" onClick={deleteHw}>Delete Homework</button>
              <button className="update-button" onClick={() => setShowUpdateHwForm(true)}>Update Homework</button>
              <button className="back-button2" onClick={() => navigate(-1)}>Back</button>
              <h3>Students Who Completed This Homework:</h3>
              <ul className="student-list">
                {completedStudents.map(student => (
                  <li key={student.id}>{student.first_name} {student.last_name}</li>
                ))}
              </ul>
              <div className="completion-rate-container">
                <h3>Homework Completion Rate:</h3>
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
                  }}
                />
                <p>{completionRate}% of students have completed this homework</p>
              </div>
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
/*import React , {useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Globals from '../../../../Globals.js';
import '../../../../style/pages/lecturer/detailsHw.css';
import UpdateHwForm from './updateHwsForm.js';

function DetailsHw() {
  const { homeworkId } = useParams(); // Extract homework ID from the URL
  const navigate = useNavigate();
  const port = Globals.PORT_SERVER; // Port of the server
  const [homework, setHomework] = useState(null); // Details of the homework
  const [isLoading, setIsLoading] = useState(true); // Still not get the data yet
  const [showUpdateHwForm, setShowUpdateHwForm] = useState(false); // State to control form visibility (make a new hw)

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
        {
            !showUpdateHwForm && <div>
            <p>{homework.description}</p>
            <a href={homework.file_url} download target="_blank">
              <button className="pdf-button">Open PDF file</button>
            </a>
            <button className="delete-button" onClick={deleteHw}>Delete Homework</button>
            <button className="update-button" onClick={()=>{setShowUpdateHwForm(true)}}>Update Homework</button>
            <button className="back-button2" onClick={() => navigate(-1)}>Back</button>
          </div>
        }
        {
            showUpdateHwForm &&
            <UpdateHwForm
                onClose={()=>{setShowUpdateHwForm(false)}}
                setHomework={setHomework}
                hwToUpdate = {homework}
            />
        }
        </div>
      )}
    </div>
  );
}

export default DetailsHw;
*/