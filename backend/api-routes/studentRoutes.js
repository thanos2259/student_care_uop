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
router.put("/updateStudentSpecialDetails/:id", checkAuth, studentController.updateStudentSpecialDetails);
// file upload routes
router.post("/sendFile/:id", studentController.sendFile);
router.post("/upload/:id&:filename", studentController.uploadFile);
module.exports = router;
