import { Request, Response } from "express";
import CommonQuestionsServices from "../service/commonQuestions";
import { ReponseStatues } from "../util/ResponseStatus";

export default class CommonQuestionsController{
  constructor(private commonQuestionsServices:CommonQuestionsServices){}

  async getAllQuestions(req:Request,res:Response){
    const lang =req.query.lang as string | "en";
    let responseServer= await this.commonQuestionsServices.handleAllQuestions();
    ReponseStatues(responseServer,res);
  } 
  async addQuestions(req:Request,res:Response){
    const lang =req.query.lang as string | "en";
    const body=req.body;
    let responseServer= await this.commonQuestionsServices.handleAddQuestions(body,lang);
    ReponseStatues(responseServer,res);
  } 
  async deleteQuestions(req:Request,res:Response){
    const questionId=req.params.questionId;
    let responseServer= await this.commonQuestionsServices.handleDeleteQuestions(questionId);
    ReponseStatues(responseServer,res);
  } 
  async updateQuestions(req:Request,res:Response){
    const questionId=req.params.questionId;
    const lang =req.query.lang as string | "en";
    const body=req.body;
    let responseServer= await this.commonQuestionsServices.handleUpdateQuestions(body,questionId,lang);
    ReponseStatues(responseServer,res);
  } 
  async sendQuestionsForEmail(req:Request,res:Response){
    const body=req.body;
    let responseServer= await this.commonQuestionsServices.handleSendQuestionsForEmail(body);
    ReponseStatues(responseServer,res);
  } 
}