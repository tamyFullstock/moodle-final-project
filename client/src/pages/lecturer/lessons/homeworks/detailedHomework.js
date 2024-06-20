import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Globals from '../../../../Globals.js';
import '../../../../style/pages/lecturer/detailsHw.css';
import UpdateHwForm from './updateHwsForm.js';
import showErrorMessage from '../../../../helpers/alertMessage.js';
import HwCompletionGraph from './components/HwCompletionGraph.js';
import SingleStudentsTasks from './components/SingleStudentTask.js';

function DetailsHw() {
  const { homeworkId } = useParams(); // Extract homework ID from the URL
  const navigate = useNavigate();
  const port = Globals.PORT_SERVER; // Port of the server
  const [homework, setHomework] = useState(null); // Details of the homework
  const [isLoading, setIsLoading] = useState(true); // Still not get the data yet
  const [showUpdateHwForm, setShowUpdateHwForm] = useState(false); // State to control form visibility (make a new hw)
  const [students, setStudents] = useState([]); // List of all students
  const [tasks, setTasks] = useState([]); // List of all tasks of hw
  const [editingGrade, setEditingGrade] = useState(null); // Track the student being edited. the value is the task now been updated
  const [hwFileUrl, setHwFileUrl] = useState('')  //full url of the file of hw

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

  useEffect(()=>{
    if(homework && homework.file_name){ // Construct the file URL for the PDF file
      setHwFileUrl(`http://localhost:${port}/hw/files/${homework.file_name}`);
    }
  },[homework, homeworkId])

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
            file_name: t.file_name,
            grade: t.grade
          }))
        );
        const studentsDetailsList = await Promise.all(studentDetailsPromises); // List with all students have this task (student in the course) with their details
        setStudents(studentsDetailsList);
      } catch (err) {
        console.log(err);
      }
    }
    getStudents();
  }, [homeworkId, port]);

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
        console.log(response, "error")
        if(response.status == 403){
          throw new Error("You don't have permission to edit task's grade");
        }
        throw new Error(`Error updating grade for task ID ${taskId} status: ${response.status}`);
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
                  <SingleStudentsTasks key={student.id}
                                       student={student} 
                                       editingGrade={editingGrade} 
                                       setEditingGrade={setEditingGrade}
                                       handleGradeSubmit={handleGradeSubmit}
                                      />
                ))}
              </ul>
              <div className="completion-rate-pContainer">
                  <HwCompletionGraph StudentsTasksList = {students}/>
              </div>
              {(homework.file_name && hwFileUrl) && (
                <a href={hwFileUrl} download target="_blank" rel="noopener noreferrer">
                  <button className="pdf-button">Hw file</button>
                </a>
              )}
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