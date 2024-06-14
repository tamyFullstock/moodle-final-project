import sql from './db.js';

class Course {
  constructor(course) {
    // Check if user object is provided
    if (course) {
      this.subject = course.subject;
      this.semester = course.semester;
      this.lecturer_id = course.lecturer_id;
    }
  }
}

//result is a callback func with 2 params : err, data if there is an error it will return the error and put null on data' else will put null on the error and enter the new data to the data
Course.create = (newCourse, result) => {
  sql.query("INSERT INTO courses SET ?", newCourse, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created course: ", {id: res.insertId, ...newCourse } );
    result(null, {id: res.insertId, ...newCourse });
  });
};

//get a course using its id
Course.findById = (id, result) => {
  sql.query(`SELECT * FROM courses WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    //ther is course with such id
    if (res.length) {
      console.log("found course: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found course with the id
    result({ kind: "not_found" }, null);
  });
};

//get all courses, or get by filter (lecturer_id or semester)
Course.getAll = (lecturer_id, semester, result) => {
  let query = "SELECT * FROM courses";
  //get all filter by lecturer and semester
  if (lecturer_id) {
    query += ` WHERE lecturer_id = '${lecturer_id}'`;
    if(semester){
      query += ` AND semester = '${semester}'`;
    }
  }
  //filter only by semester
  else if (semester) {
    query += ` WHERE semester = '${semester}'`;
  }
  
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err,null);
      return;
    }
    console.log("courses: ", res);
    result(null, res);
  });
};

//update a course found by its id
Course.updateById = (id, course, result) => {
  sql.query(
    "UPDATE courses SET  subject=?, semester=?, lecturer_id=? WHERE id = ?",
    [ course.subject, course.semester, course.lecturer_id, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      //res includes param according to the result, one of them is affectedRows  which means how many rows were changed in database if the value is 0 that means that no rows been effected
      if (res.affectedRows == 0) {
        // not found course with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated course: ", {...course, id: id} );
      result(null, {...course, id: parseInt(id)});
    }
  );
};

//remove a course
Course.remove = (id, result) => {
  sql.query("DELETE FROM courses WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // not found course with the id
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    //succeed to delete course
    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

//remove all courses
Course.removeAll = result => {
  sql.query("DELETE FROM courses", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log(`deleted ${res.affectedRows} courses`);
    result(null, res);
  });
};

export default Course;
