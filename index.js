const express = require("express");
const bodyParser = require("body-parser"); // Add body-parser
const app = express();
const port = 3000;
const jwt=require('jsonwebtoken')

app.use(bodyParser.json()); // Use body-parser middleware

let ADMINS = [];
let COURSES = [];
let USERS = [];
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
};
// const secretkey ="my_key";
// const generateJWT=(user)=>
// {
//     const payload={username:user.username};
//     return jwt.sign(payload,secretkey,{expiresIn:'1h'})
// }
// const authenticatejwt=(req.res.next)=>{
//     const authHeader=req.headers.authorization;
//     if(authHeader)
//     {
//         const token=authHeader.split(' ')[1];
//         jwt.verify(token,secretkey,(err,user)=>{
//             if(err)
//             {
//                 return res.sendStatus(403);
//             }
//             req.user=user;
//             next();
//         })
//     }
//     else{
//         res.sendStatus(401);
//     }
// }
const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(
    (a) => a.username === username && a.password === password
  );
  if (user) {
    req.user = user; //add user object to
    next();
  } else {
    res.status(403).json({ message: "Admin authentication failed" });
  }
};
app.post("/admin/signup", (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    // const token =generateJWT
    res.json({ message: "ADMIN created" });
  }
});
app.post("/admin/login", adminAuthentication, (req, res) => {
  res.json({ message: "logged in succesfully" });
});
app.post("/admin/courses", adminAuthentication, (req, res) => {
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.json({ message: "Courses created Succesfully", courseid: course.id });
});
app.put("/admin/courses/:courseid", adminAuthentication, (req, res) => {
  const courseid = Number(req.params.courseid);
  const course = COURSES.find((c) => c.id === courseid);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: "Course updated" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});
app.get("/admin/courses", adminAuthentication, (req, res) => {
  res.json({ courses: COURSES });
});
app.get("user/courses", userAuthentication, (req, res) => {
  res.json({ courses: COURSES.filter((c) => c.published) });
});
app.post("/users/courses/:courseid", userAuthentication, (req, res) => {
  const courseid = Number(req.params.courseid);
  const course = COURSES.find((c) => c.id == courseid && c.published);
  if (course) {
    req.user.purchasedCourses.push(courseid);
    res.json({ message: "Course purchased" });
  } else {
    res.status(404).json({ messsage: "Courses not found or not available" });
  }
});
app.get("/user/purchasedCourses", userAuthentication, (req, res) => {
  //const purchasedCourses = COURSES.filter((c.id);
  //req.user.purchasedCourses.includes(c.id);
  var purchasedcourseID = req.user.purchasedCourses;
  [1, 4];
  var purchasedCourses = [];
  for (let i = 0; i < COURSES.length; i++) {
    if (purchasedcourseID < indexof(COURSES[i].id) != -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }
  res.json({purchasedCourses});
});
app.post("/user/signup", (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: [],
  };
  USERS.push(user);
  res.json({ message: "User created" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
