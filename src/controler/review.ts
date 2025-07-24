import { Request, Response } from "express";
import ReviewServices from "../service/review";
import { ReponseStatues } from "../util/ResponseStatus";
import { IUserBody } from "../interface/user";

export default class ReviewController{
  constructor(private reviewServices:ReviewServices){}

  async addReview(req:Request,res:Response){

    const body=req.body;
    const lang=req.query.lang as string;
    const propertyId=req.params.propertyId
    const user=req.user as IUserBody;
    console.log(user,"dddddddddddddddd");
    console.log(lang,"dddddddddddddddd");

    let responseServer=await this.reviewServices.handleAddReview(body,user,propertyId,lang);
    ReponseStatues(responseServer,res)
  }
}