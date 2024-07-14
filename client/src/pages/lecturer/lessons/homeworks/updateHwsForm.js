import React, { useState, useEffect } from 'react';
import Globals from '../../../../Globals.js';
import { useParams } from 'react-router-dom';
import '../../../../style/pages/lecturer/courses/newCourseForm.css';
import showErrorMessage from '../../../../helpers/alertMessage.js';

function UpdateHwForm({ onClose, hwToUpdate, setHomework }) {
  const { homeworkId } = useParams();
  const { lessonId } = useParams();
  const [description, setDescription] = useState('');
  const port = Globals.PORT_SERVER;
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdateHw = async () => {
    const formData = new FormData();
    formData.append('hwFile', file);
    formData.append('description', description);
    formData.append('lesson_id', lessonId);

    try {
      const response = await fetch(`http://localhost:${port}/homeworks/${homeworkId}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include', // Ensures cookies are sent with the request
      });

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data);
      }
      const newHwData = await response.json();
      setHomework(newHwData);
      onClose();
    } catch (error) {
      console.error(error);
      showErrorMessage(error.message);
    }
  };

  useEffect(() => {
    setDescription(hwToUpdate.description);
  }, [hwToUpdate]);

  return (
    <div className="new-item-form">
      <h2>Update Hw</h2>
      <label htmlFor="hwFile">File:</label>
      <input
        type="file"
        id="hwFile"
        onChange={handleFileChange}
      />
      <label htmlFor="description">Description:</label>
      <input
        type="text"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="buttons">
        <button onClick={handleUpdateHw}>Update Homework</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default UpdateHwForm;