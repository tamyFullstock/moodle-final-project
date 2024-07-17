import React, { useState, useEffect } from 'react';
import Globals from '../../../Globals.js';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import CoursesHeader from './components/coursesHeader.js';
import '../../../style/pages/items/items.css';

function StudentCourses() {

  const [isLoading, setIsLoading] = useState(true); //still not get the data yet
  const port = Globals.PORT_SERVER;  //port of the server
  const [coursesList, setCoursesList] = useState([]); //list courses the student learn
  const [searchParams, setSearchParams] = useSearchParams(); 

  const user = JSON.parse(localStorage.getItem('user') ?? '{}'); //get current user from ls
  const semester = searchParams.get('semester') ?? 1;  //semester to filter by. default is semester 1

  //get all the courses student learn. filter by semester
  useEffect(() => {
    async function getCourses() {
      try {
        const response = await fetch(`http://localhost:${port}/coursesP/studentCourses/${user.id}?semester=${semester}`,{
          credentials: 'include', // Ensures cookies are sent with the request
        });
        let newList = await response.json();
        if (!response.ok) {
          throw new Error(`error getting courses of student with ID ${user.id}`);
        }
        setCoursesList(newList);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getCourses();
  }, [semester, user.id, port]);

  return (
    <div>
      {/*component with fields for making a new user*/}
      <CoursesHeader  />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="items-container">
            {coursesList.map(course => (
              <div key={course.id} className="item-card">
                <h3>{course.subject}</h3>
                <p>Course ID: {course.id}<br/>Semester: {course.semester}</p>
                <div className='links-container'>
                  {/*direct to all lessons of single course */}
                  <Link to={`./${course.id}/lessons`} state = {{search: searchParams.toString()}}>
                    <button>View Lessons</button>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default StudentCourses;
