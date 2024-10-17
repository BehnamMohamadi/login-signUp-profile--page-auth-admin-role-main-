const express = require("express");
const router = express.Router();
const { signUpValidator, updateValidator } = require("../controller/validator");

const {
  signUpGetMethod,
  signUpPostMethod,
  loginGetMethod,
  loginPostMethod,
  renderProfileGetMethod,
  renderProfilePostMethod,
  updateUser,
  logOut,
  getUser,
} = require("../controller/auth-controller");

//http://127.0.0.1:8000/auth/signup
router.get("/signup", signUpGetMethod);
router.post("/signup", signUpValidator(), signUpPostMethod);

router.get("/login", loginGetMethod);
router.post("/login", loginPostMethod);

//http://127.0.0.1:8000/auth/profile
router.get("/profile/:username", renderProfileGetMethod);
router.post("/profile/:username", renderProfilePostMethod);

//http://127.0.0.1:8000/auth/get-user/:username
router.get("/get-user/:username", getUser);

//http://127.0.0.1:8000/auth/profile/update-user/:username
router.put("/profile/update-user/:username", updateValidator(), updateUser);
//http://127.0.0.1:8000/auth/profile/logout/:username
router.put("/profile/logout/:username", logOut);

module.exports = router;
