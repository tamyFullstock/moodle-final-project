import mysql from 'mysql2';
import con from "./connection.js"

const courses=[
    {
        "id": 1,
        "subject": "mathematic",
        "semester": 1,
        "lecturer_id": 1
   },
   {
    "id": 2,
    "subject": "computer science",
    "semester": 1,
    "lecturer_id": 1
  }
    
  
];

const createCoursesTable = function(){
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    //create table courses
    var sql = `CREATE TABLE IF NOT EXISTS courses (id INT PRIMARY KEY AUTO_INCREMENT ,subject VARCHAR(255) ,semester INT, lecturer_id INT, FOREIGN KEY(lecturer_id) REFERENCES users(id))`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Courses table created");
    });
    //insert data into todos table
    for (let i = 0; i< courses.length; i++){
      var sql = `INSERT INTO courses (id, subject, semester, lecturer_id) VALUES ('${courses[i].id}','${courses[i].subject}','${courses[i].semester}','${courses[i].lecturer_id}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`${i} record inserted with id: ${result.insertId}`);
    });
    }
    //print all data from courses table
    con.query("SELECT * FROM courses", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

export default createCoursesTable;

  