import mysql from 'mysql2';
import con from "./connection.js"

const passwords=[
  {
      "username": 214667875,
      "password":"123456",
      "status": "1"
  },
  {
      "username": 214684587,
      "password":"qw55555",
      "status": "1"
  },
  {
      "username":214990876,
      "password":"Swq54b12345",
      "status": "1"
  }
];

const createPasswordsTable= function(){
  con.connect(function(err) {
    if (err) throw err;
    //create table passwords:
    var sql = "CREATE TABLE IF NOT EXISTS passwords (username INT NOT NULL PRIMARY KEY, password VARCHAR(255) , status BOOL)";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("passwords table created");
    });
    //insert data into passwords table
    for (let i = 0; i< passwords.length; i++){
      var sql = `INSERT INTO passwords (username, password, status) VALUES ('${passwords[i].username}','${passwords[i].password}', '${passwords[i].status}')`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(`${i} record inserted with id: ${result.insertId}`);
    });
    }
    //print all data in passwords table
    con.query("SELECT * FROM passwords", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });  
}

export default createPasswordsTable;
