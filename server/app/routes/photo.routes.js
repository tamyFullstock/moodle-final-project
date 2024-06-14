import photos from '../BL/photo.Bl.js'
import express from 'express';

const photoRoute = app => {

  const router = express.Router();

  // Create a new user
  router.post("/", photos.create);

  // Retrieve all users
  router.get("/", photos.findAll);

  // Retrieve a single user with id
  router.get("/:id", photos.findOne);

  // Update a user with id
  router.put("/:id", photos.update);

  // Delete a user with id
  router.delete("/:id", photos.delete);

  // Delete all users
  router.delete("/", photos.deleteAll);

  app.use('/photos', router);
};

export default photoRoute;