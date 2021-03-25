const { Surpin, SavedUser, SurpinUrls, sequelize } = require("../../models");
const createNewTags = require("../../utils/createNewTags");
const linkingTagsAndSrupin = require("../../utils/linkingTagsAndSurpin");

module.exports = async (req, res) => {
  const reqData = { ...req.body, ...req.isValid };
  if (!req.isValid) {
    return res.status(401).json({ message: "You are not member" });
  }

  if (
    !reqData.listname ||
    !(reqData.desc !== undefined) ||
    !(reqData.thumbnail !== undefined) ||
    !Array.isArray(reqData.urls) ||
    !Array.isArray(reqData.tags)
  ) {
    return res.status(400).json({ message: "Insufficient info" });
  }

  function errorMessage(message) {
    this.message = message;
  }

  try {
    await sequelize.transaction(async (t) => {
      //////////////////////////////////////////////////////////////////////////////////////
      //Increase savedCount
      //////////////////////////////////////////////////////////////////////////////////////
      if (reqData.listId) {
        const existsSurpin = await Surpin.findOne({
          where: { id: reqData.listId },
          transaction: t,
        });

        //check surpin is exists and request user is not surpin owner
        if (existsSurpin !== null && existsSurpin.userId !== reqData.id) {
          const existsSavedUser = await SavedUser.findOne({
            where: {
              listId: reqData.listId,
              userId: reqData.id,
            },
            transaction: t,
          });

          //check request user never saved this surpin
          if (!existsSavedUser) {
            //create info about request user saved this surpin
            await SavedUser.create(
              {
                listId: reqData.listId,
                userId: reqData.id,
              },
              { transaction: t }
            );
            //surpin's savedCount increase
            await existsSurpin.update(
              {
                savedCount: existsSurpin.savedCount + 1,
              },
              { transaction: t }
            );
          }
        }
      }

      //////////////////////////////////////////////////////////////////////////////////////
      //Create surpin process
      //////////////////////////////////////////////////////////////////////////////////////
      const surpinResult = await Surpin.create(
        {
          title: reqData.listname,
          desc: reqData.desc || "",
          userId: reqData.id,
          savedCount: 0,
          thumbnail: reqData.thumbnail || "",
          raw: true,
        },
        { transaction: t }
      );

      //////////////////////////////////////////////////////////////////////////////////////
      //Create surpinUrls process
      //////////////////////////////////////////////////////////////////////////////////////
      let isUnFormatted = false;
      const urls = reqData.urls.map((v) => {
        if (v.name && v.url) {
          return { ...v, listId: surpinResult.id };
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
        surpinResult.id,
        t
      );

      res.status(200).json({ message: "done" });

      // throw Error();
    });
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in createMySurpin.js---------------------------------",
      err,
      "---------------------------------Error occurred in createMySurpin.js---------------------------------"
    );
    if (err instanceof errorMessage) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).send();
    }
  }
};
