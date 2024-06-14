import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import Globals from '../../../Globals.js';
import '../../../style/pages/lecturer/detailedCard.css'
import NewStudentForm from './components/newCoursePForm.js';

function CourseDetails() {
  const user = JSON.parse(localStorage.getItem('user') ?? '{}'); //get current user from ls
  const { courseId } = useParams(); // Extract courseId from the URL
  const location = useLocation();
  const search = location.state?.search || ""; //use it to maintain params between pages
  const port = Globals.PORT_SERVER; // Port of the server
  const [courseDetails, setCourseDetails] = useState(null); // Details of the course
  const [studentsList, setStudentsList] = useState([]); // List of students
  const [isLoading, setIsLoading] = useState(true); // Still not get the data yet
  const [showNewStudentForm, setShowNewStudentForm] = useState(false); // State to control form visibility (make a new student)
  
  useEffect(() => {
    async function getCourseDetails() {
      //get the current course from server with its students
      try {
        //get details of current course
        const response = await fetch(`http://localhost:${port}/courses/${courseId}`);
        const course = await response.json();
        if (!response.ok) {
          throw new Error(`Error getting details for course with ID ${courseId}`);
        }
        setCourseDetails(course);

        //get all students of current course - now as objects of a course id, with student id,
        const csPResponse = await fetch(`http://localhost:${port}/coursesP?course=${courseId}`);
        if (!csPResponse.ok) {
          throw new Error(`Error getting students for course with ID ${courseId}`);
        }
        const coursesP = await csPResponse.json();
        const studentsIdList = coursesP.map(cp=>cp.student_id);

        // Fetch student details for each student ID. make a list of objects with usernames and id
        const studentDetailsPromises = studentsIdList.map(studentId =>
          fetch(`http://localhost:${port}/users/${studentId}`).then(response => response.json())
          .then(data=>{
            return {id: studentId,
                    student_name: `${data.first_name} ${data.last_name}`}})
        );
        const studentsDetailsList = await Promise.all(studentDetailsPromises);
        setStudentsList(studentsDetailsList);

      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getCourseDetails();
  }, [courseId, port]);

  //delete a student using its id //fetch from courseP using user=&course=. get the id and make another fetch to delete the id.
  async function deleteStudent(stId) {
    try {
      //get the id of object courseParticipant of the course and studnet
      const response = await fetch(`http://localhost:8080/coursesP?course=${courseId}&student=${stId}`, {method: 'GET'});
      if (!response.ok) {
        throw new Error(`Error while trying remove student with ID ${stId} from course with ID ${courseId}`);
      }
      const coursePData = await response.json();  
      const coursePId = coursePData[0].id;
      //delete the courseParticipant object from server
      const delResponse = await fetch(`http://localhost:8080/coursesP/${coursePId}`, {method: 'DELETE'});
      if (!delResponse.ok) {
        throw new Error(`Error while trying remove student with ID ${stId} from course with ID ${courseId}`);
      }
      //delete the student in client side
      setStudentsList(prevStudentsList => prevStudentsList.filter(student => student.id !== stId));
    } catch (err) {
      console.log(err);
    }
  }

  // Function to handle adding new student to course
  const handleAddStudent = (newStudent) => {
    const newS = {id: newStudent.id, student_name: `${newStudent.first_name} ${newStudent.last_name}`}
    //add the new student to the list of students. instead of making new fetch from server
    setStudentsList([...studentsList, newS ])
  };
  
  return (
    <div className="item-details-first-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className = "item-details-second-container">
            {!showNewStudentForm && <div>
                <h2>{courseDetails.subject}</h2>
                <p><strong>Course ID:</strong> {courseDetails.id}</p>
                <p><strong>Lecturer:</strong> {`${user.first_name} ${user.last_name}`}</p>
                <p><strong>Semester:</strong> {courseDetails.semester}</p>
                <h3>Students</h3>
                <ul>
                    {studentsList.map(st => (
                    <li key={st.id}>
                        <p>{st.student_name}</p>
                        <button className="delete-button" onClick={() => deleteStudent(st.id)}>Remove Student</button>
                        <button className="update-button" onClick={() => {}}>Student Details</button>
                    </li>
                    ))}
                </ul>
                <button className="add-item-button" onClick = {()=>{setShowNewStudentForm(true)}}>Add Student</button>
                <Link to={`../?${search}`}>
                    <button className="back-button1">Back to Courses</button>
                </Link>
            </div>}
            {showNewStudentForm &&
              <div className="modal-overlay">
                <div className="modal-content">
                 {/* add student to the course */}
                  {<NewStudentForm
                    onClose={() => setShowNewStudentForm(false)}
                    onAddStudent = {handleAddStudent}
                  />}
                </div>
              </div>
            }
        </div>
      )}
    </div>
  );
}

export default CourseDetails;