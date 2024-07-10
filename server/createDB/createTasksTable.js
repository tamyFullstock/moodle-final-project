import mysql from 'mysql2';
import con from "./connection.js"


const tasks = [
  { "id": 1, "student_id": 2, "hw_id": 1, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 2, "student_id": 3, "hw_id": 1, "completed": 1, "file_name": "hw_answers.pdf", "grade": 80 },
  { "id": 3, "student_id": 2, "hw_id": 2, "completed": 1, "file_name": "hw_answers.pdf", "grade": 90 },
  { "id": 4, "student_id": 3, "hw_id": 2, "completed": 1, "file_name": "hw_answers.pdf", "grade": 68 },
  { "id": 5, "student_id": 2, "hw_id": 3, "completed": 0, "file_name": "hw_answers.pdf", "grade": 38 },
  { "id": 6, "student_id": 3, "hw_id": 3, "completed": 0, "file_name": "hw_answers.pdf", "grade": 99 },
  { "id": 7, "student_id": 2, "hw_id": 4, "completed": 0, "file_name": "hw_answers.pdf", "grade": 67 },
  { "id": 8, "student_id": 3, "hw_id": 4, "completed": 0, "file_name": "hw_answers.pdf", "grade": 64 },
  { "id": 9, "student_id": 2, "hw_id": 5, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 10, "student_id": 2, "hw_id": 6, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 11, "student_id": 2, "hw_id": 7, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 12, "student_id": 2, "hw_id": 8, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 13, "student_id": 2, "hw_id": 9, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 14, "student_id": 2, "hw_id": 10, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 15, "student_id": 2, "hw_id": 11, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 16, "student_id": 2, "hw_id": 12, "completed": 0, "file_name": "hw_answers.pdf", "grade": 0 },
  { "id": 17, "student_id": 2, "hw_id": 13, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 18, "student_id": 2, "hw_id": 14, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 19, "student_id": 2, "hw_id": 15, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 20, "student_id": 2, "hw_id": 16, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 21, "student_id": 2, "hw_id": 17, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 22, "student_id": 2, "hw_id": 18, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 23, "student_id": 2, "hw_id": 19, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 24, "student_id": 2, "hw_id": 20, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 25, "student_id": 2, "hw_id": 21, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 26, "student_id": 2, "hw_id": 22, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 27, "student_id": 3, "hw_id": 5, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 28, "student_id": 3, "hw_id": 6, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 29, "student_id": 3, "hw_id": 7, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 30, "student_id": 3, "hw_id": 8, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 31, "student_id": 3, "hw_id": 9, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 32, "student_id": 3, "hw_id": 10, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 33, "student_id": 3, "hw_id": 11, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 34, "student_id": 3, "hw_id": 12, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 35, "student_id": 3, "hw_id": 13, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 36, "student_id": 3, "hw_id": 14, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 37, "student_id": 3, "hw_id": 15, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 38, "student_id": 3, "hw_id": 16, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 39, "student_id": 3, "hw_id": 17, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 40, "student_id": 3, "hw_id": 18, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 41, "student_id": 3, "hw_id": 19, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 42, "student_id": 3, "hw_id": 20, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 43, "student_id": 3, "hw_id": 21, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 44, "student_id": 3, "hw_id": 22, "completed": 0, "file_name": null, "grade": 0 },
  { "id": 45, "student_id": 7, "hw_id": 1, "completed": 1, "file_name": "hw_answers.pdf", "grade": 98 },
  { "id": 46, "student_id": 8, "hw_id": 1, "completed": 1, "file_name": "hw_answers.pdf", "grade": 78 },
  { "id": 47, "student_id": 9, "hw_id": 1, "completed": 1, "file_name": "hw_answers.pdf", "grade": 80 }
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
    grade INT,
    CONSTRAINT grade_check CHECK (grade BETWEEN 0 AND 100),
    CONSTRAINT HWC FOREIGN KEY(hw_id) REFERENCES homeworks(id),
    CONSTRAINT SIDC FOREIGN KEY(student_id) REFERENCES users(id))`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Tasks table created");
    });
    //insert data into tasks table
    for (let i = 0; i< tasks.length; i++){
      var sql = `INSERT INTO tasks (id, student_id, hw_id, completed, file_name, grade) 
                  VALUES 
                ('${tasks[i].id}','${tasks[i].student_id}', '${tasks[i].hw_id}', '${tasks[i].completed}', '${tasks[i].file_name}', '${tasks[i].grade}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`${i} record inserted with id: ${result.insertId}`);
    });
    }
    //print all data from tasks table
    con.query("SELECT * FROM tasks", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

export default createTasksTable;

  