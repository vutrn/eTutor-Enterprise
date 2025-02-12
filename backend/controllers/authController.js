const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {
    //Register
    registerUser: async(req,res) =>{
        try{
            const salt = await bcryptjs.genSalt(10);
            const hashed = await bcryptjs.hash(req.body.password, salt)

            //Create New User
            const newUser = await new User({
                username:req.body.username,
                email: req.body.email,
                password: hashed,
            });
            //Save to DB
            const user = await newUser.save();
            res.status(200).json(user);
        }catch(err){
            res.status(500).json(err);
        }
    },
    //Login
    loginUser: async(req,res)=>{
        try{
            const user = await User.findOne({username: req.body.username});
            if(!user){
                res.status(404).json("Wrong User Name !");
            }
            const validPassword = await bcryptjs.compare(
                req.body.password,
                user.password
            );
            if(!validPassword){
                res.status(404).json("Wrong Password !");
            }
            if(user && validPassword){
                const accessToken = jwt.sign({
                    id: user.id,
                    admin: user.admin
                },
                process.env.JWT_ACCESS_KEY,
                {expiresIn: "1d" }
                );
                const {password, ...other} = user._doc; 
                res.status(200).json({...other, accessToken});
            }
        }catch(err){
            res.status(500).json(err);
        }
    },
};

module.exports = authController;