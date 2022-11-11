const managerService = require("../services/managerService.js");
const jwt = require("jsonwebtoken");

const login = async (request, response, next) => {
  const uname = request.body.username;
  const userId = await managerService.loginManager(uname);

  if (userId == null) {
    response.status(401).json({
      message: 'Unauthorized'
    });
  } else {
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

const getManager = async (request, response) => {
  const id = request.params.id;
  try {
    const manager = await managerService.getManager(id);
    response.status(200).json(manager);
  } catch (error) {
    console.error(error.message);
    response.send({
      message: error.message
    });
  }
};



module.exports = {
  login,
  getManager
};
