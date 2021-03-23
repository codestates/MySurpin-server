const axios = require("axios");

module.exports = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    res.status(400).json({ message: "Unsufficient info" });
  }
  try {
    axios
      .get(url, {
        origin: "http://localhost:4000",
        credentials: true,
      })
      .then((res, err) => {
        const html = res.data;
        const tag = /<title>(.*)<\/title>/;
        const match = html.match(tag);
        const title = match ? match[1] : url;
        return title;
      })
      .then((title) => {
        res.status(200).json({ title });
      });
  } catch (err) {
    console.log(
      "---------------------------------Error occurred in showUrlTitle.js---------------------------------"
    );
    console.log(err);
    console.log(
      "---------------------------------Error occurred in showUrlTitle.js---------------------------------"
    );
    res.status(500).send();
  }
};
