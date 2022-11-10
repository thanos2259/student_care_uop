const pool = require("../db_config.js");
const msql = require('mssql');

// dummy login with username only for testing purposes
const loginManager = async (username) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users \
                                                  WHERE edupersonprimaryaffiliation = 'affiliate' \
                                                  AND id=$1", [username]);
    if (resultsSSOUsers.rowCount >= 1) {
      return resultsSSOUsers.rows[0].uuid;
    }
    return null;
  } catch (error) {
    throw Error('Error while logging in');
  }
};

const getManager = async (id) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users \
                                                  WHERE edupersonprimaryaffiliation = 'affiliate' \
                                                  AND uuid=$1", [id]);

    return resultsSSOUsers.rows;
  } catch (error) {
    throw Error('Error while fetching manager');
  }
};


module.exports = {
  loginManager,
  getManager
};
