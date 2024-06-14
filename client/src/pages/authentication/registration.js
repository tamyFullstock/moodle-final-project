import React, {useState} from 'react'
import '../../style/pages/authentication/registration.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Globals from '../../Globals.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import showErrorMessage from '../../helpers/alertMessage.js';

/*
  *register a new user
  *user enter username and password
  *user click submit
  *axios for "localhost../regiater" lo try register the user
  *if successfull redirect to login page
  *if not succeed to register: alert an error
*/

function Registration() {
  //port of the server
  const port = Globals.PORT_SERVER;
  const navigate = useNavigate()
  const [values, setValues] = useState({
    username: '',
    password: '',
    password2: ''
  })

 //save the detailed user in the server
 async function registerUserServer(){ 
    const response = await fetch(`http://localhost:${port}/register`, {method: 'POST',  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, body: JSON.stringify(values)});
    if (!response.ok){
      //if user datails are not valid
      if (response.status == 400) {
          const data = await response.json();
          throw new Error(data.message);
      }
      throw new Error("error while trying signing user, please try again");
    }
    /*const newUser = await response.json();
    console.log(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));*/
}

async function handleSubmit(e){ //submit the user
  e.preventDefault();
  if(values.password !== values.password2){
    showErrorMessage("passwords do not match");
    return;
  }
  try{
    await registerUserServer(); //save the user in the server
    //succeed to save user in server
    navigate("/login");
  }
  catch(err){ //error in register user 
    if(err.message == "user already exist"){
      setTimeout(()=>{navigate("/login")}, 3000);
    }
    showErrorMessage(err.message);
  }
}
  
  return (
    <div className="signContainer">
           <form className="signForm">
               <div className = "formTitle"><h1>SIGN-UP</h1></div>
               <label className="label">User-Name</label>
               <input  className="input" name = "username" 
               onChange={e=>setValues({...values, username: e.target.value})}
                     type="text" />

               <label className="label">User Password</label>
               <input className="input" name = "password"
               onChange={e=>setValues({...values, password: e.target.value})}
                   type="password"/>

               <label className="label">Verify User Password</label>
               <input  className="input" name = "password2"
               onChange={e=>setValues({...values, password2: e.target.value})}
                   type="password"/>

               <button onClick = {handleSubmit} className="btn"
                       type="submit">
                   submit
               </button>
               <Link className='switchBtn' to = "/login">log in</Link>
           </form>
    </div>
  )
}

export default Registration