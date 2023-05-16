const express = require("express");
const router = express.Router();
const userController = require("../../controller/UserController");

router.post("/create", userController.createUser);
router.get("/allUsers", userController.getAllUsers);
router.get("/:username", userController.getUser);
router.patch("/update/:username", userController.patchUser);
router.delete("/delete/:username", userController.deleteUser);
router.patch("/status/:username", userController.toggleUserStatus);
module.exports = router;
