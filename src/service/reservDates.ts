import { IUserPayload } from "../interface/user";
import PropertyModel from "../model/property";
import { ReserveDateModel } from "../model/ReservDates";
import { DateSchema } from "../util/yapSchema";

export default class ReservDatesService{
  async handleRevesveDates(user:IUserPayload,body:{startDate:Date,endDate:Date},propertyId:string){
    // if(user.role === "user"){
    //   return{
    //     status:"error",
    //     messageEn:"You are not authorized to perform this action.",
    //     message: "غير مصرح لك بتنفيذ هذا الإجراء"
    //   }
    // }
    try{
      await DateSchema.validate(body);
      const property=await PropertyModel.findOne({_id:propertyId}).select(["admin._id", "nightPrice"]);
      const foundHotal= await ReserveDateModel.findOne({propertyId:propertyId});
      if(foundHotal){
        await ReserveDateModel.updateOne({_id:foundHotal._id},{$push:{reserveDates:{...body,userId:user._id}}})
      }else{
        const newReservDate= new ReserveDateModel({reserveDates:{...body,userId:user._id},adminId:property?.admin?._id,propertyId});
        await newReservDate.save()
      }
      return{
        status:"success",
        message:"Date reserved successfully"
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
 
  async handleGetReserveDateForProperty(propertyId:string){
    try{
      const property=await PropertyModel.findOne({_id:propertyId}).select(["admin._id", "nightPrice"]);
      const foundHotal= await ReserveDateModel.findOne({propertyId:propertyId});
      if(foundHotal){
        return{
          status:"success",
          property:foundHotal,
          nightPrice:property?.nightPrice
        }
      }else{
        return{
          status:"success",
          message:"You do not have any reserve date",
          nightPrice:property?.nightPrice
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

