import {  Router } from "express";
import UserService from "../service/user";
import UserControler from "../controler/user";
import { authentication } from "../meddileware/user";
import upload from "../meddileware/cloudnary";

const router=Router();

const userService= new UserService();
const userControler= new UserControler(userService)


router.post("/sendCode",(req,res)=>userControler.sendCode(req,res))
router.post("/verfyCode",(req,res)=>userControler.verfyCode(req,res))
router.post("/register",(req,res)=>userControler.register(req,res))
router.post("/login",(req,res)=>userControler.login(req,res))
router.post("/forgetPassword",(req,res)=>userControler.forgetPassword(req,res))
router.post("/resetPassword",(req,res)=>userControler.resetPassword(req,res))
router.get("/setting",authentication,(req,res)=>userControler.getSpecificUser(req,res))
router.patch("/setting",authentication,upload.single("image"),(req,res)=>userControler.updateUser(req,res))











export default router;