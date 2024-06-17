import React, { useState, useEffect } from 'react';
import UpdateUser from './components/UpdateUser.js'
import '../../style/pages/DetailedUser.css';

const DetailedUser = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  //get user from local storage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  //actions after update a user in server succesfully
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="user-details-container">
      <h2>User Details</h2>
      <div className="user-details">
        <p><strong>First Name:</strong> {user.first_name}</p>
        <p><strong>Last Name:</strong> {user.last_name}</p>
        <p><strong>TZ:</strong> {user.tz}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Type:</strong> {user.type}</p>
        <div className='update-button-container'>
          <button onClick={handleEditClick}>Update User</button>
        </div>
      </div>
      {isEditing && <UpdateUser user={user} onUpdate={handleUserUpdate} onClose={() => setIsEditing(false)} />}
    </div>
  );
};

export default DetailedUser;