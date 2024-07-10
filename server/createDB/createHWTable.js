import mysql from 'mysql2';
import con from "./connection.js"

const homeworks = [
  { "id": 1, "lesson_id": 1, "file_name": 'hw_interface.pdf', "description": "the history of the mathematics" },
  { "id": 2, "lesson_id": 2, "file_name": 'hw_interface.pdf', "description": "science and high-tech" },
  { "id": 3, "lesson_id": 1, "file_name": 'hw_interface.pdf', "description": "lab 2 mathematicinas" },
  { "id": 4, "lesson_id": 1, "file_name": 'hw_interface.pdf', "description": "lab 1 egyption code" },
  { "id": 5, "lesson_id": 3, "file_name": 'hw_interface.pdf', "description": "computers communication basics" },
  { "id": 6, "lesson_id": 3, "file_name": 'hw_interface.pdf', "description": "advanced communication" },
  { "id": 7, "lesson_id": 3, "file_name": 'hw_interface.pdf', "description": "network protocols" },
  { "id": 8, "lesson_id": 4, "file_name": 'hw_interface.pdf', "description": "vectors in physics" },
  { "id": 9, "lesson_id": 4, "file_name": 'hw_interface.pdf', "description": "advanced vectors" },
  { "id": 10, "lesson_id": 4, "file_name": 'hw_interface.pdf', "description": "vector applications" },
  { "id": 11, "lesson_id": 5, "file_name": 'hw_interface.pdf', "description": "introduction to vectors part 2" },
  { "id": 12, "lesson_id": 5, "file_name": 'hw_interface.pdf', "description": "advanced vectors part 2" },
  { "id": 13, "lesson_id": 5, "file_name": 'hw_interface.pdf', "description": "vectors in real life" },
  { "id": 14, "lesson_id": 6, "file_name": 'hw_interface.pdf', "description": "heap algorithms basics" },
  { "id": 15, "lesson_id": 6, "file_name": 'hw_interface.pdf', "description": "advanced heap algorithms" },
  { "id": 16, "lesson_id": 6, "file_name": 'hw_interface.pdf', "description": "heap algorithms applications" },
  { "id": 17, "lesson_id": 7, "file_name": 'hw_interface.pdf', "description": "list algorithms basics" },
  { "id": 18, "lesson_id": 7, "file_name": 'hw_interface.pdf', "description": "advanced list algorithms" },
  { "id": 19, "lesson_id": 7, "file_name": 'hw_interface.pdf', "description": "list algorithms applications" },
  { "id": 20, "lesson_id": 8, "file_name": 'hw_interface.pdf', "description": "squares areas basics" },
  { "id": 21, "lesson_id": 8, "file_name": 'hw_interface.pdf', "description": "advanced squares areas" },
  { "id": 22, "lesson_id": 8, "file_name": 'hw_interface.pdf', "description": "squares areas applications" }
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
    //insert hws to the table
    for (let i = 0; i< homeworks.length; i++){
      var sql = `INSERT INTO homeworks (id, lesson_id, file_name, description)
                   VALUES 
                 ('${homeworks[i].id}','${homeworks[i].lesson_id}','${homeworks[i].file_name}','${homeworks[i].description}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`${i} record inserted with id: ${result.insertId}`);
    });
    }
    //print the table
    con.query("SELECT * FROM homeworks", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

export default createHWTable;

