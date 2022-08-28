// Libraries and dependencies
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
// const cron = require('node-cron');
const MiscUtils = require("./MiscUtils.js");

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

app.use((_request, response, next) => {
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

app.get("/", async (_request, response) => {
  response.send("<h2>hello from the server!</h2>");
  // await testMSSQL();
});

app.use("/api/students", studentRoutes);

module.exports = app;
