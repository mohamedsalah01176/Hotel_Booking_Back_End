import { Request,Response, Router } from "express";
import UserService from "../service/user";
import UserControler from "../controler/user";

const router=Router();

const userService= new UserService();
const userControler= new UserControler(userService)


router.get("/user",userControler.testUser)











export default router;