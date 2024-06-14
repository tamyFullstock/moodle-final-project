import  CourseP from "../DL/courseP.dl.js";

const coursePCrud = {};

// Create and Save a new user
coursePCrud.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  else if(!req.user){
     res.status(400).send({
      message: "student must be exist in the system!"
    });
    return;
  }
  else if(req.user.type != "student"){
    res.status(400).send({
      message: "user must be a student!"
    });
    return;
  }
  else{
    // Create a courseP
    const courseP = new CourseP({
      student_id: req.user.id,
      course_id : req.body.course_id
    });

    // Save course in the database using the DL layer, then return the response object with status code and data the error is a data
    CourseP.create(courseP, (err, data) => {
      if (err)
        return res.status(500).send({
          message:
            err.message || "Some error occurred while creating the courseP."
        });
      else return res.send(req.user); //return the user has been added to the course
    });
  }
  
};

// Retrieve all coursesP from the database (with condition).
//query effort us to filter records in db based on some conditions (same as query? username=?)
coursePCrud.findAll = (req, res) => {
  const student_id = req.query.student;
  const course_id = req.query.course;
  CourseP.getAll(student_id, course_id, (err, data) => {
    if (err){
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving coursesP."
      });}
    else res.send(data);
  });
};

// Find a single courseP by Id
coursePCrud.findOne = (req, res) => {
  CourseP.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found courseP with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving courseP with id " + req.params.id
        });
        console.log(res);
      }
    } else res.send(data);
  });
};

// Delete a courseP with the specified id in the request
//to delete url is like /:id
coursePCrud.delete = (req, res) => {
  CourseP.remove(req.params.id, (err, data) => {
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
coursePCrud.deleteAll = (req, res) => {
  CourseP.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all coursesP."
      });
    else res.send({ message: `All coursesP were deleted successfully!` });
  });
};


export default coursePCrud;
