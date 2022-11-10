const express = require('express');
const router = express.Router();
const managerController = require("../controllers/managerController.js");
const checkAuth = require("../middleware/auth.js");

//dummy login
router.post("/login", managerController.login);
router.get("/getManager/:id", checkAuth, managerController.getManager);

module.exports = router;