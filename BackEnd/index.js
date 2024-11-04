const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const mongoose = require("mongoose");
const landingRoute = require("./routes/landing");
const homeRoute = require("./routes/home");
const dashboardRoute = require("./routes/dashboard");
const messageStudentRoute = require("./routes/messageStudent");
const notificationRoute = require("./routes/notification");
const studentRoute = require("./routes/student");
const googleAuthRoute = require("./routes/googleOAuth");
const googleRequestRoute = require("./routes/googleRequest");
const { Authorization } = require("./services/AuthorizationServices");

dotenv.config();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

const PORT = process.env.PORT;

app.use(express.json());
//landing and login
app.use("/index", landingRoute);
//home
app.use("/home", Authorization, homeRoute);
//search and view,delete,update and add student info
app.use("/students", Authorization, studentRoute);
//notifications
app.use("/notification", Authorization, notificationRoute);
//message student
app.use("/message", Authorization, messageStudentRoute);
//dashboard
app.use("/dashboard", Authorization, dashboardRoute);
//google

//mongodb connection
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Connected to DATABSE and server is Listening to port ${PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
