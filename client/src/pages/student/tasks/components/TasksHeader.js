import React, { useState, useEffect } from 'react';
import Globals from '../../../../Globals.js';
import { useSearchParams } from 'react-router-dom';
import '../../../../style/pages/lecturer/courses/coursesHeader.css';

function TasksHeader() {
  const [course, setCourse] = useState(''); // course to filter by the tasks
  const [searchParams, setSearchParams] = useSearchParams();
  const user = JSON.parse(localStorage.getItem('user') ?? '{}'); // get current user from localStorage
  const port = Globals.PORT_SERVER;  // port of the server
  const [coursesList, setCoursesList] = useState([]); // list of courses the student is enrolled in

  // handle the search params according to the course user chose
  const handleCourseChange = (event) => {  
    const newCourse = event.target.value;
    setCourse(newCourse);
    searchParams.set("course", newCourse);
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  };

  // get all the courses student is enrolled in
  useEffect(() => {
    async function getCourses() {
      try {
        const response = await fetch(`http://localhost:${port}/coursesP/studentCourses/${user.id}`);
        let newList = await response.json();
        if (!response.ok) {
          throw new Error(`Error getting courses of student with ID ${user.id}`);
        }
        setCoursesList(newList);
      } catch (err) {
        console.log(err);
      } 
    }
    getCourses();
  }, [user.id, port]);

  return (
    <div className="tasks-header">
      <div className="course-select">
        <label htmlFor="course">Course:</label>
        <select id="course" value={course} onChange={handleCourseChange}>
          <option value="All">All</option>
          {coursesList.map((course) => (
            <option key={course.id} value={course.id}>
              {course.subject}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default TasksHeader;