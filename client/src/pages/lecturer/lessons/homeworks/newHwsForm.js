import React, { useState } from 'react';
import Globals from '../../../../Globals.js';
import { useParams } from 'react-router-dom';
import '../../../../style/pages/lecturer/courses/newCourseForm.css';
import showErrorMessage from '../../../../helpers/alertMessage.js';

function NewHwForm({ onClose, onAddHw }) {
  const [description, setDescription] = useState('');
  const { lessonId } = useParams();
  const port = Globals.PORT_SERVER;
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddHw = async () => {
    const formData = new FormData();
    formData.append('hwFile', file);
    formData.append('lesson_id', lessonId);
    formData.append('description', description);

    try {
      const response = await fetch(`http://localhost:${port}/homeworks`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data);
      }
      const newHwData = await response.json();
      onAddHw(newHwData);
      onClose();
    } catch (error) {
      console.error(error);
      showErrorMessage(error.message);
    }
  };

  return (
    <div className="new-item-form">
      <h2>Add New Hw</h2>
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
        <button onClick={handleAddHw}>Add Homework</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default NewHwForm;