const { Tags, sequelize, Sequelize } = require("../models");
module.exports = async (reqTags, t) => {
  //////////////////////////////////////////////////////////////////////////////////////
  //Check exists tags and create non exists tags process
  //////////////////////////////////////////////////////////////////////////////////////
  const existsTagsArr = await Tags.findOne({
    attributes: [
      [sequelize.fn("JSON_ARRAYAGG", sequelize.col("name")), "tags"],
      [sequelize.fn("JSON_ARRAYAGG", sequelize.col("id")), "tagsId"],
    ],
    where: {
      name: { [Sequelize.Op.in]: reqTags },
    },
    raw: true,
  });

  let newTags = reqTags;
  if (existsTagsArr.tags !== null) {
    const existsTagsObj = existsTagsArr.tags.reduce((obj, tag) => {
      obj[tag] = true;
      return obj;
    }, {});

    newTags = reqTags.filter((v) => !(v in existsTagsObj));
  }

  newTags = newTags.reduce((obj, newTag) => {
    obj.push({ name: newTag });
    return obj;
  }, []);

  const newTagIds = await Tags.bulkCreate(newTags, {
    transaction: t,
    fields: ["name"],
  });

  return { newTagIds, existsTagIds: existsTagsArr.tagsId };
};
