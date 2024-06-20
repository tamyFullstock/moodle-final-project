import React, { useState, useEffect } from 'react';
import Globals from '../../../../Globals.js';
import {useParams } from 'react-router-dom';
import '../../../../style/pages/lecturer/courses/newCourseForm.css'
import showErrorMessage from '../../../../helpers/alertMessage.js';

//update hw form 
function UpdateHwForm({ onClose, hwToUpdate, setHomework}) {
  const {homeworkId} = useParams();
  //values of new hw
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const { lessonId } = useParams(); // Extract lessonId of all lessons from the URL

  const port = Globals.PORT_SERVER; //prt of server

  //make a new hw from the fileds. using put http request
  const handleUpdateHw = async () => {
    const newHw = {
      lesson_id: parseInt(lessonId),
      file_name: fileName,
      description: description
    };

    try {
      const response = await fetch(`http://localhost:${port}/homeworks/${homeworkId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newHw),
      });

      if (!response.ok) {
        if (response.status === 400) { //not valid user fields
          const data = await response.text();
          throw new Error(data);
        }
        const data = await response.json();
        console.log(data.message)
        throw new Error(`error while trying updating homework with ID = ${homeworkId}`);
      }
      //hw has been added successfully:
      const newHwData = await response.json(); //post a hw return the new course with its new id
      setHomework(newHwData); //set the homework in the parent page to the new hw
      onClose(); //close the component
    } catch (error) {
      console.error(error);
      showErrorMessage(error.message)
    }
};

//if we update a hw, initialize the fields to the previous hw values 
useEffect(()=>{
      setFileName(hwToUpdate.file_name);
      setDescription(hwToUpdate.description)
 }, [homeworkId])

  return (
    <div className="new-item-form">
      <h2>Update Hw</h2>
      <label htmlFor="file-url">File-url:</label>
      <input
        type="text"
        id="fileName"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <label htmlFor="description">Description:</label>
      <input
        type="text"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="buttons">
        <button onClick={()=>{
          handleUpdateHw()}}>Update Homework</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default UpdateHwForm;