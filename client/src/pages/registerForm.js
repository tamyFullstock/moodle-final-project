import React , {useState, useEffect} from 'react';
import '../style/pages/registerForm.css'
import { useSetAuth } from '../helpers/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import 'rsuite/dist/rsuite.min.css';
import { toaster, Notification } from 'rsuite';
import showErrorMessage from '../helpers/alertMessage';
import Globals from '../Globals';

function RegisterForm() {
    const port = Globals.PORT_SERVER;
    const navigate = useNavigate();
  //authentication of user
   const setAuth = useSetAuth();
   const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") ?? {})); 

   useEffect(()=>{
    //get current user form local storage
    //if there is an error getting the user from ls, set authentication to false: meaning get out the app
    setUser(JSON.parse(localStorage.getItem("user") ?? {}));
    if (user == {}){
     setAuth(false);
    } 
    setUser({...user, type: "student"}); //default of user is student
    },[]);


  //save the detailed user in the server
  async function saveUserServer(){  
      const response = await fetch(`http://localhost:${port}/users/${user.id}`, {method: 'PUT',
        credentials: 'include', // Ensures cookies are sent with the request
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: JSON.stringify({...user, status:1})});
      if (!response.ok){
        //if user datails are not valid
        if (response.status === 400) {
            const data = await response.json();
            throw new Error(data.message);
        }
        throw new Error("error while trying signing user, please try again");
      }
  }
//submit the user
 async function handleSubmit(e){ 
    //make sure all fields completed
    e.preventDefault();
    try{
        await saveUserServer(); //save the user in the server
        localStorage.setItem("user", JSON.stringify(user)); //save the detailed user in local storage
        navigate("/");
    }
    //error in saving user details
    catch(err){
        showErrorMessage(err.message)
    }
  }
  
  return (
    <div className = 'register-form'>
      <form className="registerForm-form">

        <div className = "formTitle-form"><h1>complete your details</h1></div>

              <div className = "colsContainer">
                  <div className = "firstCol">
                        <div className="inputItemContainer">
                            <label className="label">first name</label>
                            <input  className="input" name = "first_name"
                            onChange={e=>setUser({...user, first_name: e.target.value})}
                            type="text" required />
                        </div>

                        <div className="inputItemContainer">
                            <label className="label">last name</label>
                            <input  className="input" name = "last_name"
                            onChange={e=>setUser({...user, last_name: e.target.value})}
                            type="text" required />
                        </div>

                        <div className="inputItemContainer">
                            <label className="label">email</label>
                            <input  className="input" name = "email"
                            onChange={e=>setUser({...user, email: e.target.value})}
                            type="text" required />
                        </div>

                        <div className="inputItemContainer">
                            <label className="label">address</label>
                            <input  className="input" name = "address"
                            onChange={e=>setUser({...user, address: e.target.value})}
                            type="text" required />
                        </div>

                        <div className="inputItemContainer">
                            <label className="label">phone number</label>
                            <input  className="input" name = "phone"
                            onChange={e=>setUser({...user, phone: e.target.value})}
                            type="text" required />
                        </div>

                        <div className="inputItemContainer">
                            <label htmlFor="userRole">Choose your role:</label>
                            <select
                                onChange={e => setUser({ ...user, type: e.target.value })}
                                className="input" id="userRole">
                                <option value="student">Student</option>
                                <option value="lecturer">Lecturer</option>
                            </select>
                        </div>
                        
                    </div>

              </div>
               

               <button onClick={handleSubmit} className="btn-form"
                       type="submit">
                   submit
               </button>
           </form>
    </div>
  )
}

export default RegisterForm
