import hws from '../BL/hw.Bl.js'
import { isLecturerValidation } from '../middleware/isLecturerValidation.js';
import express from 'express';
import FileUpload from '../middleware/upload/fileUpload.js'

const uploadMiddleware = FileUpload('hw/files', null, 'hwFile');

const hwRoute = app => {

  const router = express.Router();
  
  // Create a new user
  router.post("/", uploadMiddleware ,isLecturerValidation, hws.create);

  // Retrieve all users
  router.get("/", hws.findAll);

  // Retrieve a single user with id
  router.get("/:id", hws.findOne);

  // Update a user with id
  router.put("/:id", uploadMiddleware ,isLecturerValidation,  hws.update);

  // Delete a user with id
  router.delete("/:id", hws.delete);

  // Delete all users
  router.delete("/", hws.deleteAll);

  app.use('/homeworks', router);
  
};

export default hwRoute;