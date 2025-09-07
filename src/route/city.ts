import CityController from '../controler/city';
import upload from '../meddileware/cloudnary';
import { authentication } from '../meddileware/user';
import CityService from '../service/city';
import { Router } from "express";

const router =Router();

const cityService=new CityService();
const cityController=new CityController(cityService);

router.get("/city",(req,res)=>cityController.allCities(req,res))
router.delete("/city/:cityName",(req,res)=>cityController.deleteCity(req,res))
router.patch("/city/:cityName",(req,res)=>cityController.updateCity(req,res))

  








export default router