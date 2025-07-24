import {  Router } from "express";
import UserService from "../service/user";
import UserControler from "../controler/user";
import ReviewServices from "../service/review";
import ReviewController from "../controler/review";

const router=Router();

const reviewServices= new ReviewServices();
const reviewController= new ReviewController(reviewServices)


router.post("/review/:propertyId",(req,res)=>reviewController.addReview(req,res))








export default router;