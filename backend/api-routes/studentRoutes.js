const express = require('express');
const router = express.Router();
const studentController = require("../controllers/studentController.js");
const checkAuth = require("../middleware/auth.js");

/* Student Routes */
router.get("/", studentController.getAllStudents);
router.get("/getStudentById/:id", studentController.getStudentById);
router.get("/getStudentApplications/:id", studentController.getStudentApplications);
router.get("/getStudentActiveApplication/:id", studentController.getStudentActiveApplication);
router.get("/getStudentPositions/:id", studentController.getStudentPositions);
router.post("/login", studentController.login);
router.post("/insertStudentApplication/:id", checkAuth, studentController.insertStudentApplication);
router.post("/insertStudentPosition/:id", checkAuth, studentController.insertStudentPosition);
router.put("/updateStudentDetails/:id", checkAuth, studentController.updateStudentDetails);
router.put("/updateStudentContractDetails/:id", checkAuth, studentController.updateStudentContractDetails);
router.put("/updateStudentBio/:id", checkAuth, studentController.updateStudentBio);
router.put("/updateStudentContact/:id", checkAuth, studentController.updateStudentContact);
router.put("/updateStudentPositionPriorities/:id", checkAuth, studentController.updateStudentPositionPriorities);
router.put("/updateStudentPositions/:id", checkAuth, studentController.updateStudentPositions);
router.put("/updateStudentSpecialDetails/:id", checkAuth, studentController.updateStudentSpecialDetails);
router.delete("/deleteEntryFormByStudentId/:id", checkAuth, studentController.deleteEntryFormByStudentId);
router.delete("/deletePositionsByStudentId/:id", checkAuth, studentController.deletePositionsByStudentId);
router.delete("/deleteApplicationById/:id", checkAuth, studentController.deleteApplicationById);
// file upload routes
router.post("/updateStudentSSNFile/:id", studentController.insertSSNFile);
router.post("/updateStudentIbanFile/:id", studentController.insertIbanFile);
router.post("/sendFile/:id", studentController.sendFile);

module.exports = router;
