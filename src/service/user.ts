import { ILoginUser, IUpdateBody, IUserBody } from "../interface/user";
import bcrypt from "bcrypt"
import UserModel from "../model/user";
import { sendMessageSMS, sendMessageWhatsUp } from "../util/sendMessage";
import {  loginBodySchema, regiterBodySchema } from "../util/yapSchema";
import { sendEmailChange, sendEmailCode } from "../util/sendEmail";
import jwt from "jsonwebtoken";
import PropertyModel from "../model/property";




let otpStore:{[key:string]:string}={};

export default class UserService{
  constructor(){}
  async handleSendCode(body:{email:string, type?:string}){
    if(!body){
      return{
        status:'fail',
        messageEn:"The Email is Required",
        messageAr:"يجب ادخال الايميل",
      }
    }
    try{
      console.log(body,"body")
      let code=Math.floor(100000+Math.random()*900000);
      otpStore[body.email]=code.toString();
      sendEmailCode(code,body.email as string)
      // if(body.type === "whatsApp"){
      //   await sendMessageWhatsUp(code,body.phone);
      // }else{
      //   await sendMessageSMS(code,body.phone);
      // }
      return{
        status:"success",
        meessageEn:"Code Sended",
        meessageAr:"تم ارسال الكود",
      }
    }catch(errors:any){
      if(errors.code === 11000 && errors.keyPattern?.email){
        return {
          status:"fail",
          messageEn:"this email is already registered",
          messageAr:"تم تسجيل الايميل من قبل"
        }
      }
      return{
        status:"error",
        errors
      }
    }
  }

