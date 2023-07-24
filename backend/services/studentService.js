// database connection configuration
const pool = require("../db_config.js");
const MiscUtils = require("../MiscUtils.js");
const mssql = require("../secretariat_db_config.js");
const msql = require('mssql');
const fs = require('fs');
const JSZip = require('jszip');
const moment = require('moment');
require('dotenv').config();

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
    const results = await pool.query("SELECT * FROM application_files \
                                      WHERE app_id = $1 AND value = true", [appID]);
    return results.rows;
  } catch (error) {
    throw Error('Error while fetching accommodation files: ' + error.message);
  }
};

const getStudentsSecretaryDetails = async (departmentId, AM) => {
  try {
    let procedureResults;

    if (process.env.ENV == 'DEV') {
      return {
        'Grade': 6.7, 'Ects': 160, 'Semester': 7, 'Praktiki': 0, 'CourseCount': 32, 'Studieslevel': 1
      };
    }

    try {
      procedureResults = await getStudentFactorProcedure(MiscUtils.departmentsMap[departmentId], MiscUtils.splitStudentsAM(AM));
    } catch (exc) {
      console.log("SQLException or timeout occurred: " + exc.message);
      return {
        'Grade': 0,
        'Ects': 0,
        'Semester': 0,
        'Praktiki': 0,
        'Studieslevel': ''
      };
    }

    if (procedureResults.Grade == null || procedureResults.Ects == null || procedureResults.Semester == null || procedureResults.Praktiki == null) {
      console.error("some student details fetched from procedure were null");
      return {
        'Grade': 0,
        'Ects': 0,
        'Semester': 0,
        'Praktiki': 0,
        'Studieslevel': ''
      };
    }

    return procedureResults;
  } catch (error) {
    console.log('Error while inserting Approved students rank ' + error.message);
    throw Error('Error while inserting Approved students rank');
  }
};

const getStudentFactorProcedure = async (depId, studentAM) => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    if (process.env.ENV == 'DEV') {
      return {
        Grade: 0,
        Ects: 0,
        Semester: 0,
        Praktiki: true,
        CourseCount: 0,
        Studieslevel: ''
      };
    }

    console.log(mssql);
    console.log(process.env.SECRETARIAT_DB_USER);
    let mspool = await msql.connect(mssql);
    console.log(mspool);

    const result = await mspool.request()
      .input('DepId', msql.Int, depId)
      .input('am', msql.VarChar(100), studentAM)
      .execute('usp_GetStudentFactorPraktiki');
    //console.log(result.recordset[0]);
    return result.recordset[0];
  } catch (error) {
    console.log("error: " + error);
  }
};

const getStudentById = async (id) => {
  try {
    const resultsSSOUsers = await pool.query("SELECT * FROM sso_users \
                                              INNER JOIN student_users \
                                              ON sso_users.uuid = student_users.sso_uid \
                                              WHERE sso_users.uuid = $1", [id]);

    // const student = resultsSSOUsers.rows;
    // return student;

    const student = resultsSSOUsers.rows[0];

    let departmentFieldForProcedure = student.department_id;
    // If length equals 6 then it is a merged TEI department and should keep only 4 digits for the procedure
    // if (student.department_id.toString().length == 6) {
    //   departmentFieldForProcedure = MiscUtils.getAEICodeFromDepartmentId(student.department_id);
    // }

    const studentDetailsProcedure = await getStudentsSecretaryDetails(departmentFieldForProcedure, student.schacpersonaluniquecode);
    let studentDetails = Object.assign(student, studentDetailsProcedure);
    return [studentDetails];
  } catch (error) {
    throw Error('Error while fetching students by id');
  }
};

const getStudentActiveApplication = async (studentId, application_type) => {
  try {
    return await pool.query(`SELECT *
                            FROM applications
                            WHERE uid = $1
                            AND application_type = $2
                            AND is_active = 'true'`, [studentId, application_type]);
  } catch (error) {
    throw Error('Error while fetching student applications');
  }
};

