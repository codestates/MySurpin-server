const { Surpin_Tags, Tags, sequelize } = require("../../models");

module.exports = async (req, res) => {
  //Surpin_Tags의 tagsId로 그룹을 지어 listId의 수를 내림차순으로 설정하여 상위 10개만 가져온다.
  const tagInfo = await Surpin_Tags.findAll({
    attributes: [
      [sequelize.col("Tag.name"), "name"],
      [sequelize.fn("COUNT", "listId"), "countOfTag"],
    ],
    group: "tagsId",
    order: [[sequelize.col("countOfTag"), "DESC"]],
    include: [{ model: Tags, attributes: [], required: true }],
    limit: 10,
  });

  if (tagInfo.length > 0) res.json({ tags: tagInfo });
  else
    res.status(404).json({
      message: "No data in server",
    });
};
