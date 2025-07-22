import { IProperty } from "../interface/property";
import { IUserPayload } from "../interface/user";
import CityModel from "../model/city";
import PropertyModel from "../model/property";
import { translateToAr } from "./translateToAr";
import { translateToEn } from "./translateToEn";

export const translateToEnLogic =async (body:IProperty,adminBody:IUserPayload)=>{
    const translatedBody= await translateToEn(body);

  const newProperty=new PropertyModel({...translatedBody,admin:adminBody});
  await newProperty.save();
  const cityUpdated=await CityModel.updateOne({nameAr:translatedBody.location.city.toLowerCase()},{$inc:{numberOfHotel:1}});
  if(cityUpdated.modifiedCount ===0){
    await CityModel.create({
      name:translatedBody.location.city,
      nameAr:translatedBody.location.cityAr,
      nameEn:translatedBody.location.cityEn,
      numberOfHotel:1
    })
  }
}
export const translateToArLogic =async (body:IProperty,adminBody:IUserPayload)=>{
  const translatedBody= await translateToAr(body);
  const newProperty=new PropertyModel({...translatedBody,admin:adminBody});
  await newProperty.save();
  const cityUpdated=await CityModel.updateOne({nameEn:translatedBody.location.city.toLowerCase()},{$inc:{numberOfHotel:1}})
  console.log(cityUpdated)
  if(cityUpdated.modifiedCount ===0){
    await CityModel.create({
      name:translatedBody.location.city,
      nameEn:translatedBody.location.cityEn,
      nameAr:translatedBody.location.cityAr,
      numberOfHotel:1
    })
  }
}