import React, { useState } from 'react';
import '../../../style/pages/DetailedUser.css'
import Globals from '../../../Globals';
import showErrorMessage from '../../../helpers/alertMessage';

const UpdateUser = ({ user, onUpdate, onClose }) => {
  const port = Globals.PORT_SERVER;
  // Fields of user
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

  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const formDataToSubmit = new FormData();
      for (const key in formData) {
        formDataToSubmit.append(key, formData[key]);
      }
      if (photo) {
        formDataToSubmit.append('userPhoto', photo);
      }

      // Update the user on the server
      const response = await fetch(`http://localhost:${port}/users/${user.id}`, {
        method: 'PUT',
        credentials: 'include', // Ensures cookies are sent with the request
        body: formDataToSubmit
      });

      if (!response.ok) {
        if (response.status === 400) { // Not valid user input in fields
          const data = await response.json();
          throw new Error(data.message);
        }
        const data = await response.json();
        console.log(data.message);
        throw new Error('Error updating new student');
      }

      // Succeeded to update the user - save him (also in local storage by the parent)
      const updatedUser = await response.json();
      console.log(updatedUser)
      onUpdate(updatedUser);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      showErrorMessage("error while updating user");
    }
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
          <label>Upload Photo:</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="buttons">
            <button type="button" onClick={handleSubmit}>Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;