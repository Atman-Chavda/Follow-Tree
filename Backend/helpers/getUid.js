import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
export function getUid(req) {
  const token = req.cookies.token;
  
  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_KEY
    );
    return decoded.id;
  } catch (error) {
    console.log(error);
    return error;
  }
};

// const result = getUid();
// console.log(result);