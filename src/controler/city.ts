import { Request, Response } from "express";
import CityService from "../service/city";
import { ReponseStatues } from "../util/ResponseStatus";

export default class CityController{
  constructor(private cityService:CityService){}

  async allCities(req:Request,res:Response){
    let responseServer= await this.cityService.handleGetCities()
    ReponseStatues(responseServer,res)
  }
  async deleteCity(req:Request,res:Response){
    const cityName=req.params.cityName
    let responseServer= await this.cityService.handleDeleteCities(cityName)
    ReponseStatues(responseServer,res)
  }
  async updateCity(req:Request,res:Response){
    const cityName=req.params.cityName;
    const body=req.body;
    let responseServer= await this.cityService.handleUpdateCities(cityName,body)
    ReponseStatues(responseServer,res)
  }
}