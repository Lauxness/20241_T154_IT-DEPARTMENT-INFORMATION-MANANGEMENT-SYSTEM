const Authorization = (req, res, next) => {
  if (req.session && req.session.tokens) {
    next(); // Proceed to the next middleware or route handler
  } else {
    console.log("Unauthorized access attempt:", req.originalUrl);
    res.status(401).json({ message: "Unauthorized. Please log in." });
  }
};

module.exports.Authorization = Authorization; // Ensure proper export
