import { ILoginUser, IUserBody } from "../interface/user";
import * as yup from "yup"
import bcrypt from "bcrypt"
import UserModel from "../model/user";
import { sendMessage } from "../util/sendMessage";
import  twilio  from "twilio";


const bodySchema=yup.object({
  name:yup.string().min(3,'Password must be at least 3 characters').required('Password is required'),
  phone: yup.string().required('Password is required'),
  email: yup.string().email().required('Password is required'),
  password:yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/,'Password must contain at least one letter and one number'),
  role: yup.string().oneOf(['user', 'host', 'manager']),
  birthDate: yup.date().optional()
})

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
      const validationBody=bodySchema.validate(body,{abortEarly:false});
      console.log((await validationBody).password as string)
      let dcriptPassword=await bcrypt.hash((await validationBody).password as string ,parseInt(process.env.SALTPASSWORD as string));
      let newUser=new UserModel({...(await validationBody),password:dcriptPassword});
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

  handleLogin(body:ILoginUser){
    console.log(otpStore,"jjjjjjjjjjj")
    return {
        status:"error",
      
      }
  }
}