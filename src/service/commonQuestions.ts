import { IQuestion, IQuestionBody, IQuestionBodyUpdate, ISendQuestion } from "../interface/question";
import QuestionsModel from "../model/commonQuestions";
import { translateToAr } from "../util/Questions/translateToAr";
import { translateToEn } from "../util/Questions/translateToEn";
import { sendEmail } from "../util/sendEmail";

export default class CommonQuestionsServices{
  constructor(){}

  async handleAllQuestions(){
    try{
      const questions= await QuestionsModel.find({});
      return{
        status:"success",
        questions
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleAddQuestions(body:IQuestionBody,lang:string){
    try{
      const translator = lang === "ar" ? translateToEn : translateToAr;
      const translated = await translator(body as IQuestionBody);
      const foundQuestion= await QuestionsModel.findOne({questionAr:body.question});
      if(foundQuestion){
        return{
          status:"fail",
          message:"هذا السؤال موجود بلفعل"
        }
      }
      const newQuestion = new QuestionsModel(translated);
      await newQuestion.save();
      return{
        status:"success",
        message :"Question Added"
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleDeleteQuestions(questionId:string){
    try{
      const deleteQuestion=await QuestionsModel.deleteOne({_id:questionId});
      if(deleteQuestion.deletedCount){
        return{
          status:"success",
          messageEn :"Question Deleted",
          messageAr:"تم مسح السؤال"
        }
      }else{
        return{
          status:"fail",
          messageEn:"This question aready exist",
          messageAr:"هذا السؤال غير موجود بلفعل"
        }
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleUpdateQuestions(body:IQuestionBodyUpdate,questionId:string,lang:string){
    try{
      const translator = lang === "ar" ? translateToEn : translateToAr;
      const translated = await translator(body as IQuestionBody);
      const updateResult = await QuestionsModel.updateOne(
        { _id: questionId },
        { $set: { ...translated } }
      );
      if (updateResult.modifiedCount <= 0) {
        return {
          status: "fail",
          message: "لم يتم العثور على السؤال"
        };
      }
      return{
        status:"success",
        message :"Question Updated"
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
  async handleSendQuestionsForEmail(body:ISendQuestion){
    try{
      
      await sendEmail(body,"question")
      return{
        status:"success",
        message :"Emial Sended"
      }
    }catch(errors){
      return{
        status:"error",
        errors
      }
    }
  }
}