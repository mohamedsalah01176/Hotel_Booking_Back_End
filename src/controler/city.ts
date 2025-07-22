import { Request, Response } from "express";
import CityService from "../service/city";
import { ReponseStatues } from "../util/ResponseStatus";

export default class CityController{
  constructor(private cityService:CityService){}

  async allCities(req:Request,res:Response){
    let responseServer= await this.cityService.handleGetCities()
    ReponseStatues(responseServer,res)
  }
}