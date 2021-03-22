const { Surpin_Tags } = require("../models");
module.exports = async (tags, surpinId, t) => {
  //////////////////////////////////////////////////////////////////////////////////////
  //Create surpin_Tags process
  //////////////////////////////////////////////////////////////////////////////////////
  const { existsTagIds, newTagIds } = tags;

  const makeSurpinTagsDataSet = (arr, v) => {
    arr.push({ tagsId: v.id ? v.id : v, listId: surpinId });
    return arr;
  };

  const surpinTagsDS = [
    ...(existsTagIds !== null
      ? existsTagIds.reduce(makeSurpinTagsDataSet, [])
      : []),
    ...newTagIds.reduce(makeSurpinTagsDataSet, []),
  ];

  await Surpin_Tags.bulkCreate(surpinTagsDS, {
    transaction: t,
    fields: ["tagsId", "listId"],
    raw: true,
  });
};
