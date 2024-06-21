import sql from './db.js';

// Define the Lesson class
class Lesson {
  constructor(lesson) {
    if (lesson) {
      this.title = lesson.title;
      this.year = lesson.year;
      this.month = lesson.month;
      this.day = lesson.day;
      this.hour = lesson.hour;
      this.course_id = lesson.course_id;
      this.video_name = lesson.video_name; // Video file name
    }
  }
}

// Create a new lesson in the database
Lesson.create = (newLesson, result) => {
  sql.query("INSERT INTO lessons SET ?", newLesson, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created lesson: ", { id: res.insertId, ...newLesson });
    result(null, { id: res.insertId, ...newLesson });
  });
};

// Find a lesson by its ID
Lesson.findById = (id, result) => {
  sql.query(`SELECT * FROM lessons WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found lesson: ", res[0]);
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

// Retrieve all lessons, optionally filtered by course_id and year
Lesson.getAll = (course_id, year, result) => {
  let query = "SELECT * FROM lessons";
  if (course_id) {
    query += ` WHERE course_id = '${course_id}'`;
    if (year) {
      query += ` AND year = '${year}'`;
    }
  } else if (year) {
    query += ` WHERE year = '${year}'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("lessons: ", res);
    result(null, res);
  });
};

// Update a lesson by its ID
Lesson.updateById = (id, lesson, result) => {
  sql.query(
    "UPDATE lessons SET title=?, year=?, month=?, day=?, hour=?, course_id=?, video_name=? WHERE id = ?",
    [lesson.title, lesson.year, lesson.month, lesson.day, lesson.hour, lesson.course_id, lesson.video_name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated lesson: ", lesson);
      result(null, { ...lesson, id: parseInt(id) });
    }
  );
};

// Delete a lesson by its ID
Lesson.remove = (id, result) => {
  sql.query("DELETE FROM lessons WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("deleted lesson with id: ", id);
    result(null, res);
  });
};

// Delete all lessons
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