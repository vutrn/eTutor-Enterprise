const middlewareController = require("../controllers/middlewareController");
const messageController = require("../controllers/messageController");

const router = require("express").Router();

router.get("/getusertochat", middlewareController.verifyToken, messageController.getUserToChat);

router.get("/getmessage/:id", middlewareController.verifyToken, messageController.getMessages);

router.post("/sendmessage/:id", middlewareController.verifyToken, messageController.sendMessage);

module.exports = router;