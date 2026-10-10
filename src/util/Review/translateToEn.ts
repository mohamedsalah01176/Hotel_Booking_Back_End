import { IReviewBody } from "../../interface/property";
import { parseServicesFromFlatBody } from "../parseServicesFromFlatBody";
const translate = require("translate-google");

export const translateToEn = async (body: IReviewBody ): Promise<IReviewBody> => {

  const translated: IReviewBody = JSON.parse(JSON.stringify(body));

  try {
    if (body.data) {
      translated.dataAr = body.data;
      translated.dataEn = await translate(body.data, { from: "ar", to: "en" });
    }
    return translated;
  } catch (err) {
    return translated;
  }
};
