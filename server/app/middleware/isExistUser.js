import User from "../DL/user.dl.js";

//check the user already exist in the system by its tz
const isExistUserValidation = (req, res, next) => {
    const username = req.body.user_id
    if(!username){
        return res.status(400).json({message: "UserName is required"})
    }
    else{
        User.getAll(null , username, (err, data) => {
            if (err){
              res.status(400).send({
                message:
                  err.message || "user is not exist in the system"
              });}
            else {
                req.user = data[0];
                next();
            }
          });
    }
   
  };

  export {isExistUserValidation};