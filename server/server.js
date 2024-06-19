import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import multer from 'multer'

import userRoutes from './app/routes/user.routes.js';
import courseRoute from './app/routes/course.routes.js';
import photoRoute from './app/routes/photo.routes.js';
import lessonRoute from './app/routes/lesson.routes.js';
import hwRoute from './app/routes/hw.routes.js';
import taskRoute from './app/routes/task.routes.js';
import initRoute from './app/routes/initialization.route.js';
import cookieParser from 'cookie-parser';
import registerRoute from './app/routes/authentication/register.route.js';
import loginRoute from './app/routes/authentication/login.route.js';
import logoutRoute from './app/routes/authentication/logout.route.js';
import coursePRoute from './app/routes/courseP.routes.js';

import { verifyUser } from './app/middleware/verifyUser.js'; // Import verifyUser middleware

// Initialize express app
const app = express();

/*
 * cookieParser is a middleware that parses cookies attached to the client request object.
 * After this middleware, you can access cookies via `req.cookies`.
*/
//Middleware to parse cookies from the HTTP request
app.use(cookieParser());

// Enable CORS for only the website client at http://localhost:3000
const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware function to log requests.
// This middleware logs the timestamp, HTTP method, and requested URL to log.txt file.
app.use((req, res, next) => {
  const logData = `${new Date().toISOString()} - ${req.method} ${req.originalUrl}\n`;
  fs.appendFile('./log.txt', logData, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
  next();
});

// Middleware to parse JSON bodies and URL-encoded data conditionally
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

// Apply JSON parser only for POST, PUT, PATCH requests
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    jsonParser(req, res, next);
  } else {
    next();
  }
});

// Apply URL-encoded parser only for POST, PUT, PATCH requests
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    urlencodedParser(req, res, next);
  } else {
    next();
  }
});

// Route definitions
userRoutes(app);
courseRoute(app);
coursePRoute(app);
photoRoute(app);
lessonRoute(app);
hwRoute(app);
taskRoute(app);
initRoute(app);
registerRoute(app);
loginRoute(app);
logoutRoute(app);


// the basic route that returns the user from the verified token/cookie
//if user does not have correct cookie it return status of error. 
//if it verify the use cookie, it return the client the user of the cookie
app.get('/', verifyUser, (req, res) => {
  return res.json(req.user);
});

// Set port and listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});