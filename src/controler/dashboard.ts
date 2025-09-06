import { Request, Response } from "express";
import { ReponseStatues } from "../util/ResponseStatus";
import DashboardService from "../service/dashboard";

export default class DashboardController{
  constructor(private dashboardService:DashboardService){}

  async analysisData(req:Request,res:Response){
    let responseServer= await this.dashboardService.handleGetAnalysisData()
    ReponseStatues(responseServer,res)
  }
  async getChartData(req:Request,res:Response){
    let responseServer= await this.dashboardService.handleGetChartData()
    ReponseStatues(responseServer,res)
  }
}