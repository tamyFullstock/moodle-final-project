import express from 'express';
import path from 'path';
import multer from 'multer';
import sql from '../../DL/db.js'

//the path to store the file, and the name it will be stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/hw/videos');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

const hwUploadVideoRoute = express.Router();

hwUploadFileRoute.post('/:id/fupload', upload.single('hwFile'), (req, res) => {
  if (req.file) {
    //save the file name in homeworks table in file_Name field
    const filename = req.file.filename; //name of the file
    const query = `update homeworks set file_name=? where id=?`;
    sql.query(query,[filename, req.params.id], (err,result)=>{
        if (err){
            return res.status(500).json({message: `failure uploading hw ${req.params.id} file`})
        }
        return res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    })
  } else {
    return res.status(400).json({ message: 'File upload failed' });
  }
});

export default hwUploadFileRoute;