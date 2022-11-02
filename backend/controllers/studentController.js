const studentService = require("../services/studentService.js");
const jwt = require("jsonwebtoken");
const formidable = require('formidable');
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

const updateStudentBasicDocuments = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    await studentService.updateStudentBasicDocuments(student, id);

    response
      .status(200)
      .json({
        message: 'Student basic documents updated successfully'
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
    const student = request.body;

    await studentService.updateStudentSpecialData(student, id);

    studentService.combineToZIP(id);
    deleteFiles();

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
  const path = fileDir + studentId;
  const finalFileName = request.params.fileIndex;
  // currently we have only pdf files, if more types will be added, we should split the name or mimetype
  const fileType = ".pdf";

  try {
    fs.mkdirSync(path, { recursive: true });

    let form = new formidable.IncomingForm();
    form.parse(request, function (error, fields, files) {
      // console.log(files);
      let oldpath = files.file.filepath;
      let newpath = path + "/" + finalFileName + fileType;

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

const deleteFiles = () => {
  const studentId = 1;
  const fileDir = "./uploads/";
  const path = fileDir + studentId + '/';

  try {
    // Read the directory given in `path`
    const files = fs.readdir(path, (err, files) => {
      if (err)
        throw err;
      files.forEach((file) => {
        // Check if the file is with a PDF extension, remove it
        if (file.split('.').pop().toLowerCase() == 'pdf') {
          fs.unlinkSync(path + file)
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
}

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
  updateStudentDetails,
  updateStudentContact,
  updateStudentSpecialData,
  updateStudentBasicInfo,
  updateStudentBasicDocuments,
  login,
  uploadFile,
  deleteFiles,
  sendFile
};
