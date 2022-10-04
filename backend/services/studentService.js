// database connection configuration
// const { addSyntheticLeadingComment } = require("typescript");
const pool = require("../db_config.js");
const MiscUtils = require("../MiscUtils.js");
const mssql = require("../secretariat_db_config.js");
const msql = require('mssql');

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
    // const student = resultsSSOUsers.rows;
    // return student;
    const student = resultsSSOUsers.rows[0];
    const studentDetailsProcedure = await getStudentsSecretaryDetails(student.department_id, student.schacpersonaluniquecode);
    let studentDetails = Object.assign(student, studentDetailsProcedure);
    return [studentDetails];
  } catch (error) {
    throw Error('Error while fetching students');
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


const getFileMetadataByStudentId = async (userId, docType) => {
  try {
    const fileMetadata = await pool.query("SELECT * FROM sso_user_files \
                                          WHERE sso_uid = $1 \
                                          AND doc_type = $2 \
                                          ORDER BY file_id DESC", [userId, docType]);
    return fileMetadata;
  } catch (error) {
    throw Error('Error while fetching students');
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
    throw Error('Error while updating students');
  }
};

const updateStudentContractDetails = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "ssn = $1, doy = $2, iban = $3 WHERE sso_uid = $4",
      [student.ssn, student.doy, student.iban, id]
    );

    return updateResults;
  } catch (error) {
    throw Error('Error while updating students');
  }
};


const updateStudentContact = async (student, id) => {
  try {
    const updateResults = await pool.query("UPDATE student_users \
     SET " + "phone = $1, address = $2, location = $3, city = $4, post_address = $5, country = $6  WHERE sso_uid = $7",
      [student.phone, student.address, student.location, student.city, student.post_address, student.country, id]);

    return updateResults;
  } catch (error) {
    throw Error('Error while updating contact details from students');
  }
};


const insertOrUpdateMetadataBySSOUid = async (studentId, docType, filePath, fileName, fileExtension) => {
  try {
    const filesData = await getFileMetadataByStudentId(studentId, docType);

    if (!MiscUtils.FILE_TYPES.includes(fileExtension)) {
      return 'Incorrect File Type';
    }

    if (filesData.rowCount != 0) {
      await updateFileDataBySSOUid(studentId, docType, filePath, fileName, fileExtension);
    } else {
      await insertFileMetadataBySSOUid(studentId, docType, filePath, fileName, fileExtension);
    }

  } catch (error) {
    throw Error("Error while inserting file data for: " + docType + " student: " + studentId);
  }
};

const insertFileMetadataBySSOUid = async (studentId, docType, filePath, fileName) => {
  console.log("to be inserted " + docType);
  try {
    await pool.query("INSERT INTO sso_user_files(sso_uid, file_name, file_path, doc_type, date_uploaded) \
                      VALUES ($1, $2, $3, $4, now())", [studentId, fileName, filePath, docType]);
  } catch (error) {
    throw Error("Error while updating file data for: " + docType + " student: " + studentId);
  }
};

const updateFileDataBySSOUid = async (studentId, docType, filePath, fileName) => {
  console.log("to be updated " + docType);
  try {
    await pool.query("UPDATE sso_user_files SET file_name = $1, file_path = $2, date_uploaded = now() \
    WHERE sso_uid = $3 AND doc_type = $4", [fileName, filePath, studentId, docType]);
  } catch (error) {
    throw Error("Error while updating file data for: " + docType + " student: " + studentId);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getFileMetadataByStudentId,
  updateStudentDetails,
  updateStudentContractDetails,
  updateStudentContact,
  // dummy login
  loginStudent,
  insertOrUpdateMetadataBySSOUid
};
