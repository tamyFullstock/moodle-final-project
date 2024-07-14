// Middleware function to convert "null" strings to null values
const convertNullStringsToNull = (req, res, next) => {
    const traverseObject = (obj) => {
      for (const key in obj) {
        if (obj[key] === 'null') {
          obj[key] = null; // Convert "null" strings to null
        }
      }
    };
  
    if (req.body) {
      traverseObject(req.body); // Start traversing from req.body
    }
  
    next(); // Move to the next middleware
  };
  
  export {convertNullStringsToNull};