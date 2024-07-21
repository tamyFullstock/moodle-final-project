import React, { useState, useEffect } from 'react';
import Globals from '../../../Globals.js';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import CoursesHeader from './components/coursesHeader.js';
import NewCourseForm from './components/newCourseForm.js'; // Import NewCourseForm
import '../../../style/pages/items/items.css';

function LecturerCourses() {

  const [isLoading, setIsLoading] = useState(true); //still not get the data yet
  const port = Globals.PORT_SERVER;  //port of the server
  const [coursesList, setCoursesList] = useState([]); //list courses the lecturer teaches
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [showNewCourseForm, setShowNewCourseForm] = useState(false); // State to control form visibility (make a new course)

  const user = JSON.parse(localStorage.getItem('user') ?? '{}'); //get current user from ls
  const semester = searchParams.get('semester') ?? 1;  //semester to filter by. default is semester 1

  //get all the courses the lecturer teach. filter by semester
  useEffect(() => {
    async function getCourses() {
      try {
        const response = await fetch(`http://localhost:${port}/courses?lecturer=${user.id}&semester=${semester}`,{
          credentials: 'include', // Ensures cookies are sent with the request
        });
        let newList = await response.json();
        if (!response.ok) {
          throw new Error(`error getting courses of lecturer with ID ${user.id}`);
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

  // Function to handle adding new course
  const handleAddCourse = (newCourse) => {
    //add the new course to the list of courses. instead of making new fetch from server
    setCoursesList([...coursesList, newCourse])
  };

  return (
    <div>
      <CoursesHeader setShowNewCourseForm={() => setShowNewCourseForm(true)} /> {/* Header for courses page */}
      {!isLoading && ( // Render only if not loading
        coursesList.length > 0 ? ( // Render items-container if coursesList has items
          <div className="items-container">
            {!showNewCourseForm && coursesList.map(course => (
              <div key={course.id} className="item-card">
                <h3>{course.subject}</h3> {/* Display course subject */}
                <p>Course ID: {course.id}<br />Semester: {course.semester}</p> {/* Display course ID and semester */}
                <div className='links-container'>
                  {/* Link to view lessons of the course */}
                  <Link to={`./${course.id}/lessons`} state={{ search: searchParams.toString() }}>
                    <button>View Lessons</button>
                  </Link>
                  {/* Link to view students of the course */}
                  <Link to={`./${course.id}/students`} state={{ search: searchParams.toString() }}>
                    <button>View Students</button>
                  </Link>
                </div>
              </div>
            ))}
            {/* Component with fields for making a new course, shown based on showNewCourseForm state */}
            {showNewCourseForm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <NewCourseForm
                    onClose={() => setShowNewCourseForm(false)}
                    onAddCourse={handleAddCourse}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>No courses found.</p> // Render if coursesList is empty
        )
      )}
      {isLoading && <p>Loading...</p>} {/* Loading message while fetching courses */}
    </div>
  );
}

export default LecturerCourses;
