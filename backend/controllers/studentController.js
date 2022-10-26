const studentService = require("../services/studentService.js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = require("../middleware/file.js");
const formidable = require('formidable');
const MiscUtils = require("../MiscUtils.js");
const fs = require('fs');

// app.post("/api/students/login/:id", (request, response, next) => {
const login = async (request, response, next) => {
  const uname = request.body.username;
  const userId = await studentService.loginStudent(uname);
  // console.log(userId);

  if (userId == null) response.status(401).json({
    message: 'Unauthorized'
  });

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

const updateStudentSpecialDetails = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentSpecialDetails(student, id);

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

const sendFile = async (request, response) => {
  try {
    const id = request.params.id;
    let initialPath = 'C:/internship_uop/';
    // let initialPath = 'C:/Users/losNasos/Documents/workspace/uop_innternsip/';
    // let initialPath = 'C:/xampp/htdocs/internship_uop/uploads/';
    const docType = request.body.doctype;
    // let dirType = (docType == 'IBAN') ? 'ibans' : 'ssns';

    let metadata = (await studentService.getFileMetadataByStudentId(id, docType)).rows[0];

    response
      .status(200)
      .sendFile(initialPath + metadata.file_path + '/' + metadata.file_name);

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
  const path = fileDir + studentId;
  const fileIndex = request.params.fileIndex;

  try {
    fs.mkdirSync(path, { recursive: true });

    let form = new formidable.IncomingForm();
    form.parse(request, function (error, fields, files) {
      console.log(files);
      let oldpath = files.file.filepath;
      let newName = fileIndex;
      const maxFileLength = 110;

      if (files.file.originalFilename.length >= maxFileLength) {
        newName += files.file.originalFilename.slice(0, maxFileLength);
      } else {
        newName += files.file.originalFilename;
      }

      let newpath = path + "/" + newName;
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

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudentDetails,
  updateStudentContact,
  updateStudentSpecialDetails,
  updateStudentBasicInfo,
  login,
  sendFile,
  uploadFile
};
