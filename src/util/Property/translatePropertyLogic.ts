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

  const cityEn = translatedBody.location.cityEn?.trim();
  const cityAr = translatedBody.location.cityAr?.trim();

  // Search by either nameAr, or nameEn (case-insensitive)
  const cityQuery = {
    $or: [
      ...(cityAr ? [{ nameAr: cityAr }, { name: cityAr }] : []),
      ...(cityEn
        ? [
            { nameEn: { $regex: new RegExp(`^${cityEn}$`, "i") } },
            { name: { $regex: new RegExp(`^${cityEn}$`, "i") } },
          ]
        : []),
    ],
  };

  const cityUpdated = await CityModel.updateOne(
    cityQuery,
    {
      $inc: { numberOfHotel: 1 },
      $set: {
        ...(cityAr ? { nameAr: cityAr } : {}),
        ...(cityEn ? { nameEn: cityEn.toLowerCase() } : {}),
      },
    }
  );

  if (cityUpdated.matchedCount === 0) {
    await CityModel.create({
      name: cityEn || translatedBody.location.city,
      nameAr: cityAr || translatedBody.location.city,
      nameEn: cityEn?.toLowerCase() || translatedBody.location.city?.toLowerCase(),
      isDangerousPlace: !isSafePlace,
      numberOfHotel: 1,
    });
  }
}
export const translateToArLogic = async (body: IProperty, adminBody: IUserPayload) => {
  const translatedBody = await translateToAr(body);

  const isSafePlace = safeProvincesEn.some(
    (item) => item.toLowerCase() === body.location.city?.toLowerCase()
  );
  const foundProperty = await PropertyModel.findOne({ "admin._id": adminBody?._id });
  let newProperty;
  if (foundProperty && foundProperty.isConfirmed === true) {
    newProperty = new PropertyModel({
      ...translatedBody,
      admin: adminBody,
      isDangerousPlace: !isSafePlace,
      isConfirmed: true,
    });
  } else {
    newProperty = new PropertyModel({
      ...translatedBody,
      admin: adminBody,
      isActive: false,
      isDangerousPlace: !isSafePlace,
      isConfirmed: false,
    });
  }
  await newProperty.save();

  const cityEn = translatedBody.location.cityEn?.trim();
  const cityAr = translatedBody.location.cityAr?.trim();

  // Search by either nameAr, or nameEn (case-insensitive)
  const cityQuery = {
    $or: [
      ...(cityAr ? [{ nameAr: cityAr }, { name: cityAr }] : []),
      ...(cityEn
        ? [
            { nameEn: { $regex: new RegExp(`^${cityEn}$`, "i") } },
            { name: { $regex: new RegExp(`^${cityEn}$`, "i") } },
          ]
        : []),
    ],
  };

  const cityUpdated = await CityModel.updateOne(
    cityQuery,
    {
      $inc: { numberOfHotel: 1 },
      $set: {
        ...(cityAr ? { nameAr: cityAr } : {}),
        ...(cityEn ? { nameEn: cityEn.toLowerCase() } : {}),
      },
    }
  );

  if (cityUpdated.matchedCount === 0) {
    await CityModel.create({
      name: cityEn || translatedBody.location.city,
      nameEn: cityEn?.toLowerCase() || translatedBody.location.city?.toLowerCase(),
      nameAr: cityAr || translatedBody.location.city,
      isDangerousPlace: !isSafePlace,
      numberOfHotel: 1,
    });
  }
};