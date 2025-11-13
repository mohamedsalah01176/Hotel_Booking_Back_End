import { IAdmin } from './../../interface/property';
import { IProperty } from "../../interface/property";
import { IUserPayload } from "../../interface/user";
import CityModel from "../../model/city";
import PropertyModel from "../../model/property";
import { translateToAr } from "./translateToAr";
import { translateToEn } from "./translateToEn";
import {  safeProvincesAr, safeProvincesEn } from '../dangerousPlace';

export const translateToEnLogic =async (body:IProperty,adminBody:IUserPayload)=>{
  const translatedBody= await translateToEn(body);
  const isSafePlace= safeProvincesAr.some(item=>item === body.location.city?.toLowerCase())
  const foundProperty= await PropertyModel.findOne({"admin._id":adminBody?._id})
  let newProperty;
  if(foundProperty && foundProperty.isConfirmed === true){
    newProperty=new PropertyModel({...translatedBody,admin:adminBody,isDangerousPlace:!isSafePlace,isConfirmed:true});
  }else{
    newProperty=new PropertyModel({...translatedBody,admin:adminBody,isActive:false,isDangerousPlace:!isSafePlace,isConfirmed:false});
    
  }
  await newProperty.save();
  const cityUpdated=await CityModel.updateOne({nameAr:translatedBody.location.cityAr},{$inc:{numberOfHotel:1}});
  if(cityUpdated.modifiedCount ===0){
    await CityModel.create({
      name:translatedBody.location.city,
      nameAr:translatedBody.location.cityAr,
      nameEn:translatedBody.location.cityEn,
      isDangerousPlace:!isSafePlace,
      numberOfHotel:1
    })
  }
}
export const translateToArLogic =async (body:IProperty,adminBody:IUserPayload)=>{
  console.log(body.location.city,"sssssssssssss")
  const translatedBody= await translateToAr(body);
  
  const isSafePlace= safeProvincesEn.some(item=>item.toLowerCase() ===body.location.city?.toLowerCase())
  console.log(isSafePlace,"sssssssssssss")
  const foundProperty= await PropertyModel.findOne({"admin._id":adminBody?._id})
  let newProperty;
  if(foundProperty && foundProperty.isConfirmed === true){
    newProperty=new PropertyModel({...translatedBody,admin:adminBody,isDangerousPlace:!isSafePlace,isConfirmed:true});
  }else{
    newProperty=new PropertyModel({...translatedBody,admin:adminBody,isActive:false,isDangerousPlace:!isSafePlace,isConfirmed:false});
    
  }
  await newProperty.save();
  const cityUpdated=await CityModel.updateOne({nameEn:translatedBody?.location?.cityEn?.toLowerCase()},{$inc:{numberOfHotel:1}})
  if(cityUpdated.modifiedCount ===0){
    await CityModel.create({
      name:translatedBody.location.city,
      nameEn:translatedBody.location.cityEn,
      nameAr:translatedBody.location.cityAr,
      isDangerousPlace:!isSafePlace,
      numberOfHotel:1
    })
  }
}