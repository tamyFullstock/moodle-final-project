import express from 'express';
import initialization from '../../createDB/initialization.js';

const initRoute = app => {

  const router = express.Router();

  // Create a new comment
  router.post("/",  function(req, res)  {
    // Save comment in the database using the DL layer, then return the response object with status code and data the error is a data
    initialization((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while initializing the DB"
        });
      else res.send(data);
    });
  });

  app.use('/initialization', router);
};

export default initRoute;