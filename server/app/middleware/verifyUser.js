import jwt from 'jsonwebtoken';
import User from '../DL/user.dl.js';

//verify the cookie of the user so he will not need to login any time
/*
  *get the user encrypted cookie
  *decode the cookie to the username (using the secret key)
  *check the username exist in the db
  *return the user if exist
  *if the user does not exist or does not have a cookie: return status 401
*/
const verifyUser = (req, res, next) => {
  const token = req.cookies.username;  //cookie of the user with the key: "username"
  //there is no cookie - user need to login
  if(!token){  
    return res.status(401).json({message: 'Unauthorized'});
  }
  //user have a cookie
  else{
    //decode the cookie with the secret key
    jwt.verify(token, process.env.SECRET_COOKIE_KEY, (err, decoded) => {
      if(err){  //do not succeed to decode the cookie
        return res.status(401).json({message: 'Unauthorized'});
      }
      //decode the cookie- get the username of the user
      else{
        //check  username exists in table users.
        User.getAll(null, decoded.username, (err, data) => {
          if (err){
            return res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving users."
            });}
          else if(data.length === 0){  //there is no such username
            return res.status(401).json({message: 'Unauthorized'});
          }
          req.user = data[0];  //add the user to the request. (we will return it to user after verification suceed)
          next();
        });
      }
  });
}
}

export { verifyUser };