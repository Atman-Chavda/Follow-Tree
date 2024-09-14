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
  try {
    const { email, password } = req.body;
    const checkUser = await conn.query(
      `SELECT * FROM user_details WHERE email = ?`,
      [email]
    );
    if (checkUser[0].length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const validPassword = await bcrypt.compare(
      password,
      checkUser[0][0].password
    );
    if (!validPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    const token = createSecretToken(email);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
    });
    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const reset = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUser = await conn.query(
      `SELECT * FROM user_details WHERE email = ?`,
      [email]
    );
    if (checkUser[0].length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const user = checkUser[0][0];
    const resetToken = await bcrypt.genSalt(10);
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000;
    const msTime = new Date(now.getTime() + offset + 1800000);
    const resetTokenExpires = msTime
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    console.log(resetTokenExpires);
    await conn.query(
      `UPDATE user_details SET reset_password_token = ?, reset_password_token_expires = ? WHERE email = ?`,
      [resetToken, resetTokenExpires, email]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_SEND,
      to: user.email,
      subject: "Follow tree Password Reset",
      text: `Click on the link to reset your password: http://localhost:3000/reset/${resetToken}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
    res
      .status(200)
      .json({ success: true, message: "Reset link sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await conn.query(
      `SELECT * FROM user_details WHERE reset_password_token = ?`,
      [token]
    );

    if (result[0].length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token " });
    }
    const user = result[0][0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await conn.query(
      `UPDATE user_details SET password = ?, reset_password_token = NULL, reset_password_token_expires = NULL WHERE id = ?`,
      [hashedPassword, user.id]
    );
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
