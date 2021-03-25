const { User } = require("../../models");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  const { email, googleData } = req;
  const userInfo = await User.findOne({
    where: {
      email,
    },
  });

  if (userInfo && userInfo.validGoogleData(googleData)) {
    const data = userInfo;

    const accessToken = jwt.sign(
      { nickname: data.nickname },
      process.env.ACCESS_SECRET,
      { expiresIn: "1H" }
    );

    userInfo.token = accessToken;
    await userInfo.save();

    res.status(200).json({ accessToken, nickname: data.nickname, email });
  } else {
    res.status(401).json({ message: "Invalid user" });
  }
};
