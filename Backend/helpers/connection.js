import mysql2 from "mysql2";
import dotenv from 'dotenv';
dotenv.config()

const conn = mysql2.createPool({
    host:process.env.DBHOST,
    user:process.env.DBUSER,
    password:process.env.DBPWD,
    database:process.env.DBDB,   
}).promise();

export default conn;