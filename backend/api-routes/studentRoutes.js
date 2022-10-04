const express = require('express');
const router = express.Router();
const studentController = require("../controllers/studentController.js");
const checkAuth = require("../middleware/auth.js");

/* Student Routes */
router.get("/", studentController.getAllStudents);
router.get("/getStudentById/:id", studentController.getStudentById);
router.post("/login", studentController.login);
router.put("/updateStudentDetails/:id", checkAuth, studentController.updateStudentDetails);
router.put("/updateStudentContractDetails/:id", checkAuth, studentController.updateStudentContractDetails);
router.put("/updateStudentContact/:id", checkAuth, studentController.updateStudentContact);
router.put("/updateStudentSpecialDetails/:id", checkAuth, studentController.updateStudentSpecialDetails);
// file upload routes
router.post("/updateStudentSSNFile/:id", studentController.insertSSNFile);
router.post("/updateStudentIbanFile/:id", studentController.insertIbanFile);
router.post("/sendFile/:id", studentController.sendFile);

module.exports = router;
