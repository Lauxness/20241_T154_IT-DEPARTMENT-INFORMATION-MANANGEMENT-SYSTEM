const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const loginRoute = require("./routes/login");
const homeRoute = require("./routes/home");
const dashboardRoute = require("./routes/dashboard");
const notificationRoute = require("./routes/notification");
const studentRoute = require("./routes/student");
const activityRoute = require("./routes/activities");
const { Authorization } = require("./services/AuthorizationServices");
require("./services/googleOAuthServices");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT;

//landing and login
app.use("/index", loginRoute);
//home
app.use("/home", Authorization, homeRoute);
//search and view,delete,update and add student info
app.use("/students", Authorization, studentRoute);
//notifications
app.use("/notification", Authorization, notificationRoute);
//message student
app.use("/activity", Authorization, activityRoute);
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
