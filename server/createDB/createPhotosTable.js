import mysql from 'mysql2';
import con from "./connection.js"

const photos=[
    {
        "id": 1,
        "description": "id labore ex et quam laborum",
        "url": "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
        "owner_id": 1
    },
    {
        "id": 2,
        "description": "a frog climb a tree",
        "url": "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
        "owner_id": 1
    },
    {
      "id": 3,
      "description": "beautiful flowers",
      "url": "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
      "owner_id": 2
    }
  ];

const createPhotosTable = function(){
  con.connect(function(err) {
    if (err) throw err;
    //create a table photos
    var sql = `CREATE TABLE IF NOT EXISTS photos (id INT PRIMARY KEY AUTO_INCREMENT ,description VARCHAR(255) ,url VARCHAR(255), owner_id INT, 
     FOREIGN KEY(owner_id) REFERENCES users(id))`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Photos table created");
    });
    //insert photos to the table
    for (let i = 0; i< photos.length; i++){
      var sql = `INSERT INTO photos (id, description, url, owner_id) VALUES ('${photos[i].id}','${photos[i].description}','${photos[i].url}','${photos[i].owner_id}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`${i} record inserted with id: ${result.insertId}`);
    });
    }
    //print the table
    con.query("SELECT * FROM photos", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

export default createPhotosTable;

