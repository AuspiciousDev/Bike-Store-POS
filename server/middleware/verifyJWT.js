const jwt = require("jsonwebtoken");
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // console.log("Verify JWT : ", authHeader);
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized access!" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // invalid token
    req.user = decoded.UserInfo.username;
    req.userType = decoded.UserInfo.userType;
    next();
  });
};

module.exports = verifyJWT;
