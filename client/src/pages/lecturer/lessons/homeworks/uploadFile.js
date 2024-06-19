import React, {useState} from 'react'

function UploadFile() {
    const [file, setFile] = useState();  //store the file in it

    const handleFile = (e) =>{
        setFile(e.target.files[0]);
    }

    const handleUpload = () =>{
        
    }

    return (
        <div className='upload-file-container'>
            <imput type="file" onChange = {handleFile}/>
            <button onClick={handleUpload}>Upload</button>
        </div>
    )
}

export default UploadFile