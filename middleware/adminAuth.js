import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: "Forbidden: Invalid admin token" });
    }
    next();
}catch(error){
    console.error("ADMIN AUTH ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
}
}

export default adminAuth;