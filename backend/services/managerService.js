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

const getPeriodInfo = async (depId) => {
  try {
    const results = await pool.query(`SELECT to_char("date_from", 'YYYY-MM-DD') as date_from, to_char("date_to", 'YYYY-MM-DD') as date_to, app_type
                                      FROM period WHERE is_active = 'true' AND department_id = $1 `, [depId]);
    return results.rows;
  } catch (error) {
    throw Error('Error while fetching period info');
  }
};

const getCommentByStudentIdAndSubject = async (studentId, subject) => {
  try {
    const comment = await pool.query("SELECT * FROM comments WHERE student_id = $1 AND comment_subject = $2", [studentId, subject]);
    return comment.rows[0];
  } catch (error) {
    console.log('Error while getting comments ' + error.message);
    throw Error('Error while getting comments');
  }
};

const insertCommentsByStudentId = async (studentId, comments, subject) => {
  try {
    await pool.query("INSERT INTO comments(comment_text, comment_date, student_id, comment_subject) \
                      VALUES ($1, NOW(), $2, $3)", [comments, studentId, subject]);
  } catch (error) {
    console.log('Error while inserting comments ' + error.message);
    throw Error('Error while inserting comments');
  }
};

const insertPeriodDates = async (id, depId, data) => {
  try {
    await pool.query('UPDATE period SET is_active = \'false\' WHERE department_id = $1 AND app_type = $2', [depId, data.app_type]);
    await pool.query("INSERT INTO period(sso_user_id, date_from, date_to, app_type, is_active, department_id) \
                      VALUES ($1, $2, $3, $4, $5, $6)", [id, data.date_from, data.date_to, data.app_type, true, depId]);
  } catch (error) {
    console.log('Error while inserting period dates ' + error.message);
    throw Error('Error while inserting period dates');
  }
};

const updateCommentsByStudentId = async (studentId, comments, subject) => {
  try {
    await pool.query("UPDATE comments \
                      SET comment_text = $1, comment_date = NOW() \
                      WHERE student_id = $2 AND comment_subject = $3", [comments, studentId, subject]);
  } catch (error) {
    console.log('Error while updating comments ' + error.message);
    throw Error('Error while updating comments');
  }
};


module.exports = {
  loginManager,
  getManager,
  getPeriodInfo,
  getCommentByStudentIdAndSubject,
  insertCommentsByStudentId,
  insertPeriodDates,
  updateCommentsByStudentId
};
