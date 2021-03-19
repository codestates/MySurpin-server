const getSrupinLists = require("../../utils/getSurpinLists");
const { User } = require("../../models");

module.exports = async (req, res) => {
  try {
    const { nickname } = req.query;
    const { pagenumber, tag } = req.body;
    const offset = ((pagenumber || 1) - 1) * 10;
    const tagOption = {};

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
      //사용자가 가지고 있는 모든 태그를 담는 구문
      if (tag) {
        tagOption.name = tag;
      }
      res.json({
        ...(await getSrupinLists(
          offset,
          10,
          { userId: rows[0].id },
          tagOption
        )),
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
