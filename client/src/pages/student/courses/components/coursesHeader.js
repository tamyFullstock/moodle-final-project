import React, { useState } from 'react';
import Globals from '../../../../Globals.js';
import { useSearchParams } from 'react-router-dom';
import '../../../../style/pages/lecturer/courses/coursesHeader.css';

function CoursesHeader({ setShowNewCourseForm }) {
  const [semester, setSemester] = useState(''); //smester to filter by the courses 
  const [searchParams, setSearchParams] = useSearchParams();
  const port = Globals.PORT_SERVER;  //port of the server
  //handle the search params according to the semester user chose
  const handleSemesterChange = (event) => {  
    const newSemester = event.target.value;
    setSemester(newSemester);
    setSearchParams({ semester: newSemester });
  };

  return (
    <div className="lecturer-header">
      <div className="first-input">
        {/*field for semester (1-3) to filter by */}
        <label htmlFor="semester">Semester:</label>
        <input
          type="number"
          id="semester"
          min="1"
          max="3"
          onChange={handleSemesterChange}
        />
      </div>
    </div>
  );
}

export default CoursesHeader;