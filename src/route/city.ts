import CityController from '../controler/city';
import upload from '../meddileware/cloudnary';
import { authentication } from '../meddileware/user';
import CityService from '../service/city';
import { Router } from "express";

const router =Router();

const cityService=new CityService();
const cityController=new CityController(cityService);

router.get("/city",(req,res)=>cityController.allCities(req,res))










export default router