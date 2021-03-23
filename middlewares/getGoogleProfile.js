const axios = require("axios");

module.exports = (req, res, next) => {
  const googleData = req.body.data.split("#")[1].split("&");

  let access_token = "";
  for (const query of googleData) {
    const splited = query.split("=");
    if (splited[0] === "access_token") {
      access_token = splited[1];
    }
  }
  const googleAPI = `https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses`;

  axios
    .get(googleAPI, {
      headers: {
        authorization: `Bearer ${access_token}`,
      },
    })
    .then((v) => {
      //console.log(v.data);
      req.email = v.data.emailAddresses[0].value;
      req.nickname = v.data.names[0].displayName;
      req.googleData = v.data.resourceName;
      next();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "check server" });
    });
};
