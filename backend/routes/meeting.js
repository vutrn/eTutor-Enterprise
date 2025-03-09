const router = require("express").Router();
const meetingController = require("../controllers/meetingController");
const middlewareController = require("../controllers/middlewareController");

router.post("/", middlewareController.verifyTokenAndAdmin, meetingController.createMeeting);

router.get("/:classId", middlewareController.verifyTokenAndAdmin, meetingController.getMeetingsByClass);

router.put("/attendance/:meetingId", middlewareController.verifyTokenAndAdminAndTutor, meetingController.markAttendance);

module.exports = router;