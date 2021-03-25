const { User } = require("../../models");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  const userInfo = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!req.body.password)
    return res.status(400).json({ message: "Insufficient info" });

  if (userInfo && userInfo.validPassword(req.body.password)) {
    const data = userInfo;

    const accessToken = jwt.sign(
      { nickname: data.nickname },
      process.env.ACCESS_SECRET,
      { expiresIn: "1H" }
    );

    userInfo.token = accessToken;
    await userInfo.save();

    res.status(200).json({ accessToken, nickname: data.nickname });
  } else {
    res.status(401).json({ message: "Invalid user or Wrong password" });
  }
};
