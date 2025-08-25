import CityModel from "../model/city"
import PropertyModel from "../model/property";
import { translateToAr } from "../util/City/translateToAr";

export default class CityService{
  async handleGetCities(){
    try{
      const cities=await CityModel.find({});
      return{
        status:"success",
        cities
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }

  async handleDeleteCities(cityName:string){
    try{
      console.log(cityName)
      const cities=await CityModel.deleteOne({nameEn:cityName});
      console.log(cities)
      if(cities.deletedCount>0){
        await PropertyModel.deleteMany({"location.cityEn":cityName});
        return{
          status:"success",
          cities
        }
      }else{
        return{
          status:"fail",
          message:"Not Found Any City"
        }
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }

  async handleUpdateCities(cityName:string,body:{name:string,isDangerousPlace:boolean}){
    try{
      const translateBody=await translateToAr(body)
      const cities=await CityModel.updateOne({nameEn:cityName},{$set:{...body,...translateBody}});
      if(cities.modifiedCount>0){
        await PropertyModel.updateMany({"location.cityEn":cityName},{$set:{isDangerousPlace:body.isDangerousPlace,"location.city":cityName,"location.cityEn":translateBody.nameEn,"location.cityAr":translateBody.nameAr}});
        return{
          status:"success",
          cities
        }
      }else{
        return{
          status:"fail",
          message:"Not Found Any City"
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
