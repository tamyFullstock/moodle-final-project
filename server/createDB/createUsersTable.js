import mysql from 'mysql2';
import con from "./connection.js"

const users = [
  {
    "id": 1,
    "first_name": "Shira",
    "last_name": "Rubin",
    "tz": 214667875,
    "email": "Shrarub@april.biz",
    "address": "Rishon Lezzion Rotchild 67",
    "phone": 547865011,
    "type": "lecturer",
    "photo": 'passport.png',
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
    "photo": 'passport1.png',
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
    "photo": 'passport2.png',
    "status": 1
  },
  {
    "id": 4,
    "first_name": "Avi",
    "last_name": "Levi",
    "tz": 215667875,
    "email": "Avilevi@april.biz",
    "address": "Haifa Herzl 10",
    "phone": 542365011,
    "type": "lecturer",
    "photo": 'passport3.png',
    "status": 1
  },
  {
    "id": 5,
    "first_name": "Yael",
    "last_name": "Cohen",
    "tz": 214124587,
    "email": "Yaelcohen@april.biz",
    "address": "Ashdod Ben Gurion 5",
    "phone": 545776453,
    "type": "student",
    "photo": 'passport4.png',
    "status": 1
  },
  {
    "id": 6,
    "first_name": "David",
    "last_name": "Golan",
    "tz": 214997876,
    "email": "Davidgolan@april.biz",
    "address": "Beersheba Negev 21",
    "phone": 526561986,
    "type": "student",
    "photo": 'passport5.png',
    "status": 1
  },
  {
    "id": 7,
    "first_name": "Noa",
    "last_name": "Bar",
    "tz": 214223875,
    "email": "Noabar@april.biz",
    "address": "Eilat Red Sea 15",
    "phone": 547765011,
    "type": "student",
    "photo": 'passport6.png',
    "status": 1
  },
  {
    "id": 8,
    "first_name": "Rami",
    "last_name": "Katz",
    "tz": 214984587,
    "email": "Ramikatz@april.biz",
    "address": "Netanya Kikar 7",
    "phone": 549876453,
    "type": "student",
    "photo": 'passport7.png',
    "status": 1
  },
  {
    "id": 9,
    "first_name": "Lior",
    "last_name": "Amit",
    "tz": 214909876,
    "email": "Lioramit@april.biz",
    "address": "Holon Sokolov 22",
    "phone": 525661986,
    "type": "student",
    "photo": 'passport8.png',
    "status": 1
  },
  {
    "id": 10,
    "first_name": "Eitan",
    "last_name": "Shir",
    "tz": 214887875,
    "email": "Eitanshir@april.biz",
    "address": "Rehovot Weizmann 3",
    "phone": 547854011,
    "type": "lecturer",
    "photo": 'passport9.png',
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
     photo VARCHAR(255),
     status BOOLEAN)`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Users table created");
    });
    // Insert users into the table
    users.forEach(user => {
      sql = `INSERT INTO users(id, first_name, last_name, tz, email, address, phone, type, photo, status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      con.query(sql, [
        user.id,
        user.first_name,
        user.last_name,
        user.tz,
        user.email,
        user.address,
        user.phone,
        user.type,
        user.photo,
        user.status
      ], function (err, result) {
        if (err) throw err;
        console.log(`Record inserted with id: ${result.insertId}`);
      });
    });
    //console log the users
    con.query("SELECT * FROM users", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
});
}

export default createUsersTable;


