import mysql from 'mysql2';
import con from "./connection.js"

const clearDBTables = function(){
    con.connect(function(err) {
      if (err) throw err;
      con.query("drop table if exists passwords", function (err, result, fields) {
        if (err) throw err;
        console.log("(deleted passwords table successfully");
      });
      con.query("drop table if exists tasks", function (err, result, fields) {
        if (err) throw err;
        console.log("(deleted tasks table successfully");
      });
      con.query("drop table if exists homeworks", function (err, result, fields) {
        if (err) throw err;
        console.log("(deleted homeworks table successfully");
      });
      con.query("drop table if exists lessons", function (err, result, fields) {
        if (err) throw err;
        console.log("(deleted lessons table successfully");
      });
      con.query("drop table if exists coursesP", function (err, result, fields) {
        if (err) throw err;
        console.log("(deleted  coursesP table successfully");
      });
      con.query("drop table if exists courses", function (err, result, fields) {
        if (err) throw err;
        console.log("(deleted  courses table successfully");
      });
      con.query("drop table if exists photos", function (err, result, fields) {
        if (err) throw err;
        console.log("(deleted  photos table successfully");
      });
      con.query("drop table if exists users", function (err, result, fields) {
        if (err) throw err;
        console.log("(deleted users table successfully");
      });
    });
}

export default clearDBTables;