const { User } = require("../../models");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  const { password, nickname, email } = req.body;
  if (!password && !nickname) {
    res.status(400).json({ message: "Insufficient info" });
  }

  try {
    const userInfo = await User.findOne({
      where: {
        email,
      },
    });

    if (nickname) userInfo.nickname = nickname;
    if (password) userInfo.updatePassword(password);

    //always return new accessToken
    const accessToken = jwt.sign(
      { nickname: userInfo.nickname },
      process.env.ACCESS_SECRET,
      { expiresIn: "1H" }
    );

    userInfo.token = accessToken;
    await userInfo.save();

    res.status(200).json({ accessToken });
  } catch (err) {
    console.log(
      "-------------------------------Error occurred in useredit.js-------------------------------- \n",
      err,
      "-------------------------------Error occurred in useredit.js-------------------------------- \n"
    );
    res.status(500).send();
  }
};
