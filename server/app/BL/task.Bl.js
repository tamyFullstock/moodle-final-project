import  Task from "../DL/task.dl.js";

const taskCrud = {};

// Create and Save a new task
taskCrud.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a user
  const task = new Task({
  student_id : req.body.student_id,
  hw_id : req.body.hw_id,
  completed : req.body.completed,
  });

  // Save task in the database using the DL layer, then return the response object with status code and data the error is a data
  Task.create(task, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the task."
      });
    else res.send(data);
  });
};

// Retrieve all tasks from the database (with condition).
//query effort us to filter records in db based on some conditions (same as query? username=?)
taskCrud.findAll = (req, res) => {
  const student = req.query.user;
  const hw = req.query.homework;
  const page = req.query.page; //what page to return
  const limit = req.query.limit;  //number of photos in page
  Task.getAll(page, limit, hw, student, (err, data) => {
    if (err){
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tasks."
      });}
    else res.send(data);
  });
};

// Find a single task by Id
taskCrud.findOne = (req, res) => {
  Task.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found task with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving task with id " + req.params.id
        });
        console.log(res);
      }
    } else res.send(data);
  });
};


// Update a task identified by the id in the request 
//to update url is like /:id
taskCrud.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Task.updateById(
    req.params.id,
    new Task(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found task with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating task with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a task with the specified id in the request
//to delete url is like /:id
taskCrud.delete = (req, res) => {
  Task.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found task with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete task with id " + req.params.id
        });
      }
    } else res.send({ message: `task was deleted successfully!` });
  });
};

// Delete all tasks from the database.
taskCrud.deleteAll = (req, res) => {
  Task.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tasks."
      });
    else res.send({ message: `All tasks were deleted successfully!` });
  });
};


export default taskCrud;
