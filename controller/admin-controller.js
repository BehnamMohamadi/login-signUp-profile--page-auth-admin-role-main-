const { response } = require("express");
const userData = require("../user-data.json");
const { writeFile, access, constants } = require("node:fs/promises");
const { join } = require("node:path");

const getAllUserData = (_request, response) => {
  response.status(200).json({
    status: "success",
    data: { users: userData },
  });
};

const getUser = (request, response) => {
  const { username = null } = request.params;
  const findUser = userData.find((user) => user.username === username);

  if (!findUser) {
    return response.status(404).json({
      status: "fail",
      data: {
        message: "username not-found",
      },
    });
  }

  response.status(200).json({
    status: "success",
    data: { users: findUser },
  });
};

const removeUser = async (request, response) => {
  try {
    const { username = null } = request.params;
    const findIndexOfUser = userData.findIndex(
      (user) => user.username === username
    );

    if (findIndexOfUser === -1) {
      return response.status(404).json({
        status: "fail",
        data: {
          message: "username not-found",
        },
      });
    }

    userData.splice(findIndexOfUser, 1);

    const userDataAsJson = JSON.stringify(userData);

    await access(join(__dirname, "../user-data.json"), constants.F_OK);
    await writeFile(join(__dirname, "../user-data.json"), userDataAsJson);

    response.status(204).json({
      status: "success",
      data: { message: "user removed" },
    });
  } catch (error) {
    console.log(`controller>admin-controller>removeUser `, error?.message);
    response.status(500).json({
      status: "error",
      data: {
        message: "internal server error",
      },
    });
  }
};

const userTable = (_request, response) => {
  response.status(200).sendFile(join(__dirname, "../view/admin-panel.html"));
};

module.exports = { getAllUserData, getUser, removeUser, userTable };
