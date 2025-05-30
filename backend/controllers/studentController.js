const studentService = require("../services/studentService.js");
const jwt = require("jsonwebtoken");
const formidable = require('formidable');
const fs = require('fs');
require('dotenv').config();
const path = require('path');

// app.post("/api/students/login/:id", (request, response, next) => {
const login = async (request, response, next) => {
  console.log(request.body);
  const uname = request.body.username;
  let userId;

  if (uname)
    userId = await studentService.loginStudent(uname);

  console.log("uid " + userId);

  if (userId == null)
    response.status(401).json({
      message: 'Unauthorized'
    });
  else {
    const token = jwt.sign({
      userId: userId
    },
      "secret_this_should_be_longer", {
      expiresIn: "1h"
    });
    response.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: userId
    });
  }
};

/**
 * Returns all students from SSO and student users tables.
 */
const getAllStudents = async (request, response) => {
  try {
    const students = await studentService.getAllStudents();
    response.status(200).json(students);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getApplicationsById = async (request, response) => {
  try {
    const studentId = request.params.id;
    const student = await studentService.getApplicationById(studentId);
    response.status(200).json(student);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentsApplyPhaseMeals = async (request, response) => {
  try {
    const userId = request.params.id;
    const studentsApps = await studentService.getStudentsApplyPhaseMeals(userId);
    response.status(200).json(studentsApps);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentsApplyPhaseMealsByYear = async (request, response) => {
  try {
    const userId = request.query.id;
    const academicYear = request.query.year;
    const studentsApps = await studentService.getStudentsApplyPhaseMealsByYear(userId, academicYear);
    response.status(200).json(studentsApps);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentsApplyPhaseAccommodation = async (request, response) => {
  try {
    const userId = request.params.id;
    const studentsApps = await studentService.getStudentsApplyPhaseAccommodation(userId);
    response.status(200).json(studentsApps);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentsApplyPhaseAccommodationByYear = async (request, response) => {
  try {
    const userId = request.query.id;
    const academicYear = request.query.year;
    const studentsApps = await studentService.getStudentsApplyPhaseAccommodationByYear(userId, academicYear);
    response.status(200).json(studentsApps);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

// get accommodation files information by application id
const getAccommodationFiles = async (request, response) => {
  try {
    const appID = request.params.id;
    const files = await studentService.getAccommodationFilesByAppID(appID);
    response.status(200).json(files);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentById = async (request, response) => {
  try {
    const studentId = request.params.id;
    const student = await studentService.getStudentById(studentId);
    response.status(200).json(student);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getCommentByStudentIdAndSubject = async (request, response) => {
  try {
    const id = request.query.studentId;
    const subject = request.query.subject;

    const comment = await studentService.getCommentByStudentIdAndSubject(id, subject);
    response.status(200).json(comment);
  } catch (error) {
    response.send({
      message: error.message
    });
  }
};

const getOldStudentsAppsForMeals = async (request, response) => {
  try {
    const userId = request.params.id;

    const comment = await studentService.getOldStudentsAppsForMeals(userId);
    response.status(200).json(comment);
  } catch (error) {
    response.send({
      message: error.message
    });
  }
};

const getOldStudentsAppsForAccommodation = async (request, response) => {
  try {
    const userId = request.params.id;

    const comment = await studentService.getOldStudentsAppsForAccommodation(userId);
    response.status(200).json(comment);
  } catch (error) {
    response.send({
      message: error.message
    });
  }
};

const getStudentsCountByYearAndDepartment = async (request, response) => {
  try {
    const academicYear = request.query.year;
    const type = request.query.type;

    const stats = await studentService.getStudentsCountByYearAndDepartment(academicYear, type);
    response.status(200).json(stats);
  } catch (error) {
    response.status(400).json({
      message: error.message
    });
  }
};

const getStudentAppsByYear = async (request, response) => {
  try {
    const academicYear = request.query.year;
    const type = request.query.type;

    const stats = await studentService.getStudentAppsByYear(academicYear, type);
    response.status(200).json(stats);
  } catch (error) {
    response.status(400).json({
      message: error.message
    });
  }
};

const checkUserAcceptance = async (request, response) => {
  const studentId = request.params.id;
  try {
    const resultsFound = await studentService.checkUserAcceptance(studentId);

    response.status(200)
      .json({
        message: 'User acceptance checked successfully',
        accepted: resultsFound
      });

  } catch (error) {
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const updateStudentDetails = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentDetails(student, id);

    response
      .status(200)
      .json({
        message: 'Student details updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentContact = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentContact(student, id);

    response
      .status(200)
      .json({
        message: 'Student contact updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentBasicInfo = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    await studentService.updateStudentBasicInfo(student, id);
    response
      .status(200)
      .json({
        message: 'Student basic information updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentSpecialData = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body.studentData;
    const filesData = request.body.submittedFilesData;
    const deleteFilesEnabled = false; // File deletion is currently disabled

    await studentService.updateStudentSpecialData(student, id);

    console.log(student.application_type);
    studentService.combineToZIP(id, student.application_type);
    if (deleteFilesEnabled) {
      studentService.deleteFiles(id, student.application_type);
    }
    await studentService.insertOrUpdateApplication(student, filesData, id);

    response
      .status(200)
      .json({
        message: 'Student special data updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const uploadFile = async (request, response) => {
  const studentId = request.params.id;
  const fileDir = "./uploads/";
  const finalFileName = request.params.fileIndex;
  const applicationType = finalFileName.slice(0, 3);
  const path = fileDir + studentId + "/" + applicationType + "/";
  // currently we have only pdf files, if more types will be added, we should split the name or mimetype
  const fileType = ".pdf";

  try {
    fs.mkdirSync(path, { recursive: true });

    let form = new formidable.IncomingForm();
    form.parse(request, function (error, fields, files) {
      // console.log(files);
      let oldpath = files.file.filepath;
      let newpath = path + finalFileName + fileType;

      let size = fs.statSync(oldpath).size;
      let sizeToMb = (size / (1024 * 1024)).toFixed(2);

      if (sizeToMb > 4) {
        return response.status(400).json({
          status: "Failure",
          message: "File was too big",
        });
      }
      fs.rename(oldpath, newpath, function (error) {
        if (error) {
          return response.status(400).json({
            status: "Failure",
            message: "File was not uploaded",
          });
        } else {
          return response.status(200).json({
            status: "success",
            message: "File uploaded and moved!",
          });
        }
      });
    });
  } catch (error) { console.log(error); }
};

const sendFile = async (request, response) => {
  try {
    const id = request.params.id;
    // let initialPath = 'C:/Users/thanos/Documents/Github/student_care_uop/';
    let initialPath = 'C:/Users/losNasos/Documents/workspace/student_care_uop/';
    // let initialPath = 'C:/xampp/htdocs/student_care_uop/uploads/';
    const fileName = request.body.fileName + '.pdf';
    const filePath = './uploads/' + id + '/';

    let metadata = { file_path: filePath, file_name: fileName };

    response
      .status(200)
      .sendFile(initialPath + metadata.file_path + metadata.file_name);

  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};


const sendFileByType = async (request, response) => {
  try {
    const id = request.params.id;
    // let initialPath = 'C:/Users/thanos/Documents/Github/student_care_uop/';
    let initialPath = process.env.MANAGER_PREVIEW_FILE_PATH;
    // let initialPath = 'C:/xampp/htdocs/student_care_uop/uploads/';
    const fileName = request.body.fileName + '.pdf';
    const appType = request.body.appType;

    const filePath = './backend/uploads/' + id + '/' + appType + '/';

    let metadata = { file_path: filePath, file_name: fileName };

    response
      .status(200)
      .sendFile(initialPath + metadata.file_path + metadata.file_name);

  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getMealsAppZipFile = async (request, response) => {
  try {
    const id = request.params.id;
    const initialPath = process.env.MANAGER_PREVIEW_FILE_PATH;
    const fileName = `dikaiologitika_student_${id}.zip`;
    const filePath = `./backend/uploads/${id}/mea/`;

    const fullPath = path.join(initialPath, filePath, fileName);

    response
      .status(200)
      .sendFile(fullPath);
  } catch (error) {
    console.error(error.message);
    response.status(500).send({
      message: error.message
    });
  }
};

const getAccommodationAppZipFile = async (request, response) => {
  try {
    const id = request.params.id;
    const initialPath = process.env.MANAGER_PREVIEW_FILE_PATH;
    const fileName = `dikaiologitika_student_${id}.zip`;
    const filePath = `./backend/uploads/${id}/acc/`;

    const fullPath = path.join(initialPath, filePath, fileName);

    response
      .status(200)
      .sendFile(fullPath);
  } catch (error) {
    console.error(error.message);
    response.status(500).send({
      message: error.message
    });
  }
};

const insertCommentsByStudentId = async (request, response) => {
  try {
    const id = request.params.id;
    const comments = request.body.comments;
    const subject = "Σίτιση";

    await studentService.insertCommentsByStudentId(id, comments, subject);

    response
      .status(200)
      .json({
        message: 'Student comments inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.status(400).send({
      message: error.message
    });
  }
};

const updateCommentsByStudentId = async (request, response) => {
  try {
    const id = request.params.id;
    const comments = request.body.comments;
    const subject = "Σίτιση";

    await studentService.updateCommentsByStudentId(id, comments, subject);

    response
      .status(200)
      .json({
        message: 'Student comments updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.status(400).send({
      message: error.message
    });
  }
};

const updateSpecialField = async (request, response) => {
  try {
    const appId = request.params.id;
    const { fieldValue, fieldName } = request.body;

    await studentService.updateSpecialField(fieldValue, fieldName, appId);

    response
      .status(200)
      .json({
        message: `Student application ${fieldName} field was updated successfully`
      });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({
      message: `Student application ${fieldName} field was not updated, error: ${error.message}`
    });
  }
};

const updateOptionalFilesStatus = async (request, response) => {
  try {
    const appId = request.params.appId;
    const { filenames, value } = request.body;

    await studentService.updateOptionalFilesStatus(filenames, value, appId);

    response
      .status(200)
      .json({
        message: `Student application field was updated successfully`
      });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({
      message: `Student application field was not updated, error: ${error.message}`
    });
  }
};

const getQuestionsByStudentId = async (request, response) => {
  try {
    const studentId = request.params.studentId;
    const questions = await studentService.getQuestionsByStudentId(studentId);
    response.status(200).json(questions);
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ error: 'Error fetching questions' });
  }
};

const insertQuestion = async (request, response) => {
  try {
    const questionData = request.body;
    await studentService.insertQuestion(questionData);
    response.status(201).json({ message: 'Question submitted successfully' });
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ error: 'An error occurred while submitting the question' });
  }
};

const insertUserAcceptance = async (request, response) => {
  const studentId = request.params.id;
  const areTermsAccepted = request.body.areTermsAccepted;

  try {
    await studentService.insertUserAcceptance(studentId, areTermsAccepted);

    response.status(200).json({
      message: 'User acceptance updated/inserted successfully'
    });
  } catch (error) {
    response.status(401).json({
      message: error.message
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getAccommodationFiles,
  getCommentByStudentIdAndSubject,
  getOldStudentsAppsForMeals,
  getOldStudentsAppsForAccommodation,
  getQuestionsByStudentId,
  getStudentsCountByYearAndDepartment,
  getStudentAppsByYear,
  checkUserAcceptance,
  updateStudentDetails,
  updateStudentContact,
  updateStudentSpecialData,
  updateStudentBasicInfo,
  updateSpecialField,
  updateOptionalFilesStatus,
  insertCommentsByStudentId,
  insertQuestion,
  insertUserAcceptance,
  updateCommentsByStudentId,
  getApplicationsById,
  getStudentsApplyPhaseMeals,
  getStudentsApplyPhaseMealsByYear,
  getStudentsApplyPhaseAccommodationByYear,
  getStudentsApplyPhaseAccommodation,
  login,
  uploadFile,
  sendFile,
  sendFileByType,
  getMealsAppZipFile,
  getAccommodationAppZipFile
};
