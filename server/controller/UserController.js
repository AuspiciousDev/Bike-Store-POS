const User = require("../model/User");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const wishlist =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$";
const length = 10;
const sendMail = require("../helper/sendMail");
const UserController = {
  createUser: async (req, res) => {
    let emptyFields = [];
    let duplicateFields = [];
    var tempPassword, hashedPassword;
    console.log(req.body);
    try {
      // Get users details
      const {
        username,
        email,
        userType,
        firstName,
        middleName,
        lastName,
        address,
        mobile,
        birthday,
        password,
      } = req.body;
      // Validate if empty fields
      if (username.length < 5) emptyFields.push("username length");
      if (!username) emptyFields.push("username");
      if (!email) emptyFields.push("email");
      if (!userType) emptyFields.push("userType");
      if (!firstName) emptyFields.push("firstName");
      if (!lastName) emptyFields.push("lastName");
      if (!address) emptyFields.push("address");
      if (!mobile) emptyFields.push("mobile");
      if (!birthday) emptyFields.push("birthday");
      if (emptyFields.length > 0)
        return res
          .status(400)
          .json({ message: "Please fill in all the fields", emptyFields });
      // Check Duplicates
      const duplicateUsername = await User.findOne({ username }).lean().exec();

      const duplicateEmail = await User.findOne({ email }).lean().exec();
      if (duplicateUsername) duplicateFields.push("username");
      if (duplicateEmail) duplicateFields.push("email");
      if (duplicateFields.length > 0)
        return res.status(409).json({
          message: `Existing [${duplicateFields}] `,
          duplicateFields,
        });
      if (password === "default") {
        tempPassword = "portal01";
      }
      if (password === "generated") {
        tempPassword = generatePassword();
      }
      hashedPassword = await bcrypt.hash(tempPassword, 10);
      console.log(
        "🚀 ~ file: UserController.js:60 ~ createUser: ~ hashedPassword:",
        hashedPassword
      );

      // Create User Object
      const userObject = {
        username,
        email,
        userType,
        firstName,
        middleName,
        lastName,
        password: hashedPassword,
        address,
        mobile,
        birthday,
      };
      const createUser = await User.create(userObject);
      res.status(201).json(createUser);
    } catch (error) {
      console.log(
        "🚀 ~ file: UserController.js:81 ~ createUser: ~ error:",
        error
      );

      res.status(500).json({ message: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    const users = await User.find({}, { password: 0, refreshToken: 0 })
      .sort({ createdAt: -1 })
      .lean();
    if (!users) return res.status(204).json({ message: "No Users Found!" });
    res.status(200).json(users);
  },
  getUser: async (req, res) => {
    if (!req?.params?.username)
      return res.status(400).json({ message: `Username is required!` });
    try {
      const username = req.params.username;
      const users = await User.findOne({ username }).exec();
      if (!users) return res.status(204).json({ message: "User no Found!" });
      res.status(200).json(users);
    } catch (error) {
      console.log("🚀 ~ file: UserController.js:88 ~ getUser: ~ error", error);
      res.status(500).json({ message: error.message });
    }
  },
  patchUser: async (req, res) => {
    if (!req?.params?.username)
      return res.status(400).json({ message: `Username is required!` });

    try {
      const username = req.params.username;
      console.log(
        "🚀 ~ file: UserController.js:100 ~ patchUser: ~ username",
        username
      );
      const users = await User.findOne({ username }).exec();
      if (!users) return res.status(204).json({ message: "No Users Found!" });

      const {
        email,
        userType,
        firstName,
        middleName,
        lastName,
        address,
        mobile,
        birthday,
      } = req.body;
      const update = await User.findOneAndUpdate(
        { username },
        {
          email,
          userType,
          firstName,
          middleName,
          lastName,
          address,
          mobile,
          birthday,
        }
      );
      if (!update) {
        return res.status(400).json({ error: "No Employee" });
      }
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: UserController.js:127 ~ patchUser: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  deleteUser: async (req, res) => {
    if (!req?.params?.username)
      return res.status(400).json({ message: `Username is required!` });
    try {
      const username = req.params.username;

      const users = await User.findOne({ username }).exec();
      if (!users) return res.status(204).json({ message: "User not found!" });
      const deleteItem = await users.deleteOne({ username });
      res.json(deleteItem);
    } catch (error) {
      console.log(
        "🚀 ~ file: UserController.js:148 ~ deleteUser: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  toggleUserStatus: async (req, res) => {
    if (!req?.params?.username)
      return res.status(400).json({ message: `Username is required!` });
    try {
      const username = req.params.username;
      const { status } = req.body;
      const users = await User.findOne({ username }).exec();
      if (!users) return res.status(204).json({ message: "User not Found!" });
      const update = await User.findOneAndUpdate(
        { username },
        {
          status,
        }
      );
      if (!update) {
        return res.status(400).json({ message: "User update failed" });
      }
      console.log(update);
      res.status(200).json(update);
    } catch (error) {
      console.log(
        "🚀 ~ file: UserController.js:182 ~ toggleUserStatus: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
};

const generatePassword = () =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join("");

module.exports = UserController;
