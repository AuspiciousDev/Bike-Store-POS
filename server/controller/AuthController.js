const User = require("../model/User");
const bcrypt = require("bcrypt");
const createToken = require("../helper/createToken");
const sendMail = require("../helper/sendMail");
const authController = {
  handleLogin: async (req, res) => {
    try {
      const { username, password } = req.body;

      const foundUser = await User.findOne({ username }).exec();
      if (!foundUser) {
        return res
          .status(401)
          .json({ message: "Invalid Username or Password!" });
      }
      if (foundUser.status === false)
        return res
          .status(401)
          .json({ message: "Your account has been disabled!" });
      else {
        const match = await bcrypt.compare(password, foundUser.password);

        if (match) {
          //create JWTs
          const userObject = {
            UserInfo: {
              username: foundUser.username,
              userType: foundUser.userType,
            },
          };
          const firstName = foundUser.firstName;
          const lastName = foundUser.lastName;
          const accessToken = createToken.access(userObject);
          const refreshToken = createToken.refresh({
            username: foundUser.username,
          });

          // Saving RefreshToken with Current User
          foundUser.refreshToken = refreshToken;
          const result = await foundUser.save();
          console.log(result);

          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          // res.json({ sucess: `Users ${user} is logged in!` });

          res.json({
            userType: foundUser.userType,
            accessToken,
            firstName,
            lastName,
          });
        } else {
          res.status(401).json({ message: "Invalid Username/Password!" });
        }
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: authController.js:42 ~ handleLogin: ~ error",
        error
      );
      res.status(500).json({ message: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      //get email
      const { email } = req.body;
      console.log(
        "🚀 ~ file: AuthController.js:59 ~ forgotPassword: ~ email",
        email
      );
      //check email
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "This email does not exists!" });
      if (user?.status === false) {
        return res.status(401).json({
          message:
            "Cannot request forgot password, Your account has been disabled!",
        }); //Unauth
      }
      //create access token
      const accessToken = createToken.access({ username: user.username });
      console.log("BASE URL:", process.env.BASE_URL);
      console.log("BASE EMAIL:", process.env.ADMIN_EMAIL);
      //send email
      const url = `${process.env.BASE_URL}/#/auth/forgot-password/${accessToken}`;
      const name = user.username;
      sendMail.sendEmailReset(email, url, "Reset your password", name);

      //success
      res.status(200).json({
        message:
          "Password reset token has been sent, Please check your inbox or spam email.",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  },
  resetPassword: async (req, res) => {
    try {
      //get password
      const { password } = req.body;
      //hash password
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      //update password
      const foundUser = await User.findOne({
        username: req.user.username,
      }).exec();
      if (!foundUser)
        return res.status(404).json({ message: "Invalid Username/Password!" }); //Unauth
      const compareOldNew = await bcrypt.compare(password, foundUser.password);
      if (compareOldNew)
        return res.status(400).json({
          message: `Current and New password is just the same!, Use a new password instead.`,
        });
      await User.findOneAndUpdate(
        {
          username: req.user.username,
        },
        {
          password: hashPassword,
        }
      );
      //reset success
      res.status(200).json({ message: "Password reset successfully!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  },
  changePassword: async (req, res) => {
    try {
      const { username, password, newPassword } = req.body;
      if (!username || !password || !newPassword)
        res.status(400).json({ message: "Incomplete Fields" });

      const foundUser = await User.findOne({ username }).exec();
      if (!foundUser)
        return res.status(404).json({ message: "Invalid Username/Password!" }); //Unauth
      // return res.status(401).json({ message: "Username not found" }); //Unauth
      const compareOldNew = await bcrypt.compare(
        newPassword,
        foundUser.password
      );
      if (compareOldNew)
        return res.status(400).json({
          message: `Current and new password is just the same!, Use a different password instead.`,
        });
      const match = await bcrypt.compare(password, foundUser.password);
      if (match) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(newPassword, salt);

        await User.findOneAndUpdate(
          {
            username: username,
          },
          {
            password: hashPassword,
          }
        );
        res.status(200).json({ message: "Password changed successfully!" });
      } else {
        res.status(400).json({ message: "Password does not matched!" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.log(error);
    }
  },
};
module.exports = authController;
