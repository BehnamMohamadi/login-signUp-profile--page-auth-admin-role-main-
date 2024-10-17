const { log } = require("node:console");
const userData = require("../user-data.json");
const { readFileSync } = require("node:fs");
const { writeFile, access, constants } = require("node:fs/promises");
const { join } = require("node:path");

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
    data: { user: findUser },
  });
};

const signUpGetMethod = (_request, response) => {
  response.status(200).sendFile(join(__dirname, "../view/sign-up.html"));
};

const signUpPostMethod = async (request, response) => {
  try {
    const {
      firstname = null,
      lastname = null,
      username = null,
      password = null,
      gender = "not-set",
      isLoggedIn = "false",
    } = request.body;

    const findUser = userData.find((user) => user.username === username);
    if (findUser) {
      return response.status(404).json({
        status: "fail",
        data: { message: "this username is exist in user db" },
      });
    }

    userData.push({
      firstname,
      lastname,
      username,
      password,
      gender,
      isLoggedIn,
    });
    const userDataAsJson = JSON.stringify(userData);

    await access(join(__dirname, "../user-data.json"), constants.F_OK);
    await writeFile(join(__dirname, "../user-data.json"), userDataAsJson);

    response.status(200).json({
      status: "success",
      data: {
        message: "new user added",
        user: { firstname, lastname, username, gender },
      },
    });
  } catch (error) {
    console.log(`controller>auth-controller>signUpPostMethod `, error?.message);
    response.status(500).json({
      status: "error",
      data: {
        message: "internal server error",
      },
    });
  }
};

const loginGetMethod = (_request, response) => {
  response.status(200).sendFile(join(__dirname, "../view/login.html"));
};

const loginPostMethod = async (request, response) => {
  try {
    console.log(request.body);
    const { username = null, password = null } = request.body;
    const findUser = userData.find((user) => user.username === username);
    if (!findUser) {
      return response.status(400).json({
        status: "fail",
        data: { message: "username or password is invalid(username)" },
      });
    }
    if (findUser.password !== password) {
      return response.status(400).json({
        status: "fail",
        data: { message: "username or password is invalid(password)" },
      });
    }
    findUser.isLoggedIn = true;

    const userDataAsJson = JSON.stringify(userData);

    await access(join(__dirname, "../user-data.json"), constants.F_OK);
    await writeFile(join(__dirname, "../user-data.json"), userDataAsJson);

    response.status(200).json({
      status: "success",
      data: {
        user: {
          firstname: findUser.firstname,
          lastname: findUser.lastname,
          username: findUser.username,
          gender: findUser.gender,
          isLoggedIn: findUser.isLoggedIn,
        },
      },
    });
  } catch (error) {
    console.log(`controller>auth-controller>loginPostMethod `, error?.message);
    response.status(500).json({
      status: "error",
      data: {
        message: "internal server error",
      },
    });
  }
};

const renderProfileGetMethod = async (request, response) => {
  const { username } = request.params;
  const findUser = userData.find((user) => user.username === username);

  if (!findUser) {
    return response.status(404).json({
      status: "fail",
      data: { message: "can't find any user" },
    });
  }

  if (!findUser.isLoggedIn) {
    return response.status(200).sendFile(join(__dirname, "../view/login.html"));
  }
  console.log(findUser.isLoggedIn);
  response.status(200).sendFile(join(__dirname, "../view/profile.html"));
};

const renderProfilePostMethod = (request, response) => {
  const { username } = request.params;
  const findUser = userData.find((user) => user.username === username);

  if (!findUser) {
    return response.status(404).json({
      status: "fail",
      data: { message: "can't find any user" },
    });
  }

  response.status(200).json(findUser);
};

const updateUser = async (request, response) => {
  const { username } = request.params;
  const updatedUser = request.body.data;

  const findUser = userData.find((user) => user.username === username);

  if (!findUser) {
    return response.status(400).json({
      status: "fail",
      data: { message: "can't find any user" },
    });
  }

  if (!findUser.isLoggedIn) {
    return response.status(200).sendFile(join(__dirname, "../view/login.html"));
  }

  for (const property of updatedUser) {
    findUser[property.id] = property.value;
  }

  const userDataAsJson = JSON.stringify(userData);
  await writeFile(join(__dirname, "../user-data.json"), userDataAsJson);

  response.status(200).json({
    status: "success",
    data: { user: findUser },
  });
};

const logOut = async (request, response) => {
  const { username } = request.params;
  const { isLoggedIn } = request.body.data;

  const findUser = userData.find((user) => user.username === username);

  if (!findUser) {
    return response.status(400).json({
      status: "fail",
      data: { message: "can't find any user" },
    });
  }

  findUser.isLoggedIn = false;
};

module.exports = {
  signUpGetMethod,
  signUpPostMethod,
  loginGetMethod,
  loginPostMethod,
  renderProfileGetMethod,
  renderProfilePostMethod,
  updateUser,
  getUser,
  logOut,
};
