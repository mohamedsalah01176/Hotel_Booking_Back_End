import { IReviewBody } from "../../interface/property";
const translate = require("translate-google");

export const translateToAr = async (body: IReviewBody ): Promise<IReviewBody> => {

  const translated: IReviewBody = JSON.parse(JSON.stringify(body));

  try {
    if (body.data) {
      translated.dataEn = body.data;
      translated.dataAr = await translate(body.data.trim(), { from: "en", to: "ar" });
    }
    return translated;
  } catch (err) {
    return translated;
  }
};
