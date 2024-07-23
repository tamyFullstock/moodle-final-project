import mysql from 'mysql2';
import con from "./connection.js"

const homeworks = [
  { "id": 1, "lesson_id": 1, "file_name": 'a.pdf', "description": "the history of the mathematics" },
  { "id": 2, "lesson_id": 1, "file_name": 'b.pdf', "description": "science and high-tech" },
  { "id": 3, "lesson_id": 2, "file_name": 'c.pdf', "description": "computers communication basics" },
  { "id": 4, "lesson_id": 2, "file_name": 'd.pdf', "description": "advanced communication" },
  { "id": 5, "lesson_id": 4, "file_name": 'e.pdf', "description": "network protocols" },
  { "id": 6, "lesson_id": 4, "file_name": 'f.pdf', "description": "vectors in physics" },
  { "id": 7, "lesson_id": 4, "file_name": 'g.pdf', "description": "advanced vectors" },
  { "id": 8, "lesson_id": 3, "file_name": 'h.pdf', "description": "vector applications" },
  { "id": 9, "lesson_id": 3, "file_name": 'i.pdf', "description": "introduction to vectors part 2" },
  { "id": 10, "lesson_id": 3, "file_name": 'j.pdf', "description": "advanced vectors part 2" }
];

const createHWTable = function(){
  con.connect(function(err) {
    if (err) throw err;
    //create a table photos
    var sql = `CREATE TABLE IF NOT EXISTS homeworks 
    (id INT PRIMARY KEY AUTO_INCREMENT ,
    lesson_id INT ,
    file_name VARCHAR(255),
    description VARCHAR(255), 
    FOREIGN KEY(lesson_id) REFERENCES lessons(id))`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Hws table created");
    });
    // Insert data into homeworks table
    homeworks.forEach(hw => {
      var sql = `INSERT INTO homeworks (id, lesson_id, file_name, description) VALUES (?, ?, ?, ?)`;
      con.query(sql, [
        hw.id,
        hw.lesson_id,
        hw.file_name,
        hw.description
      ], function (err, result) {
        if (err) throw err;
        console.log(`Record inserted with id: ${result.insertId}`);
      });
    });
    //print the table
    con.query("SELECT * FROM homeworks", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

export default createHWTable;

