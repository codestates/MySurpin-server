const { Surpin, sequelize } = require("../../models");

module.exports = async (req, res) => {
  if (!req.isValid) {
    return res.status(401).json({ message: "You are not member" });
  }
  if (!req.body.listId) {
    return res.status(400).json({ message: "Insufficient info" });
  }
  function errorMessage(message) {
    this.message = message;
  }

  try {
    await sequelize.transaction(async (t) => {
      const existsSurpin = await Surpin.findOne({
        where: { id: req.body.listId },
        transaction: t,
      });

      if (existsSurpin !== null && existsSurpin.userId === req.isValid.id) {
        await existsSurpin.destroy({ transaction: t });
      }

      res.status(200).json({ message: "Successfully processed" });
      // throw Error();
    });
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in removeMySurpin.js---------------------------------",
      err,
      "---------------------------------Error occurred in removeMySurpin.js---------------------------------"
    );
    if (err instanceof errorMessage) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).send();
    }
  }
};
