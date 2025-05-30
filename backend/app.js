// Libraries and dependencies
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// Route imports
const studentRoutes = require("./api-routes/studentRoutes.js");
const managerRoutes = require("./api-routes/managerRoutes.js");
const adminRoutes = require("./api-routes/adminRoutes.js");

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
app.use("/api/managers", managerRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
