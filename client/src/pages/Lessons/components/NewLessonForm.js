import React, { useState } from 'react';
import Globals from '../../../Globals.js';
import {useParams } from 'react-router-dom';
import '../../../style/pages/items/newItemForm.css'
import showErrorMessage from '../../../helpers/alertMessage.js';

//add lesson form to a course
function NewLessonForm({ onClose, onAddLesson}) {
  //values of new lesson
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const { courseId } = useParams(); // Extract courseId of all lessons from the URL
  const maxYear = new Date().getFullYear(); //max year to create a lesson is now

  const port = Globals.PORT_SERVER; //prt of server

  //make a new lesson from the fileds. using post http request
  const handleAddLesson = async () => {
    const newLesson = {
      title,
      year: parseInt(year),
      month: parseInt(month),
      day: parseInt(day),
      hour: parseInt(hour),
      course_id: parseInt(courseId),
    };

    try {
      const response = await fetch(`http://localhost:${port}/lessons`, {
        method: 'POST',
        credentials: 'include', // Ensures cookies are sent with the request
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLesson),
      });

      if (!response.ok) {
        if (response.status === 400) { //not valid user fields
          const data = await response.text();
          throw new Error(data);
        }
        const data = await response.json();
        console.log(data.message)
        throw new Error("error while trying adding new lesson");
      }
      //lesson has been added successfully:
      const newLessonData = await response.json(); //post a course return the new course with its new id
      newLessonData.Date = new Date(year, month - 1, day, hour).toLocaleString(); //add format date to the lesson
      onAddLesson(newLessonData); // Notify parent component (LecturerCourses) about the new course
      //reset the fields??
      onClose(); //close the component
    } catch (error) {
      console.error(error);
      showErrorMessage(error.message)
    }
  };

  return (
    <div className="new-item-form">
      <h2>Add New Lesson</h2>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label htmlFor="year">Year:</label>
      <input
        type="number"
        id="year"
        value={year}
        min="2000"
        max = {maxYear}
        onChange={(e) => setYear(e.target.value)}
      />
      <label htmlFor="month">Month:</label>
      <input
        type="number"
        id="month"
        value={month}
        min="1"
        max="12"
        onChange={(e) => setMonth(e.target.value)}
      />
      <label htmlFor="day">Day:</label>
      <input
        type="number"
        id="day"
        value={day}
        min="1"
        max="31"
        onChange={(e) => setDay(e.target.value)}
      />
      <label htmlFor="hour">Hour:</label>
      <input
        type="number"
        id="hour"
        value={hour}
        min="0"
        max="24"
        onChange={(e) => setHour(e.target.value)}
      />
      <div className="buttons">
        <button onClick={handleAddLesson}>Add Lesson</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default NewLessonForm;