import { IProperty } from "../interface/property";
import {  IUserPayload } from "../interface/user";
import PropertyModel from "../model/property";
import { translateToArLogic, translateToEnLogic } from "../util/Property/translatePropertyLogic";
import { propertySchema } from "../util/yapSchema";

export class PropertyService{

  async handleAllProperties(lang:string){
    try{
      const properties=await PropertyModel.find({});
      // let properties:IProperty[];
      // if(lang === "ar"){
      //   properties=await PropertyModelAr.find({});
      // }else{
      //   properties=await PropertyModelEn.find({});
      // }
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
        message:"Property Added"
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
          status:"fail",
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
}