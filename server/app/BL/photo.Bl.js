import  Photo from "../DL/photo.dl.js";

const photoCrud = {};

// Create and Save a new photo
photoCrud.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a user
  const photo = new Photo({
  description : req.body.description,
  url : req.body.url,
  owner_id : req.body.owner_id,
  });

  // Save photo in the database using the DL layer, then return the response object with status code and data the error is a data
  Photo.create(photo, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the photo."
      });
    else res.send(data);
  });
};

// Retrieve all photos from the database (with condition).
//query effort us to filter records in db based on some conditions (same as query? username=?)
photoCrud.findAll = (req, res) => {
  const owner = req.query.user;
  const page = req.query.page; //what page to return
  const limit = req.query.limit;  //number of photos in page
  Photo.getAll(page, limit,owner, (err, data) => {
    if (err){
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving photos."
      });}
    else res.send(data);
  });
};

// Find a single user by Id
photoCrud.findOne = (req, res) => {
  Photo.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found photo with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving photo with id " + req.params.id
        });
        console.log(res);
      }
    } else res.send(data);
  });
};


// Update a photo identified by the id in the request 
//to update url is like /:id
photoCrud.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Photo.updateById(
    req.params.id,
    new Photo(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found photo with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating photo with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a photo with the specified id in the request
//to delete url is like /:id
photoCrud.delete = (req, res) => {
  Photo.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found photo with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete photo with id " + req.params.id
        });
      }
    } else res.send({ message: `photo was deleted successfully!` });
  });
};

// Delete all photos from the database.
photoCrud.deleteAll = (req, res) => {
  Photo.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all photos."
      });
    else res.send({ message: `All photos were deleted successfully!` });
  });
};


export default photoCrud;
