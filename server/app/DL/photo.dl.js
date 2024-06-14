import sql from './db.js';

class Photo {
  constructor(photo) {
    // Check if photo object is provided
    if (photo) {
      this.description = photo.description;
      this.url = photo.url;
      this.owner_id = photo.owner_id;
    }
  }
}

//result is a callback func with 2 params : err, data if there is an error it will return the error and put null on data' else will put null on the error and enter the new data to the data
Photo.create = (newPhoto, result) => {
  sql.query("INSERT INTO photos SET ?", newPhoto, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created photo: ", {id: res.insertId, ...newPhoto } );
    result(null, {id: res.insertId, ...newPhoto });
  });
};

//get a photo using its id
Photo.findById = (id, result) => {
  sql.query(`SELECT * FROM photos WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    //ther is photo with such id
    if (res.length) {
      console.log("found photo: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found photo with the id
    result({ kind: "not_found" }, null);
  });
};

//get all photos, or get by filter (owner_id)
Photo.getAll = (page, limit, owner_id, result) => {
  let query = "SELECT * FROM photos";
  //get all filter by owner(user)
  if (owner_id) {
    query += ` WHERE owner_id = '${owner_id}'`;
  }
  //return photos per page
  if(page){
     //default in 3 photos per page
    if(!limit || limit >3){
      limit = 3;
    }
    query += ` LIMIT ${limit} OFFSET ${(page-1)*limit}`; //limit is number of photos to return, offset is where to start the counting
  }
  //limit number of photos but not return per page
  else if (limit){
    query += ` LIMIT ${limit}`;
  }
  
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err,null);
      return;
    }
    console.log("photos: ", res);
    result(null, res);
  });
};

//update a photo found by its id
Photo.updateById = (id, photo, result) => {
  sql.query(
    "UPDATE photos SET  description=?, url=?, owner_id=? WHERE id = ?",
    [ photo.description, photo.url, photo.owner_id, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      //res includes param according to the result, one of them is affectedRows  which means how many rows were changed in database if the value is 0 that means that no rows been effected
      if (res.affectedRows == 0) {
        // not found photo with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated photo: ", {...photo, id: id} );
      result(null,  {...photo, id: parseInt(id)} );
    }
  );
};

//remove a photo
Photo.remove = (id, result) => {
  sql.query("DELETE FROM photos WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    // not found photo with the id
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    //succeed to delete course
    console.log("deleted photo with id: ", id);
    result(null, res);
  });
};

//remove all courses
Photo.removeAll = result => {
  sql.query("DELETE FROM photos", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log(`deleted ${res.affectedRows} photos`);
    result(null, res);
  });
};

export default Photo;
