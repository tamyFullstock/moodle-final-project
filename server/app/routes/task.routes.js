import tasks from '../BL/task.Bl.js'
import express from 'express';
import { EditTaskValidation } from '../middleware/EditTaskValidation.js';
import { verifyUser } from '../middleware/verifyUser.js';

const taskRoute = app => {

  const router = express.Router();

  // Create a new user
  router.post("/", tasks.create);

  // Retrieve all users
  router.get("/", tasks.findAll);

  // Retrieve a single user with id
  router.get("/:id", tasks.findOne);

  // Update a user with id
  router.put("/:id", verifyUser, EditTaskValidation, tasks.update);

  // Delete a user with id
  router.delete("/:id", tasks.delete);

  // Delete all users
  router.delete("/", tasks.deleteAll);

  app.use('/tasks', router);
};

export default taskRoute;