import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import Globals from '../../../../Globals';

function UploadFile() {
    const { homeworkId } =  useParams(); // Extract homework ID from the URL
    const [file, setFile] = useState();  //store the file in it
    const [data, setData] = useState([]); //the file we get
    const port = Globals.PORT_SERVER;

    const handleFile = (e) =>{
        setFile(e.target.files[0]);
    }

    const handleUpload = () =>{
        console.log(file);
        const formdata = new FormData();
        formdata.append('hwFile', file) //key and value of the file
        axios.post(`http://localhost:${port}/homeworks/${homeworkId}/fupload`, formdata)
        .then(res => {
            if(res.status == 200){
                console.log("succeed upload homework file")
            }
            else{
                console.log("fail to upload homework file")
            }
        }).catch(err=>console.log(err))

    }

    useEffect(()=>{
        axios.get(`http://localhost:${port}/homeworks/${homeworkId}/fupload`)
        .then(res => {
            if(res.status==200){
                setData(res.data[0]?.file_name)
            }
        }).catch(err=>console.log(err))
    }, [])

    return (
        <div className='upload-file-container'>
            <input type="file" onChange = {handleFile}/>
            <button onClick={handleUpload}>Upload</button>
            {data && <img src = {`http://localhost:${port}/hw/files/${data}`}/>}
        </div>
    )
}

export default UploadFile;