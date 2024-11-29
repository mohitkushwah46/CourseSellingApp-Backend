const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

function tutorAuth(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const tutor = jwt.verify(token, JWT_SECRET);
        if(!token){
            return res.json({
                message:"authenticaiton failed"
            })
        }
        req.id = tutor.id; // Attach tutor info to request for further use
        console.log(tutor)

        next();
    } catch (error) {
        console.error(error); // Log the error
        return res.status(403).json({ message: "Token invalid or expired, login again" });
    }
}

module.exports = tutorAuth; // Use CommonJS export
