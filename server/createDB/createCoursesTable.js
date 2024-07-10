import mysql from 'mysql2';
import con from "./connection.js"

const courses = [
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
  },
  {
    "id": 3,
    "subject": "physics",
    "semester": 1,
    "lecturer_id": 1
  },
  {
    "id": 4,
    "subject": "chemistry",
    "semester": 1,
    "lecturer_id": 1
  },
  {
    "id": 5,
    "subject": "biology",
    "semester": 1,
    "lecturer_id": 1
  },
  {
    "id": 6,
    "subject": "english",
    "semester": 1,
    "lecturer_id": 1
  },
  {
    "id": 7,
    "subject": "history",
    "semester": 1,
    "lecturer_id": 1
  },
  {
    "id": 8,
    "subject": "geography",
    "semester": 1,
    "lecturer_id": 1
  },
  {
    "id": 9,
    "subject": "philosophy",
    "semester": 2,
    "lecturer_id": 1
  },
  {
    "id": 10,
    "subject": "psychology",
    "semester": 3,
    "lecturer_id": 1
  },
  {
    "id": 11,
    "subject": "sociology",
    "semester": 3,
    "lecturer_id": 1
  },
  {
    "id": 12,
    "subject": "art",
    "semester": 2,
    "lecturer_id": 1
  },
  {
    "id": 13,
    "subject": "torah",
    "semester": 2,
    "lecturer_id": 1
  },
  {
    "id": 14,
    "subject": "gym",
    "semester": 2,
    "lecturer_id": 1
  },
  {
    "id": 15,
    "subject": "japanees art",
    "semester": 3,
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

  