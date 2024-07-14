// TaskList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, searchParams, useSearchParams } from 'react-router-dom';
import '../../../style/pages/student/tasks.css'
import Globals from '../../../Globals';
import TasksHeader from './components/TasksHeader';

const StudentTasks = () => {
    const port = Globals.PORT_SERVER; // Port of the server
    const user = JSON.parse(localStorage.getItem('user') ?? '{}'); //get current user from ls
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Still not get the data yet
    const [searchParams, setSearchParams] = useSearchParams(); 
    const [hasMore, setHasMore] = useState(true);
    const course = searchParams.get('course')??"All";  //semester to filter by.
    const page = searchParams.get('page')??"1";  //semester to filter by.

    const loadMoreTasks = () =>{
        searchParams.set("page", parseInt(page)+1);
        setSearchParams(searchParams);
    }

    useEffect(() => {
        // Fetch the tasks from your API
        const fetchTasks = async () => {
            try {
                let query = `http://localhost:${port}/tasks/detailed?user=${user.id}&limit=6&page=${page}&completed=0`;
                if (course != "All"){
                    query+=`&course=${course}`
                }
                // Fetch all not completed tasks
                const response = await fetch(query,{
                    credentials: 'include', // Ensures cookies are sent with the request
                });
                if (!response.ok) {
                  throw new Error(`Error getting user's tasks`);
                }
                const tasksList = await response.json();
                if(page==1){
                    setTasks(tasksList);
                }
                else if (tasksList.length == 0){
                    setHasMore(false)
                }
                else{
                    setTasks(p=>p.concat(tasksList));
                    console.log(tasks)
                }
              } catch (err) {
                console.log(err);
              } finally {
                setIsLoading(false); // Set loading to false after fetching data
              }
        };

        fetchTasks();
    }, [page, course]);

    // Navigate to the lesson with this task for user to complete the task
    const handleTaskClick = (t) => {
        navigate(`/student/${user.id}/courses/${t.course_id}/lessons/${t.lesson_id}`);
    };

    return (
        <div className="task-list">
            <TasksHeader setHasMore={setHasMore}/>
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
                {hasMore ? (
                    <button onClick={loadMoreTasks} className="load-more-button">Load More Tasks</button>):
                    (<p>No more tasks to load.</p>)
                }
            </div>
            }
        </div>
    );
};

export default StudentTasks;