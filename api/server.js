import express from 'express';
import cors from 'cors'
import corsOptions from './middlewares/corsOptions.js';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
// import routes
import authRouter from './routes/auth.js'

import './config/passport.js'


config()
const PORT = process.env.PORT || 5000;     


const app = express();
app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(bodyParser.json())


connectDB()



app.get('/', (req, res) => {
    res.send('Hello World!');
})


// configure routes 
app.use('/api/auth' , authRouter)


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});