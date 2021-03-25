const { SurpinUrls, Surpin, sequelize } = require("../../models");
const getSrupinFullData = require("../../utils/getSurpinLists");

module.exports = async (req, res) => {
  const { listId } = req.query;
  const { needFullData } = req.body;

  if (!listId) {
    return res.status(400).json({ message: "Insufficient info" });
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
        attributes: ["name", "url"],
        where: { listId },
        raw: true,
        transaction: t,
      });

      const responseData = {
        isMember: req.isValid !== false,
        isValid,
        urls: urls.map((url) => {
          return {
            ...url,
          };
        }),
      };

      if (needFullData === true) {
        const { surpins: fullData } = await getSrupinFullData(0, 1, {
          id: listId,
        });
        responseData.surpin = fullData;
      }

      res.status(200).json(responseData);
    });
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in showSurpin.js---------------------------------",
      err,
      "---------------------------------Error occurred in showSurpin.js---------------------------------"
    );
    if (err instanceof errorMessage) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).send();
    }
  }
};
