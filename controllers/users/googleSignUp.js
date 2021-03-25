const { Op } = require("sequelize");
const { User } = require("../../models");
module.exports = async (req, res) => {
  const { email, nickname, googleData } = req;

  const userInfo = await User.findOne({
    where: {
      [Op.or]: [{ email }, { nickname }, { googleData }],
    },
  });

  if (!userInfo) {
    try {
      await User.create({
        email,
        nickname,
        googleData,
      });

      res.status(200).json({ message: "Successfully processed" });
    } catch (err) {
      console.log(
        "-------------------------------Error occurred in googleSignUp.js-------------------------------- \n",
        err,
        "-------------------------------Error occurred in googleSignUp.js-------------------------------- \n"
      );
      res.status(500).send();
    }
  } else {
    //Already exists user email or nickname
    if (userInfo.email === email) {
      //email
      res.status(401).json({ message: "Already exists email" });
    } else if (userInfo.nickname === nickname) {
      //nickname이 기존 사용자들과 중복될 때 어떻게 해야 하는가?
      res.status(401).json({ message: "Already exists nickname" });
    } else {
      res.status(403).json({ message: "Already joined your Google Account" });
    }
  }
};
