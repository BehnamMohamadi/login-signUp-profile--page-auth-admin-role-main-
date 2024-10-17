const express = require("express");
const router = express.Router();
const {
  getAllUserData,
  getUser,
  removeUser,
  userTable,
} = require("../controller/admin-controller");

//http://127.0.0.1:8000/admin/get-all-users
router.get("/get-all-users", getAllUserData);

//http://127.0.0.1:8000/admin/get-user/username
router.get("/get-user/:username", getUser);

//http://127.0.0.1:8000/admin/remove-user/username
router.delete("/remove-user/:username", removeUser);

router.get("/panel", userTable);

module.exports = router;
