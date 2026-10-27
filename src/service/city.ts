import CityModel from "../model/city"
import PropertyModel from "../model/property";
import { translateToAr } from "../util/City/translateToAr";

export default class CityService{
  async handleGetCities(){
    try{
      // Remove any cities that have 0 or fewer hotels
      await CityModel.deleteMany({
        $or: [
          { numberOfHotel: { $lte: 0 } },
          { numberOfHotel: { $exists: false } },
        ],
      });

      const cities = await CityModel.find({ numberOfHotel: { $gt: 0 } });
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

  async handleDeleteCities(cityName: string) {
    try {
      const cityQuery = {
        $or: [
          { nameEn: { $regex: new RegExp(`^${cityName}$`, "i") } },
          { nameAr: cityName },
          { name: { $regex: new RegExp(`^${cityName}$`, "i") } },
        ],
      };

      const cityToDelete = await CityModel.findOne(cityQuery);
      if (!cityToDelete) {
        return {
          status: "fail",
          message: "Not Found Any City",
        };
      }

      const cities = await CityModel.deleteOne({ _id: cityToDelete._id });
      if (cities.deletedCount > 0) {
        const deletePropertyQuery = {
          $or: [
            ...(cityToDelete.nameEn ? [{ "location.cityEn": { $regex: new RegExp(`^${cityToDelete.nameEn}$`, "i") } }] : []),
            ...(cityToDelete.nameAr ? [{ "location.cityAr": cityToDelete.nameAr }] : []),
            ...(cityToDelete.name ? [{ "location.city": { $regex: new RegExp(`^${cityToDelete.name}$`, "i") } }] : []),
          ],
        };
        await PropertyModel.deleteMany(deletePropertyQuery);
        return {
          status: "success",
          cities,
        };
      } else {
        return {
          status: "fail",
          message: "Not Found Any City",
        };
      }
    } catch (errors) {
      return {
        status: "error",
        errors,
      };
    }
  }

  async handleUpdateCities(cityName: string, body: { name: string; isDangerousPlace: boolean }) {
    try {
      const translateBody = await translateToAr(body);
      const cityQuery = {
        $or: [
          { nameEn: { $regex: new RegExp(`^${cityName}$`, "i") } },
          { nameAr: cityName },
          { name: { $regex: new RegExp(`^${cityName}$`, "i") } },
        ],
      };

      const cities = await CityModel.updateOne(
        cityQuery,
        { $set: { ...body, ...translateBody } }
      );
      if (cities.modifiedCount > 0) {
        await PropertyModel.updateMany(
          {
            $or: [
              { "location.cityEn": { $regex: new RegExp(`^${cityName}$`, "i") } },
              { "location.cityAr": cityName },
              { "location.city": { $regex: new RegExp(`^${cityName}$`, "i") } },
            ],
          },
          {
            $set: {
              isDangerousPlace: body.isDangerousPlace,
              "location.city": cityName,
              "location.cityEn": translateBody.nameEn,
              "location.cityAr": translateBody.nameAr,
            },
          }
        );
        return {
          status: "success",
          cities,
        };
      } else {
        return {
          status: "fail",
          message: "Not Found Any City",
        };
      }
    } catch (errors) {
      return {
        status: "error",
        errors,
      };
    }
  }
}
