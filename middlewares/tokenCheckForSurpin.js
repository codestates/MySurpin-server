const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  const { email } = req.body;

  if (!authorization || !email) {
    //비로그인 상태 다음으로 진행
    req.isValid = false;
    next();
    return;
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
        //접근 권한이 있는 회원의 접근
        req.isValid = {
          id: userInfo.id,
          nickname: userInfo.nickname,
        };
        next();
        return;
      } else if (userInfo.token !== bearer[1]) {
        return res.status(403).json({ message: "Expired token" });
      } else {
        //사용자 정보가 없는 경우 혹은 인증정보가 다른 경우 =>
        //nickname정보를 포함한 토큰을 Bearer를 통해서 보내면서
        //존재하지 않거나 일치하지 않는 email로 요청하는 것은 정상적인 접근으로 보기 어렵기 때문에 거절
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
            "---------------------------------Error occurred in tokenCheckForSurpin.js---------------------------------",
            err,
            "---------------------------------Error occurred in tokenCheckForSurpin.js---------------------------------"
          );
          break;
      }
      return;
    }
  } else {
    return res.status(400).json({ message: "Bearer is not exists!" });
  }
};
