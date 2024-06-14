import React, { useState, useEffect } from 'react';
import Globals from '../../../Globals.js';
import { useSearchParams,useParams, useLocation, Link } from 'react-router-dom';
import '../../../style/pages/lecturer/courses/courses.css';
import LessonsHeader from './components/LessonsHeader.js';
import NewLessonForm from './components/newLessonsForm.js';

function LecturerLessons() {

  const { courseId } = useParams(); // Extract courseId the lessons belongs to from the URL
  const location = useLocation(); // Current location
  const [isLoading, setIsLoading] = useState(true); // Still not get the data yet
  const port = Globals.PORT_SERVER; // Port of the server
  const [lessonsList, setLessonsList] = useState([]); // List of lessons
  const [searchParams, setSearchParams] = useSearchParams(); 
  const [showNewLessonForm, setShowNewLessonForm] = useState(false); // State to control form visibility (make a new lesson)
  const user = JSON.parse(localStorage.getItem('user') ?? '{}'); //get current user from ls
  const currentYear = new Date().getFullYear();
  const year = searchParams.get('year') ?? currentYear;  //year to filter by. default is current year

  // Get all the lessons for the specific course
  useEffect(() => {
    async function getLessons() {
      try {
        const response = await fetch(`http://localhost:${port}/lessons?course=${courseId}&year=${year}`);
        let newList = await response.json();
        if (!response.ok) {
          throw new Error(`error getting lessons for course with ID ${courseId}`);
        }
        //add a formatted date to any lesson. sort by the new to old
        newList = newList.map(lesson=>{return {...lesson, Date: formatDate(lesson.year, lesson.month, lesson.day, lesson.hour)}})
        .sort((a, b) => b.Date - a.Date);
        setLessonsList(newList);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getLessons();
  }, [courseId,year, user.id, port]);

  // Function to handle adding new lesson
  const handleAddLesson = (newLesson) => {
    //add to current lessons only lesson in this year to filter
    if(newLesson.year != year){
      return;
    }
    //add the new lesson to the list of lessons. instead of making new fetch from server
    setLessonsList([...lessonsList, newLesson].sort((a, b) => b.Date - a.Date))
  };

  // Function to format the date
  const formatDate = (year, month, day, hour) => {
    const date = new Date(year, month - 1, day, hour); // Note: month is 0-indexed in JavaScript Date
    return date.toLocaleString(); // Adjust to desired date format
  };

  return (
    <div>
      {/*component with fields for making a new lesson*/}
      <LessonsHeader setShowNewLessonForm={() => setShowNewLessonForm(true)}/>
      <h2>Lessons for Course {courseId}</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="items-container">
            {!showNewLessonForm && lessonsList.map(lesson => (
            <div key={lesson.id} className="item-card">
              <h3>{lesson.title}</h3>
              <p>Lesson ID: {lesson.id}</p>
              <p>Date: {lesson.Date}</p>
              <Link to={`./${lesson.id}`} state = {{search: searchParams.toString()}}>
                <button>View Details</button>
              </Link>
            </div>
          ))}
            {/*component with fields for making a new lesson
             - be shown up to showNewLessonForm switched by button in LessonsHeader*/}
           {showNewLessonForm &&
              <div className="modal-overlay">
                <div className="modal-content">
                  <NewLessonForm
                    onClose={() => setShowNewLessonForm(false)}
                    onAddLesson={handleAddLesson}
                  />
                </div>
              </div>
            }
        </div>
      )}
    </div>
  )};

export default LecturerLessons;