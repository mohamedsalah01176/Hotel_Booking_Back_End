import mongoose from "mongoose";
import { IQuestion } from "../interface/question";


const schema=new mongoose.Schema({
  question:{
    type:String,
    required:true,
  },
  questionEn:{
    type:String,
  },
  questionAr:{
    type:String,
  },
  answer:{
    type:String,
    required:true,
  },
  answerEn:{
    type:String,
  },
  answerAr:{
    type:String,
  }
});


const QuestionsModel=  mongoose.model<IQuestion>("commonQuestion",schema);


export default QuestionsModel;