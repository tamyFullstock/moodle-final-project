import coursesP from '../BL/courseP.Bl.js'
import { isLecturerValidation } from '../middleware/isLecturerValidation.js';
import express from 'express';
import { isExistUserValidation } from '../middleware/isExistUser.js';

const coursePRoute = app => {

  const router = express.Router();

  // Create a new user
  router.post("/", isLecturerValidation, isExistUserValidation, coursesP.create);  //validate the student exist in the system

  // Retrieve all users
  router.get("/", coursesP.findAll);

  // Retrieve a single user with id
  router.get("/:id", coursesP.findOne);

  // Delete a user with id
  router.delete("/:id", coursesP.delete);

  // Delete all users
  router.delete("/", coursesP.deleteAll);

  // Retrieve all users
  router.get("/studentCourses/:studentId", coursesP.findStudentCourses);  //get all courses of a single student as courses objects

  app.use('/coursesP', router);
};

export default coursePRoute;