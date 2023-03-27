/*********************************************************************************
 *  WEB700 – Assignment 04
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Mahbubul Hasan Student ID: 161258215 Date: 3/05/2023
 *
 ********************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var cd = require("./modules/collegeData.js");

// Add the middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET /students
app.get("/students", async (req, res) => {
  try {
    // check if user input a course parameter i.e /students?course=7
    if (req.query.course) {
      const course = parseInt(req.query.course);
      // check if user course input is a number between 1 and 7
      if (isNaN(course) || course < 1 || course > 7) {
        res.json({ message: "Invalid course number" });
      }
      // filter students by course using our getStudentsByCourse(c) funciton
      const filteredStudents = await cd.getStudentsByCourse(course);
      res.json(filteredStudents);
    } else {
      // else get all the data using getAllStudents() funciton
      const allStudentsData = await cd.getAllStudents();
      res.json(allStudentsData);
    }
  } catch (error) {
    // show 'query returned 0 results' message, in case of no data collected
    res.json({ message: "query returned 0 results" });
  }
});

// GET /tas
app.get("/tas", async (req, res) => {
  try {
    // get and show all managers using our getTAs() function
    const managers = await cd.getTAs();
    res.json(managers);
  } catch (error) {
    // show 'no result' message, in case of no data collected
    res.json({ message: "no result" });
  }
});

// GET /courses
app.get("/courses", async (req, res) => {
  try {
    // get and show all courses using our getCourses() function
    const courses = await cd.getCourses();
    res.json(courses);
  } catch (error) {
    // show 'no result' message, in case of no data collected
    res.status(500).json({ message: "no results" });
  }
});

// GET /student/num
app.get("/student/:num", async (req, res) => {
  try {
    // get the user input parameter 'num'
    const num = parseInt(req.params.num);
    //check if it is a positive number
    if (isNaN(num) || num < 1) {
      res.json({ message: "Invalid student number" });
    }
    // get and show a specific student by id using our function getStudentByNum
    const student = await cd.getStudentByNum(num);
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "no results " });
  }
});

// setup a 'route' to listen on the default url path
// GET / 'home'
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views", "/home.html"));
});

// GET /about
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views", "/about.html"));
});

// GET /htmlDemo
app.get("/htmlDemo", (req, res) => {
  res.sendFile(path.join(__dirname, "/views", "/htmlDemo.html"));
});

app.get("/students/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views", "/addStudent.html"));
});

// Post route for adding a student
app.post("/students/add", function (req, res) {
  // Get student data from req.body
  const studentData = req.body;

  // Call addStudent function with studentData
  cd.addStudent(studentData)
    .then(function () {
      // Redirect to /students on successful resolution
      res.redirect("/students");
    })
    .catch(function (error) {
      // Handle error
      console.log(error);
      res.send("Error adding student");
    });
});

// 'No matching route' if user input wrong URL path we send him a  status 404 'Page Not Found' message
app.use(function (req, res, next) {
  res.status(404).send("Page Not Found");
});

// setup http server to listen on HTTP_PORT
cd.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log("server listening on port: " + HTTP_PORT);
    });
  })
  .catch((error) => {
    console.error(`Error initializing data: ${error}`);
  });
