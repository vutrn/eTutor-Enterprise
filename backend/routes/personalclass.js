const personalClassController = require("../controllers/personalClassController");

const middlewareController = require("../controllers/middlewareController");

const authController = require("../controllers/authController");

const router = require("express").Router();

router.post("/createclass", middlewareController.verifyTokenAndAdmin ,personalClassController.createPersonalClass);

router.get("/", personalClassController.getPersonalClass);

router.delete("/:personalClassId", middlewareController.verifyTokenAndAdmin, personalClassController.deletePersonalClass);

router.delete("/:personalClassId/deletestudent/:studentId", middlewareController.verifyTokenAndAdmin, personalClassController.removeStudentFromClass);

router.put("/:personalClassId/update", middlewareController.verifyTokenAndAdmin, personalClassController.updateClass);

module.exports = router;

