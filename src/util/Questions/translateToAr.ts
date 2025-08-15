import { IQuestion, IQuestionBody } from "../../interface/question";
const translate = require("translate-google");

export const translateToAr = async (body: IQuestionBody ): Promise<IQuestion> => {

  const translated: IQuestion = JSON.parse(JSON.stringify(body));

  try {
    if (body.question) {
      translated.questionEn = body.question;
      translated.questionAr = await translate(body.question.trim(), { from: "en", to: "ar" });
    }
    if (body.answer) {
      translated.answerEn = body.answer;
      translated.answerAr = await translate(body.answer.trim(), { from: "en", to: "ar" });
    }
    console.log(translated)
    return translated;
  } catch (err) {
    console.error("❌ Translation Error:", err);
    return translated;
  }
};
