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
        propertyUpdated=await PropertyModel.updateOne({_id:propertyId},{$push:{reviews:{_id:propertyId,...translaedBody,user}}});
      }else{
        console.log("ddddddd")
        const translaedBody=await translateToEn(body)
        propertyUpdated=await PropertyModel.updateOne({_id:propertyId},{$push:{reviews:{_id:propertyId,...translaedBody,user}}});
      }
      if(propertyUpdated.modifiedCount>0){
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
}