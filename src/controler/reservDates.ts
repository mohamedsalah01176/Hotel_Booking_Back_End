import { Request, Response } from "express";
import { ReponseStatues } from "../util/ResponseStatus";
import { IUserPayload } from "../interface/user";
import ReservDatesService from "../service/reservDates";

export default class ReservDatesController{
  constructor(private reverveDateService:ReservDatesService){}
  async revesveDates(req:Request,res:Response){
    const user=req.user as IUserPayload;
    const body=req.body;
    const propertyId=req.params.propertyId;
    const responseServicer= await this.reverveDateService.handleRevesveDates(user,body,propertyId);
    ReponseStatues(responseServicer,res)
  }
  
  async getReserveDateForProperty(req:Request,res:Response){
    const propertyId=req.params.propertyId;
    const responseServicer= await this.reverveDateService.handleGetReserveDateForProperty(propertyId);
    ReponseStatues(responseServicer,res)
  }
  async getReserveDateForUser(req:Request,res:Response){
    const userId=req?.user as IUserPayload;
    const responseServicer= await this.reverveDateService.handleGetReserveDateForUser(userId._id);
    ReponseStatues(responseServicer,res)
  }
  async deleteRevervedDate(req:Request,res:Response){
    const dateId=req.params.dateId
    const responseServicer= await this.reverveDateService.handleDeleteRevervedDate(dateId);
    ReponseStatues(responseServicer,res)
  }
}