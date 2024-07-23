import tasks from '../BL/task.Bl.js'
import express from 'express';
import { EditTaskValidation } from '../middleware/EditTaskValidation.js';
import { verifyUser } from '../middleware/verifyUser.js';
import FileUpload from '../middleware/upload/fileUpload.js'

// Allowed MIME types for PDF and DOCX files (upload only)
const validFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const uploadMiddleware = FileUpload('task/files', validFileTypes, 'taskFile');

const taskRoute = app => {

  const router = express.Router();

  // Create a new user
  router.post("/", tasks.create);

  // Retrieve all tasks
  router.get("/", tasks.findAll);

  // Retrieve all tasks with their corresponding hw
  router.get("/withHw", tasks.findAllWithHw);

    // Retrieve all tasks with their corresponding hw
    router.get("/detailed", tasks.findAllWithDetails);

  // Retrieve a single user with id
  router.get("/:id", tasks.findOne);

  // Update a user with id
  router.put("/:id", uploadMiddleware, EditTaskValidation, tasks.update);

  // Delete a user with id
  router.delete("/:id", tasks.delete);

  // Delete all users
  router.delete("/", tasks.deleteAll);

  app.use('/tasks', router);
};

export default taskRoute;