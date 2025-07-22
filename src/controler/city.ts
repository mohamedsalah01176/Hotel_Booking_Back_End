import { Request, Response } from "express";
import CityService from "../service/city";

export default class CityController{
  constructor(private cityService:CityService){}

  allCities(req:Request,res:Response){

  }
}