import express from 'express';
import path from 'path';
import multer from 'multer';
import sql from '../../DL/db.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/hw/files');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

const hwUploadFileRoute = express.Router();

hwUploadFileRoute.post('/:id/fupload', upload.single('hwFile'), (req, res) => {
  console.log('in post reuest to file');
  if (req.file) {
    console.log('File received:', req.file);
    //save the file name in homeworks table in file_name field
    const filename = req.file.filename; //name of the file
    const query = `update homeworks set file_name=? where id=?`;
    sql.query(query,[filename, req.params.id], (err,result)=>{
        if (err){
          console.log(err);
            return res.status(500).json({message: `failure uploading hw ${req.params.id} file`})
        }
        return res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    })
  } else {
    return res.status(400).json({ message: 'File upload failed' });
  }
});

hwUploadFileRoute.get('/:id/fupload', (req,res)=>{
  const query = `select file_name from homeworks where id=?`;
  sql.query(query,[req.params.id], (err,result)=>{
        if (err){
            return res.status(500).json({message: `failure getting hw ${req.params.id} file`})
        }
        return res.json(result);
  })
})

export default hwUploadFileRoute;