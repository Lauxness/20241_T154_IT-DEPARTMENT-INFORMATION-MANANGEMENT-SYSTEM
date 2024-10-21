const express = require("express");

const app = express();

//landing and login
app.get("/index", (req, res) => {});
app.get("/login/:email", Authentication, (req, res) => {});
app.get("/home", (req, res) => {});

//search and view,delete,update and add student info
app.get("/home/search/students/:name", (req, res) => {});
app.get("/home/search/students/:id", (req, res) => {});
app.get("/students/student_info/:id", (req, res) => {});
app.patch("/students/student_info/:id", (req, res) => {});
app.post("/add/student", (req, res) => {});
app.delete("/students/student_info/:id", (req, res) => {});

//student requirements
app.get("/students/student_requirements/:id", (req, res) => {});
app.post("/students/student_requirements/upload_image/:id", (req, res) => {});
app.patch("/students/student_requirements/:id", (req, res) => {});
app.delete("/students/student_requirements/remove_image/:id", (req, res) => {});

//notifications
app.post("/students/notify", (req, res) => {});
app.get("/notification/inbox", (req, res) => {});
app.delete("/notification/inbox/:id", (req, res) => {});

//message student
app.post("/message/student/:email", (req, res) => {});
app.get("/message/student/:email", (req, res) => {});

//dashboard
app.get("/dashboard", (req, res) => {});

//admin to enrollment officer
app.get("/dashboard/enrollment_officers", (req, res) => {});
app.post("/dashboard/enrollment_officer/add", (req, res) => {});
app.delete("/dashboard/erollment_officer/:id", (req, res) => {});
app.patch("/dashboard/erollment_officer/:id", (req, res) => {});

//gene rate reports
app.post("/dashboard/generate_report", (req, res) => {});

//middleware
const Authentication = () => {};

app.listen(3000);
