import hws from '../BL/hw.Bl.js'
import express from 'express';

const hwRoute = app => {

  const router = express.Router();

  // Create a new user
  router.post("/", hws.create);

  // Retrieve all users
  router.get("/", hws.findAll);

  // Retrieve a single user with id
  router.get("/:id", hws.findOne);

  // Update a user with id
  router.put("/:id", hws.update);

  // Delete a user with id
  router.delete("/:id", hws.delete);

  // Delete all users
  router.delete("/", hws.deleteAll);

  app.use('/homeworks', router);
};

export default hwRoute;