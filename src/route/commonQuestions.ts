import { Router } from "express";
import CommonQuestionsServices from "../service/commonQuestions";
import CommonQuestionsController from "../controler/commonQuestions";
import { authorizationForManager } from "../meddileware/user";

const router=Router()


const commonQuestionsServices=new CommonQuestionsServices();
const commonQuestionsController=new CommonQuestionsController(commonQuestionsServices)



router.get("/questions",authorizationForManager,(req,res)=>commonQuestionsController.getAllQuestions(req,res))
router.post("/questions",authorizationForManager,(req,res)=>commonQuestionsController.addQuestions(req,res))
router.patch("/questions/:questionId",authorizationForManager,(req,res)=>commonQuestionsController.updateQuestions(req,res))
router.delete("/questions/:questionId",authorizationForManager,(req,res)=>commonQuestionsController.deleteQuestions(req,res))
router.post("/sendQuestion",(req,res)=>commonQuestionsController.sendQuestionsForEmail(req,res))













export default router