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
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
const PORT = process.env.PORT;

app.use("/index", loginRoute);

app.use("/home", Authorization, homeRoute);

app.use("/students", Authorization, studentRoute);

app.use("/notification", Authorization, notificationRoute);

app.use("/activity", Authorization, activityRoute);

app.use("/dashboard", Authorization, dashboardRoute);

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
