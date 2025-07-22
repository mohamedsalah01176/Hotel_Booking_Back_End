import express, { Response,Request } from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import userRouter from "./route/user";
import { rateLimit } from 'express-rate-limit';
import helmet from "helmet";
import compression from "compression"
import cors from 'cors';
import propertyRouter from "./route/property";
import cityRouter from "./route/city";



dotenv.config();
const app =express();
const Port=process.env.PORT;
const Mongo_URL=process.env.MONGO_URL as string;

app.use(express.json());

/*const limiter=rateLimit({
     windowMs:15 * 60 * 1000, //  15 minutes
     limit:1000, // you have 100 request from one ip address at 15 minutes
    message:"Too many requests, please try again later"
})

app.use(limiter)*/


// we use it to provide the attacks accourding header
app.use(helmet({
    // to solve show image problem
    contentSecurityPolicy:{
        directives:{
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'"],  
            // "img-src":["'self'","https://cdn.dummyjson.com"]
        }
    },
    // to provide attecker to write iframe in page
    xFrameOptions:{
        action:"deny"
    }
}))
app.use(cors());

app.use(compression());


app.use("/api",userRouter)
app.use("/api",propertyRouter)
app.use("/api",cityRouter)


app.use((req:Request,res:Response)=>{
  if(req.originalUrl.startsWith('/api')){
    return res.status(404).json({
      status:"fail",
      message:`The ${req.originalUrl} Url Not Found`
    })
  }
  res.status(404).json({
    status:"Error",
    message:"Url is Not Valid"
  })
})








mongoose.connect(Mongo_URL).then(()=>console.log("databse connected"))

app.listen(Port,()=>console.log(`http://localhost:${Port}`))