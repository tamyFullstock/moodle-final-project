import mysql from 'mysql2';
import con from "./connection.js"


const tasks=[
    {
        "id": 1,
        "student_id": 2,
        "hw_id": 1,
        "completed": 0,
        "file_name": null,
        "grade": 0
    },
    {
      "id": 2,
      "student_id": 3,
      "hw_id": 1,
      "completed": 1,
      "file_name": "https://www.math.cmu.edu/~jmackey/151_128/bws_book.pdf",
      "grade": 80
    },
    {
      "id": 3,
      "student_id": 2,
      "hw_id": 2,
      "completed": 1,
      "file_name": "https://www.math.cmu.edu/~jmackey/151_128/bws_book.pdf",
      "grade": 90
  },
  {
    "id": 4,
    "student_id": 3,
    "hw_id": 2,
    "completed": 0,
    "file_name": "https://www.math.cmu.edu/~jmackey/151_128/bws_book.pdf",
    "grade" : 68
  }
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

  