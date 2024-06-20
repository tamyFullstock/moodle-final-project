import React, {useState} from 'react'
import Globals from '../../../../../Globals';
function SingleStudentsTasks({student, editingGrade, setEditingGrade, handleGradeSubmit}) {
  const port = Globals.PORT_SERVER;

  // Function to open the file URL
  const openFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <li key={student.id} className={student.completed === 1 ? 'completed' : 'not-completed'}>
        {student.student_name} {student.completed === 1 ? '✔️' : '❌'}
        {student.file_name && (
        <button className="file-button" onClick={() => openFile(student.file_name)}>Open File</button>
        )}
        {/*an input field for updating grade. show only for the task been upadted */}
        {editingGrade === student.taskId ? 
        (
          <div className="grade-input-container">
            <input
              type="number"
              defaultValue={student.grade}
              onKeyDown={e => { //submit the grade
                if (e.key === 'Enter') {
                    handleGradeSubmit(student.taskId, e.target.value);
                } else if (e.key === 'Escape') {
                    setEditingGrade(null);
                }
              }}
              autoFocus
            />
            <button onClick={() => setEditingGrade(null)}>X</button> 
          </div>
        ) : (
          <button className="grade-button" onClick={() => setEditingGrade(student.taskId)}>Grade</button>
      )}
    </li>
  )
}

export default SingleStudentsTasks