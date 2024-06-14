import sql from './db.js';

class Lesson{
  constructor(lesson) {
    // Check if user object is provided
    if (lesson) {
      this.title = lesson.title;
      this.year= lesson.year;
      this.month = lesson.month;
      this.day = lesson.day;
      this.hour = lesson.hour;
      this.course_id = lesson.course_id;
    }
  }
}

//result is a callback func with 2 params : err, data if there is an error it will return the error and put null on data' else will put null on the error and enter the new data to the data
Lesson.create = (newLesson, result) => {
  sql.query("INSERT INTO lessons SET ?", newLesson, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created lesson: ", {id: res.insertId, ...newLesson } );
    result(null, {id: res.insertId, ...newLesson });
  });
};

//get a lesson using its id
Lesson.findById = (id, result) => {
  sql.query(`SELECT * FROM lessons WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    //ther is lesson with such id
    if (res.length) {
      console.log("found lesson: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found lesson with the id
    result({ kind: "not_found" }, null);
  });
};

//get all lessons, or get by filter (course_id or year)
Lesson.getAll = (course_id, year, result) => {
  let query = "SELECT * FROM lessons";
  //get all filter by course and year
  if (course_id) {
    query += ` WHERE course_id = '${course_id}'`;
    if(year){
      query += ` AND year = '${year}'`;
    }
  }
  //filter only by year
  else if (year) {
    query += ` WHERE year = '${year}'`;
  }
  
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err,null);
      return;
    }
    console.log("lessons: ", res);
    result(null, res);
  });
};

//update a lesson found by its id
Lesson.updateById = (id, lesson, result) => {
  sql.query(
    "UPDATE lessons SET  title=?, year=?, month=?, day=?, hour=?, course_id=? WHERE id = ?",
    [ lesson.title, lesson.year, lesson.month, lesson.day, lesson.hour, lesson.course_id, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      //res includes param according to the result, one of them is affectedRows  which means how many rows were changed in database if the value is 0 that means that no rows been effected
      if (res.affectedRows == 0) {
        // not found lesson with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated lesson: ", lesson );
      result(null, {...lesson, id: parseInt(id)});
    }
  );
};

//remove a lesson
Lesson.remove = (id, result) => {
  sql.query("DELETE FROM lessons WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // not found lesson with the id
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    //succeed to delete lesson
    console.log("deleted lesson with id: ", id);
    result(null, res);
  });
};

//remove all lessons
Lesson.removeAll = result => {
  sql.query("DELETE FROM lessons", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log(`deleted ${res.affectedRows} lessons`);
    result(null, res);
  });
};

export default Lesson;
