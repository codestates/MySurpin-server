const { User } = require("../../models");
module.exports = async (req, res) => {
  try {
    await User.findOne({ where: { email: req.body.email } }).then(
      async (user) => {
        await user.update({ token: null });
      }
    );
    res.status(200).json({ message: "Successfully signed out" });
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in signout.js---------------------------------",
      err,
      "---------------------------------Error occurred in signout.js---------------------------------"
    );
    res.status(500).send();
  }
};
