const router = require("express").Router();
const meetingController = require("../controllers/meetingController");
const middlewareController = require("../controllers/middlewareController");

router.post("/", middlewareController.verifyTokenAndAdmin, meetingController.createMeeting);

module.exports = router;