const insertOrUpdateApplication = async (student, filesData, uid) => {
  try {
    const rows = await getStudentActiveApplication(uid, student.application_type);
    // check if rows fetched successfully and if there is an active application
    if (rows && rows.rowCount > 0) {
      // update application and handle files
      return await updateApplicationAndHandleFiles(student, filesData, rows.rows[0].id, student.application_type);
    }

    return await insertNewApplication(student, filesData, uid);
  }
  catch (error) {
    throw Error('Error while inserting or updating files: ' + error.message);
  }
};

const updateApplicationByAppId = async (student, filesData, appId) => {
  try {
    const updateAppResult = await pool.query("UPDATE applications \
      SET status=$1, submit_date=now(), application_type=$2, father_name=$3, location=$4, city=$5, phone=$6, category=$7, family_income=$8, family_state=$9, protected_members=$10, siblings_students=$11, children=$12 \
      WHERE id=$13",
      [0, student.application_type, student.father_name, student.location, student.city, student.phone, student.category, student.family_income, student.family_state, student.protected_members, student.siblings_students, student.children, appId]);

    if (!updateAppResult) {
      throw Error('Application not updated');
    }

    return true;
  } catch (error) {
    throw Error('Error while updating student application ' + error.message);
  }
};

// Updates an existing application and handles file management
const updateApplicationAndHandleFiles = async (student, filesData, appId, appType) => {
  try {
    const updateResult = await updateApplicationByAppId(student, filesData, appId);

    if (updateResult) {
      const deleteFilesResult = await deleteOldApplicationFiles(appId);
      const insertFilesResult = await insertApplicationFilesSubmittedData(appId, filesData, appType);

      if (!deleteFilesResult || !insertFilesResult) {
        throw Error('Files not inserted');
      }
    }

    return updateResult;

  } catch (error) {
    throw Error('Error while handling files: ' + error.message);
  }
};

const getStudentsApplyPhaseMeals = async (userId) => {
  try {
    const query = `SELECT DISTINCT
                        apps.id as app_id,
                        apps.status,
                        apps.submit_date,
                        apps.application_type,
                        apps.uid,
                        apps.father_name,
                        apps.location,
                        apps.city,
                        apps.phone,
                        apps.category,
                        apps.family_income,
                        apps.family_state,
                        apps.protected_members,
                        apps.siblings_students,
                        apps.children,
                        apps.is_active,
                        apps.notes,
                        student_sso_users.*
                    FROM sso_users student_sso_users
                        INNER JOIN student_users ON student_sso_users.uuid = student_users.sso_uid
                        INNER JOIN applications apps ON apps.uid = student_sso_users.uuid
                        INNER JOIN sso_users manager_sso_users ON manager_sso_users.uuid = $1
                        INNER JOIN users_roles ON manager_sso_users.id = users_roles.sso_username
                        INNER JOIN role_manages_academics ON users_roles.user_role_id = role_manages_academics.user_role_id
                        INNER JOIN period ON apps.submit_date BETWEEN period.date_from AND period.date_to AND period.department_id = role_manages_academics.academic_id
                    WHERE student_sso_users.edupersonprimaryaffiliation = 'student'
                        AND apps.application_type = 'meals'
                        AND period.is_active = true
                        AND period.app_type = 'meals'
                        AND student_sso_users.department_id = role_manages_academics.academic_id`;

    const studentsWithAppsMeals = await pool.query(query, [userId]);

    let studentsWithFactorProcedureResult = [];
    studentsWithFactorProcedureResult = await getProcedureResultsForStudent(studentsWithAppsMeals);

    return studentsWithFactorProcedureResult;
  } catch (error) {
    console.error('Error while fetching students from active period' + error.message);
    throw Error('Error while fetching students from active period');
  }
};

