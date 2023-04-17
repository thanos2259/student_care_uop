const express = require('express');
const router = express.Router();
const managerController = require("../controllers/managerController.js");
const checkAuth = require("../middleware/auth.js");

//dummy login
router.post("/login", managerController.login);
router.get("/getManager/:id", managerController.getManager);
router.get("/getCommentByStudentIdAndSubject/", managerController.getCommentByStudentIdAndSubject);
router.post("/insertCommentsByStudentId/:id", managerController.insertCommentsByStudentId);
router.put("/updateCommentsByStudentId/:id", managerController.updateCommentsByStudentId);
router.post("/insertPeriodDates/", managerController.insertPeriodDates);
router.get("/getPeriodInfo/:id", managerController.getPeriodInfo);

module.exports = router;
