import dotenv from 'dotenv';
import express from 'express';
import conn from '../helpers/connection.js';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
app.use(cookieParser());

export const createPost = async (req, res) => {
    try
    {
        const {title, description} = req.body;
        const post_detail = await conn.query(
            `INSERT INTO post_details (title, description) VALUES (?, ?)`,
            [title, description]
        );
        const user_id = verifyToken(req.cookies.jwt, process.env.TOKEN_SECRET);
        const post_user_juntion = await conn.query(`INSERT INTO post_user_junction (user_id, post_id) VALUES (?, ?)`, [user_id.id, post_detail[0].insertId]);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({ message: error.message });
    }   
}