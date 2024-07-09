import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Globals from '../../../Globals.js';
import '../../../style/pages/lecturer/detailedCard.css';
import UpdateTaskForm from './homeworks/updateTaskForm.js';

// Component to show lesson details with its homework and tasks for the student
function LessonDetails() {
  const { lessonId } = useParams(); // Extract lessonId from the URL
  const location = useLocation();
  const search = location.state?.search || ""; // Use it to maintain params between pages
  const port = Globals.PORT_SERVER; // Port of the server
  const user = JSON.parse(localStorage.getItem('user') ?? '{}'); //get current user from ls

  // State variables
  const [lessonDetails, setLessonDetails] = useState(null); // Details of the lesson
  const [tasks, setTasks] = useState([]); // List of tasks for the student
  const [isLoading, setIsLoading] = useState(true); // Still not get the data yet
  const [selectedTask, setSelectedTask] = useState(null); // Selected task to upload file

  useEffect(() => {
    // Function to fetch lesson details and tasks from server
    async function getLessonDetailsAndTasks() {
      try {
        // Fetch lesson details
        const response = await fetch(`http://localhost:${port}/lessons/${lessonId}`);
        if (!response.ok) {
          throw new Error(`Error getting details for lesson with ID ${lessonId}`);
        }
        const lesson = await response.json();
        setLessonDetails(lesson);

        // Fetch tasks for the lesson
        const tasksResponse = await fetch(`http://localhost:${port}/tasks/withHw?lesson=${lessonId}&user=${user.id}`);
        if (!tasksResponse.ok) {
          throw new Error(`Error getting tasks for lesson with ID ${lessonId}`);
        }
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false); // Set loading to false after fetching data
      }
    }

    getLessonDetailsAndTasks();
  }, [lessonId, port]);

  return (
    <div className="item-details-first-container lesson-details-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="item-details-second-container">
          <div>
            <h2>{lessonDetails.title}</h2>
            <p><strong>Lesson ID:</strong> {lessonDetails.id}</p>
            <p><strong>Date:</strong> {new Date(lessonDetails.year, lessonDetails.month - 1, lessonDetails.day, lessonDetails.hour).toLocaleString()}</p>

            {/* Display video if video_name is not null */}
            {lessonDetails.video_name && (
              <div>
                <h3>Lesson Video</h3>
                <video width="600" controls>
                  <source src={`http://localhost:${port}/lesson/videos/${lessonDetails.video_name}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            <h3>Tasks</h3>
            <ul>
              {tasks.map(task => (
                <li key={task.id} className="task-item">
                  <p>{task.hw_description}</p>
                  <a href={`http://localhost:${port}/hw/files/${task.hw_file_name}`} target="_blank" rel="noopener noreferrer">
                    <button className="pdf-button">Open Homework</button>
                  </a>
                  {task.file_name && (
                    <a href={`http://localhost:${port}/task/files/${task.file_name}`} target="_blank" rel="noopener noreferrer">
                      <button className="task-file-button">Open Your File</button>
                    </a>
                  )}
                  {task.completed ? (
                    <button className="complete-task-button" onClick={() => setSelectedTask(task)}>Update Task</button>
                  ) : (
                    <button className="complete-task-button" onClick={() => setSelectedTask(task)}>Complete Task</button>
                  )}
                  {task.grade !== null ? (
                    <p>Grade: {task.grade}</p>
                  ) : (
                    <p>No grade yet</p>
                  )}
                </li>
              ))}
            </ul>
            <Link to={`../?${search}`}>
              <button className="back-button1">Back to Lessons</button>
            </Link>
          </div>
        </div>
      )}

      {/* Modal for file upload */}
      {selectedTask && (
        <div className="modal-overlay">
        <div className="modal-content">
          <UpdateTaskForm
            onClose={() =>  setSelectedTask(null)}
            task = {selectedTask}
            setTasks = {setTasks}
          />
        </div>
      </div>
      )}
    </div>
  );
}

export default LessonDetails;