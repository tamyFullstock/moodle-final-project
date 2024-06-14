/*import sql from './db.js';

class Hw {
  constructor(homework) {
    // Check if homework object is provided
    if (homework) {
      this.lesson_id = homework.lesson_id;
      this.file_url = homework.file_url;
      this.description = homework.description;
    }
  }
}

//result is a callback func with 2 params : err, data if there is an error it will return the error and put null on data' else will put null on the error and enter the new data to the data
Hw.create = (newHw, result) => {
  sql.query("INSERT INTO homeworks SET ?", newHw, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created homework: ", {id: res.insertId, ...newHw } );
    result(null, {id: res.insertId, ...newHw });
  });
};

//get a homework using its id
Hw.findById = (id, result) => {
  sql.query(`SELECT * FROM homeworks WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    //ther is homework with such id
    if (res.length) {
      console.log("found homework: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found homework with the id
    result({ kind: "not_found" }, null);
  });
};

//get all homeworks, or get by filter (lesson_id)
Hw.getAll = (lesson_id, result) => {
  let query = "SELECT * FROM homeworks";
  //get all filter by lesson
  if (lesson_id) {
    query += ` WHERE lesson_id = '${lesson_id}'`;
  }
  
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err,null);
      return;
    }
    console.log("homeworks: ", res);
    result(null, res);
  });
};

//update a homework found by its id
Hw.updateById = (id, homework, result) => {
  sql.query(
    "UPDATE homeworks SET lesson_id=?, file_url=?, description=?  WHERE id = ?",
    [  homework.lesson_id, homework.file_url, homework.description, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      //res includes param according to the result, one of them is affectedRows  which means how many rows were changed in database if the value is 0 that means that no rows been effected
      if (res.affectedRows == 0) {
        // not found photo with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated homework: ", {...homework, id: id} );
      result(null, {...homework, id: parseInt(id)}  );
    }
  );
};

//remove a homework
Hw.remove = (id, result) => {
  sql.query("DELETE FROM homeworks WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // not found homework with the id
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    //succeed to delete homework
    console.log("deleted homework with id: ", id);
    result(null, res);
  });
};

//remove all homeworks
Hw.removeAll = result => {
  sql.query("DELETE FROM homeworks", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log(`deleted ${res.affectedRows} homeworks`);
    result(null, res);
  });
};

export default Hw;
*/
import sql from './db.js';

class Hw {
  constructor(homework) {
    if (homework) {
      this.lesson_id = homework.lesson_id;
      this.file_url = homework.file_url;
      this.description = homework.description;
    }
  }
}

Hw.create = (newHw, result) => {
  sql.query("INSERT INTO homeworks SET ?", newHw, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    const hwId = res.insertId;
    console.log("created homework: ", { id: hwId, ...newHw });

    // Get the course_id from the lesson_id
    sql.query(`SELECT course_id FROM lessons WHERE id = ${newHw.lesson_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      const courseId = res[0].course_id;

      // Get all students participating in the course
      sql.query(`SELECT student_id FROM coursesP WHERE course_id = ${courseId}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        const tasks = res.map(row => [row.student_id, hwId, false]);
        if (tasks.length > 0) {
          sql.query("INSERT INTO tasks (student_id, hw_id, completed) VALUES ?", [tasks], (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }
            console.log("Created tasks for all students in the course");
            result(null, { id: hwId, ...newHw });
          });
        } else {
          result(null, { id: hwId, ...newHw });
        }
      });
    });
  });
};

Hw.findById = (id, result) => {
  sql.query(`SELECT * FROM homeworks WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found homework: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

Hw.getAll = (lesson_id, result) => {
  let query = "SELECT * FROM homeworks";
  if (lesson_id) {
    query += ` WHERE lesson_id = '${lesson_id}'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("homeworks: ", res);
    result(null, res);
  });
};

//update a homework found by its id
Hw.updateById = (id, homework, result) => {
  sql.query(
    "UPDATE homeworks SET lesson_id=?, file_url=?, description=?  WHERE id = ?",
    [  homework.lesson_id, homework.file_url, homework.description, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      //res includes param according to the result, one of them is affectedRows  which means how many rows were changed in database if the value is 0 that means that no rows been effected
      if (res.affectedRows == 0) {
        // not found photo with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated homework: ", {...homework, id: id} );
      result(null, {...homework, id: parseInt(id)}  );
    }
  );
};

Hw.remove = (id, result) => {
  // Delete tasks associated with the homework
  sql.query("DELETE FROM tasks WHERE hw_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
  });

  sql.query("DELETE FROM homeworks WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log(`deleted homework and its associated tasks with id: ${id}`);
    result(null, res)
  });
  
};

Hw.removeAll = result => {
  sql.query("DELETE FROM tasks", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }});
    
  sql.query("DELETE FROM homeworks", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log(`deleted ${res.affectedRows} homeworks`);
    result(null, res);
  });
};

export default Hw;