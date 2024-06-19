import React, { useState, useEffect } from 'react';
import Globals from '../../../../Globals.js';
import { useSearchParams, NavLink, useLocation } from 'react-router-dom';
import '../../../../style/pages/lecturer/courses/coursesHeader.css';

function LessonsHeader({ setShowNewLessonForm }) {
  const user = JSON.parse(localStorage.getItem('user'??{})); //get current user from ls
  const location = useLocation();
  const search = location.state?.search || ""; //use it to maintain params between pages
  const [year, setYear] = useState(''); //year to filter by the lessons
  const [searchParams, setSearchParams] = useSearchParams();
  const port = Globals.PORT_SERVER;  //port of the server
  const maxYear = new Date().getFullYear()
  
  //handle the search params according to the year user chose
  const handleYearChange = (event) => {  
    const newYear = event.target.value;
    setYear(newYear);
    setSearchParams({ year: newYear });
  };


  return (
    <div className="lecturer-header">
      <div className="first-input">
        {/*field for year (2000-current year) to filter by */}
        <label htmlFor="year">year:</label>
        <input
          type="number"
          id="semester"
          min="2020"
          max={maxYear}
          onChange={handleYearChange}
        />
      </div>
      <div className="back-button">
        <button><NavLink 
                    to= {`/lecturer/${user.id}/courses?${search}`}
                >
                    back to all courses
          </NavLink></button>
      </div>
      {/*button to add a new lesson- show newLesson component */}
      <div className="new-item-button">
        <button onClick={() => setShowNewLessonForm (true)}>New Lesson</button>
      </div>
    </div>
  );
}

export default LessonsHeader;