  async handleVerfyCode(body:{code:string,email:string}){
    if(!body){
      return{
          status:'fail',
          messageEn:"The Email is Required",
          messageAr:"يجب ادخال رقم الايميل",
        }
    }
    try{
      if(body.code !== otpStore[body.email]){
        return{
          status:"fail",
          messageEn:"Sorry, we are not able to verify the code. Please make sure you input the right Email and code.",
          messageAr: "عذرًا، لا يمكننا التحقق من الرمز. يرجى التأكد من إدخال الايميل والرمز الصحيح"
        }
      }
      delete otpStore[body.email];
      const newUser =await UserModel.findOneAndUpdate({email:body.email},{$set:{phoneVerfy:true}},{new:true});
      
      const payload = {
        _id: newUser?._id,
        name:newUser?.name,
        email: newUser?.email,
        role: newUser?.role,
        phone:newUser?.phone,
        image:newUser?.image,
        phoneVerfy:newUser?.phoneVerfy,
        createdAt:newUser?.createdAt
      };
      let token=  jwt.sign(payload,process.env.SECTERTOKENKEY as string,{expiresIn:"30d"});
      return{
        status:"success",
        messageEn:"verfiy correct",
        messageAr:"التحقيق صحيح",
        token
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
      const foundUser=await UserModel.findOne({$or:[{email:body.email},{phone:body.phone}]});
      if(foundUser){
        return{
          status:"fail",
          messageEn:"The Email Or Phone Aready Registered",
          messageAr:"تم تسجيل الايميل او الفون من قبل",
        }
      }
      
      const validationBody=regiterBodySchema.validate(body,{abortEarly:false});
      console.log((await validationBody).password as string)
      let bcriptPassword=await bcrypt.hash((await validationBody).password as string ,parseInt(process.env.SALTPASSWORD as string));
      let newUser=new UserModel({...(await validationBody),password:bcriptPassword});
      await newUser.save();
      const payload = {
        _id: newUser._id,
        name:newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone:newUser.phone,
        image:newUser?.image,
        phoneVerfy:newUser?.phoneVerfy,
        createdAt:newUser.createdAt
      };
      let token=  jwt.sign(payload,process.env.SECTERTOKENKEY as string,{expiresIn:"30d"});
      return{
        status:"success",
        messageEn:"user Created",
        messageAr:"تم انشاء المستخدم",
        token
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
        messageEn:"Email and Password are required",
        messageAr:"يجب ادجال الايميل وكلمه السر",
      }
    }
    try{
      let validateBody=await loginBodySchema.validate(body,{abortEarly:false});
      let foundUser:IUserBody | null;
      if(validateBody.emailOrPhone.startsWith("+")){
        foundUser=await UserModel.findOne({phone:validateBody.emailOrPhone});
      }else{
        foundUser=await UserModel.findOne({email:validateBody.emailOrPhone});
      }
      console.log(foundUser)
      if(!foundUser){
        return{
          status:"fail",
          messageEn:"Email Or Phone Not Registered",
          messageAr:"الايميل غير مسجل"
        }
      }
      let matchedPassword=await bcrypt.compare(validateBody.password,foundUser.password);
      const payload = {
        _id: foundUser._id,
        name:foundUser.name,
        email: foundUser.email,
        phone:foundUser.phone,
        role: foundUser.role,
        image:foundUser?.image,
        phoneVerfy:foundUser?.phoneVerfy,
        createdAt:foundUser.createdAt
      };
      let token=  jwt.sign(payload,process.env.SECTERTOKENKEY as string,{expiresIn:"30d"});
      console.log(validateBody.password);
      console.log(matchedPassword);
      if(matchedPassword){
        return{
          status:"success",
          messageEn:"Welcame in Our WebSite",
          messageAr:"مرحبا بك في موقعنا",
          token
        }
      }else{
        return{
          status:"error",
          messageEn:"Password is not correct",
          messageAr:"كلمه السر غير صحيحيه",
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
        messageEn:"Email is Required",
        messageAr:"يجب ادخال الايميل",
      }
    }
    try{
      let userFounded=await UserModel.findOne({email:body.email});
      if(!userFounded){
        return{
          status:"fail",
          messageُى:"Email Not Registered",
          messageAr:"الايميل غير مسجل"
        }
      }
      await sendEmailChange(userFounded,"password")
      return{
        status:"success",
        messageEn:"Check your gmail account",
        messageAr:"افحص الجيميل الخاص بك"
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleResetPassword(body:{emailOrPhone:string,password:string}){
    if(!body){
      return{
        status:"fail",
        messageEn:"Email Not Found",
        messageAr:"الايميل غير مسجل",
      }
    }
    
    try{
      let validateBody=await loginBodySchema.validate(body);
      let foundUser=await UserModel.findOne({email:validateBody.emailOrPhone});
      if(!foundUser){
        return{
          status:"fail",
          messageEn:"Email is not Registered",
          messageAr:"البريد الإلكتروني غير مسجّل"
        }
      }
      let bcriptPassword=await bcrypt.hash(body.password,parseInt(process.env.SALTPASSWORD as string ))
      let updateUser=await UserModel.updateOne({email:validateBody.emailOrPhone},{$set:{password:bcriptPassword}})
      if(updateUser.modifiedCount){
        return{
          status:"success",
          messageEn:"Password Updated",
          messageAr:"تم تحديث كلمه السر",
        }
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleGetSpecificUser(userId:string){
    try{
      let foundUser=await UserModel.findOne({_id:userId});
      if(!foundUser){
        return{
          status:"fail",
          messageEn:"User Not Found",
          messageAr:"المستخدم ليس موجود"
        }
      }
      return{
        status:"success",
        user:foundUser
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleUpdateUser(userId:string,body:IUpdateBody){
    let hashPassword="";
    try{
      let user=await UserModel.findOne({_id:userId});
      if(!user){
        return{
          status:"fail",
          messageEn:"User Not Found",
          messageAr:"المستخدم ليس موجود"
        }
      }
      if(body.oldPassword){
        const checkedPassword=await bcrypt.compare(body?.oldPassword as string,user?.password as string);
        console.log(checkedPassword,"lllllllllll")
        if(!checkedPassword){
          return{
            status:"fail",
            messageEn:"Your Old Password Not The Same your Password",
            messageAr:"كلمه السر القديمه غير متشابه"
          }
        }
        hashPassword=await bcrypt.hash(body?.newPassword as string,Number(process.env.SALTPASSWORD));
      }
      console.log(body,"llllllllllllllllll")
      body.password=hashPassword;
      delete body.newPassword
      delete body.oldPassword
      const updateUser=await UserModel.updateOne({_id:userId},{$set:body},{new: true})
      if(updateUser.modifiedCount>0){
        return{
          status:"success",
          messageEn:"Your Account Updated",
          messageAr:"تم تحديث حسابكم"
        }
      }else{
        return{
          status:"fail",
          messageEn:"Your Account Not Updated",
          messageAr:"لم تم تحديث حسابكم"
        }
      }
      
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleGetAllUsers(){
    try{
      const users=await UserModel.find({});
      return{
          status:"success",
          users
        }
    }catch(errors){
      console.log(errors)
      return{
        status:"error",
        errors
      }
    }
  }
  async handleDeleteUser(userId:string){

    try{
      const userDeleted=await UserModel.deleteOne({_id:userId});
      if(userDeleted.deletedCount>0){
        await PropertyModel.deleteMany({"admin._id":userId})
        return{
          status:"success",
          userDeleted
        }
      }else{
        return{
          status:"fail",
          messageEn:"User Not Found",
          messageAr:"المستخدم ليس موجود"
        }
      }
    }catch(errors){
      console.log(errors)
      return{
        status:"error",
        errors
      }
    }
  }
}