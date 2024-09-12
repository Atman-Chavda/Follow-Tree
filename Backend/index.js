import express from 'express';
import dotenv from 'dotenv';
import conn from './helpers/connection';

dotenv.config();
const app = express();
const port = process.env.PORT;

if(conn)
{
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
else{
    console.log("Connection failed");
}