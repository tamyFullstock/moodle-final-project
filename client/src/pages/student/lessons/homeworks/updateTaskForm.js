import React, { useState } from 'react';
import Globals from '../../../../Globals.js';
import '../../../../style/pages/lecturer/courses/newCourseForm.css';

function UpdateTaskForm({ onClose, task, setTasks }) {
  const port = Globals.PORT_SERVER;
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to handle file upload for a task
  const handleUpdateTask = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('taskFile', file);
    formData.append('student_id', task.student_id);
    formData.append('hw_id', task.hw_id);
    formData.append('completed', 1);
    formData.append('grade', task.grade);
    try {
      const response = await fetch(`http://localhost:${port}/tasks/${task.id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include', // This ensures that cookies are sent with the request
      });

      if (!response.ok) {
        // Enhanced error handling
        const errorText = await response.text();
        throw new Error(`Error uploading file: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const updatedTask = await response.json();
      setTasks(tasks => tasks.map(t => (t.id === task.id ? {...t, file_name: updatedTask.file_name, completed: true} : t))); // Update the task in the state
      onClose();
    } catch (err) {
      console.error('Error in handleUpdateTask:', err.message, err.stack);
    }
  };

  return (
    <div className="new-item-form">
      <h2>Complete Hw</h2>
      <label htmlFor="taskFile">File:</label>
      <input
        type="file"
        id="taskFile"
        onChange={handleFileChange}
      />
      
      <div className="buttons">
        <button onClick={handleUpdateTask}>Update Homework</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default UpdateTaskForm;