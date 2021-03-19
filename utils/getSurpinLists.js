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
  tagSelect = "",
  SurpinOrder = {
    name: "createdAt",
    order: "DESC",
  }
) => {
  let { count, rows: surpins } = await Surpin.findAndCountAll({
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
      [
        sequelize.fn("GROUP_CONCAT", sequelize.col("Surpin_Tags->Tag.name")),
        "tags",
      ],
    ],
    include: [
      //관계 이용
      { model: User, attributes: [], required: true },
      {
        model: Surpin_Tags,
        required: true,
        attributes: [],
        include: [
          {
            model: Tags,
            required: true,
            attributes: [],
            // where: tagSelect, //태그 선택 where만 적용
          },
        ],
      },
    ],
    subQuery: false, //limit와 같은 옵션이 관계에 영향을 안 미치도록 설정
    where: options, //Surpin where적용, tagSelector가 있으면 값을 이용해 like검색 할 수 있도록 수정
    group: ["Surpin_Tags.listId"],
    offset,
    limit: surpinCountPerPage,
    order: [[sequelize.col(SurpinOrder.name), SurpinOrder.order]], //orderby 설정 기본값은 createdAt을 DESC로 정렬
  });
  [].map.call(surpins, (v) => {
    v.dataValues.tags = v.dataValues.tags.split(",");
  });
  return { surpinCount: count.length, surpinCountPerPage, surpins };
};
