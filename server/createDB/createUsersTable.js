import mysql from 'mysql2';
import con from "./connection.js"

const users =[
  {
      "id": 1,
      "first_name": "Shira",
      "last_name": "Rubin",
      "tz": 214667875,
      "email": "Shrarub@april.biz",
      "address": "Rishon Lezzion Rotchild 67",
      "phone": 547865011,
      "type": "lecturer",
      "status": 1
  },
  {
    "id": 2,
    "first_name": "Moishi",
    "last_name": "Mukiioto",
    "tz": 214684587,
    "email": "Mukimuki@april.biz",
    "address": "Tel Aviv Jhonson 3",
    "phone": 549776453,
    "type": "student",
    "status": 1
  },
  {
  "id": 3,
  "first_name": "Breta",
  "last_name": "Zavdii",
  "tz": 214990876,
  "email": "Bretaroo@april.biz",
  "address": "Jerusalem David 98",
  "phone": 525561986,
  "type": "student",
  "status": 1
  }
];

const createUsersTable = function(){
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    //create a tabkle "user"
    var sql = `CREATE TABLE IF NOT EXISTS users
    (id INT PRIMARY KEY AUTO_INCREMENT,
     first_name VARCHAR(255), 
     last_name VARCHAR(255),
     tz INT UNIQUE,
     email VARCHAR(255), 
     address VARCHAR(255), 
     phone INT(30), 
     type VARCHAR(255), 
     status BOOLEAN)`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Users table created");
    });
    //insert users to the table
    for (let i = 0; i< users.length; i++){
      sql = `INSERT INTO users(id, first_name, last_name, tz, email, address, phone, type, status) VALUES('${users[i].id}','${users[i].first_name}','${users[i].last_name}','${users[i].tz}','${users[i].email}','${users[i].address}','${users[i].phone}','${users[i].type}','${users[i].status}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`${i} record inserted with id: ${result.insertId}`);
    });
    }
    //console log the users
    con.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
});
}

export default createUsersTable;


