const express = require('express');
const router = express.Router();
const managerController = require("../controllers/managerController.js");
const checkAuth = require("../middleware/auth.js");

//dummy login
router.get("/getManager/:id", managerController.getManager);
router.get("/getCommentByStudentIdAndSubject/", managerController.getCommentByStudentIdAndSubject);
router.get("/getPeriodInfo/:id", managerController.getPeriodInfo);
router.post("/login", managerController.login);
router.post("/insertPeriodDates/", managerController.insertPeriodDates);
router.post("/insertCommentsByStudentId/:id", managerController.insertCommentsByStudentId);
router.put("/updateCommentsByStudentId/:id", managerController.updateCommentsByStudentId);
router.put("/updateApplicationStatus/:id", managerController.updateApplicationStatus);

module.exports = router;
