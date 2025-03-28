const router = require("express").Router();
const onlMeetingController = require("../controllers/onlMeetingController");
const middlewareController = require("../controllers/middlewareController");

router.post("/", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.createOnlMeeting);

router.get("/:classId", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.getMeetingsByClass);

router.put("/attendance/:meetingId", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.markAttendance);

module.exports = router;