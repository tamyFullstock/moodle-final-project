import express from 'express';
import con from '../../DL/db.js'
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser'
import User from '../../DL/user.dl.js';
const salt = 10;

/*
    * This function is used to register a new user
    * check the username and password are valid
    * check there is no such username in the system (tz must be unique)
    * hash the password with the salt. 
    * save the username and hashed password in passwords table
    * save the username in users table who get unique id.
    * return the user from the user table
*/

//register route
const registerRoute = app => {

    const router = express.Router();

    // Inside registerRoute
    router.post('/', function(req, res) {
        console.log(req.body)
        const { username, password } = req.body;
        if (!password || !username){
            res.status(400).send({ message: 'Username and password are required' });
            return 
        }
        const passwordStatus = isStrongPassword(password);
        if(!passwordStatus.success){
            res.status(400).send({ message: passwordStatus.error});
            return 
        }
        if(!isUsernameNumeric(username)){
            res.status(400).send({ message: 'Username must be numeric'});
            return 
        }
        con.query(`SELECT username FROM passwords WHERE username = ${username}`, (err, result) => {
            if (err) {
                res.status(500).send("error retrieving data from passwords table");
                return 
            }
            //there is already user with such tz
            if (result.length > 0 ){
                res.status(400).send("user already exist");
                return 
            }
            //the user is new
            const query = "INSERT INTO passwords (`username`, `password`) VALUES (?)";
            //hash the password with random salt.
            //salt is for make the password unpredictable. improve entropy, make it harder to hacker to try all possible hashed passwords
            //avoid single point of failure- find all passwords from the manager
            bcrypt.hash(password.toString(), salt, (err, hash) => {
                if (err) {
                    res.status(500).send('Error for hashing password');
                    return;
                }
                const values = [
                    username,
                    hash
                ]
                con.query(query, [values], (err, result1) => {
                    if (err) {
                        res.status(500).send('Inserting Data error');
                        return;
                    }
                    //add the user to the table of users
                    else{
                        // Create a user
                        const user = new User({
                            tz: parseInt(username)
                        });
                        User.create(user, (err, data) => {
                            if (err)
                            res.status(500).send({
                                message:
                                err.message || "Some error occurred while creating the user."
                            });
                            //we saved the user in users table and passwords table
                            else {
                                console.log(data);
                                res.send(data);  //return the user created
                                return;
                            }
                        });
                    }
                })
            });
        })
    });
    app.use('/register', router);
};

//check a password is strong enough
function isStrongPassword(password) {
    const status = {error: null, success: true};
    const minLength = 8;  //password must be at least 8 characters
    const hasLetters = /[a-zA-Z]/.test(password); //password must have letters
    const hasNumbers = /[0-9]/.test(password);  //password must have numbers
    if(!password.length > minLength){
        status.error = 'Password must be at least 8 characters'
        status.success = false;
    }
    else if(!hasLetters){
        status.error = 'password must have letters'
        status.success = false;
    }
    else if(!hasNumbers){
        status.error = 'password must have numbers'
        status.success = false;
    }
    return status;
}

//check the username- tz made only from numbers.
function isUsernameNumeric(username) {
    const numericPattern = /^[0-9]+$/;
    return numericPattern.test(username);
}

export default registerRoute;