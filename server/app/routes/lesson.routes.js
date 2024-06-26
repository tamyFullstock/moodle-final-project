import lessons from '../BL/lesson.Bl.js'
import express from 'express';
import { chechLessonValidation } from '../middleware/lessonValidation.js';
import FileUpload from '../middleware/upload/fileUpload.js'

const lessonRoute = app => {

  const router = express.Router();

  // Create a new user
  router.post("/",  FileUpload('lesson/videos', ['video/mp4'], 'lessonVideo'), chechLessonValidation, lessons.create);

  // Retrieve all users
  router.get("/", lessons.findAll);

  // Retrieve a single user with id
  router.get("/:id", lessons.findOne);

  // Update a user with id
  router.put("/:id",  FileUpload('lesson/videos', ['video/mp4'], 'lessonVideo'),chechLessonValidation, lessons.update);

  // Delete a user with id
  router.delete("/:id", lessons.delete);

  // Delete all users
  router.delete("/", lessons.deleteAll);

  app.use('/lessons', router);
};

export default lessonRoute;