import  Course from "../DL/course.dl.js";

const courseCrud = {};

// Create and Save a new user
courseCrud.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a user
  const course = new Course({
    subject: req.body.subject,
    semester: req.body.semester,
    lecturer_id : req.body.lecturer_id
  });

  // Save course in the database using the DL layer, then return the response object with status code and data the error is a data
  Course.create(course, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the course."
      });
    else res.send(data);
  });
};

// Retrieve all courses from the database (with condition).
//query effort us to filter records in db based on some conditions (same as query? username=?)
courseCrud.findAll = (req, res) => {
  const lecturer_id = req.query.lecturer;
  const semester = req.query.semester
  Course.getAll(lecturer_id, semester, (err, data) => {
    if (err){
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving courses."
      });}
    else res.send(data);
  });
};

// Find a single course by Id
courseCrud.findOne = (req, res) => {
  Course.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found course with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving course with id " + req.params.id
        });
        console.log(res);
      }
    } else res.send(data);
  });
};


// Update a course identified by the id in the request 
//to update url is like /:id
courseCrud.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Course.updateById(
    req.params.id,
    new Course(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found course with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating course with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a course with the specified id in the request
//to delete url is like /:id
courseCrud.delete = (req, res) => {
  Course.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found course with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete course with id " + req.params.id
        });
      }
    } else res.send({ message: `course was deleted successfully!` });
  });
};

// Delete all courses from the database.
courseCrud.deleteAll = (req, res) => {
  Course.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all courses."
      });
    else res.send({ message: `All courses were deleted successfully!` });
  });
};


export default courseCrud;
