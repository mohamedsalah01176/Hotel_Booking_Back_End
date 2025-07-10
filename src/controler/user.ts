import { Request, Response } from "express";
import UserService from "../service/user";

export default class UserControler{
  constructor(private userService:UserService){
  }
  testUser(req:Request,res:Response){
    res.send("test")
  }
}