import express from 'express';
import path from 'path';
import multer from 'multer';

/*
upload a file in a generic directory,
generic key,
generic valid types.
throw an error if the file not valid
*/

// Middleware to filter file uploads by extension
const fileFilter = function(validExt) {
    return function(req, file, cb) {
        if (!validExt || validExt.length === 0) {
            // If no valid extensions provided, allow all file types
            cb(null, true);
        } else {
            // Check if file mimetype is in the list of allowed types
            const allowedTypes = validExt;
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                // Reject file if mimetype is not in the allowed types
                cb(new Error('Invalid file type!'), false);
            }
        }
    };
};

// Middleware to handle file uploads
const FileUpload = (folderPath, filterBy, fileKey) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `public/${folderPath}`); // Specify the destination directory
        },
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`); // Define how files should be named
        }
  });

  const upload = multer({
      storage: storage,
      fileFilter: fileFilter(filterBy)
  }).single(fileKey); 

  // Middleware to handle multer errors and send a 400 response for file type validation failures
  const uploadMiddleware = (req, res, next) => {
        upload(req, res, function(err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred (e.g., file too large, unsupported file type)
                res.status(400).send('File upload error: ' + err.message);
            } else if (err) {
                // An unexpected error occurred
                res.status(500).send('Internal server error: ' + err.message);
            } else {
                // No errors, proceed to the next middleware/route handler
                next();
            }
        });
  };
 return uploadMiddleware;
};

export default FileUpload;