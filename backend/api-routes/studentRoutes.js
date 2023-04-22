const express = require('express');
const router = express.Router();
const studentController = require("../controllers/studentController.js");
const checkAuth = require("../middleware/auth.js");

/* Student Routes */
router.get("/", studentController.getAllStudents);
router.get("/getStudentById/:id", studentController.getStudentById);
router.get("/getStudentApplicationById/:id", studentController.getApplicationsById);
router.get("/getAccommodationFiles/:id", studentController.getAccommodationFiles);
router.get("/getCommentByStudentIdAndSubject/", studentController.getCommentByStudentIdAndSubject);
router.get("/getStudentsApplyPhaseMeals/:id", studentController.getStudentsApplyPhaseMeals);
router.get("/getOldStudentsApps/:id", studentController.getOldStudentsApps);
router.put("/updateStudentDetails/:id", studentController.updateStudentDetails);
router.put("/updateStudentContact/:id", studentController.updateStudentContact);
router.put("/updateStudentBasicInfo/:id", studentController.updateStudentBasicInfo);
router.put("/updateStudentSpecialData/:id", studentController.updateStudentSpecialData);
router.post("/login", studentController.login);
// file upload routes
router.post("/upload/:id/:fileIndex", studentController.uploadFile);
router.post("/sendFile/:id", studentController.sendFile);
router.post("/sendFileByType/:id", studentController.sendFileByType);
router.post("/getMealsAppZipFile/:id", studentController.getMealsAppZipFile);
router.post("/getAccommodationAppZipFile/:id", studentController.getMealsAppZipFile);
router.patch("/applications/updateSpecialField/:id", studentController.updateSpecialField);

module.exports = router;
