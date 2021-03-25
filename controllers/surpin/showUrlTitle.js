const axios = require("axios");

module.exports = async (req, res) => {
  const { url } = req.body;
  const rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

  if (!url || !url.match(rValidUrl)) {
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
      })
      .catch((err) => {
        console.error(err);
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
