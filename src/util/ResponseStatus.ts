import { Request, Response } from "express";

export function ReponseStatues(responseServer:any,req:Request,res:Response){
  if(responseServer.status === "success"){
      res.status(200).json(responseServer);
    }else if(responseServer.status === "fail"){
      res.status(404).json(responseServer);
    }else{
      res.status(500).json(responseServer);
    }
}