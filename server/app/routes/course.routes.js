import courses from '../BL/course.Bl.js'
import { isLecturerValidation } from '../middleware/isLecturerValidation.js';
import express from 'express';

const courseRoute = app => {

  const router = express.Router();

  // Create a new user
  router.post("/",isLecturerValidation, courses.create);

  // Retrieve all users
  router.get("/", courses.findAll);

  // Retrieve a single user with id
  router.get("/:id", courses.findOne);

  // Update a user with id
  router.put("/:id", isLecturerValidation, courses.update);

  // Delete a user with id
  router.delete("/:id", courses.delete);

  // Delete all users
  router.delete("/", courses.deleteAll);

  app.use('/courses', router);
};

export default courseRoute;