const router = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const documentController = require("../controllers/documentController");

router.post("/upload", middlewareController.verifyTokenAndAdminAndTutor, documentController.uploadDocument);

router.get("/:classId/:userId",  documentController.getDocuments);

router.delete("/:classId/:documentId", middlewareController.verifyTokenAndAdmin, documentController.deleteDocument);


module.exports = router;    