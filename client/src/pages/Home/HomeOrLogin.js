import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Globals from '../../Globals.js';
import { useAuth, useSetAuth } from '../../helpers/ThemeProvider.js';
import showErrorMessage from '../../helpers/alertMessage.js';
import HomeAuth from './HomeAuth.js'
import HomeUnauth from './HomeUnauth.js'
import '../../style/home/HomeOrLogin.css'

/*
  *user enter this page: axios for "localhost.."
  *server check the cookie. if cookie not match: user unautorized. show please login
  *if cookie match: server is authorized. user in local storage set to the user the server 
    return by the request (who find it by the username encrypted cookie)
  *cookie match: show the home page with user name
  *logout: remove user form local storage and post http request to /logout that remove cookie
*/

function HomeOrLogin() {
  const port = Globals.PORT_SERVER;
  axios.defaults.withCredentials = true;  // Make it possible to use cookies
  const navigate = useNavigate();
  // The user unauthorized by default. Meaning did not login
  // Is the user authorized
  const setAuth = useSetAuth();
  const auth = useAuth();

  const [user, setUser] = useState({}); // State to store user data

  useEffect(() => {
    axios.get(`http://localhost:${port}`)
      .then((res) => {
        // If user succeeds to login
        if (res.status === 200) {
          const userData = res.data; // Extract user data from response
          setUser(userData); // Set user data in state
          localStorage.setItem("user", JSON.stringify(userData)); // Store user data in local storage
          setAuth(true);
          //if not all required user fields completed:
          if(userData.status!=1){
            setAuth(false);
          }
        } else {
          setAuth(false);
        }
      })
      // Catch errors if any
      .catch((err) => {
        setAuth(false);
        console.log(err);    
      });
  }, [port, setAuth]);

  return (
    <div className='containerHome'>
      {
        auth ?
          <HomeAuth user = {user}/>
          :
          <HomeUnauth/>
      }
    </div>
  );
}

export default HomeOrLogin;