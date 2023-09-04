import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import AuthRoutes from '../server/Routes/AuthRoutes.js'
import UserRoutes from '../server/Routes/UserRoute.js'
import PostRoute from '../server/Routes/PostRoute.js'
import cloudinary from "cloudinary";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

config({
  path :"./config/config.env"
})

cloudinary.v2.config({ 
  cloud_name:process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const app = express();

app.use(bodyParser.json({ limit: "30mb", }));

app.use(cors({
  origin:"http://localhost:3000",
  credentials:true,
  methods:["GET","POST","PUT","DELETE","PATCH"]

}))
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));
app.use(cookieParser())


const PORT = process.env.PORT;
const CONNECTION = process.env.MONGODB_CONNECTION;
mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`server connected successfully at Port ${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

  app.use('/auth' , AuthRoutes)
  app.use('/user' , UserRoutes)
  app.use('/post', PostRoute )

