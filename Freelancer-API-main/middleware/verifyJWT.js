const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  let token;

  // Check Authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // If no token in header, check for access token in cookie
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  // If still no token, unauthorized
  if (!token) return res.sendStatus(401);

  // Verify the token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // Invalid or expired token
    req.user = decoded.UserInfo.username || decoded.UserInfo.Username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
