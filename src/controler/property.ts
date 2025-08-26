import jwt  from 'jsonwebtoken';
import { Request, Response } from 'express';
import { PropertyService } from '../service/property';
import { ReponseStatues } from '../util/ResponseStatus';
import { IUserBody, IUserPayload } from '../interface/user';
export default class PropertyController{
  constructor(private propertyService:PropertyService){}

  async allProperty(req:Request,res:Response){
    const lang =req.query.lang as string | "en"
    let responseServer= await this.propertyService.handleAllProperties(lang)
    ReponseStatues(responseServer,res);
  }
  async allActiveProperty(req:Request,res:Response){
    const lang =req.query.lang as string | "en"
    let responseServer= await this.propertyService.handleAllActiveProperties(lang)
    ReponseStatues(responseServer,res);
  }
  async specificProperty(req:Request,res:Response){
    const lang =req.query.lang as string | "en"
    let propertyId:string=req.params.propertyId
    let responseServer= await this.propertyService.handleSpecificProperty(propertyId,lang)
    ReponseStatues(responseServer,res);
  }
  async addProperty(req:Request,res:Response){
    const lang=req.query.lang  as string || "en";
    const files=req.files as Express.Multer.File[];
    const images = files?.map(file=>file.path);
    const adminBody:IUserPayload=req.user as IUserPayload;
    const body=req.body;
    let responseServer= await this.propertyService.handleAddProperties({...body,images},adminBody,lang)
    ReponseStatues(responseServer,res);
  }
  async getPropertyForAdmin(req:Request,res:Response){
    const adminBody:IUserPayload=req.user as IUserPayload;
    let responseServer= await this.propertyService.handleGetPropertyForAdmin(adminBody)
    ReponseStatues(responseServer,res);
  }
  async updateProperty(req:Request,res:Response){
    const lang=req.query.lang  as string || "en";
    const files=req.files as Express.Multer.File[];
    const images = files?.map(file=>file.path);
    const user=req.user as IUserBody;
    const propertyId=req.params.propertyId;
    const body=req.body;
    let responseServer= await this.propertyService.handleUpdateProperty({...body,images},user,propertyId,lang)
    ReponseStatues(responseServer,res);
  }
  async DeActiveProperty(req:Request,res:Response){
    const user=req.user as IUserBody;
    const propertyId=req.params.propertyId;
    let responseServer= await this.propertyService.handleDeActiveProperty(user,propertyId)
    ReponseStatues(responseServer,res);
  }
  async ActiveProperty(req:Request,res:Response){
    const user=req.user as IUserBody;
    const propertyId=req.params.propertyId;
    let responseServer= await this.propertyService.handleActiveProperty(user,propertyId)
    ReponseStatues(responseServer,res);
  }
  async confirmProperty(req:Request,res:Response){
    const propertyId=req.params.propertyId;
    let responseServer= await this.propertyService.handleConfirmProperty(propertyId)
    ReponseStatues(responseServer,res);
  }
  async deleteProperty(req:Request,res:Response){
    const user=req.user as IUserBody;
    const propertyId=req.params.propertyId;
    let responseServer= await this.propertyService.handleDeleteProperty(propertyId)
    ReponseStatues(responseServer,res);
  }
}