const getStudentsMealsCountByYearAndDepartment = async (academicYear) => {
  try {
    const query = `SELECT
                      years.acyear,
                      departments.department_id,
                      COALESCE(all_results, 0) AS all_results,
                      COALESCE(pass, 0) AS pass,
                      COALESCE(fail, 0) AS fail
                    FROM (
                      SELECT DISTINCT department_id FROM sso_users
                    ) departments
                    CROSS JOIN (SELECT DISTINCT acyear FROM period WHERE app_type = 'meals' AND acyear = $1) years
                    LEFT JOIN (
                      SELECT
                        acyear,
                        period.department_id,
                        SUM(CASE WHEN apps.status IS NULL THEN 1 ELSE 0 END) AS all_results,
                        SUM(CASE WHEN apps.status = 1 THEN 1 ELSE 0 END) AS pass,
                        SUM(CASE WHEN apps.status = 0 THEN 1 ELSE 0 END) AS fail
                      FROM sso_users student_sso_users
                        INNER JOIN student_users ON student_sso_users.uuid = student_users.sso_uid
                        INNER JOIN applications apps ON apps.uid = student_sso_users.uuid
                        INNER JOIN period ON apps.submit_date BETWEEN period.date_from AND period.date_to AND period.department_id = student_sso_users.department_id
                      WHERE student_sso_users.edupersonprimaryaffiliation = 'student'
                        AND apps.application_type = 'meals'
                        AND period.app_type = 'meals'
                        AND acyear = $1
                      GROUP BY acyear, period.department_id
                    ) results
                    ON departments.department_id = results.department_id AND years.acyear = results.acyear
                    ORDER BY acyear, departments.department_id`;

    const { rows } = await pool.query(query, [academicYear]);
    return rows;
  } catch (error) {
    console.error('Error while fetching students count from active period' + error.message);
    throw Error('Error while fetching students count from active period');
  }
};

const getStudentsApplyPhaseMealsByYear = async (userId, academicYear) => {
  try {
    const query = `SELECT DISTINCT
                        apps.id as app_id,
                        apps.status,
                        apps.submit_date,
                        apps.application_type,
                        apps.uid,
                        apps.father_name,
                        apps.location,
                        apps.city,
                        apps.phone,
                        apps.category,
                        apps.family_income,
                        apps.family_state,
                        apps.protected_members,
                        apps.siblings_students,
                        apps.children,
                        apps.is_active,
                        apps.notes,
                        student_sso_users.*
                    FROM sso_users student_sso_users
                        INNER JOIN student_users ON student_sso_users.uuid = student_users.sso_uid
                        INNER JOIN applications apps ON apps.uid = student_sso_users.uuid
                        INNER JOIN sso_users manager_sso_users ON manager_sso_users.uuid = $1
                        INNER JOIN users_roles ON manager_sso_users.id = users_roles.sso_username
                        INNER JOIN role_manages_academics ON users_roles.user_role_id = role_manages_academics.user_role_id
                        INNER JOIN period ON apps.submit_date BETWEEN period.date_from AND period.date_to AND period.department_id = role_manages_academics.academic_id
                    WHERE student_sso_users.edupersonprimaryaffiliation = 'student'
                        AND apps.application_type = 'meals'
                        AND period.app_type = 'meals'
                        AND student_sso_users.department_id = role_manages_academics.academic_id
                        AND acyear = $2`;

    const studentsWithAppsMeals = await pool.query(query, [userId, academicYear]);

    let studentsWithFactorProcedureResult = [];
    studentsWithFactorProcedureResult = await getProcedureResultsForStudent(studentsWithAppsMeals);

    return studentsWithFactorProcedureResult;
  } catch (error) {
    console.error('Error while fetching students from active year' + error.message);
    throw Error('Error while fetching students from active year');
  }
};

const getProcedureResultsForStudent = async (studentsWithAppsMeals) => {
  let studentsWithFactorProcedureResult = [];
  for (const student of studentsWithAppsMeals.rows) {
    let departmentFieldForProcedure = student.department_id;

    // If length equals 6 then it is a merged TEI department and should keep only 4 digits for the procedure
    if (departmentFieldForProcedure.toString().length == 6) {
      departmentFieldForProcedure = MiscUtils.getAEICodeFromDepartmentId(departmentFieldForProcedure);
    }
    const factorProcedureResult = await getStudentFactorProcedure(MiscUtils.departmentsMap[departmentFieldForProcedure], MiscUtils.splitStudentsAM(student.schacpersonaluniquecode));
    studentsWithFactorProcedureResult.push({
      ...student,
      ...factorProcedureResult
    });
  }
  return studentsWithFactorProcedureResult;
};

