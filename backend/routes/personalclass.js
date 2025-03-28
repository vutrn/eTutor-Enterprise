const personalClassController = require("../controllers/personalClassController");

const middlewareController = require("../controllers/middlewareController");

const authController = require("../controllers/authController");

const router = require("express").Router();

router.post("/createclass", middlewareController.verifyTokenAndAdmin ,personalClassController.createPersonalClass);

router.get("/", personalClassController.getPersonalClass);

router.delete("/:personalClassId", middlewareController.verifyTokenAndAdmin, personalClassController.deletePersonalClass);

router.patch("/:personalClassId", middlewareController.verifyTokenAndAdmin, personalClassController.updateClass);

router.patch("/:personalClassId/:studentId", middlewareController.verifyTokenAndAdmin, personalClassController.updateClass);


module.exports = router;

