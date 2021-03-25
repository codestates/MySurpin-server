const express = require("express");
const tokenCheckForSurpin = require("../middlewares/tokenCheckForSurpin");
const router = express.Router();
const controller = require("../controllers/surpin/");

router.post("/newlists", controller.newLists);
router.get("/besttags", controller.bestTags);
router.post("/searchlists", controller.searchLists);
router.post("/showuserLists/", tokenCheckForSurpin, controller.showUserLists);
router.post("/showsurpin", tokenCheckForSurpin, controller.showSurpin);
router.post("/createmysurpin", tokenCheckForSurpin, controller.createMySurpin);
router.patch("/editmysurpin", tokenCheckForSurpin, controller.editMySurpin);
router.post("/showurltitle", controller.showUrlTitle);
router.delete(
  "/removemysurpin",
  tokenCheckForSurpin,
  controller.removeMySurpin
);

module.exports = router;
