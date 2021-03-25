const getSrupinLists = require("../../utils/getSurpinLists");
const { Surpin_Tags, Tags, sequelize, Sequelize } = require("../../models");

module.exports = async (req, res) => {
  try {
    const { pagenumber, tag } = req.body;
    const offset = ((pagenumber || 1) - 1) * 10;

    if (tag) {
      //tag를 이용해 해당 태그를 사용하는 listId를 가져온다.
      const target = await Surpin_Tags.findAll({
        attributes: [
          [sequelize.fn("JSON_ARRAYAGG", sequelize.col("listId")), "surpinIDs"],
        ],
        include: [{ model: Tags, attributes: [], required: true }],
        where: sequelize.where(sequelize.col("Tag.name"), tag),
        group: ["tagsId"],
      });

      if (target.length > 0) {
        //가져온 listId를 이용하여 일반목록, 순위검색을 해서 가져온다.
        res.json({
          ...(await getSrupinLists(offset, 10, {
            id: { [Sequelize.Op.in]: target[0].dataValues.surpinIDs },
          })),
          top: (
            await getSrupinLists(
              0,
              10,
              { id: { [Sequelize.Op.in]: target[0].dataValues.surpinIDs } },
              [
                ["savedCount", "DESC"],
                ["createdAt", "DESC"],
              ]
            )
          ).surpins,
        });
      } else {
        res.status(400).json({ message: "No surpin with request tag" });
      }
    } else {
      res.status(400).json({ message: "Insufficient info" });
    }
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in searchLists.js---------------------------------",
      err,
      "---------------------------------Error occurred in searchLists.js---------------------------------"
    );
    res.status(500).send();
  }
};