const getStudentsApplyPhaseAccommodation = async (userId) => {
  try {
    const query = `SELECT DISTINCT
                        apps.id as app_id,
                        student_sso_users.*,
                        apps.*
                    FROM sso_users student_sso_users
                        INNER JOIN student_users ON student_sso_users.uuid = student_users.sso_uid
                        INNER JOIN applications apps ON apps.uid = student_sso_users.uuid
                        INNER JOIN sso_users manager_sso_users ON manager_sso_users.uuid = $1
                        INNER JOIN users_roles ON manager_sso_users.id = users_roles.sso_username
                        INNER JOIN role_manages_academics ON users_roles.user_role_id = role_manages_academics.user_role_id
                        INNER JOIN period ON apps.submit_date BETWEEN period.date_from AND period.date_to AND period.department_id = role_manages_academics.academic_id
                    WHERE student_sso_users.edupersonprimaryaffiliation = 'student'
                        AND apps.application_type = 'accommodation'
                        AND period.is_active = true
                        AND period.app_type = 'accommodation'
                        AND student_sso_users.department_id = role_manages_academics.academic_id`;

    const studentsWithAppsAccommodation = await pool.query(query, [userId]);

    let studentsWithFactorProcedureResult = [];
    studentsWithFactorProcedureResult = await getProcedureResultsForStudent(studentsWithAppsAccommodation);

    return studentsWithFactorProcedureResult;
  } catch (error) {
    console.error('Error while fetching students from active period' + error.message);
    throw Error('Error while fetching students from active period');
  }
};

const getStudentsApplyPhaseAccommodationByYear = async (userId, academicYear) => {
  try {
    const query = `SELECT DISTINCT
                        apps.id as app_id,
                        student_sso_users.*,
                        apps.*
                    FROM sso_users student_sso_users
                        INNER JOIN student_users ON student_sso_users.uuid = student_users.sso_uid
                        INNER JOIN applications apps ON apps.uid = student_sso_users.uuid
                        INNER JOIN sso_users manager_sso_users ON manager_sso_users.uuid = $1
                        INNER JOIN users_roles ON manager_sso_users.id = users_roles.sso_username
                        INNER JOIN role_manages_academics ON users_roles.user_role_id = role_manages_academics.user_role_id
                        INNER JOIN period ON apps.submit_date BETWEEN period.date_from AND period.date_to AND period.department_id = role_manages_academics.academic_id
                    WHERE student_sso_users.edupersonprimaryaffiliation = 'student'
                        AND apps.application_type = 'accommodation'
                        AND period.app_type = 'accommodation'
                        AND student_sso_users.department_id = role_manages_academics.academic_id
                        AND acyear = $2`;

    const studentsWithAppsAccommodation = await pool.query(query, [userId, academicYear]);

    let studentsWithFactorProcedureResult = [];
    studentsWithFactorProcedureResult = await getProcedureResultsForStudent(studentsWithAppsAccommodation);

    return studentsWithFactorProcedureResult;
  } catch (error) {
    console.error('Error while fetching students from active year' + error.message);
    throw Error('Error while fetching students from active year');
  }
};

const getOldStudentsAppsForMeals = async (userId) => {
  try {
    const query = `SELECT DISTINCT
                        apps.id as app_id,
                        student_sso_users.*,
                        apps.*
                    FROM sso_users student_sso_users
                        INNER JOIN student_users ON student_sso_users.uuid = student_users.sso_uid
                        INNER JOIN applications apps ON apps.uid = student_sso_users.uuid
                        INNER JOIN sso_users manager_sso_users ON manager_sso_users.uuid = $1
                        INNER JOIN users_roles ON manager_sso_users.id = users_roles.sso_username
                        INNER JOIN role_manages_academics ON users_roles.user_role_id = role_manages_academics.user_role_id
					              INNER JOIN period p1
                          ON apps.submit_date BETWEEN p1.date_from AND p1.date_to
                          AND (p1.is_active = false OR p1.is_active IS NULL) AND p1.department_id = role_manages_academics.academic_id
                          INNER JOIN period p2 ON apps.submit_date NOT BETWEEN p2.date_from AND p2.date_to
                          AND p2.is_active = true AND p2.department_id = role_manages_academics.academic_id
                    WHERE student_sso_users.edupersonprimaryaffiliation = 'student'
                        AND apps.application_type = 'meals'
                        AND p1.app_type = 'meals' AND p2.app_type = 'meals'
                        AND student_sso_users.department_id = role_manages_academics.academic_id`;

    const results = await pool.query(query, [userId]);

    let studentsWithFactorProcedureResult = [];
    studentsWithFactorProcedureResult = await getProcedureResultsForStudent(results);

    return studentsWithFactorProcedureResult;
  } catch (error) {
    console.error('Error while fetching students old meal applications' + error.message);
    throw Error('Error while fetching students old meal applications');
  }
};

