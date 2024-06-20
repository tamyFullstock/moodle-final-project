import hws from '../BL/hw.Bl.js'
import express from 'express';
import FileUpload from '../BL/upload/fileUpload.js'

const hwRoute = app => {

  const router = express.Router();
  
  // Create a new user
  router.post("/", FileUpload('hw/files').single('hwFile'), hws.create);

  // Retrieve all users
  router.get("/", hws.findAll);

  // Retrieve a single user with id
  router.get("/:id", hws.findOne);

  // Update a user with id
  router.put("/:id", FileUpload('hw/files').single('hwFile'), hws.update);

  // Delete a user with id
  router.delete("/:id", hws.delete);

  // Delete all users
  router.delete("/", hws.deleteAll);

  app.use('/homeworks', router);
  
};

export default hwRoute;