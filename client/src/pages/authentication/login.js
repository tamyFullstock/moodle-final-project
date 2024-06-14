import React, {useState} from 'react'
import '../../style/pages/authentication/login.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Globals from '../../Globals.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth, useSetAuth } from '../../helpers/ThemeProvider.js';

/*
    *user insert username(tz) and password
    *axios for "localhost../login"
    *if response is 200 server save cookie in user computer
    *if response is 200 then navigate to home
    *if error is 404 status: alert details not correct
    *else alert error message
*/

function Login() {
  //port of the server
  const port = Globals.PORT_SERVER;
  const navigate = useNavigate();
  //is the use authorized
  const setAuth = useSetAuth();
  const auth = useAuth();
  axios.defaults.withCredentials = true;  //make it possible to use cookies
  const [values, setValues] = useState({
    username: '',
    password: ''
  })
  //submit a new user with post request
  const handleSubmit = (event) => {
    event.preventDefault();
    axios({
      url: `http://localhost:${port}/login`,
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: values,
    })
    .then((res) => {
      // If user succeeds to login - navigate to home page
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data))  //save the user returned in local storage
        toast.success("Success login!", {position: "top-center"});
        setAuth(true);
        //if not all user details completed (user does not have email: he did not pass registerForm)
        if(res.data.email == "" || !res.data.email){
          setTimeout(()=>{navigate("/registerForm")}, 3000);
        }
        else{setTimeout(()=>{navigate("/")}, 3000)};
      }
    })
    // Catch errors if any
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 404) {
            toast.error("username or password not correct", {position: "top-center"});
        } else {  
            toast.error("login failed", {position: "top-center"});
        }
      } else {
        console.log("An unexpected error occurred:", err.message);
      }
    });
  };

  return (
    <div className="loginContainer">
           <ToastContainer/>
           <form className="loginForm">
               <div className = "formTitle"><h1>LOG-IN</h1></div>
               <label className="label">User-Name</label>
               <input  className="input"  name = "username"
               onChange={e=>setValues({...values, username: e.target.value})}
                     type="text" />

               <label className="label">User Password</label>
               <input  className="input" name = "password"
               onChange={e=>setValues({...values, password: e.target.value})}
                   type="password"/>

               <button onClick = {handleSubmit} className="btn"
                       type="submit">
                   submit
               </button>
               <Link className="switchBtn" to = "/register">sign up</Link>
           </form>
    </div>
  )
}

export default Login