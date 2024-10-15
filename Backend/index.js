import express from 'express';
import dotenv from 'dotenv';
import conn from './helpers/connection.js';
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

if(conn)
{
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
else{
    console.log("Connection failed");
}

const corsOptions = {
    origin: 'http://localhost:3000', // The URL of your React frontend
    methods: 'GET,POST,PUT,DELETE', // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies and credentials
};
app.use(cors(corsOptions));
app.use(express.json()); // Add this line to parse JSON bodies

app.use('/user',userRoute);
app.use('/post',postRoute);

