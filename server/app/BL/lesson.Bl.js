import  Lesson from "../DL/lesson.dl.js";

const lessonCrud = {};

// Create and Save a new photo
lessonCrud.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a user
  const lesson = new Lesson({
  title : req.body.title,
  year : req.body.year,
  month : req.body.month,
  day : req.body.day,
  hour : req.body.hour,
  course_id : req.body.course_id,
  });

  // Save lesson in the database using the DL layer, then return the response object with status code and data the error is a data
  Lesson.create(lesson, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the lesson."
      });
    else res.send(data);
  });
};

// Retrieve all lessons from the database (with condition).
//query effort us to filter records in db based on some conditions (same as query? username=?)
lessonCrud.findAll = (req, res) => {
  const course = req.query.course;
  const year = req.query.year;
  Lesson.getAll(course, year, (err, data) => {
    if (err){
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving lessons."
      });}
    else res.send(data);
  });
};

// Find a single lesson by Id
lessonCrud.findOne = (req, res) => {
  Lesson.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found lesson with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving lesson with id " + req.params.id
        });
        console.log(res);
      }
    } else res.send(data);
  });
};


// Update a lesson identified by the id in the request 
//to update url is like /:id
lessonCrud.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Lesson.updateById(
    req.params.id,
    new Lesson(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found lesson with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating lesson with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a lesson with the specified id in the request
//to delete url is like /:id
lessonCrud.delete = (req, res) => {
  Lesson.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found lesson with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete lesson with id " + req.params.id
        });
      }
    } else res.send({ message: `lesson was deleted successfully!` });
  });
};

// Delete all lessons from the database.
lessonCrud.deleteAll = (req, res) => {
  Lesson.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all lessons."
      });
    else res.send({ message: `All lessons were deleted successfully!` });
  });
};


export default lessonCrud;
