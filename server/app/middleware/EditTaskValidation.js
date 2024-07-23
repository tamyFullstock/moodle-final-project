import User from "../DL/user.dl.js";
import Task from "../DL/task.dl.js";

//check the user change only fields he can change according to its role
//only lecturer can add a grade
const EditTaskValidation = (req, res, next) => {
  const taskId = req.params.id;  //id of task to edit
  if (req.body.grade=="null"){
    req.body.grade = null;
  }
  //find the old task we want to update. to check if grade is been changed
  //if the task has been changed- check the user is a lecturer
  Task.findById(req.params.id, (err, data) => { 
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found task with id ${req.params.id}.`
        });
      } else {
        return res.status(500).send({
          message: "Error retrieving task with id " + req.params.id
        });
      }
    } else {
      const oldTask = data;
      //if the grade has been updated- check the user change it is a lecturer
      if(oldTask.grade != req.body.grade){
        if(req.user.type === "lecturer"){
          next();
        }
        else{
          console.log(req.body.grade);
          console.log(oldTask.grade);
          return res.status(403).json({message: "forbidden action for not lecturer user"}) //403 is forbidden status
        }
      }
      else{ //not chnage the grade- authorized action
        next();
      }
    }
  });
    
  };

  export {EditTaskValidation};