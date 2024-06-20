// middleware/checkFileExtension.js
import path from 'path';

//check the file extension is mp4
 const checkFileExtensionMp4 = (req, res, next) => {
  if (!req.file) {
    return next(); // If there's no file, move to the next middleware
  }

  const fileExt = path.extname(req.file.originalname).toLowerCase();
  if (fileExt !== '.mp4') {
    return res.status(400).json({ error: 'Only MP4 files are allowed' });
  }

  next();
};

export default checkFileExtensionMp4;