const getOldStudentsAppsForAccommodation = async (userId) => {
  try {
    const query = `SELECT DISTINCT
                      apps.id as app_id,
                      student_sso_users.*,
                      apps.*
                    FROM sso_users student_sso_users
                      INNER JOIN student_users ON student_sso_users.uuid = student_users.sso_uid
                      INNER JOIN applications apps ON apps.uid = student_sso_users.uuid
                      INNER JOIN sso_users manager_sso_users ON manager_sso_users.uuid = $1
                      INNER JOIN users_roles ON manager_sso_users.id = users_roles.sso_username
                      INNER JOIN role_manages_academics ON users_roles.user_role_id = role_manages_academics.user_role_id
                      INNER JOIN period p1
                        ON apps.submit_date BETWEEN p1.date_from AND p1.date_to
                        AND (p1.is_active = false OR p1.is_active IS NULL) AND p1.department_id = role_manages_academics.academic_id
                        INNER JOIN period p2 ON apps.submit_date NOT BETWEEN p2.date_from AND p2.date_to
                        AND p2.is_active = true AND p2.department_id = role_manages_academics.academic_id
                    WHERE student_sso_users.edupersonprimaryaffiliation = 'student'
                      AND apps.application_type = 'accommodation'
                      AND p1.app_type = 'accommodation' AND p2.app_type = 'accommodation'
                      AND student_sso_users.department_id = role_manages_academics.academic_id`;

    const results = await pool.query(query, [userId]);

    let studentsWithFactorProcedureResult = [];
    studentsWithFactorProcedureResult = await getProcedureResultsForStudent(results);

    return studentsWithFactorProcedureResult;
  } catch (error) {
    console.error('Error while fetching students old meal applications' + error.message);
    throw Error('Error while fetching students old meal applications');
  }
};

