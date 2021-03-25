const { Surpin_Tags, Tags, Sequelize, sequelize } = require("../../models");
const { search } = require("../../routes/surpin");
module.exports = async (req, res) => {
  const { inputText } = req.query;

  if (!inputText) {
    res.status(400).json({ message: "Insufficient info" });
  }

  try {
    const avaliableTags = await Surpin_Tags.findAll({
      attributes: [
        [sequelize.col("Tag.name"), "name"],
        [sequelize.fn("COUNT", "listId"), "contentsCount"],
      ],
      group: "tagsId",
      order: [[sequelize.col("contentsCount"), "DESC"]],
      include: [{ model: Tags, attributes: [], required: true }],
      where: sequelize.where(sequelize.col("Tag.name"), {
        [Sequelize.Op.like]: `${inputText}%`,
      }),
      limit: 5,
    });

    res.json({
      tagsCount: avaliableTags.length,
      tags: avaliableTags,
    });
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in showExistsTags.js---------------------------------",
      err,
      "---------------------------------Error occurred in showExistsTags.js---------------------------------"
    );
    res.status(500).send();
  }
};
