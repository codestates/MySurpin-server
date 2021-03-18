const jwt = require("jsonwebtoken");
const { User } = require("../models");
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  const { email } = req.body;

  if (!authorization) {
    return res.status(400).json({ message: "Token is not exists!" });
  }
  if (!email) {
    return res.status(400).json({ message: "Unsufficient info" });
  }

  const bearer = authorization.split(" ");

  if (bearer[0] === "Bearer") {
    const authData = await jwt.verify(bearer[1], process.env.ACCESS_SECRET);

    if (authData === TOKEN_EXPIRED) {
      //token expired
      return res.status(401).json({ message: "Expired token" });
    } else if (authData === TOKEN_INVALID) {
      //token invalid
      return res.status(401).json({ message: "Invalid token" });
    } else if (authData.nickname === undefined) {
      //not our token format
      return res.status(401).json({ message: "Incorrect token" });
    }

    //query to db with email from request
    //and check result nickname and token data is matched
    //if matched than send request to next step using next method
    //if not matched response error code.
    const userInfo = await User.findOne({
      where: {
        email,
      },
    });

    if (userInfo && userInfo.nickname === authData.nickname) {
      next();
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } else {
    return res.status(400).json({ message: "Bearer is not exists!" });
  }
};
