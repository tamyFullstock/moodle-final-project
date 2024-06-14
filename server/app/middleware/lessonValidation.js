import Lesson from "../DL/lesson.dl.js";

//still need to check constrait course is valid and exist
//check all user fields are valid
const chechLessonValidation = (req, res, next) => {
    const lesson = new Lesson(req.body);
    const {title, year, month, day, hour, course_id} = lesson;
    if (!title ) {
      return res.status(400).send("title is required");
    }
    if (!year ) {
      return res.status(400).send("year is required");
    }
    if (!month ) {
      return res.status(400).send("month is required");
    }
    if (!day ) {
      return res.status(400).send("day is required");
    }
    if (!hour ) {
      return res.status(400).send("hour is required");
    }
    if (!course_id){
      return res.status(400).send("Course Id is required");
    }
    if(year>new Date().getFullYear()){
      return res.status(400).send("Year should not be greater than current year");
    }
    if(year<2000){
      return res.status(400).send("Year should not be less than 2000");
    }
    if(month<0 || month>12 || day<0 || day>31 || hour<0 || hour>24){
      return res.status(400).send("Invalid date or time");
    }
    req.validLesson = lesson;
    next();
  };

  export {chechLessonValidation};