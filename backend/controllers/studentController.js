const studentService = require("../services/studentService.js");
const jwt = require("jsonwebtoken");
const formidable = require('formidable');
const fs = require('fs');

// app.post("/api/students/login/:id", (request, response, next) => {
const login = async (request, response, next) => {
  const uname = request.body.username;
  const userId = await studentService.loginStudent(uname);
  // console.log(userId);

  if (userId == null) {
    response.status(401).json({
      message: 'Unauthorized'
    });
  } else {
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

const updateStudentDetails = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentDetails(student, id);
    // console.log(inserts.rowCount);
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

    await studentService.updateStudentSpecialData(student, id);

    console.log(student.application_type);
    studentService.combineToZIP(id, student.application_type);
    studentService.deleteFiles(id, student.application_type);
    await studentService.insertNewApplication(student, filesData, id);

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

module.exports = {
  getAllStudents,
  getStudentById,
  getAccommodationFiles,
  updateStudentDetails,
  updateStudentContact,
  updateStudentSpecialData,
  updateStudentBasicInfo,
  getApplicationsById,
  login,
  uploadFile,
  sendFile
};
