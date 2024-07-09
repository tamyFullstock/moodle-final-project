import sql from './db.js';

class CourseP {
  constructor(courseP) {
    // Check if user object is provided
    if (courseP) {
      this.course_id = courseP.course_id;
      this.student_id = courseP.student_id;
    }
  }
}

//result is a callback func with 2 params : err, data if there is an error it will return the error and put null on data' else will put null on the error and enter the new data to the data
CourseP.create = (newCourseP, result) => {
  sql.query("INSERT INTO coursesP SET ?", newCourseP, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created courseP: ", {id: res.insertId, ...newCourseP } );
    result(null, {id: res.insertId, ...newCourseP });
  });
};

//get a course using its id
CourseP.findById = (id, result) => {
  sql.query(`SELECT * FROM coursesP WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    //ther is courseP with such id
    if (res.length) {
      console.log("found courseP: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found courseP with the id
    result({ kind: "not_found" }, null);
  });
};

//get all courses, or get by filter (student_id or course_id)
CourseP.getAll = (student_id, course_id, result) => {
  let query = "SELECT * FROM coursesP";
  //get all filter by lecturer and semester
  if (student_id) {
    query += ` WHERE student_id = '${student_id}'`;
    if(course_id){
      query += ` AND course_id = '${course_id}'`;
    }
  }
  //filter only by course
  else if (course_id) {
    query += ` WHERE course_id = '${course_id}'`;
  }
  
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err,null);
      return;
    }
    console.log("coursesP: ", res);
    result(null, res);
  });
};


//remove a course
CourseP.remove = (id, result) => {
  sql.query("DELETE FROM coursesP WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // not found courseP with the id
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    //succeed to delete courseP
    console.log("deleted courseP with id: ", id);
    result(null, res);
  });
};

//remove all coursesP
CourseP.removeAll = result => {
  sql.query("DELETE FROM coursesP", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log(`deleted ${res.affectedRows} coursesP`);
    result(null, res);
  });
};

//get all courses of a student
CourseP.getByStudent = (student_id, semester, result) => {
  let query = `SELECT c.* FROM coursesP p join courses c on p.course_id = c.id where student_id = ${student_id}`;
  if(semester){
    query += ` and semester = ${semester}`
  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err,null);
      return;
    }
    console.log(`courses of student with id: ${student_id}: `, res);
    result(null, res);
  });
};


export default CourseP;
