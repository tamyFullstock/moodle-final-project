import Hw from "../DL/hw.dl.js";
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use these two lines to get the equivalent of __dirname- get the file url, convert it to directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hwCrud = {};

// Create and Save a new homework
hwCrud.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const homework = new Hw({
    lesson_id: req.body.lesson_id,
    file_name : req.file?.filename ?? null,
    description: req.body.description
  });

  Hw.create(homework, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the homework"
      });
    else res.send(data);
  });
};

// Retrieve all homeworks from the database (with condition).
hwCrud.findAll = (req, res) => {
  const lesson = req.query.lesson;
  Hw.getAll(lesson, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving homeworks."
      });
    } else res.send(data);
  });
};

// Find a single hw by Id
hwCrud.findOne = (req, res) => {
  Hw.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found homework with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving homework with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Update a homework identified by the id in the request
hwCrud.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Hw.findById(req.params.id, (err, oldData) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found homework with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving homework with id " + req.params.id
        });
      }
    } else {
      let newFileName = oldData.file_name;
      if (req.file) {
        // Delete the old file
        if (oldData.file_name) {
          const filePath = path.join(__dirname, '../../public/hw/files', oldData.file_name);
          fs.unlink(filePath, (err) => {
            if (err) console.error("Failed to delete old file:", err);
          });
        }
        newFileName = req.file.filename;
      }

      const homework = new Hw({
        lesson_id: req.body.lesson_id,
        file_name: newFileName,
        description: req.body.description
      });

      Hw.updateById(req.params.id, homework, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found homework with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating homework with id " + req.params.id
            });
          }
        } else res.send(data);
      });
    }
  });
};

// Delete a homework with the specified id in the request
hwCrud.delete = (req, res) => {
  Hw.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found homework with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving homework with id " + req.params.id
        });
      }
    } else {
      // Delete the file
      if (data.file_name) {
        const filePath = path.join(__dirname, '../../public/hw/files', data.file_name);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      }

      Hw.remove(req.params.id, (err, result) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found homework with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete homework with id " + req.params.id
            });
          }
        } else res.send({ message: `Homework was deleted successfully!` });
      });
    }
  });
};

// Delete all homeworks from the database.
hwCrud.deleteAll = (req, res) => {
  // Delete all files from the hw/files directory
  const directoryPath = path.join(__dirname, '../../public/hw/files');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      res.status(500).send({
        message: "Error listing files in directory."
      });
    } else {
      files.forEach((file, index) => {
        const filePath = path.join(directoryPath, file);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      });
    }
  });

  Hw.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all homeworks."
      });
    else res.send({ message: `All homeworks were deleted successfully!` });
  });
};


export default hwCrud;