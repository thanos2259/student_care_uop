const jwt = require("jsonwebtoken");
const adminService = require("../services/adminService.js");

const login = async (request, response) => {
  const uname = request.body.username;
  let userId;

  if (uname)
    userId = await adminService.loginAdmin(uname);

  console.log("uid " + userId);

  if (userId == null)
    response.status(401).json({
      message: 'Unauthorized'
    });
  else {
    const token = jwt.sign({
      userId: userId
    },
      "secret_this_should_be_longer", {
      expiresIn: "1h"
    });
    response.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: userId
    });
  }
};

const insertRoles = async (request, response) => {
  try {
    const username = request.body.username;
    const isAdmin = request.body.is_admin;
    const academics = request.body.academics;

    const userRole = await adminService.insertRoles(username, isAdmin, academics);

    response.status(201).json({ message: 'Successfully inserted user role' });
  } catch (error) {
    console.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const getUsers = async (request, response) => {
  try {
    const users = await adminService.getUsersWithRoles();
    response.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const getDepartmentsOfUserByUserID = async (request, response) => {
  try {
    const userRoleId = request.params.id;
    console.log(userRoleId);
    const departments = await adminService.getDepartmentsOfUserByUserID(userRoleId);
    response.status(200).json(departments);
  } catch (error) {
    console.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

const deleteUserRoleByUserId = async (request, response) => {
  try {
    const userRoleId = request.params.id;
    await adminService.deleteUserRoleByUserId(userRoleId);
    response.status(200)
      .json({
        message: "User role was successfully deleted"
      });
  } catch (error) {
    console.error(error.message);
    response.status(401)
      .json({
        message: error.message
      });
  }
};

module.exports = {
  login,
  getUsers,
  getDepartmentsOfUserByUserID,
  deleteUserRoleByUserId,
  insertRoles
};
