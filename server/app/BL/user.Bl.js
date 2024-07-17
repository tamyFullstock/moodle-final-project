import User from "../DL/user.dl.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use these two lines to get the equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userCrud = {};

// Create and Save a new user
userCrud.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    tz: req.body.tz,
    email: req.body.email,
    address: req.body.address,
    phone: req.body.phone,
    type: req.body.type,
    status: req.body.status,
    photo: req.file?.filename ?? null
  });

  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({ message: err.message || "Some error occurred while creating the user." });
    else res.send(data);
  });
};

// Retrieve all users from the database (with condition).
userCrud.findAll = (req, res) => {
  const username = req.query.username;
  const type = req.query.type;
  User.getAll(type, username, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || "Some error occurred while retrieving users." });
    } else res.send(data);
  });
};

// Find a single user by Id
userCrud.findOne = (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Not found user with id ${req.params.id}.` });
      } else {
        res.status(500).send({ message: "Error retrieving user with id " + req.params.id });
      }
    } else res.send(data);
  });
};

// Update a user identified by the id in the request
userCrud.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
  }

  User.findById(req.params.id, async (err, oldData) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Not found user with id ${req.params.id}.` });
      } else {
        res.status(500).send({ message: "Error retrieving user with id " + req.params.id });
      }
    } else {
      let newPhotoName = oldData.photo;
      if (req.file) {
        // Delete the old photo
        if (oldData.photo) {
          const filePath = path.join(__dirname, '../../public/user/photos', oldData.photo);
          await fs.unlink(filePath, (err) => {
            if (err) console.error("Failed to delete old photo:", err);
          });
        }
        newPhotoName = req.file.filename;
      }

      const user = new User({
        ...req.body,
        photo: newPhotoName,
        status: 1
      });

      User.updateById(req.params.id, user, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({ message: `Not found user with id ${req.params.id}.` });
          } else {
            res.status(500).send({ message: "Error updating user with id " + req.params.id });
          }
        } else res.send(data);
      });
    }
  });
};

// Delete a user with the specified id in the request
userCrud.delete = (req, res) => {
  User.findById(req.params.id, async (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Not found user with id ${req.params.id}.` });
      } else {
        res.status(500).send({ message: "Error retrieving user with id " + req.params.id });
      }
    } else {
      // Delete the photo
      if (data.photo) {
        const filePath = path.join(__dirname, '../../public/user/photos', data.photo);
        await fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete photo:", err);
        });
      }

      User.remove(req.params.id, (err, result) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({ message: `Not found user with id ${req.params.id}.` });
          } else {
            res.status(500).send({ message: "Could not delete user with id " + req.params.id });
          }
        } else res.send({ message: `User was deleted successfully!` });
      });
    }
  });
};

// Delete all users from the database.
userCrud.deleteAll = (req, res) => {
  const directoryPath = path.join(__dirname, '../../public/user/photos');
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      res.status(500).send({ message: "Error listing files in directory." });
    } else {
      files.forEach(async (file) => {
        const filePath = path.join(directoryPath, file);
        await fs.unlink(filePath, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      });
    }
  });

  User.removeAll((err, data) => {
    if (err)
      res.status(500).send({ message: err.message || "Some error occurred while removing all users." });
    else res.send({ message: `All users were deleted successfully!` });
  });
};

export default userCrud;