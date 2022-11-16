const express = require('express');
const router = express.Router();
const managerController = require("../controllers/managerController.js");
const checkAuth = require("../middleware/auth.js");

//dummy login
router.post("/login", managerController.login);
router.get("/getManager/:id", checkAuth, managerController.getManager);
router.get("/getCommentByStudentIdAndSubject/", managerController.getCommentByStudentIdAndSubject);
router.post("/insertCommentsByStudentId/:id", managerController.insertCommentsByStudentId);
router.put("/updateCommentsByStudentId/:id", managerController.updateCommentsByStudentId);

module.exports = router;
