import { IProperty } from "../interface/property";
import {  IUserPayload } from "../interface/user";
import PropertyModelAr from "../model/propertyAr";
import PropertyModelEn from "../model/propertyEn";
import { translateToAr } from "../util/translateToAr";
import { propertySchema } from "../util/yapSchema";

export class PropertyService{

  async handleAllProperties(){
    try{
      const properties=await PropertyModelEn.find({});
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
  async handleSpecificProperty(propertyId:string){
    try{
      const property=await PropertyModelEn.find({_id:propertyId});
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
  async handleAddProperties(body:IProperty,adminBody:IUserPayload){
    if(adminBody.role !== "host"){
      return {
        status:"fail",
        message: "Access denied. Only hosts can perform this action."
      };
    }
    try{
      const validbody=await propertySchema.validate(body,{abortEarly:false});
      const newProperties=new PropertyModelEn({...validbody,admin:adminBody});
      await newProperties.save()
      const translatedBody= await translateToAr(body);
      console.log(translatedBody,"servise")
      const newPropertyAr=new PropertyModelAr({...translatedBody,admin:adminBody});
      await newPropertyAr.save();
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
}