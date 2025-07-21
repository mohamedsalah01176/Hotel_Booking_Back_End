import jwt  from 'jsonwebtoken';
import { Request, Response } from 'express';
import { PropertyService } from '../service/property';
import { ReponseStatues } from '../util/ResponseStatus';
import { IUserBody, IUserPayload } from '../interface/user';
export default class PropertyController{
  constructor(private propertyService:PropertyService){}

  async allProperty(req:Request,res:Response){
    let responseServer= await this.propertyService.handleAllProperties()
    ReponseStatues(responseServer,res);
  }
  async specificProperty(req:Request,res:Response){
    let propertyId:string=req.params.propertyId
    let responseServer= await this.propertyService.handleSpecificProperty(propertyId)
    ReponseStatues(responseServer,res);
  }
  async addProperty(req:Request,res:Response){
    const files=req.files as Express.Multer.File[]
    const images = files?.map(file=>file.path)
    const adminBody:IUserPayload=req.user as IUserPayload
    const body=req.body
    let responseServer= await this.propertyService.handleAddProperties({...body,images},adminBody)
    ReponseStatues(responseServer,res);
  }
}