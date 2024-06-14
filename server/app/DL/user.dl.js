import sql from './db.js';

class User {
  constructor(user) {
    // Check if user object is provided
    if (user) {
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.tz = user.tz;
      this.email = user.email;
      this.address = user.address;
      this.phone = user.phone;
      this.type = user.type;
    }
  }
}

//result is a callback func with 2 params : err, data if there is an error it will return the error and put null on data' else will put null on the error and enter the new data to the data
User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created user: ", {id: res.insertId, ...newUser } );
    result(null, {id: res.insertId, ...newUser });
  });
};

//get a user using its id
User.findById = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    //there is user with such id
    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found user with the id
    result({ kind: "not_found" }, null);
  });
};

//get all users, or get by filter (username or type)
User.getAll = (user_type, username, result) => {
  let query = "SELECT * FROM users";
  //get all filter by username and type of user
  if (username) {
    query += ` WHERE tz = '${username}'`;
    if(user_type=="lecturer"){
      query += ` AND type = 'lecturer'`;
    }
    else if(user_type=="student"){
      query += ` AND type = 'student'`;
    }
  }
  //get only lecturer
  else if (user_type=="lecturer") {
    query += ` WHERE type = 'lecturer'`;
  }
  //get only students
  else if (user_type=="student") {
    query += ` WHERE type = 'student'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err,null);
      return;
    }
    console.log("users: ", res);
    result(null, res);
  });
};

//update a user found by its id
User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET  first_name=?, last_name=?, tz=?, email=?, address=?, phone=?, type=? WHERE id = ?",
    [ user.first_name, user.last_name, user.tz, user.email, user.address, user.phone, user.type, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      //res includes param according to the result, one of them is affectedRows  which means how many rows were changed in database if the value is 0 that means that no rows been effected
      if (res.affectedRows == 0) {
        // not found user with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", {...user, id: id} );
      result(null, {...user, id: parseInt(id)} );
    }
  );
};

//remove a user
User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // not found user with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

//remove all users
User.removeAll = result => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};

export default User;
