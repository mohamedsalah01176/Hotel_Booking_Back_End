import { Router } from "express";
import ReservDatesController from "../controler/reservDates";
import { authentication } from "../meddileware/user";
import { ReservDatesService } from "../service/ReservDates";

const router =Router();

const resvervService=new ReservDatesService();
const reservController=new ReservDatesController(resvervService)



router.post("/reserve/:propertyId",authentication,(req,res)=>reservController.revesveDates(req,res))











export default router