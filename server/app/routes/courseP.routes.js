import coursesP from '../BL/courseP.Bl.js'
import express from 'express';
import { isExistUserValidation } from '../middleware/isExistUser.js';

const coursePRoute = app => {

  const router = express.Router();

  // Create a new user
  router.post("/", isExistUserValidation, coursesP.create);  //validate the student exist in the system

  // Retrieve all users
  router.get("/", coursesP.findAll);

  // Retrieve a single user with id
  router.get("/:id", coursesP.findOne);

  // Delete a user with id
  router.delete("/:id", coursesP.delete);

  // Delete all users
  router.delete("/", coursesP.deleteAll);

  app.use('/coursesP', router);
};

export default coursePRoute;