import { IProperty, IReview } from "../interface/property";
import {  IUserBody, IUserPayload } from "../interface/user";
import CityModel from "../model/city";
import PropertyModel from "../model/property";
import { translateToArLogic, translateToEnLogic } from "../util/Property/translatePropertyLogic";
import { translateToAr } from "../util/Property/translateToAr";
import { translateToEn } from "../util/Property/translateToEn";
import { propertySchema } from "../util/yapSchema";

export class PropertyService{

  async handleAllProperties(){
    try{
      const properties=await PropertyModel.find({});
      console.log(properties)
      return{
        status:"success",
        properties
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleAllActiveProperties(limit:number){
    try{
      const properties=await PropertyModel.find({isActive:true}).sort({ordersNumbers:-1}).limit(limit);
      console.log(properties)
      return{
        status:"success",
        properties
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleAllActivePropertiesForCity(cityEn:string,pageNumber:number,limit:number){
    console.log(limit)
    console.log(pageNumber)
    const skip=(pageNumber-1)*limit || 0;
    console.log(cityEn)
    try{
      const allproperties=await PropertyModel.find({isActive:true,"location.cityEn":cityEn.toLowerCase()});
      const properties=await PropertyModel.find({isActive:true,"location.cityEn":cityEn.toLowerCase()}).sort({ordersNumbers:-1}).skip(skip).limit(limit);
      return{
        status:"success",
        properties,
        numberOfProperties:allproperties.length
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleSpecificProperty(propertyId:string,lang:string){
    try{
      const property=await PropertyModel.findOne({_id:propertyId}).lean();
      const properties=await PropertyModel.find({"admin._id":property?.admin?._id}).lean();
      let lengthOfAllReviewsForHost=properties.reduce((acc,item)=>acc+ item.reviews.length,0);
      let totalRatingForHost = properties.reduce(
        (acc, item) => acc + (item.reviews?.reduce((acc2, review) => acc2 + (review.rate || 0), 0) || 0),
        0
      );      
      const rotalRatingPercentageForHost = lengthOfAllReviewsForHost > 0 ? totalRatingForHost / lengthOfAllReviewsForHost : 0;
      
      if(property){
        return{
          status:"success",
          property:{...property,allReviews:lengthOfAllReviewsForHost,rotalRatingPercentage:rotalRatingPercentageForHost}
        }
      }else{
        return{
          status:"fail",
          message:"Property Not Found"
        }
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleAddProperties(body:IProperty,adminBody:IUserPayload,lang:string){
    if(adminBody.role === "user"){
      return {
        status:"fail",
        message: "Access denied. Only hosts can perform this action."
      };
    }
    try{
      body.electricityAndWater.solar = Number(body.electricityAndWater.solar);
      body.electricityAndWater.stateElectricity = Number(body.electricityAndWater.stateElectricity);  
      body.electricityAndWater.amperes = Number(body.electricityAndWater.amperes);  
      body.electricityAndWater.publicWater = Number(body.electricityAndWater.publicWater);  
      body.electricityAndWater.privateWell = Number(body.electricityAndWater.privateWell);  
      body.electricityAndWater.waterTank = Number(body.electricityAndWater.waterTank);  
      console.log(body);
      const validbody=await propertySchema.validate(body,{abortEarly:false});
      if(lang === "ar"){
        await translateToEnLogic(body,adminBody)
      }else{
        await translateToArLogic(body,adminBody)
      }
      return{
        status:"success",
        message: "Your property has been submitted and is waiting for manager review."
      }
      
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleGetPropertyForAdmin(adminBody:IUserPayload){
    console.log(adminBody)
    if(adminBody.role === "user"){
      return {
        status:"fail",
        message: "Access denied. Only hosts can perform this action."
      };
    }
    try{
      const foundProperts=await PropertyModel.find({"admin._id":adminBody._id});
      if(foundProperts.length>0){
        return{
          status:"success",
          properties:foundProperts
        }
      }else{
        return{
          status:"success",
          message:"This admin have not any properties"
        }
      }
      
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleUpdateProperty(body:IProperty,user:IUserPayload,propertyId:string,lang:string){
    try{
      if(user.role === "user"){
        return {
          status:"fail",
          message: "Access denied. Only hosts can perform this action."
        };
      }
      const foundProperty=await PropertyModel.findOne({_id:propertyId});
      if(!foundProperty){
        return{
          status:"fail",
          message:"This Property is not found"
        }
      }
      if(lang === "ar"){
        const translatedBody= await translateToEn(body)
        foundProperty.set(translatedBody);
        await foundProperty.save();
      }else{
        const translatedBody= await translateToAr(body)
        foundProperty.set(translatedBody);
        await foundProperty.save();
      }
      return {
      status: "success",
      message: "Property updated successfully",
      data: foundProperty,
    };
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleDeActiveProperty(user:IUserPayload,propertyId:string){
    try{
      if(user.role === "user"){
        return {
          status:"fail",
          message: "Access denied. Only hosts can perform this action."
        };
      }
      const foundProperty = await PropertyModel.findByIdAndUpdate(
        propertyId,
        { $set: { isActive: false } },
        { new: true }
      );
      if (!foundProperty) {
        return {
          status: "fail",
          message: "This property was not found",
        };
      }
      return{
        status:"success",
        message:"Property is Stoped"
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleActiveProperty(user:IUserPayload,propertyId:string){
    try{
      if(user.role === "user"){
        return {
          status:"fail",
          message: "Access denied. Only hosts can perform this action."
        };
      }
      const foundProperty=await PropertyModel.findByIdAndUpdate(propertyId,{$set:{isActive:true}});
      if(!foundProperty){
        return{
          status:"fail",
          message:"This Property is not found"
        }
      }
      return{
        status:"success",
        message:"Property is Active"
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleConfirmProperty(propertyId:string){
    try{
      const foundProperty=await PropertyModel.findOne({_id:propertyId});
      if(!foundProperty){
        return{
          status:"fail",
          message:"This Property is not found"
        }
      }
      foundProperty.set({isConfirmed:true});
      foundProperty.save()
      return{
        status:"success",
        message:"Property is confirmed"
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleDeleteProperty(propertyId:string){
    try {
    const deletedProperty = await PropertyModel.findByIdAndDelete(propertyId);

    if (!deletedProperty) {
      return {
        status: "fail",
        message: "This property was not found"
      };
    }
    await CityModel.updateOne({nameEn:deletedProperty.location.cityEn},{$inc:{numberOfHotel:-1}})
    return {
      status: "success",
      message: "Property has been deleted"
    };
  }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  // async handleGetAllReviewsForHost(user:IUserBody){
  //   try{
  //     const properties=await PropertyModel.find({"admin.id":user._id});
  //     let lengthOfAllreviews=0;
  //     properties.forEach((item:IProperty)=>lengthOfAllreviews+=item.reviews.length)
  //     if(propertyUpdated.modifiedCount>0){
  //       return{
  //         status:"success",
  //         message:"Review Updated"
  //       }
  //     }else{
  //       return{
  //         status:"fail",
  //         message:"Not Found Any Property"
  //       }
  //     }
  //   }catch(errors){
  //     return{
  //       status:"error",
  //       errors
  //     }
  //   }
  // }
}