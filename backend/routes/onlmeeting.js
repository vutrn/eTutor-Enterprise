const router = require("express").Router();
const onlMeetingController = require("../controllers/onlMeetingController");
const middlewareController = require("../controllers/middlewareController");

router.get("/all", onlMeetingController.getAllMeetings);

router.post("/", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.createOnlMeeting);

router.get("/:classId", middlewareController.verifyToken, onlMeetingController.getMeetingsByClass);

router.put("/attendance/:meetingId", middlewareController.verifyTokenAndAdminAndTutor, onlMeetingController.markAttendance);

module.exports = router;