import { IProperty } from "../interface/property";
import {  IUserPayload } from "../interface/user";
import PropertyModel from "../model/property";
import { translateToArLogic, translateToEnLogic } from "../util/Property/translatePropertyLogic";
import { translateToAr } from "../util/Property/translateToAr";
import { translateToEn } from "../util/Property/translateToEn";
import { propertySchema } from "../util/yapSchema";

export class PropertyService{

  async handleAllProperties(lang:string){
    try{
      const properties=await PropertyModel.find({isActive:true});
      // let properties:IProperty[];
      // if(lang === "ar"){
      //   properties=await PropertyModelAr.find({});
      // }else{
      //   properties=await PropertyModelEn.find({});
      // }
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
  async handleSpecificProperty(propertyId:string,lang:string){
    try{
      const property=await PropertyModel.findOne({_id:propertyId});
      // let property;
      // if(lang === "ar"){
      //   property=await PropertyModelAr.findOne({_id:propertyId});
      // }else{
      //   property=await PropertyModelEn.findOne({_id:propertyId});
      // }
      if(property){
        return{
          status:"success",
          property
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
      console.log(body)
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
      const foundProperty=await PropertyModel.findOne({_id:propertyId});
      if(!foundProperty){
        return{
          status:"fail",
          message:"This Property is not found"
        }
      }
      foundProperty.set({isActive:false});
      foundProperty.save()
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
      const foundProperty=await PropertyModel.findOne({_id:propertyId});
      if(!foundProperty){
        return{
          status:"fail",
          message:"This Property is not found"
        }
      }
      foundProperty.set({isActive:true});
      foundProperty.save()
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
}