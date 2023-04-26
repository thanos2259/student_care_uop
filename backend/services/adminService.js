// database connection configuration
const pool = require("../db_config.js");
const MiscUtils = require("../MiscUtils.js");

const loginAdmin = async (username) => {
  try {
    const resultsUserRoles = await pool.query("SELECT * FROM users_roles \
                                               WHERE sso_username = $1", [username]);
    if (resultsUserRoles.rowCount >= 1) {
      return resultsUserRoles.rows[0].user_role_id;
    }
    return null;
  } catch (error) {
    throw Error('Error while logging in');
  }
};

const insertRoles = async (username, isAdmin, cities) => {
  try {
    let citiesStr = '';
    let academicsForCities = [];

    const isNafplioIncluded = cities.includes("ΝΑΥΠΛΙΟ");
    if (isNafplioIncluded) {
      const allDepartments = MiscUtils.getAllDepartments();
      academicsForCities = allDepartments.map(department => department.depId);
      citiesStr = 'ΝΑΥΠΛΙΟ,ΠΑΤΡΑ,ΚΑΛΑΜΑΤΑ';
    } else {
      for (let city of cities) {
        citiesStr += (cities.indexOf(city) == cities.length - 1) ? city : city + ',';
        const departmentsOfCity = MiscUtils.getDepartmentsByCity(city);
        academicsForCities.push(...departmentsOfCity.map(department => department.depId));
      }
    }

    const userRole = await pool.query("INSERT INTO users_roles(sso_username, is_admin, managed_cities)" +
      " VALUES ($1, $2, $3) RETURNING user_role_id", [username, isAdmin, citiesStr]);
    const userRoleId = userRole.rows[0].user_role_id;

    for (let academic of academicsForCities) {
      await pool.query("INSERT INTO role_manages_academics(user_role_id, academic_id)" +
        " VALUES ($1, $2)", [userRoleId, academic]);
    }
  } catch (error) {
    console.error('Error while inserting position group relations' + error.message);
    throw Error('Error while inserting position group relations' + error);
  }
};

const getUsersWithRoles = async () => {
  try {
    const users = await pool.query("SELECT * FROM sso_users \
    RIGHT JOIN users_roles ON users_roles.sso_username = sso_users.id");
    return users.rows;
  } catch (error) {
    throw Error('Error while getting users with roles' + error);
  }
};

const getDepartmentsOfUserByUserID = async (ssoUserId) => {
  try {
    const users = await pool.query(`SELECT academic_id FROM sso_users
                                    INNER JOIN users_roles ON users_roles.sso_username = sso_users.id
                                    INNER JOIN role_manages_academics ON
                                    role_manages_academics.user_role_id = users_roles.user_role_id
                                    WHERE uuid = $1`, [ssoUserId]);
    return users.rows;
  } catch (error) {
    throw Error('Error while getting departments of user by username' + error);
  }
};

const deleteUserRoleByUserId = async (userRoleId) => {
  try {
    await pool.query("DELETE FROM users_roles WHERE user_role_id = $1", [userRoleId]);
  } catch (error) {
    throw Error("Error while deleting user role with user_role_id: " + userRoleId + " - " + error.message);
  }
};

module.exports = {
  loginAdmin,
  getUsersWithRoles,
  getDepartmentsOfUserByUserID,
  deleteUserRoleByUserId,
  insertRoles
};
