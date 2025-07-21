import PropertyController from '../controler/property';
import upload from '../meddileware/cloudnary';
import { authentication } from '../meddileware/user';
import { PropertyService } from './../service/property';
import { Router } from "express";

const router =Router();

const propertyService=new PropertyService();
const propertyController=new PropertyController(propertyService);

router.get("/property",(req,res)=>propertyController.allProperty(req,res))
router.get("/property/:propertyId",(req,res)=>propertyController.specificProperty(req,res))
router.post("/property",authentication,upload.array("images",5),(req,res)=>propertyController.addProperty(req,res))










export default router