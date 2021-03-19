const getSrupinLists = require("../../utils/getSurpinLists");

module.exports = async (req, res) => {
  try {
    const { pagenumber } = req.body;
    const offset = ((pagenumber || 1) - 1) * 10;

    res.json(await getSrupinLists(offset, 10));
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in newLists.js---------------------------------"
    );
    console.log(err);
    console.log(
      "---------------------------------Error occurred in newLists.js---------------------------------"
    );
    res.status(500).send();
  }
};
