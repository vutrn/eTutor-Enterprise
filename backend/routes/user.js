const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

const router = require("express").Router();

//Get All User
router.get("/",userController.getAllUsers);

//Delete User
router.delete("/:id", middlewareController.verifyTokenAndAdmin, userController.deleteUser);

module.exports = router;