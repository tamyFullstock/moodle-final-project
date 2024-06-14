import tasks from '../BL/task.Bl.js'
import express from 'express';

const taskRoute = app => {

  const router = express.Router();

  // Create a new user
  router.post("/", tasks.create);

  // Retrieve all users
  router.get("/", tasks.findAll);

  // Retrieve a single user with id
  router.get("/:id", tasks.findOne);

  // Update a user with id
  router.put("/:id", tasks.update);

  // Delete a user with id
  router.delete("/:id", tasks.delete);

  // Delete all users
  router.delete("/", tasks.deleteAll);

  app.use('/tasks', router);
};

export default taskRoute;