import mysql from 'mysql2';
import con from "./connection.js";
import bcrypt from 'bcrypt';
const saltRounds = 10;

const passwords = [
  {
    "username": 214667875,
    "password": "Sw12345", 
    "status": "1"
  },
  {
    "username": 214684587,
    "password": "qw55555", 
    "status": "1"
  },
  {
    "username": 214990876,
    "password": "Swq54b12345", 
    "status": "1"
  }
];

const createPasswordsTable = async function () {
  con.connect(async function (err) {
    if (err) throw err;
    
    // Create table passwords:
    var sql = "CREATE TABLE IF NOT EXISTS passwords (username INT NOT NULL PRIMARY KEY, password VARCHAR(255), status BOOL)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("passwords table created");
    });

    // Insert data into passwords table
    for (let i = 0; i < passwords.length; i++) {
      const hashedPassword = await bcrypt.hash(passwords[i].password, saltRounds);
      var sql = `INSERT INTO passwords (username, password, status) VALUES ('${passwords[i].username}', '${hashedPassword}', '${passwords[i].status}')`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(`${i} record inserted with id: ${result.insertId}`);
      });
    }

    // Print all data in passwords table
    con.query("SELECT * FROM passwords", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
}

export default createPasswordsTable;