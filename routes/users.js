const express = require("express");
const tokenCheck = require("../middlewares/tokenCheck");
const getGoogleData = require("../middlewares/getGoogleProfile");
const router = express.Router();

const controller = require("../controllers/users/");

router.post("/userinfo", tokenCheck, controller.userinfo);
router.post("/signup", controller.signup);
router.post("/signin", controller.signin);
router.post("/signout", tokenCheck, controller.signout);
router.patch("/useredit", tokenCheck, controller.useredit);
router.delete("/withdrawal", tokenCheck, controller.withdrawal);
router.post("/googleSignIn", getGoogleData, controller.googleSignIn);
router.post("/googleSignUp", getGoogleData, controller.googleSignUp);

module.exports = router;
