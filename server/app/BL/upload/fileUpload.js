import express from 'express';
import path from 'path';
import multer from 'multer';
import sql from '../../DL/db.js'

//store a file uploaded in generic path folder. 
const FileUpload = (folderPath) =>{
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, `public/${folderPath}`);
        },
        filename: (req, file, cb) => {
          cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
        }
    });
    const upload = multer({ storage: storage });
    return upload;
}

export default FileUpload;

