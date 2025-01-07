const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateAuthToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

module.exports = generateAuthToken;
