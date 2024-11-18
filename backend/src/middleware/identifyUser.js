const { v4: uuidv4 } = require("uuid");

const identifyUser = (req, res, next) => {
  if (!req.cookies.sessionId) {
    const sessionId = uuidv4();
    res.cookie("sessionId", sessionId, { httpOnly: true });
    req.sessionId = sessionId || "";
  } else {
    req.sessionId = req.cookies.sessionId;
  }
  next();
};

module.exports = identifyUser;
