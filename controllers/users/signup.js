const { User } = require("../../models");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  const { email, password, nickname } = req.body;
  // console.log(req.body);

  const userInfo = await User.findOne({
    where: {
      [Op.or]: [{ email }, { nickname }],
    },
  });

  if (!userInfo) {
    try {
      await User.create({
        email,
        password,
        nickname,
      });

      res.status(200).json({ message: "Successfully processed" });
    } catch (err) {
      console.log(
        "-------------------------------Error occurred in signup.js-------------------------------- \n",
        err,
        "-------------------------------Error occurred in signup.js-------------------------------- \n"
      );
      res.status(500).send();
    }
  } else {
    //Already exists user email or nickname
    if (userInfo.email === email) {
      //email
      res.status(401).json({ message: "Already exists email" });
    } else {
      //nickname
      res.status(401).json({ message: "Already exists nickname" });
    }
  }
};
