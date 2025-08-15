import { IQuestion, IQuestionBody } from "../../interface/question";
const translate = require("translate-google");

export const translateToEn = async (body: IQuestionBody ): Promise<IQuestion> => {

  const translated: IQuestion = JSON.parse(JSON.stringify(body));

  try {
    if (body.question) {
      translated.questionAr = body.question;
      translated.questionEn = await translate(body.question, { from: "ar", to: "en" });
    }
    if (body.answer) {
      translated.answerAr = body.answer;
      translated.answerEn = await translate(body.answer, { from: "ar", to: "en" });
    }
    console.log(translated)
    return translated;
  } catch (err) {
    console.error("❌ Translation Error:", err);
    return translated;
  }
};
