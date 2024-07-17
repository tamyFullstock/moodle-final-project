import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Globals from '../../../../Globals.js';
import '../../../../style/pages/items/newItemForm.css'
import showErrorMessage from '../../../../helpers/alertMessage.js';

//make a new student form component
//onClose: function close the form component
//onAddStudent: function to make when student has been added (courseP)
function NewStudentForm({ onClose, onAddStudent }) {
  const { courseId } = useParams(); // Extract courseId from the URL
  const [studentId, setStudentId] = useState(''); //studentId to add to course
  const port = Globals.PORT_SERVER;

  //add student usign post request
  const handleAddStudent = async () => {
    const newCourseP = {
      course_id: courseId,
      user_id: studentId 
    };

    try {
      const response = await fetch(`http://localhost:${port}/coursesP`, {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCourseP),
      });

      if (!response.ok) {
        if(response.status == "400"){ //not valid user input in fields
          const data = await response.json();
          throw new Error(data.message);
        }
        const data = await response.json();
        console.log(data.message)
        throw new Error('Error adding new student');
      }
      //student has been added successfully to the course
      const newStudentData = await response.json();  //post a courseP return the details of the new student added to the course
      onAddStudent(newStudentData); // Notify parent component (LecturerCourses) about the new student
      onClose(); // Close the form
    } catch (error) {
      console.error(error);
      showErrorMessage(error.message);
    }
  };

  return (
    <div className="new-item-form">
      <h2>Add New Studet to The Course</h2>
      <label htmlFor="studentId">Student Id:</label>
      <input
        type="number"
        id="semester"
        min= "10000000"
        max= "1000000000"
        onChange={(e) => setStudentId(e.target.value)}
      />
      <div className="buttons">
        <button onClick={handleAddStudent}>Add Student</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default NewStudentForm;