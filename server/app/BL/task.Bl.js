import Task from "../DL/task.dl.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the equivalent of __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Task CRUD object
const taskCrud = {};

// Create and Save a new task
taskCrud.create = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a task instance with the request body and file name
  const task = new Task({
    student_id: req.body.student_id,
    hw_id: req.body.hw_id,
    completed: req.body.completed,
    file_name: req.file?.filename ?? null,
    grade: req.body.grade ?? null
  });

  // Save task in the database
  Task.create(task, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while creating the task."
      });
    }
    res.send(data);
  });
};

// Retrieve all tasks from the database (with condition)
taskCrud.findAll = (req, res) => {
  const student = req.query.user;
  const hw = req.query.homework;
  const lesson = req.query.lesson;
  const page = req.query.page; // what page to return
  const limit = req.query.limit; // number of tasks in page
  Task.getAll(page, limit, hw, student, lesson, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving tasks."
      });
    }
    res.send(data);
  });
};

// Find a single task by Id
taskCrud.findOne = (req, res) => {
  Task.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found task with id ${req.params.id}.`
        });
      }
      return res.status(500).send({
        message: "Error retrieving task with id " + req.params.id
      });
    }
    res.send(data);
  });
};

// Update a task identified by the id in the request
taskCrud.update = (req, res) => {
  // Validate request
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Retrieve the old task data to handle file deletion if necessary
  Task.findById(req.params.id, async (err, oldData) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found task with id ${req.params.id}.`
        });
      }
      return res.status(500).send({
        message: "Error retrieving task with id " + req.params.id
      });
    }

    let newFileName = oldData.file_name;
    if (req.file) {
      // Delete old file if a new file is uploaded
      if (oldData.file_name) {
        const filePath = path.join(__dirname, '../../public/task/files', oldData.file_name);
        await fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete old file:", err);
        });
      }
      newFileName = req.file.filename;
    }

    // Create a Task instance with the new data
    const task = new Task({
      student_id: req.body.student_id,
      hw_id: req.body.hw_id,
      completed: req.body.completed,
      file_name: newFileName,
      grade: req.body.grade ?? null
    });

    // Update Task in the database
    Task.updateById(req.params.id, task, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Not found task with id ${req.params.id}.`
          });
        }
        return res.status(500).send({
          message: "Error updating task with id " + req.params.id
        });
      }
      res.send(data);
    });
  });
};

// Delete a task with the specified id in the request
taskCrud.delete = (req, res) => {
  // Retrieve the task data to handle file deletion
  Task.findById(req.params.id, async (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found task with id ${req.params.id}.`
        });
      }
      return res.status(500).send({
        message: "Error retrieving task with id " + req.params.id
      });
    }

    // Delete file if it exists
    if (data.file_name) {
      const filePath = path.join(__dirname, '../../public/task/files', data.file_name);
      await fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    // Delete Task from the database
    Task.remove(req.params.id, (err, result) => {
      if (err) {
        if (err.kind === "not_found") {
          return res.status(404).send({
            message: `Not found task with id ${req.params.id}.`
          });
        }
        return res.status(500).send({
          message: "Could not delete task with id " + req.params.id
        });
      }
      res.send({ message: `Task was deleted successfully!` });
    });
  });
};

// Delete all tasks from the database
taskCrud.deleteAll = (req, res) => {
  Task.removeAll((err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while removing all tasks."
      });
    }
    res.send({ message: `All tasks were deleted successfully!` });
  });
};

// Retrieve all tasks with their corresponding hw from the database (with condition)
taskCrud.findAllWithHw = (req, res) => {
  const student = req.query.user;
  const lesson = req.query.lesson;
  const page = req.query.page; // what page to return
  const limit = req.query.limit; // number of tasks in page
  Task.getAllWithHw(page, limit, student, lesson, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving tasks."
      });
    }
    res.send(data);
  });
};

// Retrieve all tasks with their corresponding hw, lesson, course from the database (with condition)
taskCrud.findAllWithDetails = (req, res) => {
  const student = req.query.user;
  const lesson = req.query.lesson;
  const page = req.query.page; // what page to return
  const limit = req.query.limit; // number of tasks in page
  const course = req.query.course; 
  const completed = req.query.completed;
  Task.getAllDetailed(page, limit, student, lesson, course,completed, (err, data) => {
    if (err) {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving tasks."
      });
    }
    res.send(data);
  });
};

export default taskCrud;