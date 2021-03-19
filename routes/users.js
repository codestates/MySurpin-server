const express = require("express");
const tokenCheck = require("../middlewares/tokenCheck");
const router = express.Router();

const controller = require("../controllers/users/");

router.post("/userinfo", tokenCheck, controller.userinfo);
router.post("/signup", controller.signup);
router.post("/signin", controller.signin);
router.post("/signout", tokenCheck, controller.signout);
router.patch("/useredit", tokenCheck, controller.useredit);
router.delete("/withdrawal", tokenCheck, controller.withdrawal);

module.exports = router;
