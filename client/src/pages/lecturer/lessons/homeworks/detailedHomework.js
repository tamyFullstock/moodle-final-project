import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Globals from '../../../../Globals.js';
import '../../../../style/pages/lecturer/detailsHw.css';
import UpdateHwForm from './updateHwsForm.js';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import showErrorMessage from '../../../../helpers/alertMessage.js';

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
  const [tasks, setTasks] = useState([]); // List of all tasks of hw
  const [editingGrade, setEditingGrade] = useState(null); // Track the student being edited. the value is the task now been updated

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

  // Get a list with all the students (and their details) in the course have this hw (task associated to it)
  useEffect(() => {
    async function getStudents() {
      try {
        const tasksResponse = await fetch(`http://localhost:${port}/tasks?homework=${homeworkId}`);
        if (!tasksResponse.ok) {
          throw new Error('Error getting homework tasks');
        }
        const hwTasks = await tasksResponse.json();  // All tasks object related to this hw
        setTasks(hwTasks); // Set the tasks list

        // Fetch student details for each student ID. Make a list of objects with usernames and id
        const studentDetailsPromises = hwTasks.map(t =>
          fetch(`http://localhost:${port}/users/${t.student_id}`).then(response => response.json())
          .then(data => ({
            id: data.id,  // id of student
            taskId: t.id,  // id of his task
            student_name: `${data.first_name} ${data.last_name}`,
            username: data.tz,
            completed: t.completed,
            file_url: t.file_url,
            grade: t.grade
          }))
        );
        const studentsDetailsList = await Promise.all(studentDetailsPromises); // List with all students have this task (student in the course) with their details
        setStudents(studentsDetailsList);
        const completedStudentsList = studentsDetailsList.filter(s => s.completed === 1);  // List of all students who completed the hw
        setCompletedStudents(completedStudentsList);
        const completionRate = (completedStudentsList.length / studentsDetailsList.length) * 100; // Percentage of students who did the hw
        setCompletionRate(completionRate.toFixed(2));
      } catch (err) {
        console.log(err);
      }
    }
    getStudents();
  }, [homeworkId, port]);

  // Update the completedStudents list who did the homework if the list of students get changed
  useEffect(() => {
    setCompletedStudents(students.filter(s => s.completed === 1));
  }, [students]);

  // Delete the hw
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

  // Function to open the file URL
  const openFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  // Function to handle grade submission
  const handleGradeSubmit = async (taskId, newGrade) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:${port}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // This ensures that cookies are sent with the request
        body: JSON.stringify({ ...taskToUpdate, grade: newGrade }),
      });

      if (!response.ok) {
        if(response.status == 403){
          throw new Error("You don't have permission to edit task's grade");
        }
        throw new Error(`Error updating grade for task ID ${taskId}`);
      }

      const updatedTask = await response.json();

      // Update the grade in client side also:
      setStudents(prevStudents =>
        prevStudents.map(student =>
          student.taskId === taskId ? { ...student, grade: newGrade } : student
        )
      );
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId ? { ...t, grade: newGrade } : t
        )
      );
      setEditingGrade(null); // Close the input field after submission
    } catch (error) {
      console.log(error);
      showErrorMessage("error while trying updating grade")
    }
  };

  return (
    <div className="homework-details-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {!showUpdateHwForm && (
            <div>
              <h2>Homework:  {homework.description}<br /><br /></h2>
              <h4>Students' Homework</h4>
              <ul className="student-list">
                {students.map(student => (
                  <li key={student.id} className={student.completed === 1 ? 'completed' : 'not-completed'}>
                    {student.student_name} {student.completed === 1 ? '✔️' : '❌'}
                    {student.file_url && (
                      <button className="file-button" onClick={() => openFile(student.file_url)}>Open File</button>
                    )}
                    {/*an input field for updating grade. show only for the task been upadted */}
                    {editingGrade === student.taskId ? (
                      <div className="grade-input-container">
                        <input
                          type="number"
                          defaultValue={student.grade}
                          onKeyDown={e => { //submit the grade
                            if (e.key === 'Enter') {
                              handleGradeSubmit(student.taskId, e.target.value);
                            } else if (e.key === 'Escape') {
                              setEditingGrade(null);
                            }
                          }}
                          autoFocus
                        />
                        <button onClick={() => setEditingGrade(null)}>X</button> 
                      </div>
                    ) : (
                      <button className="grade-button" onClick={() => setEditingGrade(student.taskId)}>Grade</button>
                    )}
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