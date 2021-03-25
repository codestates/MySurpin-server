const getSrupinLists = require("../../utils/getSurpinLists");

module.exports = async (req, res) => {
  try {
    const { pagenumber } = req.body;
    const offset = ((pagenumber || 1) - 1) * 10;

    const lists = await getSrupinLists(offset, 10);
    if (lists.surpins.length > 0) res.json(lists);
    else
      res.status(404).json({
        message: "Not found surpin lists",
      });
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in newLists.js---------------------------------",
      err,
      "---------------------------------Error occurred in newLists.js---------------------------------"
    );
    res.status(500).send();
  }
};
