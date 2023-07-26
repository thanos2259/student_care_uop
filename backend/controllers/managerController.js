const managerService = require("../services/managerService.js");
const jwt = require("jsonwebtoken");

const login = async (request, response, next) => {
  const uname = request.body.username;
  let userId;

  if (uname)
    userId = await managerService.loginManager(uname);

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

const getManager = async (request, response) => {
  const id = request.params.id;
  try {
    const manager = await managerService.getManager(id);
    response.status(200).json(manager);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};

const getManagerCities = async (request, response) => {
  const ssoUserId = request.params.id;
  try {
    const cities = await managerService.getManagerCities(ssoUserId);
    response.status(200).json(cities);
  } catch (error) {
    console.error(error.message);
    response.status(500).send({
      message: error.message
    });
  }
};

const getPeriodInfo = async (request, response) => {
  const depId = request.params.id;
  try {
    const manager = await managerService.getPeriodInfo(depId);
    response.status(200).json(manager);
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

    const comment = await managerService.getCommentByStudentIdAndSubject(id, subject);

    response.status(200).json(comment);
  } catch (error) {
    response.send({
      message: error.message
    });
  }
};

const getAcademicYearsOrdered = async (request, response) => {
  try {
    const id = request.query.id;
    const type = request.query.type;

    const comment = await managerService.getAcademicYearsOrdered(id, type);

    response.status(200).json(comment);
  } catch (error) {
    response.send({
      message: error.message
    });
  }
};

const insertCommentsByStudentId = async (request, response) => {
  try {
    const id = request.params.id;
    const comments = request.body.comments;
    const subject = request.body.subject;

    await managerService.insertCommentsByStudentId(id, comments, subject);

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

const insertPeriodDates = async (request, response) => {
  try {
    const id = request.query.managerId;
    const depId = request.query.depId;
    const data = request.body;

    await managerService.insertPeriodDates(id, depId, data);

    response
      .status(200)
      .json({
        message: 'Period dates inserted successfully'
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
    const subject = request.body.subject;

    await managerService.updateCommentsByStudentId(id, comments, subject);

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

const updateApplicationStatus = async (request, response) => {
  try {
    const appId = request.params.id;
    const status = request.body.status;

    await managerService.updateApplicationStatus(appId, status);

    response
      .status(200)
      .json({
        message: 'Student application status updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.status(400).send({
      message: error.message
    });
  }
};

const updateNotesByAppId = async (request, response) => {
  try {
    const appId = request.params.id;
    const notes = request.body.notes;

    await managerService.updateNotesByAppId(appId, notes);

    response
      .status(200)
      .json({
        message: 'Student notes updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.status(400).send({
      message: error.message
    });
  }
};

const updateAnswerByQuestionId = async (request, response) => {
  try {
    const questionId = request.params.id;
    const answerText = request.body.answerText;

    await managerService.updateAnswerByQuestionId(questionId, answerText);

    response
      .status(200)
      .json({
        message: 'Student answer for question updated successfully'
      });
  } catch (error) {
    console.error(error.message);
    response.status(400).send({
      message: error.message
    });
  }
};

const getQuestions = async (request, response) => {
  try {
    const studentQuestions = await managerService.getQuestions();

    response.status(200).json(studentQuestions);
  } catch (error) {
    console.error(error.message);
    response.status(400).send({
      message: error.message
    });
  }
};

module.exports = {
  login,
  getManager,
  getPeriodInfo,
  getCommentByStudentIdAndSubject,
  getManagerCities,
  getQuestions,
  getAcademicYearsOrdered,
  insertCommentsByStudentId,
  insertPeriodDates,
  updateCommentsByStudentId,
  updateApplicationStatus,
  updateNotesByAppId,
  updateAnswerByQuestionId
};
