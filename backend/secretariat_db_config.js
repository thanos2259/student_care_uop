require('dotenv').config();
// const msql = require('mssql');
const sqlConfig = {
  user: process.env.SECRETARIAT_DB_USER,
  password: process.env.SECRETARIAT_DB_PWD,
  database: process.env.SECRETARIAT_DB_NAME,
  server: process.env.SECRETARIAT_DB_SERVER,
  port: parseInt(process.env.SECRETARIAT_DB_PORT),
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    //trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};

function printValues() {
  console.log(process.env.SECRETARIAT_DB_USER);
  console.log(process.env.SECRETARIAT_DB_PWD);
  console.log(process.env.SECRETARIAT_DB_NAME);
  console.log(process.env.SECRETARIAT_DB_SERVER);
  console.log(parseInt(process.env.SECRETARIAT_DB_PORT));
}

module.exports = {
  sqlConfig,
  printValues
};


// module.exports = sqlConfig;
