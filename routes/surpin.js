const express = require("express");
const tokenCheckForSurpin = require("../middlewares/tokenCheckForSurpin");
const router = express.Router();

const controller = require("../controllers/surpin/");

router.get("/newlists", controller.newLists);
router.get("/besttags", controller.bestTags);
router.get("/searchlists", controller.searchLists);
router.get("/showuserLists/", tokenCheckForSurpin, controller.showUserLists);
router.get("/showsurpin", tokenCheckForSurpin, controller.showSurpin);
router.post("/createmysurpin", tokenCheckForSurpin, controller.createMySurpin);
router.put("/editmysurpin", tokenCheckForSurpin, controller.editMySurpin);
router.delete(
  "/removemysurpin",
  tokenCheckForSurpin,
  controller.removeMySurpin
);

module.exports = router;
