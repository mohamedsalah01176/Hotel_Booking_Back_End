import { Router } from "express";
import ReservDatesService from "../service/ReservDates";
import ReservDatesController from "../controler/reservDates";
import { authentication } from "../meddileware/user";

const router =Router();

const resvervService=new ReservDatesService();
const reservController=new ReservDatesController(resvervService)



router.post("/reserve/:propertyId",authentication,(req,res)=>reservController.revesveDates(req,res))











export default router