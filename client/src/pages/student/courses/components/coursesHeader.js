import React, { useState } from 'react';
import Globals from '../../../../Globals.js';
import { useSearchParams } from 'react-router-dom';
import '../../../../style/pages/lecturer/courses/coursesHeader.css';

function CoursesHeader() {
  const [semester, setSemester] = useState(''); // semester to filter by the courses 
  const [searchParams, setSearchParams] = useSearchParams();
  const port = Globals.PORT_SERVER;  // port of the server
  
  // Handle the search params according to the semester user chose
  const handleSemesterChange = (event) => {  
    const newSemester = event.target.value;
    setSemester(newSemester);
    setSearchParams({ semester: newSemester });
  };

  return (
    <div className="courses-header">
      <div className="semester-input">
        <label htmlFor="semester">Semester:</label>
        <input
          type="number"
          id="semester"
          min="1"
          max="3"
          value={semester}
          onChange={handleSemesterChange}
        />
      </div>
    </div>
  );
}

export default CoursesHeader;