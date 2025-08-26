import PropertyController from '../controler/property';
import upload from '../meddileware/cloudnary';
import { authentication, authorizationForHost } from '../meddileware/user';
import { PropertyService } from './../service/property';
import { Router } from "express";

const router =Router();

const propertyService=new PropertyService();
const propertyController=new PropertyController(propertyService);

router.get("/property",(req,res)=>propertyController.allProperty(req,res))
router.delete("/property/:propertyId",authentication,(req,res)=>propertyController.deleteProperty(req,res))
router.get("/activeProperty",(req,res)=>propertyController.allActiveProperty(req,res))
router.get("/property/:propertyId",(req,res)=>propertyController.specificProperty(req,res))
router.post("/property",authentication,upload.array("images",30),(req,res)=>propertyController.addProperty(req,res))
router.patch("/property/:propertyId",authentication,upload.array("images",30),(req,res)=>propertyController.updateProperty(req,res))
router.get("/propertyForAdmin",authentication,(req,res)=>propertyController.getPropertyForAdmin(req,res))
router.get("/propertyDeActive/:propertyId",authentication,(req,res)=>propertyController.DeActiveProperty(req,res))
router.get("/propertyActive/:propertyId",authentication,(req,res)=>propertyController.ActiveProperty(req,res))
router.get("/confirmProperty/:propertyId",authentication,(req,res)=>propertyController.confirmProperty(req,res))










export default router