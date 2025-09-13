import { IUserBody } from './../interface/user';
import PropertyModel from "../model/property";
import { IReview, IReviewBody } from '../interface/property';
import { translateToAr } from '../util/Review/translateToAr';
import { translateToEn } from '../util/Review/translateToEn';
import { UpdateResult } from "mongoose";

export default class ReviewServices{


  async handleAddReview(body:IReviewBody,user:IUserBody,propertyId:string,lang:string){
    try{
      let propertyUpdated : UpdateResult ;
      if(lang === "en"){
        console.log(lang)
        const translaedBody=await translateToAr(body)
        propertyUpdated=await PropertyModel.updateOne({_id:propertyId},{$push:{reviews:{...translaedBody,user:user}}});
      }else{
        const translaedBody=await translateToEn(body)
        propertyUpdated=await PropertyModel.updateOne({_id:propertyId},{$push:{reviews:{...translaedBody,user}}});
      }
      if(propertyUpdated.modifiedCount>0){
        const property=await PropertyModel.findOne({_id:propertyId});
        const lengthReview=property?.reviews.length as number;
        const totalRating=property?.reviews.reduce((acc,item)=>acc + (item.rate || 0),0) as number;
        const averageRate=lengthReview>0? totalRating/lengthReview:0
        await PropertyModel.updateOne({ _id: propertyId },{ $set: { rate: Number(averageRate.toFixed(1)) } });
        return{
          status:"success",
          message:"Review Added"
        }
      }else{
        return{
          status:"fail",
          message:"Not Found Any Property"
        }
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  
  async handleDeleteReview(user:IUserBody,reviewId:string){
    try{
      let propertyUpdated;
      if(user.role === "manager"){
        propertyUpdated=await PropertyModel.updateOne({"reviews._id":reviewId},{$pull:{reviews:{_id:reviewId}}});
      }else{
        propertyUpdated=await PropertyModel.updateOne({"reviews._id":reviewId,"reviews.user._id":user._id},{$pull:{reviews:{_id:reviewId}}});
      }
      
      if(propertyUpdated.modifiedCount>0){
        return{
          status:"success",
          message:"Review Deleted"
        }
      }else{
        return{
          status:"fail",
          message:"Not Found Any Property"
        }
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleUpdateReview(user:IUserBody,reviewId:string,body:IReviewBody,lang:string){
    try{
      const filter=user.role === "manager"? { "reviews._id": reviewId } : { "reviews._id": reviewId, "reviews.user._id": user._id };
      const translateBody= lang === "en"?await translateToAr(body): await translateToEn(body)
      let propertyUpdated =await PropertyModel.updateOne(filter,{
        $set:{
          "reviews.$.data": translateBody.data,
          "reviews.$.dataEn": translateBody.dataEn,
          "reviews.$.dataAr": translateBody.dataAr,
          "reviews.$.rate": translateBody.rate,
          }
      }) ;
      
      
      if(propertyUpdated.modifiedCount>0){
        return{
          status:"success",
          message:"Review Updated"
        }
      }else{
        return{
          status:"fail",
          message:"Not Found Any Property"
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