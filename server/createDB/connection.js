import mysql from 'mysql2';


//create a connection according  to the .env file
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'tamy0549882!',
  database: 'moodleDB'
});

export default connection;
