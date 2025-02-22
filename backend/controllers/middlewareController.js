const jwt = require("jsonwebtoken");

const middlewareController = {
    //Verify Token
    // Middleware xác thực người dùng
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "You're not authenticated" });
        }

        const token = authHeader.split(" ")[1]; // Lấy token từ "Bearer <token>"
        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }

        jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Token is not valid" });
            }
            req.user = user;
            next();
        });
    },

    // Middleware xác thực Admin
    verifyTokenAndAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.role === "admin") {
                next();
            } else {
                return res.status(403).json({ message: "You're not allowed to do this function" });
            }
        });
    },

    // Middleware xác thực Admin hoặc Tutor
    verifyTokenAndAdminAndTutor: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.role === "admin" || req.user.role === "tutor") {
                next();
            } else {
                return res.status(403).json({ message: "You're not allowed to do this function" });
            }
        });
    },
};

module.exports = middlewareController;
