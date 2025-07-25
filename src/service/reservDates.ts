import { IUserPayload } from "../interface/user";
import PropertyModel from "../model/property";
import { ReserveDateModel } from "../model/ReservDates";
import { DateSchema } from "../util/yapSchema";

export class ReservDatesService{
  async handleRevesveDates(user:IUserPayload,body:{startDate:Date,endDate:Date},propertyId:string){
    if(user.role !== "user"){
      return{
        status:"error",
        messageEn:"You are not authorized to perform this action.",
        message: "غير مصرح لك بتنفيذ هذا الإجراء"
      }
    }
    try{
      await DateSchema.validate(body);
      const data=await PropertyModel.findOne({_id:propertyId}).select("admin._id");
      const foundHotal= await ReserveDateModel.findOne({propertyId:propertyId});
      if(foundHotal){
        await ReserveDateModel.updateOne({_id:foundHotal._id},{$push:{reserveDates:{...body,userId:user._id}}})
      }else{
        const newReservDate= new ReserveDateModel({reserveDates:{...body,userId:user._id},adminId:data?.admin?._id,propertyId});
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
}