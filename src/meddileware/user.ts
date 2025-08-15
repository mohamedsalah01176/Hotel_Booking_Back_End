import  jwt  from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload; // أو حط النوع الصحيح حسب محتوى التوكن
    }
  }
}

interface JwtPayload {
  _id: string;
  role: string;
  email?: string;
  name?: string;
  phoneVerfy:boolean;
  image:string;
} 
export const authentication =(req:Request,res:Response,next:NextFunction)=>{
  const authHeader  =req.headers["Authorization"] as string || req.headers["authorization"] as string;
  if(!authHeader || !authHeader.startsWith("Bearer")){
    return res.status(505).json({message:"No token Providede"})
  }
  
  const token=authHeader.split(" ")[1];
  
  
  try{
    const decoded = jwt.verify(token, process.env.SECTERTOKENKEY as string) as JwtPayload;
    console.log(decoded)
    req.user = decoded;
    next()
  }catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  
}

export const authorizationForHost=(req:Request,res:Response,next:NextFunction)=>{
  const authHearder= req.headers["Authorization"] as string || req.headers["authorization"] as string
  if(!authHearder || !authHearder.startsWith("Bearer")){
    return res.status(505).json({message:"No token Providede"})
  } 
  let token = authHearder.split(" ")[1];
  try{
    const decod =jwt.verify(token,process.env.SECTERTOKENKEY as string) as JwtPayload
    console.log(decod)
    if(decod.role == "host"){
      next();
    }else{
      return res.status(403).json({ message: "Access denied. Only hosts are allowed." });
    }
  }catch(error){
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export const authorizationForUser=(req:Request,res:Response,next:NextFunction)=>{
  const authHearder= req.headers["Authorization"] as string || req.headers["authorization"] as string
  if(!authHearder || !authHearder.startsWith("Bearer")){
    return res.status(505).json({message:"No token Providede"})
  } 
  let token = authHearder.split(" ")[1];
  try{
    const decod =jwt.verify(token,process.env.SECTERTOKENKEY as string) as JwtPayload
    console.log(decod)
    if(decod.role == "user"){
      next();
    }else{
      return res.status(403).json({ message: "Access denied. Only hosts are allowed." });
    }
  }catch(error){
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
export const authorizationForManager=(req:Request,res:Response,next:NextFunction)=>{
  const authHearder= req.headers["Authorization"] as string || req.headers["authorization"] as string
  if(!authHearder || !authHearder.startsWith("Bearer")){
    return res.status(505).json({message:"No token Providede"})
  } 
  let token = authHearder.split(" ")[1];
  try{
    const decod =jwt.verify(token,process.env.SECTERTOKENKEY as string) as JwtPayload
    console.log(decod)
    if(decod.role == "manager"){
      next();
    }else{
      return res.status(403).json({ message: "Access denied. Only Manager are allowed." });
    }
  }catch(error){
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
