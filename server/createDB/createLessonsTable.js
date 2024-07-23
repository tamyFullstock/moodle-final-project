import mysql from 'mysql2';
import con from "./connection.js"


const lessons=[
    {
        "id": 1,
        "title": "the secrets of math",
        "year": 2021,
        "month": 12, 
        "day": 3,
        "hour": 13,
        "course_id": 1,
        "video_name": 'vector.mp4'
    },
    {
        "id": 2,
        "title": "functions",
        "year": 2021,
        "month": 11, 
        "day": 5,
        "hour": 9,
        "course_id": 1,
        "video_name": 'vector1.mp4'
  },
  {
      "id": 3,
      "title": "computers communication",
      "year": 2022,
      "month": 12, 
      "day": 3,
      "hour": 11,
      "course_id": 2,
      "video_name": 'vector2.mp4'
  },
  {
    "id": 4,
    "title": "vectors part 1",
    "year": 2021,
    "month": 12, 
    "day": 1,
    "hour": 15,
    "course_id": 1,
    "video_name": 'vector3.mp4'
},
{
    "id": 5,
    "title": "vectors part 2",
    "year": 2021,
    "month": 10, 
    "day": 5,
    "hour": 9,
    "course_id": 1,
    "video_name": 'vector4.mp4'
},
{
  "id": 6,
  "title": "heap algorithms",
  "year": 2022,
  "month": 12, 
  "day": 3,
  "hour": 11,
  "course_id": 1,
  "video_name": 'vector5.mp4'
},
{
  "id": 7,
  "title": "list algorithms",
  "year": 2020,
  "month": 9, 
  "day": 3,
  "hour": 8,
  "course_id": 1,
  "video_name": 'vector6.mp4'
},
{
  "id": 8,
  "title": "squares areas",
  "year": 2020,
  "month": 12, 
  "day": 3,
  "hour": 11,
  "course_id": 1,
  "video_name": 'vector7.mp4'
}
   
];

const createLessonsTable = function(){
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    //create table lessons
    var sql = `CREATE TABLE IF NOT EXISTS lessons 
    (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255),
      year INT,
      month INT,
      day INT,
      hour INT,
      course_id INT,
      video_name VARCHAR(255),
      CONSTRAINT CIDC FOREIGN KEY (course_id) REFERENCES courses(id),
      CONSTRAINT DC CHECK (day <= 31 AND day >= 1 AND hour >= 0 AND hour <= 24 AND month >= 1 AND month <= 12 AND year >= 0)
      )`;
      con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Lessons table created");
    });
    // Insert data into lessons table
    lessons.forEach(lesson => {
      var sql = `INSERT INTO lessons (id, title, year, month, day, hour, course_id, video_name) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      con.query(sql, [
        lesson.id,
        lesson.title,
        lesson.year,
        lesson.month,
        lesson.day,
        lesson.hour,
        lesson.course_id,
        lesson.video_name
      ], function (err, result) {
        if (err) throw err;
        console.log(`Record inserted with id: ${result.insertId}`);
      });
    });
    //print all data from lessons table
    con.query("SELECT * FROM lessons", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

export default createLessonsTable;

  