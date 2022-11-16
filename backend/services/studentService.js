// database connection configuration
const pool = require("../db_config.js");
const MiscUtils = require("../MiscUtils.js");
const mssql = require("../secretariat_db_config.js");
const msql = require('mssql');
const fs = require('fs');
const JSZip = require('jszip');
const moment = require('moment');

const getAllStudents = async () => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users \
                                              INNER JOIN student_users \
                                              ON sso_users.uuid = student_users.sso_uid \
                                              WHERE sso_users.edupersonprimaryaffiliation = 'student'");
    return resultsSSOUsers.rows;
  } catch (error) {
    throw Error('Error while fetching students');
  }
};

const getAccommodationFilesByAppID = async (appID) => {
  try {
    const results = await pool.query("SELECT * FROM accommodation_files \
                                      WHERE app_id = $1 AND value = true", [appID]);
    return results.rows;
  } catch (error) {
    throw Error('Error while fetching accommodation files: ' + error.message);
  }
};

// const getStudentsSecretaryDetails = async (departmentId, AM) => {
//   try {
//     let procedureResults;
//     try {
//       procedureResults = await getStudentFactorProcedure(MiscUtils.departmentsMap[departmentId], MiscUtils.splitStudentsAM(AM));
//     } catch (exc) {
//       console.log("SQLException or timeout occurred: " + exc.message);
//       return {
//         'Grade': 0,
//         'Ects': 0,
//         'Semester': 0,
//         'Praktiki': 0
//       };
//     }

//     if (!procedureResults.Grade || !procedureResults.Ects || !procedureResults.Semester || !procedureResults.Praktiki) {
//       console.error("some student details fetched from procedure were null");
//       return {
//         'Grade': 0,
//         'Ects': 0,
//         'Semester': 0,
//         'Praktiki': 0
//       };
//     }

//     return procedureResults;
//   } catch (error) {
//     console.log('Error while inserting Approved students rank ' + error.message);
//     throw Error('Error while inserting Approved students rank');
//   }
// };

// const getStudentFactorProcedure = async (depId, studentAM) => {
//   try {
//     // make sure that any items are correctly URL encoded in the connection string
//     let mspool = await msql.connect(mssql);

//     const result = await mspool.request()
//       .input('DepId', msql.Int, depId)
//       .input('am', msql.VarChar(100), studentAM)
//       .execute('usp_GetStudentFactorPraktiki');

//     return result.recordset[0];
//   } catch (error) {
//     // error checks
//     throw Error('error' + error);
//     //console.log("error: " + error);
//   }
// };

const getStudentById = async (id) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users \
                                              INNER JOIN student_users \
                                              ON sso_users.uuid = student_users.sso_uid \
                                              WHERE sso_users.uuid = $1", [id]);

    // const student = resultsSSOUsers.rows[0];
    //const studentDetailsProcedure = await getStudentsSecretaryDetails(student.department_id, student.schacpersonaluniquecode);
    //let studentDetails = Object.assign(student, studentDetailsProcedure);
    //return [studentDetails];
    const student = resultsSSOUsers.rows;
    return student;
  } catch (error) {
    throw Error('Error while fetching students by id');
  }
};

// dummy login with username only for testing purposes
const loginStudent = async (username) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users \
                                              INNER JOIN student_users \
                                              ON sso_users.uuid = student_users.sso_uid \
                                              WHERE sso_users.edupersonprimaryaffiliation = 'student' \
                                              AND sso_users.id=$1", [username]);
    if (resultsSSOUsers.rowCount >= 1) {
      return resultsSSOUsers.rows[0].uuid;
    }
    return null;
  } catch (error) {
    throw Error('Error while logging in');
  }
};

const updateStudentDetails = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "father_name = $1, father_last_name = $2, mother_name = $3, mother_last_name = $4 WHERE sso_uid = $5",
      [student.father_name, student.father_last_name, student.mother_name, student.mother_last_name, id]
    );

    return updateResults;
  } catch (error) {
    throw Error('Error while updating student details');
  }
};

const updateStudentContact = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "phone = $1, address = $2, location = $3, city = $4, post_address = $5, country = $6  WHERE sso_uid = $7",
      [student.phone, student.address, student.location, student.city, student.post_address, student.country, id]);

    return updateResults;
  } catch (error) {
    throw Error('Error while updating student contact details');
  }
};

const updateStudentBasicInfo = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "father_name = $1, location = $2, city = $3, phone = $4, category=$5 WHERE sso_uid = $6",
      [student.father_name, student.location, student.city, student.phone, student.category, id]);

    return updateResults;
  } catch (error) {
    throw Error('Error while updating student basic information');
  }
};

