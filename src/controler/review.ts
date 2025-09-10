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
    
    let responseServer=await this.reviewServices.handleAddReview(body,user,propertyId,lang);
    ReponseStatues(responseServer,res)
  }
  
  async deleteReview(req:Request,res:Response){
    const reviewId=req.params.reviewId;
    const user=req.user as IUserBody;
    
    let responseServer=await this.reviewServices.handleDeleteReview(user,reviewId);
    ReponseStatues(responseServer,res)
  }
  
  async updateReview(req:Request,res:Response){
    const reviewId=req.params.reviewId;
    const user=req.user as IUserBody;
    const body=req.body;
    const lang=req.query.lang as string;
    let responseServer=await this.reviewServices.handleUpdateReview(user,reviewId,body,lang);
    ReponseStatues(responseServer,res)
  }
}