import sql from './db.js';

class Task {
  constructor(task) {
    // Check if homework object is provided
    if (task) {
      this.student_id = task.student_id;
      this.hw_id = task.hw_id;
      this.completed = task.completed;
    }
  }
}

//result is a callback func with 2 params : err, data if there is an error it will return the error and put null on data' else will put null on the error and enter the new data to the data
Task.create = (newTask, result) => {
  sql.query("INSERT INTO tasks SET ?", newTask, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created task: ", {id: res.insertId, ...newTask } );
    result(null, {id: res.insertId, ...newTask });
  });
};

//get a task using its id
Task.findById = (id, result) => {
  sql.query(`SELECT * FROM tasks WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    //ther is task with such id
    if (res.length) {
      console.log("found task: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found task with the id
    result({ kind: "not_found" }, null);
  });
};

//get all tasks, or get by filter (hw_id, or student_id)
Task.getAll = (page, limit, hw_id, student_id, result) => {
  let query = "SELECT * FROM tasks";
  //get all filter by homework and student
  if (hw_id) {
    query += ` WHERE hw_id = '${hw_id}'`;
    if(student_id){
      query += `AND student_id = '${student_id}'`
    }
  }
  //filter only by student
  else if(student_id){
    query += ` WHERE student_id = '${student_id}'`;
  }
  //return tasks per page
  if(page){
    //default in 3 tasks per page
   if(!limit || limit >3){
     limit = 3;
   }
   query += ` LIMIT ${limit} OFFSET ${(page-1)*limit}`; //limit is number of tasks to return, offset is where to start the counting
 }
 //limit number of tasks but not return per page
 else if (limit){
   query += ` LIMIT ${limit}`;
 }
  
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err,null);
      return;
    }
    console.log("tasks: ", res);
    result(null, res);
  });
};

//update a tasks found by its id
Task.updateById = (id, task, result) => {
  sql.query(
    "UPDATE tasks SET student_id=?, hw_id=?, completed=?  WHERE id = ?",
    [  task.student_id, task.hw_id, task.completed, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      //res includes param according to the result, one of them is affectedRows  which means how many rows were changed in database if the value is 0 that means that no rows been effected
      if (res.affectedRows == 0) {
        // not found task with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated task: ", {...task, id: id});
      result(null,{...task, id: parseInt(id)});
    }
  );
};

//remove a task
Task.remove = (id, result) => {
  sql.query("DELETE FROM tasks WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // not found task with the id
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    //succeed to delete task
    console.log("deleted task with id: ", id);
    result(null, res);
  });
};

//remove all tasks
Task.removeAll = result => {
  sql.query("DELETE FROM tasks", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log(`deleted ${res.affectedRows} tasks`);
    result(null, res);
  });
};

export default Task;