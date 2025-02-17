const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
    //Register
    registerUser: async(req, res) => {
        try {
            const salt = await bcryptjs.genSalt(10);
            const hashed = await bcryptjs.hash(req.body.password, salt)

            //Create New User
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });
            //Save to DB
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //Login
    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                res.status(404).json("Wrong User Name !");
                return;
            }
            const validPassword = await bcryptjs.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                res.status(404).json("Wrong Password !");
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                })
                const { password, ...other } = user._doc;
                res.status(200).json({...other, accessToken });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //User Logout
    userLogout: async(req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("Log Out Successfully")
    },
    //Generate Access Token 
    generateAccessToken: (user) => {
        return jwt.sign({
                id: user.id,
                admin: user.admin
            },
            process.env.JWT_ACCESS_KEY, { expiresIn: "20s" }
        );
    },

    //Generate Refresh Token
    generateRefreshToken: (user) => {
        return jwt.sign({
                id: user.id,
                admin: user.admin
            },
            process.env.JWT_REFRESH_KEY, { expiresIn: "365d" }
        );
    },

    requestRefreshToken: async(req, res) => {
        //Take refresh token from user 
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("You're not authenticated");
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh Token Not Valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.status(200).json({ accessToken: newAccessToken });
        })
    }
};

module.exports = authController;