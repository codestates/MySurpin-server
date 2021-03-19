const express = require("express");
const router = express.Router();

const controller = require("../controllers/tag/");

router.get("/showExistsTags", controller.showExistsTags);
router.get("/showUserTags", controller.showUserTags);

module.exports = router;
