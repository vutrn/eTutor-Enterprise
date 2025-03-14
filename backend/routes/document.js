const router = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const documentController = require("../controllers/documentController");

router.post("/upload", middlewareController.verifyTokenAndAdminAndTutor, documentController.uploadDocument);

router.get("/",  documentController.getDocuments);

router.delete("/:documentId", middlewareController.verifyTokenAndAdmin, documentController.deleteDocument);


module.exports = router;