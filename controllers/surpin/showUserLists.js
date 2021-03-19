const getSrupinLists = require("../../utils/getSurpinLists");
const {
  Surpin_Tags,
  Tags,
  sequelize,
  Sequelize,
  User,
} = require("../../models");

module.exports = async (req, res) => {
  try {
    const { nickname } = req.query;
    const { pagenumber, tag } = req.body;
    const offset = ((pagenumber || 1) - 1) * 10;

    if (!nickname) {
      res.status(400).json({ message: "Unsufficient info" });
    }

    //요청한 사용자가 있는지 확인
    const { count, rows } = await User.findAndCountAll({
      where: { nickname },
    });

    if (count !== 1) {
      //없거나 2명 이상이 조회되는 경우
      res.status(404).json({ message: "Non exists user" });
    } else {
      //tag를 이용해 해당 태그를 사용하는 listId를 가져온다.
      const target = await Surpin_Tags.findAll({
        attributes: [
          [sequelize.fn("JSON_ARRAYAGG", sequelize.col("listId")), "surpinIDs"],
        ],
        include: [{ model: Tags, attributes: [], required: true }],
        where: sequelize.where(sequelize.col("Tag.name"), tag),
        group: ["tagsId"],
      });

      res.json({
        ...(await getSrupinLists(offset, 10, {
          userId: rows[0].id,
          id: { [Sequelize.Op.in]: target[0].dataValues.surpinIDs },
        })),
        isValid: nickname === (req.isValid ? req.isValid.nickname : false),
      });
    }
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in showUserLists.js---------------------------------"
    );
    console.log(err);
    console.log(
      "---------------------------------Error occurred in showUserLists.js---------------------------------"
    );
    res.status(500).send();
  }
};
