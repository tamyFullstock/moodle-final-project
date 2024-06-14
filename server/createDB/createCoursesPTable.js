import mysql from 'mysql2';
import con from "./connection.js"

const courses_participants=[
    {
        "id": 1,
        "course_id": 1,
        "student_id": 2
   },
   {
        "id": 2,
        "course_id": 1,
        "student_id": 3
  },
  {
      "id": 3,
      "course_id": 2,
      "student_id": 2
  }
];

const createCoursesPTable = function(){
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    //create table courses
    var sql = `CREATE TABLE IF NOT EXISTS coursesP (id INT PRIMARY KEY AUTO_INCREMENT, course_id INT, student_id INT,
      CONSTRAINT CC FOREIGN KEY(course_id) REFERENCES courses(id),
      CONSTRAINT SC FOREIGN KEY(student_id) REFERENCES users(id))`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("CoursesP table created");
    });
    //insert data into coursesP table
    for (let i = 0; i< courses_participants.length; i++){
      var sql = `INSERT INTO coursesP (id, course_id, student_id) VALUES ('${courses_participants[i].id}','${courses_participants[i].course_id}','${courses_participants[i].student_id}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`${i} record inserted with id: ${result.insertId}`);
    });
    }
    //print all data from coursesP table
    con.query("SELECT * FROM coursesP", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

export default createCoursesPTable;

  