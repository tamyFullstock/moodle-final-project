import express from 'express';
import con from '../../DL/db.js'
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import User from '../../DL/user.dl.js';
const salt = 10;

/*
    *get username and password
    *passwords table have username and hashed password
    *check there is such username
    *if yes, compare hashed password with hashed input password
    *then check the user exist in users table
    *if match, set a cookie with key: username
    *the value of the cookie is the username encrypted with secret key.
    *the cookie last for only 1 day
    *success login return the user from the users table
*/
//login route
const loginRoute = app => {

    const router = express.Router();

    // Inside registerRoute
    router.post('/', function(req, res) {
        const query = "SELECT * from passwords WHERE username = ?";
        con.query(query, [req.body.username], (err,data)=>{
            if(err){
                res.status(500).send('login error');
                    return;
            }
            //there is such user with this username
            if(data.length > 0){
                //make hash for both passwords (user and table) if the result okay: success login.
                bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                    //passwords not matched
                    if(err || response == false){
                        res.status(404).send('login failure');
                        return;
                    }
                    //password hashed matched
                    const username = data[0].username;
                    //check username exists in table users. if exist: return the user object
                    User.getAll(null,username, (err, data) => {
                        if (err){
                        return res.status(500).send({
                            message:
                            err.message || "Some error occurred while retrieving users."
                        });}
                        else if(data.length === 0){  //there is no such username
                        return res.status(401).json({message: 'Unauthorized'});
                        }
                        //the cookie has a secret key and expires in 1 day.
                        const token = jwt.sign({username}, process.env.SECRET_COOKIE_KEY, {expiresIn: '1d'}); //i know i should replace jwt-secret-key with secret key          
                        res.cookie('username', token);  //store the token in the cookie of the user
                        return res.json(data[0]); //return the user object
                    });
                })
            }
            //there is no such user in db
            else{
                res.status(404).send('login failure');
                return;
            }
        })
    });
    app.use('/login', router);
    
};

export default loginRoute;