const { User } = require("../../models");

module.exports = async (req, res) => {
  const { email } = req.body;

  const userInfo = await User.findOne({
    where: {
      email,
    },
  });

  if (userInfo) {
    const { nickname } = userInfo;

    res.status(200).json({ email, nickname });
  } else {
    res.status(404).json({ message: "User not exists" });
  }
};
