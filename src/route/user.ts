import {  Router } from "express";
import UserService from "../service/user";
import UserControler from "../controler/user";

const router=Router();

const userService= new UserService();
const userControler= new UserControler(userService)


router.post("/sendCode",(req,res)=>userControler.sendCode(req,res))
router.post("/verfyCode",(req,res)=>userControler.verfyCode(req,res))
router.post("/register",(req,res)=>userControler.register(req,res))
router.post("/login",(req,res)=>userControler.login(req,res))
router.post("/forgetPassword",(req,res)=>userControler.forgetPassword(req,res))
router.post("/resetPassword",(req,res)=>userControler.resetPassword(req,res))











export default router;