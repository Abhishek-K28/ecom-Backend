import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import "dotenv/config";
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';


//App Config
const app = express();
const PORT = process.env.PORT || 4000;


//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//api endpoints

app.use("/api/user", userRouter)
app.use("/api/product", productRouter)

app.get('/', (req, res) => {
  res.send('Api working');
});



connectDB().then(async () => {
    console.log('Connected to MongoDB');
     await connectCloudinary();
    console.log('Connected to Cloudinary');
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
})