// Libraries and dependencies
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require('fs');
const formidable = require('formidable');

// Route imports
const studentRoutes = require("./api-routes/studentRoutes.js");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.get("/api", async (request, response) => {
  response.send("<h2>hello from the server!</h2>");
  // await testMSSQL();
});

app.use("/api/students", studentRoutes);


app.post("/api/upload", async (request, response) => {
  let form = new formidable.IncomingForm();
  form.parse(request, function (error, fields, files) {
    let oldpath = files.filetoupload.filepath;
    let newpath = './uploads/' + files.filetoupload.originalFilename;
    fs.rename(oldpath, newpath, function (error) {
      if (error) throw error;
      response.write('File uploaded and moved!');
      response.end();
    });
  });
});


module.exports = app;
