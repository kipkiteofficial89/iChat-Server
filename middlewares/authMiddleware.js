const jwt = require("jsonwebtoken");

exports.authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const { username, userId } = decode;
        req.username = username;
        req.userId = userId;
        next();
    } catch (err) {
        next("Authentication failed!");
    }
};