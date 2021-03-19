const getSrupinLists = require("../../utils/getSurpinLists");

module.exports = async (req, res) => {
  try {
    const { pagenumber, tag } = req.body;
    const offset = ((pagenumber || 1) - 1) * 10;

    if (tag) {
      //tag를 이용해 해당 태그를 사용하는 listId를 가져온다.

      //가져온 listId를 이용하여 일반목록, 순위검색을 해서 가져온다.
      res.json({
        ...(await getSrupinLists(offset, 10, {}, tag)),
        top: (
          await getSrupinLists(0, 10, {}, tag, {
            name: "savedCount",
            order: "desc",
          })
        ).surpins,
      });
    } else {
      res.status(400).json({ message: "Unsufficient info" });
    }
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in searchLists.js---------------------------------"
    );
    console.log(err);
    console.log(
      "---------------------------------Error occurred in searchLists.js---------------------------------"
    );
    res.status(500).send();
  }
};
