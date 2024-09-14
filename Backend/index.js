import express from 'express';
import dotenv from 'dotenv';
import conn from './helpers/connection.js';
import userRoute from './routes/userRoute.js';

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());

if(conn)
{
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
else{
    console.log("Connection failed");
}

app.use('/user',userRoute);