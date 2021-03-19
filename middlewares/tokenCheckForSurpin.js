const jwt = require("jsonwebtoken");
const userinfo = require("../controllers/users/userinfo");
const { User } = require("../models");
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

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
      //접근 권한이 있는 회원의 접근
      req.isValid = {
        id: userInfo.id,
        nickname: userInfo.nickname,
      };
      next();
      return;
    } else {
      //사용자 정보가 없는 경우 혹은 인증정보가 다른 경우 =>
      //nickname정보를 포함한 토큰을 Bearer를 통해서 보내면서
      //존재하지 않거나 일치하지 않는 email로 요청하는 것은 정상적인 접근으로 보기 어렵기 때문에 거절
      return res.status(403).json({ message: "Unauthorized" });
    }
  } else {
    return res.status(400).json({ message: "Bearer is not exists!" });
  }
};
