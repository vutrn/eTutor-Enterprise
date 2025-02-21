const personalClassController = require("../controllers/personalClassController");

const middlewareController = require("../controllers/middlewareController");

const authController = require("../controllers/authController");

const router = require("express").Router();

router.post("/createclass", middlewareController.verifyTokenAndAdmin ,personalClassController.createPersonalClass);

router.get("/", personalClassController.getPersonalClass);

router.put("/:personalClassId/addstudent", middlewareController.verifyTokenAndAdmin, personalClassController.addStudentsToClass);

router.delete("/:personalClassId", middlewareController.verifyTokenAndAdmin, personalClassController.deletePersonalClass);

router.delete("/:personalClassId/deletestudent/:studentId", middlewareController.verifyTokenAndAdmin, personalClassController.removeStudentFromClass);

module.exports = router;