const checkUserAcceptance = async (userId) => {
  try {
    const result = await pool.query("SELECT accepted FROM terms_accepted WHERE sso_user_id = $1", [userId]);

    if (result.rowCount === 0) {
      return false;
    } else if (!result.rows[0].accepted) {
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    throw Error(`An error occured while checking user acceptance: ${error}`);
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

const updateOptionalFilesStatus = async (filenames, value, appId) => {
  try {
    // Update the value for each filename and appId
    for (const filename of filenames) {
      const updateQuery = `
          UPDATE application_files
          SET value = $1
          WHERE name = $2 AND app_id = $3
        `;

      const finalFilename = 'file' + filename.charAt(0).toUpperCase() + filename.slice(1);
      const values = [value, finalFilename, appId];
      console.log(value, filename, appId);
      await pool.query(updateQuery, values);
    }

    return { message: 'Files status updated successfully.' };
  } catch (error) {
    console.error(error.message);
    throw Error('Error while updating file status for optional files');
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
    let isRowEmpty = comment.rows.length === 0;

    if (!isRowEmpty) {
      comment.rows[0].comment_date = moment(comment.rows[0].comment_date).format("YYYY-MM-DD HH:mm:ss");
    }

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
       (status, submit_date, application_type, uid, father_name, location, city, phone, category, family_income, family_state, protected_members, siblings_students, children, is_active) \
        VALUES ($1, now(), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'true') RETURNING id",
      [0, student.application_type, uid, student.father_name, student.location, student.city, student.phone, student.category, student.family_income, student.family_state, student.protected_members, student.siblings_students, student.children]);

    if (!insertAppResult) {
      throw Error('No application inserted');
    }

    const insertFilesDetailsResult = await insertApplicationFilesSubmittedData(insertAppResult.rows[0].id, filesData);
    // if (!insertFilesDetailsResult) {
    //   throw Error('No submitted files data inserted');
    // }

    return true;
  } catch (error) {
    throw Error('Error while inserting student application ' + error.message);
  }
};

const deleteOldApplicationFiles = async (appID) => {
  try {
    const deleteFilesRes = await pool.query(`DELETE FROM application_files
        WHERE app_id = $1`, [appID]);

    return true;
  } catch (error) {
    console.error(error.message);
    throw Error('Error while deleting student files: ' + error.message);
  }
};

const insertApplicationFilesSubmittedData = async (appID, files, appType) => {
  try {
    let itemFoundDetails;
    // traverse files as key value pairs
    for (const [key, value] of Object.entries(files)) {
      //console.log('key ' + key + ' val ' + value);
      if (appType == 'meals') {
        itemFoundDetails = MiscUtils.filesSubmittedMeals.find(element => element.filename == key);
      } else {
        itemFoundDetails = MiscUtils.filesSubmittedAccommodation.find(element => element.filename == key);
      }
      //console.log(itemFoundDetails);
      if (!itemFoundDetails)
        return false;

      const insertFiles = await pool.query("INSERT INTO application_files \
        (name, description, app_id, type, value) VALUES ($1, $2, $3, $4, $5)",
        [itemFoundDetails.filename, itemFoundDetails.description, appID, itemFoundDetails.type, value]);
    }

    return true;
  } catch (error) {
    console.error(error.message);
    throw Error('Error while inserting student files: ' + error.message);
  }
};

const updateSpecialField = async (fieldValue, fieldName, appId) => {
  try {
    const query = `UPDATE applications SET ${fieldName} = ${fieldValue} WHERE id = ${appId}`;
    console.log(query);
    await pool.query(query);
  } catch (error) {
    console.error(error.message);
    throw Error('Error while inserting student files: ' + error.message);
  }
};

const getQuestionsByStudentId = async (studentId) => {
  try {
    const query = 'SELECT * FROM ticket_questions WHERE student_id = $1 ORDER BY question_id DESC';
    const { rows } = await pool.query(query, [studentId]);
    return rows;
  } catch (error) {
    console.error(error.message);
    throw Error('Error fetching questions: ' + error.message);
  }
};

const insertQuestion = async (questionData) => {
  try {
    const { department_id, receiver_role, student_id, question_text } = questionData;
    const query = `INSERT INTO ticket_questions (department_id, receiver_role, student_id, question_text, date_submitted)
    VALUES ($1, $2, $3, $4, NOW())`;

    await pool.query(query, [department_id, receiver_role, student_id, question_text]);
  } catch (error) {
    console.error(error.message);
    throw Error('Error while inserting question: ' + error.message);
  }
};

const insertUserAcceptance = async (userId, areTermsAccepted) => {
  try {
    await pool.query("INSERT INTO terms_accepted (sso_user_id, accepted, acceptance_datetime) \
      VALUES($1, $2, NOW())", [userId, areTermsAccepted]);
  } catch (error) {
    console.error(error);
    throw Error(`An error occured while inserting user acceptance: ${error}`);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getAccommodationFilesByAppID,
  getCommentByStudentIdAndSubject,
  getStudentsApplyPhaseMeals,
  getStudentsApplyPhaseMealsByYear,
  getStudentsApplyPhaseAccommodation,
  getStudentsApplyPhaseAccommodationByYear,
  getApplicationById,
  getOldStudentsAppsForMeals,
  getOldStudentsAppsForAccommodation,
  getQuestionsByStudentId,
  getStudentsMealsCountByYearAndDepartment,
  checkUserAcceptance,
  insertOrUpdateApplication,
  insertNewApplication,
  insertQuestion,
  insertUserAcceptance,
  updateStudentDetails,
  updateStudentContact,
  updateStudentBasicInfo,
  updateStudentSpecialData,
  updateOptionalFilesStatus,
  updateSpecialField,
  loginStudent,
  combineToZIP,
  deleteFiles
};
