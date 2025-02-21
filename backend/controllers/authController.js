const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
  //Register
  registerUser: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      const salt = await bcryptjs.genSalt(10);
      const hashed = await bcryptjs.hash(req.body.password, salt);
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: "Username hoặc Email đã tồn tại!" });
      }
      //Create New User
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
        role: req.body.role,
      });
      //Save to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      console.error("Lỗi khi đăng ký:", err); // Thêm dòng này để debug lỗi
      res.status(500).json({ message: "Lỗi server!", error: err.message });
    }
  },
  //Login
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json({
          message: "Wrong User Name !",
        });
        return;
      }
      const validPassword = await bcryptjs.compare(req.body.password, user.password);
      if (!validPassword) {
        res.status(404).json({
          message: "Wrong Password !",
        });
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
        });
        const { password, ...other } = user._doc;
        res.status(200).json({ ...other, accessToken });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //User Logout
  userLogout: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken);
    res.status(200).json("Log Out Successfully");
  },
  //Generate Access Token
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1d" }
    );
  },

  //Generate Refresh Token
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  requestRefreshToken: async (req, res) => {
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
    });
  },

  checkAuth: async (req, res) => {
    try {
      // The user information will be available in req.user if the auth middleware is working
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = authController;
