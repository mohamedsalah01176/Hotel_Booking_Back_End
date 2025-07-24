import CityModel from "../model/city"

export default class CityService{
  async handleGetCities(){
    try{
      const cities=await CityModel.find({});
      if(cities.length>0){
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