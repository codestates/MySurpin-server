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
  SurpinOrder = [["createdAt", "DESC"]]
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
        sequelize.fn("JSON_ARRAYAGG", sequelize.col("Surpin_Tags->Tag.name")),
        "tags",
      ],
    ],
    include: [
      //관계 이용
      { model: User, attributes: [], required: true },
      {
        model: Surpin_Tags,
        required: true, //INNER JOIN으로 구성해둬서 태그가 없는 경우 검색되지 않는다.
        attributes: [],
        include: [
          {
            model: Tags,
            required: true, //INNER JOIN으로 구성해둬서 태그가 없는 경우 검색되지 않는다.
            attributes: [],
          },
        ],
      },
    ],
    subQuery: false, //limit와 같은 옵션이 관계에 영향을 안 미치도록 설정
    where: options, //Surpin where적용, tagSelector가 있으면 값을 이용해 like검색 할 수 있도록 수정
    group: ["Surpin_Tags.listId"],
    offset,
    limit: surpinCountPerPage,
    order: SurpinOrder, //orderby 설정 기본값은 createdAt을 DESC로 정렬
  });

  return { surpinCount: count.length, surpinCountPerPage, surpins };
};
