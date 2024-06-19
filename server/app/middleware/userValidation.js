import User from '../DL/user.dl.js';

//check all user fields are valid
const chechUserValidation = (req, res, next) => {
    const user = new User(req.body);
    if (!user.first_name || !user.last_name) {
      return res.status(400).json({message: "First name and last name are required"});
    }
    
    if (!user.tz) {
      return res.status(400).json({message: "ID is required"});
    }
  
    // Check if user.tz is numeric
    if (!/^\d+$/.test(user.tz)) {
      return res.status(400).json({message: "ID must be numeric"});
    }
    
    if (!user.email) {
      return res.status(400).json({message:"Email is required"});
    }
  
    // Check if user.email is a valid email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return res.status(400).json({message:"Email is not valid"});
    }
    
    if (!user.type) {
      return res.status(400).json({message:"User role is required"});
    }
  
    // Check if user.type is either "student" or "lecturer"
    const validTypes = ["student", "lecturer"];
    if (!validTypes.includes(user.type)) {
      return res.status(400).json({message:"User role must be either 'student' or 'lecturer'"});
    }
    req.validUser = user;
    next();
  };

  export {chechUserValidation};