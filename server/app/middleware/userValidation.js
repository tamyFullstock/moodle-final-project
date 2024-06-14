import User from '../DL/user.dl.js';

//check all user fields are valid
const chechUserValidation = (req, res, next) => {
    const user = new User(req.body);
    if (!user.first_name || !user.last_name) {
      res.status(400).send("First name and last name are required");
    }
    
    if (!user.tz) {
      res.status(400).send("ID is required");
    }
  
    // Check if user.tz is numeric
    if (!/^\d+$/.test(user.tz)) {
      res.status(400).send("ID must be numeric");
    }
    
    if (!user.email) {
      res.status(400).send("Email is required");
    }
  
    // Check if user.email is a valid email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      res.status(400).send("Email is not valid");
    }
    
    if (!user.type) {
      res.status(400).send("User role is required");
    }
  
    // Check if user.type is either "student" or "lecturer"
    const validTypes = ["student", "lecturer"];
    if (!validTypes.includes(user.type)) {
      res.status(400).send("User role must be either 'student' or 'lecturer'");
    }
    req.validUser = user;
    next();
  };

  export {chechUserValidation};