const authController = require("../controllers/authController");
const middlewareController = require("../controllers/middlewareController");

const router = require("express").Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.post("/refresh", authController.requestRefreshToken);

router.post("/logout", authController.userLogout);

// router.get("/check", middlewareController.verifyToken, authController.checkAuth);

module.exports = router;
