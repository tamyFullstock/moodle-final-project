
//action only lecturer permitted to do it
const isLecturerValidation = (req, res, next) => {
  if(req.user.type === "lecturer"){
    next();
  }
  else{
    return res.status(403).json({message: "forbidden action for not lecturer user"}) //403 is forbidden status
  }
    
};

  export {isLecturerValidation};