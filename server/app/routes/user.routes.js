import users from '../BL/user.Bl.js';
import express from 'express';
import { chechUserValidation } from '../middleware/userValidation.js';
import FileUpload from '../middleware/upload/fileUpload.js'

// Define valid image MIME types
const validImageTypes = ['image/jpeg', 'image/png'];

const userRoute = app => {

  const router = express.Router();

  // Create a new user with validation
  router.post("/", FileUpload('user/photo', validImageTypes, 'userPhoto'), chechUserValidation, users.create);

  // Retrieve all users
  router.get("/", users.findAll);

  // Retrieve a single user with id
  router.get("/:id", users.findOne);

  // Update a user with id with validation
  router.put("/:id", FileUpload('user/photo', validImageTypes, 'userPhoto'), chechUserValidation, users.update);

  // Delete a user with id
  router.delete("/:id", users.delete);

  // Delete all users
  router.delete("/", users.deleteAll);

  app.use('/users', router);
};

export default userRoute;