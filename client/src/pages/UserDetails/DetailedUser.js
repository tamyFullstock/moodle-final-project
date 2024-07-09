import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import UpdateUser from './components/UpdateUser.js';
import '../../style/pages/DetailedUser.css';
import Globals from '../../Globals.js';

const DetailedUser = () => {
  const port = Globals.PORT_SERVER;
  const { studentId } = useParams(); // The student the lecturer sees its details
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // Check if it is the user itself looking for its details or its lecturer
  const observer = searchParams.get('observer') ?? 'nonself';

  // Get user from local storage or fetch user details
  useEffect(() => {
    const fetchUserData = async () => {
      if (observer === 'self') {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        setIsLoading(false);
      } else {
        try {
          const response = await fetch(`http://localhost:${port}/users/${studentId}`);
          if (!response.ok) {
            throw new Error(`Error getting details of user with ID ${studentId}`);
          }
          const student = await response.json();
          setUser(student);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [observer, port, studentId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Actions after updating a user in the server successfully
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <>
      {isLoading && <div className='user-details-container'>Loading..</div>}
      {!isLoading && (
        <div className="user-details-container">
          <h2>User Details</h2>
          <div className="user-details">
            {user.photo && (
              <div className="user-photo-container">
                <img src={`http://localhost:${port}/user/photos/${user.photo}`} alt="User Photo" className="user-photo" />
              </div>
            )}
            <p><strong>First Name:</strong> {user.first_name}</p>
            <p><strong>Last Name:</strong> {user.last_name}</p>
            <p><strong>TZ:</strong> {user.tz}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Type:</strong> {user.type}</p>
            {observer === 'self' && (
              <div className='update-button-container'>
                <button onClick={handleEditClick}>Update Details</button>
              </div>
            )}
            {observer === 'nonself' && (
              <div className='update-button-container'>
                <button onClick={() => { navigate(-1); }}>Back</button>
              </div>
            )}
          </div>
          {isEditing && <UpdateUser user={user} onUpdate={handleUserUpdate} onClose={() => setIsEditing(false)} />}
        </div>
      )}
    </>
  );
};

export default DetailedUser;