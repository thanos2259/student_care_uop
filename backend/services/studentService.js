// database connection configuration
// const { addSyntheticLeadingComment } = require("typescript");
const pool = require("../db_config.js");
const MiscUtils = require("../MiscUtils.js");
const mssql = require("../secretariat_db_config.js");
const msql = require('mssql');
const fs = require('fs');
const JSZip = require('jszip');
const { async } = require("rxjs");

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
     SET " + "father_name = $1, location = $2, city = $3, phone = $4 WHERE sso_uid = $5",
      [student.father_name, student.location, student.city, student.phone, id]);

    return updateResults;
  } catch (error) {
    throw Error('Error while updating student basic information');
  }
};

const updateStudentBasicDocuments = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "category = $1 WHERE sso_uid = $2",
      [student.category, id]);

    return updateResults;
  } catch (error) {
    throw Error('Error while updating student basic documents');
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

const insertNewApplication = async (student, uid) => {
  try {
    const insertApp = await pool.query("INSERT INTO applications \
       (status, submit_date, application_type, uid) VALUES ($1, now(), $2, $3)",
      [0, student.application_type, uid]);

    return insertApp;
  } catch (error) {
    throw Error('Error while inserting student application' + error.message);

  }
};

const getApplicationById = async (id) => {
  try {
    const results = await pool.query("SELECT id, status, to_char(\"submit_date\", 'DD/MM/YYYY') as submit_date, application_type, uid \
                                      FROM applications \
                                      WHERE uid=$1", [id]);

    return results.rows;
  } catch (error) {
    throw Error('Error while fetching student application' + error.message);
  }
};

const combineToZIP = (id) => {
  try {
    const zip = new JSZip();
    let directory = './uploads/' + id + '/';
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

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudentDetails,
  updateStudentContact,
  updateStudentBasicInfo,
  updateStudentBasicDocuments,
  updateStudentSpecialData,
  insertNewApplication,
  getApplicationById,
  loginStudent,
  combineToZIP
};
