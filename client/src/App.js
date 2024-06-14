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
            <Route path = '/lecturer' element = {<LecturerLayout/>}>
              <Route index />
              <Route path = "courses" >
                <Route index element = {<LecturerCourses/>}/>
                <Route path=":courseId/lessons" >
                    <Route index element = {<LecturerLessons/>}/>
                    <Route path = ":lessonId" element = {<LessonDetails/>}/>
                </Route>
                <Route path=":courseId/students" >
                    <Route index element = {<CourseDetails/>}/>
                    <Route path = ":studentId" element = {<LessonDetails/>}/>
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
