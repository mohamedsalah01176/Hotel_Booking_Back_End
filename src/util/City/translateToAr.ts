import { IReviewBody } from "../../interface/property";
const translate = require("translate-google");

export const translateToAr = async (body: {name:string} ): Promise<{nameEn:string,nameAr:string}> => {

  const translated: {nameEn:string,nameAr:string} = JSON.parse(JSON.stringify(body));

  try {
    if (body.name) {
      translated.nameEn = body.name;
      translated.nameAr = await translate(body.name.trim(), { from: "en", to: "ar" });
    }
    return translated;
  } catch (err) {
    return translated;
  }
};
