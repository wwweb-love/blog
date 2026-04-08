const jwt = require("jsonwebtoken");

const sign = procces.env.JWT_SECRET;

module.exports = {
    generate(data) {
        return jwt.sign(data, sign, { expiresIn: "30d" })
    },
    verify(token) {
        return jwt.verify(token, sign)
    }
}
