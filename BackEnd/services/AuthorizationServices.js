const jwt = require("jsonwebtoken");

const Authorization = (req, res, next) => {
  // Check if the Authorization header contains a Bearer token
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; // Extract token from header

    // Verify the JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("Invalid token:", err.message);
        return res
          .status(401)
          .json({ message: "Unauthorized. Invalid token." });
      }

      // Token is valid, attach user data to request and proceed
      req.user = decoded; // `decoded` contains the JWT payload (e.g., user ID, email)
      next();
    });
  } else {
    console.log("Unauthorized access attempt:", req.originalUrl);
    res.status(401).json({ message: "Unauthorized. Please log in." });
  }
};

module.exports.Authorization = Authorization;
