const { SurpinUrls, Surpin, sequelize } = require("../../models");

module.exports = async (req, res) => {
  const { listId } = req.query;
  if (!listId) {
    return res.status(400).json({ message: "Unsufficient info" });
  }
  function errorMessage(message) {
    this.message = message;
  }

  try {
    await sequelize.transaction(async (t) => {
      let isValid = false;
      await Surpin.findOne({
        attributes: ["userId"],
        where: { id: listId },
        transaction: t,
      }).then(
        (v) => (isValid = req.isValid ? req.isValid.id === v.userId : false)
      );

      const urls = await SurpinUrls.findAll({
        where: { listId },
        raw: true,
        transaction: t,
      });

      res.status(200).json({
        isMember: req.isValid !== false,
        isValid,
        urls: urls.map((url) => {
          return {
            urlName: url.name,
            url: url.url,
          };
        }),
      });
    });
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in showSurpin.js---------------------------------"
    );
    console.log(err);
    console.log(
      "---------------------------------Error occurred in showSurpin.js---------------------------------"
    );
    if (err instanceof errorMessage) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).send();
    }
  }
};
