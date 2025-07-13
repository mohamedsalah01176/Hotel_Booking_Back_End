import { ILoginUser, IUserBody } from "../interface/user";
import bcrypt from "bcrypt"
import UserModel from "../model/user";
import { sendMessage } from "../util/sendMessage";
import { forgetPasswordBodySchema, loginBodySchema, regiterBodySchema } from "../util/yapSchema";
import { sendEmail } from "../util/sendEmail";
import jwt from "jsonwebtoken";




let otpStore:{[key:string]:string}={};

export default class UserService{
  constructor(){}
  async handleSendCode(body:{phone:string}){
    if(!body){
      return{
        status:'fail',
        message:"The Phone is Required"
      }
    }
    try{
      let code=Math.floor(100000+Math.random()*900000);
      otpStore[body.phone]=code.toString();
      await sendMessage(code,body.phone);
      return{
        status:"success",
        meessage:"Mesage Sended"
      }
    }catch(errors:any){
      if(errors.code === 11000 && errors.keyPattern?.email){
        return {
          status:"fail",
          message:"this email is already registered"
        }
      }
      return{
        status:"error",
        errors
      }
    }
  }

  async handleVerfyCode(body:{code:string,phone:string}){
    if(!body){
      return{
          status:'fail',
          message:"The Phone is Required"
        }
    }
    try{
      if(body.code === otpStore[body.phone]){
        delete otpStore[body.phone];
        return{
          status:"success",
          message:"verfiy correct"
        }
      }
      return{
        status:"fail",
        message:"code is incorrect"
      }
    }catch(errors){
      return{
        status:"error",
        message:errors
      }
    }
  }

  async handleRegister(body:IUserBody){
    try{
      const validationBody=regiterBodySchema.validate(body,{abortEarly:false});
      console.log((await validationBody).password as string)
      let bcriptPassword=await bcrypt.hash((await validationBody).password as string ,parseInt(process.env.SALTPASSWORD as string));
      let newUser=new UserModel({...(await validationBody),password:bcriptPassword});
      await newUser.save();
      return{
        status:"success",
        message:"user Created"
      }
    }catch(errors){
      return {
        status:"error",
        errors
      }
    }
  }

  async handleLogin(body:ILoginUser){
    if(!body){
      return{
        status:"fail",
        message:"Email and Password are required"
      }
    }
    try{
      let validateBody=await loginBodySchema.validate(body,{abortEarly:false});
      let foundUser=await UserModel.findOne({email:validateBody.email});
      if(!foundUser){
        return{
          status:"fail",
          message:"Email Not Registered"
        }
      }
      let matchedPassword=await bcrypt.compare(validateBody.password,foundUser.password);
      const payload = {
        id: foundUser._id,
        email: foundUser.email,
        role: foundUser.role
      };
      let token=  jwt.sign(payload,process.env.SECTERTOKENKEY as string,{expiresIn:"30d"})
      console.log(matchedPassword);
      if(matchedPassword){
        return{
          status:"success",
          message:"Welcame in Our WebSite",
          token
        }
      }else{
        return{
          status:"error",
          message:"Password is not correct",
        }
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }

  async handleForgetPassword(body:{email:string}){
    if(!body){
      return{
        status:"fail",
        message:"Email is Registered"
      }
    }
    try{
      let userFounded=await UserModel.findOne({email:body.email});
      if(!userFounded){
        return{
          status:"fail",
          message:"Email Not Registered"
        }
      }
      await sendEmail(userFounded)
      return{
        status:"success",
        message:"Check your gmail account"
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleResetPassword(body:{email:string,password:string}){
    if(!body){
      return{
        status:"fail",
        message:"Email Not Found"
      }
    }
    
    try{
      let validateBody=await loginBodySchema.validate(body);
      let foundUser=await UserModel.findOne({email:validateBody.email});
      if(!foundUser){
        return{
          status:"fail",
          message:"Email is not Registered"
        }
      }
      let bcriptPassword=await bcrypt.hash(body.password,parseInt(process.env.SALTPASSWORD as string ))
      let updateUser=await UserModel.updateOne({email:validateBody.email},{$set:{password:bcriptPassword}})
      if(updateUser.modifiedCount){
        return{
          status:"success",
          message:"Password Updated"
        }
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
}