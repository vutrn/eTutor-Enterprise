const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authController = {
  registerUser: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: "Username or Email already exists!" });
      }

      const newUser = new User({ username, email, password: hashedPassword, role });
      const user = await newUser.save();
      res.status(201).json(user);
      } catch (err) {
      res.status(500).json({ message: "Server error!", error: err.message });
    }
  },

  // Login User
  loginUser: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: "Invalid username or password!" });

      const validPassword = await bcryptjs.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ message: "Invalid username or password!" });

      const accessToken = authController.generateAccessToken(user);
      const refreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(refreshToken);

      const { password: _, ...other } = user._doc;
      res.status(200).json({ ...other, accessToken, refreshToken });
    } catch (err) {
      res.status(500).json({ message: "Server error!", error: err.message });
    }
  },

  // Logout User
  userLogout: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      res.status(200).json({ message: "Logged out successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Server error!" });
    }
  },

  // Refresh Token
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.headers["authorization"]?.split(" ")[1];
    if (!refreshToken) return res.status(401).json("You're not authenticated");
    if (!refreshTokens.includes(refreshToken)) return res.status(403).json("Refresh Token is not valid");

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) return res.status(403).json("Token is invalid");

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);

      res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  },

  // Generate Access Token
  generateAccessToken: (user) => {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "10s" }
    );
  },

  // Generate Refresh Token
  generateRefreshToken: (user) => {
    return jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "7d" }
    );
  },
};

module.exports = authController;
