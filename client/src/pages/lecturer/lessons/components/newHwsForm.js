import React, { useState, useEffect } from 'react';
import Globals from '../../../../Globals.js';
import {useParams } from 'react-router-dom';
import '../../../../style/pages/lecturer/courses/newCourseForm.css'
import showErrorMessage from '../../../../helpers/alertMessage.js';

//add/update hw form 
function NewHwForm({ onClose, type, hwToUpdate, homeworkList, setHomeworkList}) {

  //values of new hw
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');
  const [typeStr, setTypeStr] = useState('Add');  //show in scrren: add or update a hw
  const { lessonId } = useParams(); // Extract lessonId of all lessons from the URL
  const port = Globals.PORT_SERVER; //prt of server
  
   //add hw in the client side
   const onAddHw = (newHw) => {
    setHomeworkList([...homeworkList, newHw])
  };

    //update hw in the client side
    const onUpdateHw = (updatedHw) => {
    // Find the index of the homework item to update
    const hwIndex = homeworkList.findIndex(hw => hw.id === updatedHw.id);
    // If the homework item is found, create a new list with the updated homework item
    if (hwIndex !== -1) {
      const updatedHomeworkList = [
        ...homeworkList.slice(0, hwIndex),
        updatedHw,
        ...homeworkList.slice(hwIndex + 1)
      ];
      // Update the state with the new homework list
      setHomeworkList(updatedHomeworkList);
    }
  };

  //make a new hw from the fileds. using post http request
  const handleAddHw = async () => {
    const newHw = {
      lesson_id: parseInt(lessonId),
      file_url: fileUrl,
      description: description
    };

    try {
      const response = await fetch(`http://localhost:${port}/homeworks`, {
        method: 'POST',
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
        throw new Error("error while trying adding new homework");
      }
      //hw has been added successfully:
      const newHwData = await response.json(); //post a hw return the new course with its new id
      onAddHw(newHwData); // Notify parent component (detailedHw) about the new hw
      //reset the fields??
      onClose(); //close the component
    } catch (error) {
      console.error(error);
      showErrorMessage(error.message)
    }
  };

  //make a new hw from the fileds. using put http request
  const handleUpdateHw = async () => {
    const newHw = {
      lesson_id: parseInt(lessonId),
      file_url: fileUrl,
      description: description
    };

    try {
      const response = await fetch(`http://localhost:${port}/homeworks/${hwToUpdate.id}`, {
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
        throw new Error(`error while trying updating homework with ID = ${hwToUpdate.id}`);
      }
      //hw has been added successfully:
      const newHwData = await response.json(); //post a hw return the new course with its new id
      onUpdateHw(newHwData); // Notify parent component (detailedHw) about the new hw
      onClose(); //close the component
    } catch (error) {
      console.error(error);
      showErrorMessage(error.message)
    }
  };

  //if we update a hw, initialize the fields to the previous hw values 
  useEffect(()=>{
    if(type === 'update'){
      setFileUrl(hwToUpdate.file_url);
      setDescription(hwToUpdate.description)
      setTypeStr("Update");
    }
    else{
      setTypeStr("Add");
    }
  }, [type, hwToUpdate])

  return (
    <div className="new-item-form">
      {/*if type is update: Update hw, id adding type: add new hw */}
      <h2>{typeStr} {type == "update" ? "" : "New"} Hw</h2>
      <label htmlFor="file-url">File-url:</label>
      <input
        type="text"
        id="fileUrl"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
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
          if(type=="update")
          {handleUpdateHw()}
          else
          {handleAddHw()}}}>{typeStr} Homework</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default NewHwForm;