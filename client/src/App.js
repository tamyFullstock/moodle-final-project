import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { ThemeProvider } from './helpers/ThemeProvider';
import HomeOrLogin from './pages/Home/HomeOrLogin'
import Register from './pages/authentication/registration' 
import Login from './pages/authentication/login'
import RegisterForm from './pages/registerForm';
import LecturerLayout from './pages/lecturer/LecturerLayout';
import LecturerCourses from './pages/lecturer/courses/lecturerCourses';
import LecturerLessons from './pages/lecturer/lessons/lecturerLessons';
import LessonDetails from './pages/lecturer/lessons/detailedLesson';
import CourseDetails from './pages/lecturer/courses/detailedCourse';
import DetailsHw from './pages/lecturer/lessons/homeworks/detailedHomework';
import DetailedUser from './pages/UserDetails/DetailedUser';
import StudentCourses from './pages/student/courses/studentCourses'
import StudentDetailedLesson from './pages/student/lessons/detailedLesson'
import StudentTasks from './pages/student/tasks/StudentTasks';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/">
            <Route index element = {<HomeOrLogin/>}/>
            <Route path = '/register' element = {<Register/>}/>
            <Route path = '/registerForm' element = {<RegisterForm/>}/>
            <Route path = '/login' element = {<Login/>}/>
            <Route path = 'lecturer/:userId' element = {<LecturerLayout/>}>
              <Route index />
              <Route path = 'details' element = {<DetailedUser/>}/>
              <Route path = "courses" >
                <Route index element = {<LecturerCourses/>}/>
                <Route path = ":courseId">
                    <Route path="lessons" >
                        <Route index element = {<LecturerLessons/>}/>
                        <Route path = ":lessonId">
                          <Route index element = {<LessonDetails/>}/>
                          <Route path = "homework/:homeworkId" element= {<DetailsHw/>}/>
                        </Route> 
                    </Route>
                    <Route path="students" >
                        <Route index element = {<CourseDetails/>}/>
                        <Route path = ":studentId" element = {<LessonDetails/>}/>
                        <Route path = ":studentId/details" element = {<DetailedUser/>}/>
                    </Route>
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path = 'student/:userId' element = {<LecturerLayout/>}>
              <Route index />
              <Route path = 'details' element = {<DetailedUser/>}/>
              <Route path = 'tasks' element = {<StudentTasks/>}/>
              <Route path = "courses" >
                <Route index element = {<StudentCourses/>}/>
                <Route path = ":courseId">
                    <Route path="lessons" >
                        <Route index element = {<LecturerLessons/>}/>
                        <Route path = ":lessonId">
                          <Route index element = {<StudentDetailedLesson/>}/>
                          <Route path = "homework/:homeworkId" element= {<DetailsHw/>}/>
                        </Route> 
                    </Route>
                    <Route path="students" >
                        <Route index element = {<CourseDetails/>}/>
                        <Route path = ":studentId" element = {<LessonDetails/>}/>
                        <Route path = ":studentId/details" element = {<DetailedUser/>}/>
                    </Route>
                </Route>
              </Route>
            </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

