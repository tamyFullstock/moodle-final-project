import React, { useState } from 'react';
import Globals from '../../../../Globals.js';
import '../../../../style/pages/lecturer/courses/newCourseForm.css'
import showErrorMessage from '../../../../helpers/alertMessage.js';

//make a new course form component
//onClose: function close the form component
//onAddCourse: function to make when course has been added
function NewCourseForm({ onClose, onAddCourse }) {
  const [semester, setSemester] = useState(''); //semester of course
  const [subject, setSubject] = useState('');   //subject of course
  const port = Globals.PORT_SERVER;
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');  //current user
  //add course usign post request
  const handleAddCourse = async () => {
    const newCourse = {
      subject: subject,
      lecturer_id: user.id, // Assuming user_id is stored in localStorage
      semester: parseInt(semester),
    };

    try {
      const response = await fetch(`http://localhost:${port}/courses`, {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        if(response.status == "400"){ //not valid user input in fields
          const data = await response.text();
          throw new Error(data);
        }
        const data = await response.json();
        console.log(data.message)
        throw new Error('Error adding new course');
      }
      //course has been added successfully to the lecturer
      const newCourseData = await response.json();  //post a course return the new course with its new id
      onAddCourse(newCourseData); // Notify parent component (LecturerCourses) about the new course
      // Reset form fields
      setSemester('');
      setSubject('');
      // Close the form
      onClose();
    } catch (error) {
      console.error(error);
      showErrorMessage(error.message);
    }
  };

  return (
    <div className="new-item-form">
      <h2>Add New Course</h2>
      <label htmlFor="semester">Semester:</label>
      <input
        type="number"
        id="semester"
        min= "1"
        max = "3"
        onChange={(e) => setSemester(e.target.value)}
      />
      <label htmlFor="subject">Subject:</label>
      <input
        type="text"
        id="subject"
        onChange={(e) => setSubject(e.target.value)}
      />
      <div className="buttons">
        <button onClick={handleAddCourse}>Add Course</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default NewCourseForm;