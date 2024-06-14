import express from 'express';

const logoutRoute = app => {

  const router = express.Router();

  //logout the user. clear the cookies.
  router.get("/", (req, res)=>{
    res.clearCookie('username');  //clear the cookie from the user computer
    res.send("logout success");
  });

  app.use('/logout', router);
};

export default logoutRoute;