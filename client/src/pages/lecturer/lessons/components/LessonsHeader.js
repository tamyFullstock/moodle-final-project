import React, { useState, useEffect } from 'react';
import Globals from '../../../../Globals.js';
import { useSearchParams, NavLink, useLocation } from 'react-router-dom';
import '../../../../style/pages/lecturer/courses/coursesHeader.css';

function LessonsHeader({ setShowNewLessonForm }) {
  const user = JSON.parse(localStorage.getItem('user' ?? '{}')); // Get current user from localStorage
  const location = useLocation();
  const search = location.state?.search || ""; // Use it to maintain params between pages
  const [year, setYear] = useState(''); // Year to filter by the lessons
  const [searchParams, setSearchParams] = useSearchParams();
  const port = Globals.PORT_SERVER; // Port of the server
  const maxYear = new Date().getFullYear();
  
  // Handle the search params according to the year user chose
  const handleYearChange = (event) => {  
    const newYear = event.target.value;
    setYear(newYear);
    setSearchParams({ year: newYear });
  };

  return (
    <div className="lessons-header">
      <div className="year-input">
        {/* Field for year (2020-current year) to filter by */}
        <label htmlFor="year">Year:</label>
        <input
          type="number"
          id="year"
          min="2020"
          max={maxYear}
          value={year}
          onChange={handleYearChange}
        />
      </div>
      <div className="back-button">
        <button>
          <NavLink to={`/${user.type}/${user.id}/courses?${search}`}>
            Back to All Courses
          </NavLink>
        </button>
      </div>
      <div className="new-lesson-button">
        <button onClick={() => setShowNewLessonForm(true)}>New Lesson</button>
      </div>
    </div>
  );
}

export default LessonsHeader;