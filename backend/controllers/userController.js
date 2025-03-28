const User = require("../models/User");

const userController = {
    //Get All User
    getAllUsers: async(req,res)=>{
        try{
            const user = await User.find();
            res.status(200).json(user);
        }catch(err){
            res.status(500).json(err);
        }
    },

    //Delete User
    deleteUser: async(req,res)=>{
        try{
            const user = User.findById(req.params.id);
            res.status(200).json("Delete Successfully !");
            await user.deleteOne();
        }catch(err){
            res.status(500).json(err);
        }
    }
}

module.exports = userController;