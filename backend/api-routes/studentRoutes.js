const express = require('express');
const router = express.Router();
const studentController = require("../controllers/studentController.js");
const checkAuth = require("../middleware/auth.js");

/* Student Routes */
router.get("/", studentController.getAllStudents);
router.get("/getStudentById/:id", studentController.getStudentById);
router.post("/login", studentController.login);
router.put("/updateStudentDetails/:id", checkAuth, studentController.updateStudentDetails);
router.put("/updateStudentContact/:id", checkAuth, studentController.updateStudentContact);
router.put("/updateStudentBasicInfo/:id", checkAuth, studentController.updateStudentBasicInfo);
router.put("/updateStudentBasicDocuments/:id", checkAuth, studentController.updateStudentBasicDocuments);
router.put("/updateStudentSpecialData/:id", checkAuth, studentController.updateStudentSpecialData);
// file upload routes
router.post("/upload/:id/:fileIndex", studentController.uploadFile);
router.get("/combineToZIP/:id", studentController.combineToZIP);

module.exports = router;
