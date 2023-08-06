const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

router.post("/subscribe", emailController.subscribeEmail);
router.get("/subscribers", emailController.getAllSubscribers);
module.exports = router;
