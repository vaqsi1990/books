const jwt = require('jsonwebtoken');
const User = require('../moddel/user');
const handler = require('./handler');

exports.authenticate = handler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, "I love anna");
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, failed");
    }
  } else {
    res.status(401);
    throw new Error("No token");
  }
});

exports.admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not admin.");
  }
};
