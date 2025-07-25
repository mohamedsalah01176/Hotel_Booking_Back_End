import { Request, Response } from "express";
import { ReponseStatues } from "../util/ResponseStatus";
import { IUserPayload } from "../interface/user";
import  ReservDatesService  from "../service/ReservDates";

export default class ReservDatesController{
  constructor(private reverveDateService:ReservDatesService){}
  async revesveDates(req:Request,res:Response){
    const user=req.user as IUserPayload;
    const body=req.body;
    const propertyId=req.params.propertyId;
    const responseServicer= await this.reverveDateService.handleRevesveDates(user,body,propertyId);
    ReponseStatues(responseServicer,res)
  }
}