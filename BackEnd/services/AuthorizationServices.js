const jwt = require("jsonwebtoken");

const Authorization = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Invalid token:", err.message);
        return res.status(401).json({
          message:
            err.name === "TokenExpiredError"
              ? "Token expired."
              : "Unauthorized. Invalid token.",
        });
      }
      req.user = decoded;
      next();
    });
  } else {
    console.log("Unauthorized access attempt:", req.originalUrl);
    res.status(401).json({ message: "Token expired" });
  }
};

module.exports.Authorization = Authorization;
