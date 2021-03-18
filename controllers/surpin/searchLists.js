const getSrupinLists = require("../../utils/getSurpins");

module.exports = async (req, res) => {
  try {
    const { pagenumber, tag } = req.body;
    const offset = ((pagenumber || 1) - 1) * 10;

    const tagOption = {};
    if (tag) {
      tagOption.name = tag || "t";
    }
    // else {
    //   res.status(400).json({ message: "Unsufficient info" });
    // }
    res.json({
      ...(await getSrupinLists(offset, 10, {}, tagOption)),
      top: (
        await getSrupinLists(0, 10, {}, tagOption, {
          name: "savedCount",
          order: "desc",
        })
      ).surpins,
    });
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
