import React, {createContext, useContext, useState, useEffect }  from 'react'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const SetAuthContext = createContext();

//functions to make all children components know the states and inherit them.

export function useAuth(){
    return useContext(AuthContext);
}

export function useSetAuth(){
    return useContext(SetAuthContext);
}

export function ThemeProvider({children}) {
    const navigate = useNavigate();
    //is the user authorized.
    const [auth, setAuth] = useState(false);

  //if user is unauthorized (does not have a cookie), navigate to home page
  // - if user does not in login or register page
  useEffect(
    ()=>{
        const currentLocation = window.location.href.split("/")[-1]
        if(auth==false && currentLocation!="login" && currentLocation!="register"){
            navigate("/");
            localStorage.removeItem("user"); //clean the local storage
        }
    },[auth]
  )

  return (
    <AuthContext.Provider value = {auth}>
        <SetAuthContext.Provider value = {setAuth}>
            {children}
        </SetAuthContext.Provider>
    </AuthContext.Provider>
  )
}


