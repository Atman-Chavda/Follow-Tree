import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const verify = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ succses: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
