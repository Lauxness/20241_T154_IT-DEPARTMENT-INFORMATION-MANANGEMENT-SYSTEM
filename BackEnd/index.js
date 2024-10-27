const express = require("express");
const indexRoute = require("./routes/landing");
const homeRoute = require("./routes/home");
const dashboardRoute = require("./routes/dashboard");
const messageStudentRoute = require("./routes/messageStudent");
const notificationRoute = require("./routes/notification");
const studentRoute = require("./routes/student");
const app = express();

const Authentication = () => {};

app.use(express.json());
//landing and login
app.use("/index", indexRoute);
//home
app.use("/home", homeRoute);
//search and view,delete,update and add student info
app.use("/students", studentRoute);
//notifications
app.use("/notification", notificationRoute);
//message student
app.use("/message", messageStudentRoute);
//dashboard
app.use("/dashboard", dashboardRoute);

app.listen(7000);
