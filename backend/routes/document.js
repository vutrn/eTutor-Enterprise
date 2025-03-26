const router = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const documentController = require("../controllers/documentController");

router.post("/upload/:classId", middlewareController.verifyTokenAndAdminAndTutor, documentController.uploadDocument);

router.get("/:classId",  documentController.getDocuments);

router.delete("/:classId/:documentId", middlewareController.verifyTokenAndAdminAndTutor, documentController.deleteDocument);


module.exports = router;    