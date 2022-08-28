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

const getPhase = async (request, response) => {
  try {
    const departmentId = request.params.id;
    const period = await studentService.getPhase(departmentId);
    response.status(200).json(period);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentEntrySheets = async (request, response) => {
  try {
    const id = request.params.id;
    const entrySheets = await studentService.getStudentEntrySheets(id);
    response.status(200).json(entrySheets.rows);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentApplications = async (request, response) => {
  try {
    const id = request.params.id;
    const applications = await studentService.getStudentApplications(id);
    response.status(200).json(applications.rows);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentActiveApplication = async (request, response) => {
  try {
    // console.log("student active app");
    const id = request.params.id;
    const applications = await studentService.getStudentActiveApplication(id);
    response.status(200).json(applications.rows[0].count);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentExitSheets = async (request, response) => {
  try {
    const id = request.params.id;
    const exitSheets = await studentService.getStudentExitSheets(id);
    response.status(200).json(exitSheets);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentEvaluationSheets = async (request, response) => {
  try {
    const id = request.params.id;
    const exitSheets = await studentService.getStudentEvaluationSheets(id);
    response.status(200).json(exitSheets);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getStudentPositions = async (request, response) => {
  try {
    const id = request.params.id;
    const studentPositions = await studentService.getStudentPositions(id);
    response.status(200).json(studentPositions);
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

const updateStudentBio = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentBio(student, id);

    response
      .status(200)
      .json({
        message: 'Student bio updated successfully'
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

const updateStudentPositionPriorities = async (request, response, next) => {
  try {
    const id = request.params.id;
    const body = request.body;

    await studentService.updateStudentPositionPriorities(id, body);

    response
      .status(200)
      .json({
        message: 'Student position priorities updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentEntrySheet = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const updateResults = await studentService.updateStudentEntrySheet(student, id);

    response
      .status(200)
      .json({
        message: 'Student entry sheet was updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};


const updatePhase = async (request, response, next) => {
  try {
    const id = request.params.id;
    const phaseNumber = request.body.phase;
    console.log("phase number" + phaseNumber + "-ID" + id);

    await studentService.updatePhase(phaseNumber, id);

    response
      .status(200)
      .json({
        message: 'Student phase updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertStudentEntrySheet = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const insertResults = await studentService.insertStudentEntrySheet(student, id);

    response
      .status(201)
      .json({
        message: 'Student entry sheet was inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertStudentExitSheet = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const insertResults = await studentService.insertStudentExitSheet(student, id);

    response
      .status(201)
      .json({
        message: 'Student exit sheet was inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertStudentEvaluationSheet = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    const insertResults = await studentService.insertStudentEvaluationSheet(student, id);

    response
      .status(201)
      .json({
        message: 'Student evaluation sheet was inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertStudentApplication = async (request, response, next) => {
  try {
    const id = request.params.id;
    const student = request.body;

    await studentService.insertStudentApplication(student, id);

    response
      .status(201)
      .json({
        message: 'Student application was inserted successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const insertStudentPosition = async (request, response, next) => {
  try {
    let message = "";
    const studentId = request.params.id;
    const body = request.body;
    let priority = 0;
    const NUMBER_OF_POSITIONS = 5;
    let positionId = body.positionId == null ? body.internal_position_id : body.positionId;
    let atlas = body.positionId != null;

    console.log(body.internal_position_id + "|" + atlas);
    const maxPriority = await studentService.findMaxPositions(studentId, positionId);

    if (maxPriority < NUMBER_OF_POSITIONS) {
      // priority is +1 from the previous position (which we know by max priority)
      priority = maxPriority + 1;
      //console.log(priority, maxPriority, body.positionId, studentId);
      await studentService.insertStudentPositionsFromUser(studentId, positionId, priority, atlas);
      message = "Student position was inserted successfully";
    } else {
      console.log("insertStudentPosition(), Student can't choose more than 5 positions");
      message = "Student can't choose more than 5 positions";
    }

    response
      .status(201)
      .json({
        message: message
      });
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const deleteEntryFormByStudentId = async (request, response) => {
  const id = request.params.id;
  try {
    const results = await studentService.deleteEntryFormByStudentId(id);
    response
      .status(200)
      .send(`entry form of student with ID: ${id} was deleted`);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const deletePositionsByStudentId = async (request, response) => {
  const studentId = request.params.id;
  try {
    await studentService.deletePositionsByStudentId(studentId);
    response
      .status(200)
      .send(`student position with priority ${studentId} was deleted`);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const deleteApplicationById = async (request, response) => {
  const applicationId = request.params.id;
  try {
    await studentService.deleteApplicationById(applicationId);
    response
      .status(200)
      .send(`student application ${applicationId} was deleted`);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const updateStudentPositions = async (request, response) => {
  try {
    const id = request.params.id;
    const body = request.body;
    await studentService.updateStudentPositions(id, body);

    response
      .status(200)
      .json({
        message: 'Student positions were updated successfully'
      });
  } catch (error) {
    console.log(error.message);
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
  getStudentEntrySheets,
  getStudentExitSheets,
  getStudentEvaluationSheets,
  getStudentPositions,
  getStudentApplications,
  getStudentActiveApplication,
  getPhase,
  insertStudentEntrySheet,
  insertStudentExitSheet,
  insertStudentEvaluationSheet,
  insertStudentApplication,
  insertStudentPosition,
  updateStudentDetails,
  updateStudentContractDetails,
  updateStudentBio,
  updateStudentContact,
  updateStudentSpecialDetails,
  updateStudentEntrySheet,
  updateStudentPositionPriorities,
  updateStudentPositions,
  updatePhase,
  deleteEntryFormByStudentId,
  deletePositionsByStudentId,
  deleteApplicationById,
  //dummy login
  login,
  insertSSNFile,
  insertIbanFile,
  sendFile
};
