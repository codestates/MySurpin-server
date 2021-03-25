const { Surpin, Surpin_Tags, SurpinUrls, sequelize } = require("../../models");
const createNewTags = require("../../utils/createNewTags");
const linkingTagsAndSrupin = require("../../utils/linkingTagsAndSurpin");

module.exports = async (req, res) => {
  console.log("----------edit surpin-----------");
  const reqData = { ...req.body, ...req.isValid };
  if (!req.isValid) {
    return res.status(400).json({ message: "You are not member" });
  }

  if (
    !reqData.listname ||
    !(reqData.desc !== undefined) ||
    !(reqData.thumbnail !== undefined) ||
    !reqData.listId ||
    !Array.isArray(reqData.urls) ||
    !Array.isArray(reqData.tags)
  ) {
    return res.status(400).json({ message: "Unsufficient info" });
  }

  function errorMessage(message) {
    this.message = message;
  }

  try {
    await sequelize.transaction(async (t) => {
      //////////////////////////////////////////////////////////////////////////////////////
      //Check surpin with given listId
      //////////////////////////////////////////////////////////////////////////////////////
      const targetSurpin = await Surpin.findOne({
        where: reqData.listId,
        transaction: t,
      });

      if (targetSurpin === null) {
        throw new errorMessage("There's no surpin data with given listid");
      }
      if (targetSurpin.userId !== reqData.id) {
        throw new errorMessage("Unauthorize!!");
      }

      //////////////////////////////////////////////////////////////////////////////////////
      //Update surpin with given data
      //////////////////////////////////////////////////////////////////////////////////////
      await targetSurpin.update(
        {
          title: reqData.listname,
          desc: reqData.desc,
          thumbnail: reqData.thumbnail,
          // updateAt: new Date(),
        },
        { transaction: t }
      );

      //////////////////////////////////////////////////////////////////////////////////////
      //delete already linked tags
      //delete already linked SurpinUrls
      //////////////////////////////////////////////////////////////////////////////////////
      await Surpin_Tags.destroy({
        where: { listId: reqData.listId },
        transaction: t,
      });
      await SurpinUrls.destroy({
        where: { listId: reqData.listId },
        transaction: t,
      });

      //////////////////////////////////////////////////////////////////////////////////////
      //Create surpinUrls process
      //////////////////////////////////////////////////////////////////////////////////////
      let isUnFormatted = false;
      const urls = reqData.urls.map((v) => {
        if (v.name && v.url) {
          return { ...v, listId: reqData.listId };
        } else {
          isUnFormatted = true;
        }
      });
      if (isUnFormatted || urls.length === 0) {
        throw new errorMessage("unformatted urls");
      }

      await SurpinUrls.bulkCreate(urls, {
        transaction: t,
        fields: ["name", "url", "listId"],
        raw: true,
      });

      //////////////////////////////////////////////////////////////////////////////////////
      //Tag process
      //1.check exists tags
      //2.create none exists tags
      //3.linking tags with surpin on Surpin_Tags table
      //////////////////////////////////////////////////////////////////////////////////////
      await linkingTagsAndSrupin(
        await createNewTags(reqData.tags, t),
        reqData.listId,
        t
      );

      res.status(200).json({ message: "edit done!" });
      // throw Error();
    });
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in editMySurpin.js---------------------------------",
      err,
      "---------------------------------Error occurred in editMySurpin.js---------------------------------"
    );
    if (err instanceof errorMessage) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).send();
    }
  }
};
