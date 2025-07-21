import { Request, Response } from "express";
import UserService from "../service/user";
import { ReponseStatues } from "../util/ResponseStatus";






export default class UserControler{
  constructor(private userService:UserService){
  }
  async sendCode(req:Request,res:Response){
    const body=req.body;
    let responseServer=await this.userService.handleSendCode(body);
    ReponseStatues(responseServer,res)
  }
  async verfyCode(req:Request,res:Response){
    const body=req.body;
    let responseServer=await this.userService.handleVerfyCode(body);
    ReponseStatues(responseServer,res)
  }

  async register(req:Request,res:Response){
    const body=req.body;
    let responseServer=await this.userService.handleRegister(body);
    ReponseStatues(responseServer,res)
  }
  
  async login(req:Request,res:Response){
    const body=req.body;
    let responseServer=await this.userService.handleLogin(body);
    ReponseStatues(responseServer,res)  
  }

  async forgetPassword(req:Request,res:Response){
    const body=req.body;
    let responseServer=await this.userService.handleForgetPassword(body);
    ReponseStatues(responseServer,res)  
  }
  async resetPassword(req:Request,res:Response){
    const body=req.body;
    let responseServer=await this.userService.handleResetPassword(body);
    ReponseStatues(responseServer,res)  
  }
}