const jwt = require("jsonwebtoken");

const createToken = {
  access: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10m",
    });
  },
  refresh: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "30m",
    });
  },
};

module.exports = createToken;
