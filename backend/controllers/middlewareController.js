const jwt = require("jsonwebtoken");

const middlewareController = {
    //Verify Token
    veriryToken: (req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    res.status(403).json("Token Not Valid");
                }
                req.user = user;
                next();
            })
        } else {
            res.status(401).json("You're not authenticated");
        }
    },

    verifyTokenAndAdmin: (req, res, next) => {
        middlewareController.veriryToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.role === "admin") {
                next();
            } else {
                res.status(403).json("You're not allowed to do this function");
            }
        });
    },

    verifyTokenAndAdminAndTutor: (req, res, next) => {
        middlewareController.veriryToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.role === "admin" || req.user.role === "tutor") {
                next();
            } else {
                res.status(403).json("You're not allowed to do this function");
            }
        });
    },
};

module.exports = middlewareController;