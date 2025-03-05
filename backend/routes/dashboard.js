const router = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const dashboardController = require("../controllers/dashboardController");

router.get("/", middlewareController.verifyToken, dashboardController.getDashboard);

module.exports = router;