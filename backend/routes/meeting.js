const router = require("express").Router();
const meetingController = require("../controllers/meetingController");
const middlewareController = require("../controllers/middlewareController");

router.post("/", middlewareController.verifyTokenAndAdminAndTutor, meetingController.createMeeting);

router.get("/:classId", middlewareController.verifyTokenAndAdminAndTutor, meetingController.getMeetingsByClass);

router.put("/attendance/:meetingId", middlewareController.verifyTokenAndAdminAndTutor, meetingController.markAttendance);

module.exports = router;