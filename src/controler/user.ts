import { Request, Response } from "express";
import UserService from "../service/user";
import { ReponseStatues } from "../util/ResponseStatus";
import { IUserPayload } from "../interface/user";






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
  async getSpecificUser(req:Request,res:Response){
    const user=req.user as IUserPayload;
    let responseServer=await this.userService.handleGetSpecificUser(user?._id as string);
    ReponseStatues(responseServer,res)  
  }
  async updateUser(req:Request,res:Response){
    const user=req.user as IUserPayload;
    const body =req.body;
    const pathImage = req.file?.path; 
    let responseServer=await this.userService.handleUpdateUser(user?._id as string,{...body,image:pathImage});
    ReponseStatues(responseServer,res)  
  }
  async getAllUsers(req:Request,res:Response){
    let responseServer=await this.userService.handleGetAllUsers();
    ReponseStatues(responseServer,res)  
  }
  async deleteUser(req:Request,res:Response){
    const userId=req.params.userId;
    let responseServer=await this.userService.handleDeleteUser(userId);
    ReponseStatues(responseServer,res)  
  }
}