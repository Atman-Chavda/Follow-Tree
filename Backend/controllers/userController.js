import dotenv from "dotenv";
import bcrypt from "bcrypt";
import conn from "../helpers/connection.js";
import nodemailer from "nodemailer";
import { createSecretToken } from "../helpers/secretToken.js";

dotenv.config();

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await conn.query(
      `SELECT * FROM user_details WHERE uname = ? OR email = ?`,
      [username, email]
    );
    if (existingUser[0].length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await conn.query(
      `INSERT INTO user_details (uname, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword]
    );

    const token = createSecretToken(email);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const login = async (req, res) => {
    try
    {
        const {email, password} = req.body;
        const checkUser = await conn.query(`SELECT * FROM user_details WHERE email = ?`, [email]);
        if(checkUser[0].length === 0)
        {
            return res.status(400).json({success: false, message: "User not found"});
        }
        const validPassword = await bcrypt.compare(password, checkUser[0][0].password);
        if(!validPassword)
        {
            return res.status(400).json({success: false, message: "Invalid password"});
        }
        const token = createSecretToken(email);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: true
        });
        res.status(200).json({success: true, message: "Login successful"});
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message: error.message});
    }   
};
export const reset = async (req, res) => {};
export const logout = async (req, res) => {};
