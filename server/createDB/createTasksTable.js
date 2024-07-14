import mysql from 'mysql2';
import con from "./connection.js"


const tasks = [
  { "id": 1, "student_id": 2, "hw_id": 1, "completed": 0, "file_name": null, "grade": null },
  { "id": 2, "student_id": 3, "hw_id": 1, "completed": 1, "file_name": "hw_answers.pdf", "grade": 80 },
  { "id": 3, "student_id": 7, "hw_id": 1, "completed": 1, "file_name": "hw_answers.pdf", "grade": 90 },
  { "id": 4, "student_id": 8, "hw_id": 1, "completed": 1, "file_name": "hw_answers.pdf", "grade": 68 },
  { "id": 5, "student_id": 9, "hw_id": 1, "completed": 0, "file_name": null, "grade": null },

  { "id": 6, "student_id": 2, "hw_id": 2, "completed": 0, "file_name": null, "grade": null },
  { "id": 7, "student_id": 3, "hw_id": 2, "completed": 1, "file_name": "hw_answers.pdf", "grade": 80 },
  { "id": 8, "student_id": 7, "hw_id": 2, "completed": 1, "file_name": "hw_answers.pdf", "grade": 90 },
  { "id": 9, "student_id": 9, "hw_id": 2, "completed": 1, "file_name": "hw_answers.pdf", "grade": 68 },
  { "id": 10, "student_id": 8, "hw_id": 2, "completed": 0, "file_name": null, "grade": null },

  { "id": 11, "student_id": 2, "hw_id": 3, "completed": 1, "file_name": "hw_answers.pdf", "grade": 98 },
  { "id": 12, "student_id": 3, "hw_id": 3, "completed": 1, "file_name": "hw_answers.pdf", "grade": 86 },
  { "id": 13, "student_id": 7, "hw_id": 3, "completed": 0, "file_name": null, "grade": null },
  { "id": 14, "student_id": 8, "hw_id": 3, "completed": 1, "file_name": "hw_answers.pdf", "grade": 60 },
  { "id": 15, "student_id": 9, "hw_id": 3, "completed": 0, "file_name": null, "grade": null },
  
  { "id": 16, "student_id": 2, "hw_id": 4, "completed": 0, "file_name": null, "grade": null },
  { "id": 17, "student_id": 3, "hw_id": 4, "completed": 1, "file_name": "hw_answers.pdf", "grade": 80 },
  { "id": 18, "student_id": 7, "hw_id": 4, "completed": 1, "file_name": "hw_answers.pdf", "grade": 90 },
  { "id": 19, "student_id": 9, "hw_id": 4, "completed": 1, "file_name": "hw_answers.pdf", "grade": 68 },
  { "id": 20, "student_id": 8, "hw_id": 4, "completed": 0, "file_name": null, "grade": null },

  { "id": 21, "student_id": 2, "hw_id": 5, "completed": 0, "file_name": null, "grade": null },
  { "id": 22, "student_id": 3, "hw_id": 5, "completed": 1, "file_name": "hw_answers.pdf", "grade": 80 },
  { "id": 23, "student_id": 7, "hw_id": 5, "completed": 1, "file_name": "hw_answers.pdf", "grade": 90 },
  { "id": 24, "student_id": 9, "hw_id": 5, "completed": 1, "file_name": "hw_answers.pdf", "grade": 68 },
  { "id": 25, "student_id": 8, "hw_id": 5, "completed": 0, "file_name": null, "grade": null },

  { "id": 26, "student_id": 2, "hw_id": 6, "completed": 1, "file_name": "hw_answers.pdf", "grade": 87 },
  { "id": 27, "student_id": 3, "hw_id": 6, "completed": 1, "file_name": "hw_answers.pdf", "grade": 86 },
  { "id": 28, "student_id": 7, "hw_id": 6, "completed": 0, "file_name": null, "grade": null },
  { "id": 29, "student_id": 8, "hw_id": 6, "completed": 1, "file_name": "hw_answers.pdf", "grade": 60 },
  { "id": 30, "student_id": 9, "hw_id": 6, "completed": 0, "file_name": null, "grade": null },
  
  { "id": 31, "student_id": 2, "hw_id": 7, "completed": 0, "file_name": null, "grade": null },
  { "id": 32, "student_id": 3, "hw_id": 7, "completed": 1, "file_name": "hw_answers.pdf", "grade": 80 },
  { "id": 33, "student_id": 7, "hw_id": 7, "completed": 1, "file_name": "hw_answers.pdf", "grade": 90 },
  { "id": 34, "student_id": 9, "hw_id": 7, "completed": 1, "file_name": "hw_answers.pdf", "grade": 68 },
  { "id": 35, "student_id": 8, "hw_id": 7, "completed": 0, "file_name": null, "grade": null },

  { "id": 36, "student_id": 2, "hw_id": 8, "completed": 0, "file_name": null, "grade": null },
  { "id": 37, "student_id": 3, "hw_id": 8, "completed": 1, "file_name": "hw_answers.pdf", "grade": 90 },

  { "id": 38, "student_id": 2, "hw_id": 9, "completed": 0, "file_name": null, "grade": null },
  { "id": 39, "student_id": 3, "hw_id": 9, "completed": 1, "file_name": "hw_answers.pdf", "grade": 90 },

  { "id": 40, "student_id": 2, "hw_id": 10, "completed": 1, "file_name": "hw_answers.pdf", "grade": 89 },
  { "id": 41, "student_id": 3, "hw_id": 10, "completed": 1, "file_name": "hw_answers.pdf", "grade": 90 },
  
];

const createTasksTable = function(){
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    //create table todos
    var sql = `CREATE TABLE IF NOT EXISTS tasks 
    (id INT PRIMARY KEY AUTO_INCREMENT 
    ,student_id INT, 
    hw_id INT,
    completed BOOLEAN, 
    file_name VARCHAR(255),
    grade INT NULL,
    CONSTRAINT grade_check CHECK (grade BETWEEN 0 AND 100),
    CONSTRAINT HWC FOREIGN KEY(hw_id) REFERENCES homeworks(id),
    CONSTRAINT SIDC FOREIGN KEY(student_id) REFERENCES users(id))`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Tasks table created");
    });
    //insert data into tasks table
    tasks.forEach(task => {
      var sql = `INSERT INTO tasks (id, student_id, hw_id, completed, file_name, grade) 
                VALUES (?, ?, ?, ?, ?, ?)`;
      con.query(sql, [
        task.id,
        task.student_id,
        task.hw_id,
        task.completed,
        task.file_name,
        task.grade
      ], function (err, result) {
        if (err) throw err;
        console.log(`Record inserted with id: ${result.insertId}`);
      });
    });
    //print all data from tasks table
    con.query("SELECT * FROM tasks", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

export default createTasksTable;

  