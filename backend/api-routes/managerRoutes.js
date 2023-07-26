const express = require('express');
const router = express.Router();
const managerController = require("../controllers/managerController.js");
const checkAuth = require("../middleware/auth.js");

//dummy login
router.get("/getManager/:id", managerController.getManager);
router.get("/getCommentByStudentIdAndSubject/", managerController.getCommentByStudentIdAndSubject);
router.get("/getPeriodInfo/:id", managerController.getPeriodInfo);
router.get("/getManagerCities/:id", managerController.getManagerCities);
router.get("/getAcademicYearsOrdered/", managerController.getAcademicYearsOrdered);
router.post("/login", managerController.login);
router.post("/insertPeriodDates/", managerController.insertPeriodDates);
router.post("/insertCommentsByStudentId/:id", managerController.insertCommentsByStudentId);
router.put("/updateCommentsByStudentId/:id", managerController.updateCommentsByStudentId);
router.put("/updateApplicationStatus/:id", managerController.updateApplicationStatus);
router.put("/updateNotesByAppId/:id", managerController.updateNotesByAppId);
router.get("/questions/", managerController.getQuestions);
router.put("/questions/:id", managerController.updateAnswerByQuestionId);

module.exports = router;
