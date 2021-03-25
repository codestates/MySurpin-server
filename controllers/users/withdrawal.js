const { User } = require("../../models");

module.exports = async (req, res) => {
  const { email, password } = req.body;
  let errorLocation;

  if (!password) {
    res.status(400).json({ message: "Insufficient info" });
  }

  try {
    errorLocation = 0;
    const userInfo = await User.findOne({
      where: {
        email,
      },
    });

    if (userInfo && userInfo.validPassword(password)) {
      errorLocation = 1;
      await User.destroy({
        where: {
          email,
        },
      });
      res.status(200).json({ message: "Successfully processed" });
    } else {
      res.status(401).json({ message: "Password is wrong!" });
    }
  } catch (err) {
    console.log(
      `-------------------------------Error occurred in ${errorLocation}, withdrawal.js-------------------------------- \n`,
      err,
      `-------------------------------Error occurred in ${errorLocation}, withdrawal.js-------------------------------- \n`
    );
    res.status(500).send();
  }
};
