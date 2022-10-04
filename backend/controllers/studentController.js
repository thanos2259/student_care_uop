const studentService = require("../services/studentService.js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = require("../middleware/file.js");
const formidable = require('formidable');
const MiscUtils = require("../MiscUtils.js");

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

const updateStudentContractDetails = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentContractDetails(student, id);

    response
      .status(200)
      .json({
        message: 'Student contract details updated successfully'
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



const validateFile = async (request, response, err, fileType) => {
  try {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.

      // File type not valid
      if (err.message.includes("This file type is not valid")) {
        throw new Error("Multer error: The file type was not valid for" + fileType + "upload");
      }

      throw new Error("A generic Multer error occurred");
    } else if (err) {
      // An unknown error occurred when uploading.

      // File type not valid
      if (err.message.includes("This file type is not valid")) {
        throw new Error("Unkown Error: The file type was not valid for" + fileType + " upload");
      }

      throw new Error("An unknown error occurred");
    }
    response
      .status(201)
      .json({
        message: "FILE ADDED"
      });
  } catch (error) {
    // return (err.message);
    console.log(err.message);
    response.status(201).json({
      message: 'ERROR'
    });
  }
};

const insertToDB = async (request, response, ssoUserId, fileType, filePath, fileName) => {
  let form = new formidable.IncomingForm();
  let fileExtension;

  await new Promise(function (resolve, reject) {
    form.parse(request, (err, fields, files) => {
      if (err) {
        console.log("An error on form parsing occurred");
        reject(err);
        return;
      }
      let mimetype = files.file.mimetype;
      fileExtension = mimetype.split("/")[1];
      console.log("In form.parse method, file extension is: " + fileExtension);
      resolve(fileExtension);
    });
  });

  fileExtension = MiscUtils.formatDocExtension(fileExtension);
  fileName += '.' + fileExtension;

  await studentService.insertOrUpdateMetadataBySSOUid(ssoUserId, fileType, filePath, fileName, fileExtension);
};

const insertSSNFile = async (request, response, next) => {
  try {
    const ssoUserId = request.params.id;
    const docType = "SSN";
    const userType = "student";
    let fileName = userType + ssoUserId + "_" + docType;
    const filePath = `./uploads/ssns/${ssoUserId}`;

    insertToDB(request, response, ssoUserId, docType, filePath, fileName);
    await upload.ssn(request, response, (err) => validateFile(request, response, err, docType));

    response
      .status(201)
      .json({
        message: "FILE ADDED SSN"
      });

  } catch (err) {
    console.log(err);
    response
      .status(201)
      .json({
        message: "ERROR"
      });
  }
};

const insertIbanFile = async (request, response, next) => {
  try {
    const ssoUserId = request.params.id;
    const docType = "IBAN";
    const userType = "student";
    const fileName = userType + ssoUserId + "_" + docType;
    const filePath = `./uploads/ibans/${ssoUserId}`;

    insertToDB(request, response, ssoUserId, docType, filePath, fileName);
    await upload.iban(request, response, (err) => validateFile(request, response, err, docType));

    response
      .status(201)
      .json({
        message: "FILE ADDED IBAN"
      });
  } catch (error) {
    console.error(error.message);
    response.status(201).json({
      message: "ERROR"
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

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudentDetails,
  updateStudentContractDetails,
  updateStudentContact,
  updateStudentSpecialDetails,
  //dummy login
  login,
  insertSSNFile,
  insertIbanFile,
  sendFile
};
