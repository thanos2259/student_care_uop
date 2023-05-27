const Pool = require("pg").Pool;
require('dotenv').config();

const database = (process.env.ENV !== "PROD") ? "student_care_test" : "student_care";

// connection details
const pool = new Pool({
  user: "postgres",
  password: "root",
  database: database,
  host: "localhost",
  port: 5432
});

module.exports = pool;
