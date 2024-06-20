import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import Globals from '../../../Globals.js';
import '../../../style/pages/lecturer/detailedCard.css';
import NewHwForm from './homeworks/newHwsForm.js';

//show lesson details with its homework. 
//user can click hw to see the students hw states
function LessonDetails() {
  const { lessonId } = useParams(); // Extract lessonId from the URL
  const location = useLocation();
  const search = location.state?.search || ""; // Use it to maintain params between pages
  const port = Globals.PORT_SERVER; // Port of the server
  const [lessonDetails, setLessonDetails] = useState(null); // Details of the lesson
  const [homeworkList, setHomeworkList] = useState([]); // List of homework
  const [isLoading, setIsLoading] = useState(true); // Still not get the data yet
  const [showNewHwForm, setShowNewHwForm] = useState(false); // State to control form visibility (make a new hw)

  useEffect(() => {
    async function getLessonDetails() {
      // Get the current lesson from server
      try {
        const response = await fetch(`http://localhost:${port}/lessons/${lessonId}`);
        if (!response.ok) {
          throw new Error(`Error getting details for lesson with ID ${lessonId}`);
        }
        const lesson = await response.json();
        setLessonDetails(lesson);
        // Get all hws of current lesson
        const hwResponse = await fetch(`http://localhost:${port}/homeworks?lesson=${lessonId}`);
        if (!hwResponse.ok) {
          throw new Error(`Error getting homework for lesson with ID ${lessonId}`);
        }
        const homework = await hwResponse.json();
        setHomeworkList(homework);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getLessonDetails();
  }, [lessonId, port]);

   //add hw in the client side
   const handleAddHw= (newHw) => {
    setHomeworkList([...homeworkList, newHw])
  };


  return (
    <div className="item-details-first-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="item-details-second-container">
          {!showNewHwForm && (
            <div>
              <h2>{lessonDetails.title}</h2>
              <p><strong>Lesson ID:</strong> {lessonDetails.id}</p>
              <p><strong>Date:</strong> {new Date(lessonDetails.year, lessonDetails.month - 1, lessonDetails.day, lessonDetails.hour).toLocaleString()}</p>
              <h3>Homework</h3>
              <ul>
                {homeworkList.map(hw => (
                  <li key={hw.id}>
                    <p>{hw.description}</p>
                    <Link to={`./homework/${hw.id}`}>
                      <button className="show-details-button">Show Details</button>
                    </Link>
                  </li>
                ))}
              </ul>
              <button className="add-item-button" onClick={()=>{setShowNewHwForm(true)}}>Add Homework</button>
              <Link to={`../?${search}`}>
                <button className="back-button1">Back to Lessons</button>
              </Link>
            </div>
          )}
          {showNewHwForm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <NewHwForm
                  onClose={() => setShowNewHwForm(false)}
                  onAddHw={handleAddHw}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LessonDetails;
