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
import reviewRouter from "./route/review";
import reservRouter from "./route/reservDates";
import CommonQuestionsRouter from "./route/commonQuestions";
import dashboardRouter from "./route/dashboard";



dotenv.config();
const app =express();
const Port=process.env.PORT;
const Mongo_URL=process.env.MONGO_URL as string;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const allowedOrigins = [
  "http://localhost:5173",
  "https://hotel-booking-front-end-x8sw.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'CORS policy does not allow access from this origin';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(compression());


app.use("/api",userRouter)
app.use("/api",propertyRouter)
app.use("/api",cityRouter)
app.use("/api",reviewRouter)
app.use("/api",reservRouter)
app.use("/api",CommonQuestionsRouter)
app.use("/api",dashboardRouter)

app.get('/', (_req, res) => {
  res.send('API is working 🎉');
});

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
