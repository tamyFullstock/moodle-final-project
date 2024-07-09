import mysql from 'mysql2';
import con from "./connection.js"

const homeworks=[
    {
        "id": 1,
        "lesson_id": 1,
        "file_name": 'hw.pdf',
        "description": "the history of the mathematics"
    },
    {
      "id": 2,
      "lesson_id": 2,
      "file_name": 'hw.pdf',
      "description": "science and high-tech"
    },
    {
      "id": 3,
      "lesson_id": 1,
      "file_name": 'hw.pdf',
      "description": "lab 2 mathematicinas"
    },
    {
      "id": 4,
      "lesson_id": 1,
      "file_name": 'hw.pdf',
      "description": "lab 1 egyption code"
    }
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

