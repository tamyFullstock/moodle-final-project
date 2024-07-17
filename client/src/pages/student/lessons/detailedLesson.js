import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Globals from '../../../Globals.js';
import '../../../style/pages/detailedCard.css';
import UpdateTaskForm from './homeworks/updateTaskForm.js';

function LessonDetails() {
  const { lessonId } = useParams();
  const location = useLocation();
  const search = location.state?.search || "";
  const port = Globals.PORT_SERVER;
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');

  const [lessonDetails, setLessonDetails] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    async function getLessonDetailsAndTasks() {
      try {
        const response = await fetch(`http://localhost:${port}/lessons/${lessonId}`,{
          credentials: 'include', // Ensures cookies are sent with the request
        });
        if (!response.ok) {
          throw new Error(`Error getting details for lesson with ID ${lessonId}`);
        }
        const lesson = await response.json();
        setLessonDetails(lesson);

        const tasksResponse = await fetch(`http://localhost:${port}/tasks/withHw?lesson=${lessonId}&user=${user.id}`,{
          credentials: 'include', // Ensures cookies are sent with the request
        });
        if (!tasksResponse.ok) {
          throw new Error(`Error getting tasks for lesson with ID ${lessonId}`);
        }
        const tasksData = await tasksResponse.json();
        console.log(tasksData)
        setTasks(tasksData);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
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

            {lessonDetails.video_name !== null&& (
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
                  {task.file_name !== null && (
                    <a href={`http://localhost:${port}/task/files/${task.file_name}`} target="_blank" rel="noopener noreferrer">
                      <button className="task-file-button">Open Your File</button>
                    </a>
                  )}
                  <button className="complete-task-button" onClick={() => setSelectedTask(task)}>
                    {task.completed ? 'Update Task' : 'Complete Task'}
                  </button>
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

      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UpdateTaskForm
              onClose={() => setSelectedTask(null)}
              task={selectedTask}
              setTasks={setTasks}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonDetails;