const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  const { email } = req.body;

  if (!authorization) {
    return res.status(400).json({ message: "Token is not exists!" });
  }
  if (!email) {
    return res.status(400).json({ message: "Insufficient info" });
  }

  const bearer = authorization.split(" ");

  if (bearer[0] === "Bearer") {
    try {
      const authData = await jwt.verify(bearer[1], process.env.ACCESS_SECRET);

      if (authData.nickname === undefined) {
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

      if (
        userInfo &&
        userInfo.nickname === authData.nickname &&
        userInfo.token === bearer[1]
      ) {
        next();
        return;
      } else if (userInfo.token !== bearer[1]) {
        return res.status(403).json({ message: "Expired token" });
      } else {
        return res.status(403).json({ message: "Wrong access" });
      }
    } catch (err) {
      switch (err.message) {
        case "jwt expired":
          res.status(401).json({ message: "Expired token" });
          break;
        case "invalid token":
          res.status(401).json({ message: "Invalid token" });
          break;
        default:
          res.status(500).json({ message: "Something wrong in server" });
          console.log(
            "---------------------------------Error occurred in tokenCheck.js---------------------------------",
            err,
            "---------------------------------Error occurred in tokenCheck.js---------------------------------"
          );
          break;
      }
      return;
    }
  } else {
    return res.status(400).json({ message: "Bearer is not exists!" });
  }
};
