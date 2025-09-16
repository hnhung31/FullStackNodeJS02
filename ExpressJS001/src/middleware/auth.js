require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyTokenAndSetUser = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return true;
        } catch (error) {
            return false;
        }
    }
    return false;
};

const required = (req, res, next) => {
    if (verifyTokenAndSetUser(req)) {
        return next();
    }
    return res.status(401).json({ EC: -1, EM: "Yêu cầu xác thực không hợp lệ." });
};

const optional = (req, res, next) => {
    verifyTokenAndSetUser(req);
    next();
};

module.exports = {
    required,
    optional
};