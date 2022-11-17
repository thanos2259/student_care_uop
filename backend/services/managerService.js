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
  getCommentByStudentIdAndSubject,
  insertCommentsByStudentId,
  updateCommentsByStudentId
};
