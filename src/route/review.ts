import {  Router } from "express";
import ReviewServices from "../service/review";
import ReviewController from "../controler/review";
import { authentication } from "../meddileware/user";

const router=Router();

const reviewServices= new ReviewServices();
const reviewController= new ReviewController(reviewServices)


router.post("/review/:propertyId",authentication,(req,res)=>reviewController.addReview(req,res))








export default router;