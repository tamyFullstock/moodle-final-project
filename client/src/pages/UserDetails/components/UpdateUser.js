import React, { useState } from 'react';
import '../../../style/pages/DetailedUser.css'
import Globals from '../../../Globals';
import showErrorMessage from '../../../helpers/alertMessage';

const UpdateUser = ({ user, onUpdate, onClose }) => {
  const port = Globals.PORT_SERVER;
  //fields of user
  const [formData, setFormData] = useState({
    id: user.id,
    tz: user.tz,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    address: user.address,
    phone: user.phone,
    type: user.type
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      // Update the user on the server
      const response = await fetch(`http://localhost:${port}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (!response.ok) {
        if(response.status == "400"){ //not valid user input in fields
          const data = await response.json();
          throw new Error(data.message);
        }
        const data = await response.json();
        console.log(data.message)
        throw new Error('Error updating new student');
      }
      //succeed to update the use - save him (also in local storage by the parent)
      const updatedUser = await response.json();
      onUpdate(updatedUser);
    }
    catch(error) {
      console.error('Error updating user:', error);
      showErrorMessage("error while updating user")
    };
  };

  return (
    <div className="modal-overlay-user">
      <div className="modal-content-user">
        <h2>Update User</h2>
        <form onSubmit={handleSubmit}>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <div className="buttons">
            <button type="submit" onClick={handleSubmit}>Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;