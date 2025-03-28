const middlewareController = require("../controllers/middlewareController");
const messageController = require("../controllers/messageController");

const router = require("express").Router();

router.get("/users/:classId", middlewareController.verifyToken, messageController.getUserToChat);

router.get("/getmessage/:receiverId", middlewareController.verifyToken, messageController.getMessages);

router.post("/sendmessage/:receiverId", middlewareController.verifyToken, messageController.sendMessage);

module.exports = router;