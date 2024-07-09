// TaskList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../../style/pages/student/tasks.css'
import Globals from '../../../Globals';

const StudentTasks = () => {
    const port = Globals.PORT_SERVER; // Port of the server
    const user = JSON.parse(localStorage.getItem('user') ?? '{}'); //get current user from ls
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Still not get the data yet

    useEffect(() => {
        // Fetch the tasks from your API
        const fetchTasks = async () => {
            try {
                // Fetch all not completed tasks
                const response = await fetch(`http://localhost:${port}/tasks/detailed?user=${user.id}`);
                if (!response.ok) {
                  throw new Error(`Error getting user's tasks`);
                }
                const tasksList = await response.json();
                console.log(tasksList)
                setTasks(tasksList.filter(t=>!t.completed));
              } catch (err) {
                console.log(err);
              } finally {
                setIsLoading(false); // Set loading to false after fetching data
              }
        };

        fetchTasks();
    }, []);

    // Navigate to the lesson with this task for user to complete the task
    const handleTaskClick = (t) => {
        navigate(`/student/${user.id}/courses/${t.course_id}/lessons/${t.lesson_id}`);
    };

    return (
        <div className="task-list">
            {isLoading ? <div>Loading..</div> : 
            <div>
                <h2>Tasks To Complete</h2>
                {tasks.length > 0 ? (
                    <ul>
                        {tasks.map(task => (
                            <li key={task.id} className="task-item">
                                <div className="task-info">
                                    <h3>{task.course_name}</h3>
                                    <p><strong>Lesson:</strong> {task.lesson_title}</p>
                                    <p><strong>Description:</strong> {task.hw_description}</p>
                                </div>
                                <div className="task-buttons">
                                    <a href={`http://localhost:${port}/hw/files/${task.hw_file_name}`} target="_blank" rel="noopener noreferrer">
                                        <button className="download-button">Download Homework</button>
                                    </a>
                                    <button onClick={() => handleTaskClick(task)} className="go-to-lesson-button">Go to Lesson</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No incomplete tasks found.</p>
                )}
            </div>
            }
        </div>
    );
};

export default StudentTasks;