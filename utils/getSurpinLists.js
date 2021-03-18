const {
  Surpin,
  Surpin_Tags,
  Tags,
  User,
  SavedUser,
  sequelize,
} = require("../models");

module.exports = async (
  offset,
  surpinCountPerPage,
  options = {},
  tagSelect = {},
  SurpinOrder = {
    name: "createdAt",
    order: "DESC",
  }
) => {
  let surpins = await Surpin.findAll({
    attributes: [
      //가져오는 column
      [sequelize.col("Surpin.id"), "surpinId"],
      "title",
      "desc",
      [sequelize.col("User.nickname"), "writer"],
      //"savedCount",
      "thumbnail",
      "createdAt",
      "updatedAt",
    ],
    include: [
      //관계 이용
      { model: User, attributes: [], required: true },
      {
        model: Surpin_Tags,
        required: true,
        attributes: ["id", "tagsId"],
        include: [
          {
            model: Tags,
            required: true,
            attributes: ["name"],
            where: tagSelect, //태그 선택 where만 적용
          },
        ],
      },
    ],
    subQuery: false, //limit와 같은 옵션이 관계에 영향을 안 미치도록 설정
    where: options, //Surpin where적용
    offset,
    limit: surpinCountPerPage,
    order: [[sequelize.col(SurpinOrder.name), SurpinOrder.order]], //orderby 설정 기본값은 createdAt을 DESC로 정렬
  });
  [].map.call(surpins, (v) => {
    const tags = [].map.call(
      v.dataValues.Surpin_Tags,
      (v) => v.dataValues.Tag.dataValues.name
    );
    v.dataValues.Tags = tags;
    delete v.dataValues.Surpin_Tags;
  });

  return { surpinCount: surpins.length, surpinCountPerPage, surpins };
};
