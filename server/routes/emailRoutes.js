const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

router.post("/subscribe", emailController.subscribeEmail);
router.get("/subscribers", emailController.getAllSubscribers);
router.post("/send-task-email", emailController.sendTaskEmail);
router.post("/send-project-email", emailController.sendProjectEmail);
module.exports = router;
