import Hw from "../DL/hw.dl.js";

const hwCrud = {};

// Create and Save a new homework
hwCrud.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const homework = new Hw({
    lesson_id: req.body.lesson_id,
    file_url: req.body.file_url,
    description: req.body.description
  });

  Hw.create(homework, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the homework"
      });
    else res.send(data);
  });
};

// Retrieve all homeworks from the database (with condition).
hwCrud.findAll = (req, res) => {
  const lesson = req.query.lesson;
  Hw.getAll(lesson, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving homeworks."
      });
    } else res.send(data);
  });
};

// Find a single hw by Id
hwCrud.findOne = (req, res) => {
  Hw.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found homework with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving homework with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Update a homework identified by the id in the request
hwCrud.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Hw.updateById(req.params.id, new Hw(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found homework with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating homework with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Delete a homework with the specified id in the request
hwCrud.delete = (req, res) => {
  Hw.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found homework with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete homework with id " + req.params.id
        });
      }
    } else res.send({ message: `Homework was deleted successfully!` });
  });
};

// Delete all homeworks from the database.
hwCrud.deleteAll = (req, res) => {
  Hw.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all homeworks."
      });
    else res.send({ message: `All homeworks were deleted successfully!` });
  });
};

export default hwCrud;
/*import  Hw from "../DL/hw.dl.js";

const hwCrud = {};

// Create and Save a new homework
hwCrud.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a homework
  const homework = new Hw({
    lesson_id : req.body.lesson_id,
    file_url : req.body.file_url,
    description : req.body.description
  });

  // Save homework in the database using the DL layer, then return the response object with status code and data the error is a data
  Hw.create(homework, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the homework"
      });
    else res.send(data);
  });
};

// Retrieve all homeworks from the database (with condition).
//query effort us to filter records in db based on some conditions (same as query? username=?)
hwCrud.findAll = (req, res) => {
  const lesson = req.query.lesson;
  Hw.getAll(lesson, (err, data) => {
    if (err){
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving homeworks."
      });}
    else res.send(data);
  });
};

// Find a single hw by Id
hwCrud.findOne = (req, res) => {
  Hw.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found homework with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving homework with id " + req.params.id
        });
        console.log(res);
      }
    } else res.send(data);
  });
};


// Update a homework identified by the id in the request 
//to update url is like /:id
hwCrud.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Hw.updateById(
    req.params.id,
    new Hw(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found homework with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating homework with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a homework with the specified id in the request
//to delete url is like /:id
hwCrud.delete = (req, res) => {
  Hw.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found homework with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete homework with id " + req.params.id
        });
      }
    } else res.send({ message: `homework was deleted successfully!` });
  });
};

// Delete all homeworks from the database.
hwCrud.deleteAll = (req, res) => {
  Hw.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all homeworks."
      });
    else res.send({ message: `All homeworks were deleted successfully!` });
  });
};


export default hwCrud;
*/