const updateStudentSpecialData = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "family_income = $1, family_state = $2, protected_members = $3, siblings_students = $4, children = $5 WHERE sso_uid = $6",
      [student.family_income, student.family_state, student.protected_members, student.siblings_students, student.children, id]);

    return updateResults;
  } catch (error) {
    throw Error('Error while updating student special data');

  }
};

const getApplicationById = async (id) => {
  try {
    const results = await pool.query("SELECT id, status, to_char(\"submit_date\", 'DD/MM/YYYY') as submit_date, application_type, uid, \
                                     father_name, location, city, phone, category, family_income, family_state, protected_members, siblings_students, children \
                                     FROM applications \
                                     WHERE uid = $1", [id]);

    return results.rows;
  } catch (error) {
    throw Error('Error while fetching student application' + error.message);
  }
};

const getCommentByStudentIdAndSubject = async (studentId, subject) => {
  try {
    const comment = await pool.query("SELECT * FROM comments WHERE student_id = $1 AND comment_subject = $2", [studentId, subject]);
    // Change the date because comment_date was wrong even if timezones seemed correct both in nodejs and db.
    comment.rows[0].comment_date = moment(comment.rows[0].comment_date).format("YYYY-MM-DD HH:mm:ss");
    return comment.rows[0];
  } catch (error) {
    console.log('Error while getting comments ' + error.message);
    throw Error('Error while getting comments');
  }
};

const combineToZIP = (id, applicationType) => {
  try {
    const zip = new JSZip();
    let directory = './uploads/' + id + "/" + applicationType.slice(0, 3) + '/';
    filenames = fs.readdirSync(directory, { withFileTypes: true });

    filenames.forEach(file => {
      // console.log(file);
      const pdfData = fs.readFileSync(directory + file.name);
      zip.file(file.name, pdfData);
    });

    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
      .pipe(fs.createWriteStream(directory + 'dikaiologitika_student_' + id + '.zip'))
      .on('finish', function () {
        console.log('ZIP written for student with id' + id);
      });
  } catch (error) {
    throw Error(error.message);
  }
};

const deleteFiles = (studentId, applicationType) => {
  const fileDir = "./uploads/";
  const path = fileDir + studentId + '/' + applicationType.slice(0, 3) + '/';

  try {
    // Read the directory given in `path`
    const files = fs.readdir(path, (err, files) => {
      if (err)
        throw err;
      files.forEach((file) => {
        // Check if the file is with a PDF extension, remove it
        if (file.split('.').pop().toLowerCase() == 'pdf') {
          fs.unlinkSync(path + file);
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const insertNewApplication = async (student, filesData, uid) => {
  try {
    const insertAppResult = await pool.query("INSERT INTO applications \
       (status, submit_date, application_type, uid, father_name, location, city, phone, category, family_income, family_state, protected_members, siblings_students, children) \
        VALUES ($1, now(), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id",
      [0, student.application_type, uid, student.father_name, student.location, student.city, student.phone, student.category, student.family_income, student.family_state, student.protected_members, student.siblings_students, student.children]);

    if (!insertAppResult) {
      throw Error('No application inserted');
    }

    const insertFilesDetailsResult = await insertAccommodationFilesSubmittedData(insertAppResult.rows[0].id, filesData);
    // if (!insertFilesDetailsResult) {
    //   throw Error('No submitted files data inserted');
    // }

    return true;
  } catch (error) {
    throw Error('Error while inserting student application ' + error.message);
  }
};

insertAccommodationFilesSubmittedData = async (appID, files) => {
  try {
    // traverse files as key value pairs
    for (const [key, value] of Object.entries(files)) {
      //console.log('key ' + key + ' val ' + value);
      let itemFoundDetails = MiscUtils.filesSubmitted.find(element => element.filename == key);
      //console.log(itemFoundDetails);
      if (!itemFoundDetails)
        return false;

      const insertFiles = await pool.query("INSERT INTO accommodation_files \
        (name, description, app_id, type, value) VALUES ($1, $2, $3, $4, $5)",
        [itemFoundDetails.filename, itemFoundDetails.description, appID, itemFoundDetails.type, value]);
    }

    return true;
  } catch (error) {
    throw Error('Error while inserting student files: ' + error.message);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getAccommodationFilesByAppID,
  getCommentByStudentIdAndSubject,
  updateStudentDetails,
  updateStudentContact,
  updateStudentBasicInfo,
  updateStudentSpecialData,
  insertNewApplication,
  getApplicationById,
  loginStudent,
  combineToZIP,
  deleteFiles
};
