const express = require("express");
const dotenv = require("dotenv");
const landingRoute = require("./routes/landing");
const homeRoute = require("./routes/home");
const dashboardRoute = require("./routes/dashboard");
const messageStudentRoute = require("./routes/messageStudent");
const notificationRoute = require("./routes/notification");
const studentRoute = require("./routes/student");
const googleAuthRoute = require("./routes/googleOAuth");
const googleRequestRoute = require("./routes/googleRequest");

dotenv.config();

const PORT = process.env.PORT;

const app = express();

const Authentication = () => {};

app.use(express.json());
//landing and login
app.use("/index", landingRoute);
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
//google
app.use("/google", googleRequestRoute);
app.use("/oauth", googleAuthRoute);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
