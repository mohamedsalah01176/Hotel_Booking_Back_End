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
      const property=await PropertyModel.findOne({_id:propertyId});
      const foundHotal= await ReserveDateModel.findOne({propertyId:propertyId});
      if(foundHotal){
        await ReserveDateModel.updateOne({_id:foundHotal._id},{$push:{reserveDates:{...body,userId:user._id}}})
      }else{
        const newReservDate= new ReserveDateModel({reserveDates:{...body,userId:user._id},adminId:property?.admin?._id,property,propertyId});
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
      const foundHotal= await ReserveDateModel.findOne({propertyId:propertyId});
      if(foundHotal){
        return{
          status:"success",
          property:foundHotal,
          nightPrice:foundHotal.property?.nightPrice
        }
      }else{
        const property=await PropertyModel.findOne({_id:propertyId});
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
  async handleGetReserveDateForUser(userId:string){
    console.log(userId)
    try{
      const foundHotels = await ReserveDateModel.find({ "reserveDates.userId": userId });
      if (foundHotels.length > 0) {
      return {
        status: "success",
        properties: foundHotels.map(hotel => ({
          property: hotel.property,
          nightPrice: hotel.property?.nightPrice,
          reserveDates: hotel.reserveDates.filter(r => r.userId.toString() === userId)
        }))
      };
    } else {
      return {
        status: "success",
        message: "You do not have any reserve dates"
      };
    }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleGetAllReserveDate(){
    try{
      const disableDates = await ReserveDateModel.find({});
      return {
        status: "success",
        disableDates:disableDates.map((item)=>item.reserveDates.map((item)=>item))
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleDeleteRevervedDate(dateId:string){
    try{
      const deletedHotel = await ReserveDateModel.updateOne({"reserveDates._id": dateId },{$pull:{reserveDates:{_id:dateId}}});
    if (deletedHotel.modifiedCount>0) {
      return {
        status: "success",
        message :"Hotal Deleted"
      };
    } else {
      return {
        status: "success",
        message: "Not Found This Hotal"
      };
    }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
}

