import Lesson from "../DL/lesson.dl.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the equivalent of __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lesson CRUD object
const lessonCrud = {};

// Create a new lesson
lessonCrud.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Lesson instance with the request body and file name
  const lesson = new Lesson({
    title: req.body.title,
    year: req.body.year,
    month: req.body.month,
    day: req.body.day,
    hour: req.body.hour,
    course_id: req.body.course_id,
    video_name: req.file?.filename ?? null
  });

  // Save Lesson in the database
  Lesson.create(lesson, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the lesson."
      });
    else res.send(data);
  });
};

// Retrieve all lessons
lessonCrud.findAll = (req, res) => {
  const course = req.query.course;
  const year = req.query.year;
  Lesson.getAll(course, year, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving lessons."
      });
    } else res.send(data);
  });
};

// Find a single lesson by ID
lessonCrud.findOne = (req, res) => {
  Lesson.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found lesson with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving lesson with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Update a lesson by ID
lessonCrud.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Retrieve the old lesson data to handle file deletion if necessary
  Lesson.findById(req.params.id, (err, oldData) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found lesson with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving lesson with id " + req.params.id
        });
      }
    } else {
      let newFileName = oldData.video_name;
      if (req.file) {
        // Delete old video file if a new file is uploaded
        if (oldData.video_name) {
          const filePath = path.join(__dirname, '../../public/lesson/videos', oldData.video_name);
          fs.unlink(filePath, (err) => {
            if (err) console.error("Failed to delete old video:", err);
          });
        }
        newFileName = req.file.filename;
      }

      // Create a Lesson instance with the new data
      const lesson = new Lesson({
        title: req.body.title,
        year: req.body.year,
        month: req.body.month,
        day: req.body.day,
        hour: req.body.hour,
        course_id: req.body.course_id,
        video_name: newFileName
      });

      // Update Lesson in the database
      Lesson.updateById(req.params.id, lesson, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found lesson with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating lesson with id " + req.params.id
            });
          }
        } else res.send(data);
      });
    }
  });
};

// Delete a lesson by ID
lessonCrud.delete = (req, res) => {
  // Retrieve the lesson data to handle file deletion
  Lesson.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found lesson with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving lesson with id " + req.params.id
        });
      }
    } else {
      // Delete video file if it exists
      if (data.video_name) {
        const filePath = path.join(__dirname, '../../public/lesson/videos', data.video_name);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete video:", err);
        });
      }

      // Delete Lesson from the database
      Lesson.remove(req.params.id, (err, result) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found lesson with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete lesson with id " + req.params.id
            });
          }
        } else res.send({ message: `Lesson was deleted successfully!` });
      });
    }
  });
};

// Delete all lessons
lessonCrud.deleteAll = (req, res) => {
  Lesson.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all lessons."
      });
    else res.send({ message: `All lessons were deleted successfully!` });
  });
};

export default lessonCrud;