export interface IQuestionBody{
  question:string,
  answer:string,
}
export interface IQuestionBodyUpdate{
  question?:string,
  answer?:string,
}
export interface IQuestion{
  question:string,
  questionEn:string,
  questionAr:string,
  answer:string,
  answerEn:string,
  answerAr:string,
}


export interface ISendQuestion{
  name:string,
  email:string,
  phone:string,
  message:string
}