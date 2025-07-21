import { IProperty } from "../interface/property";
const translate =require("translate-google")

export const translateToAr = async (body: IProperty): Promise<IProperty> => {
  const translated: IProperty = { ...body };

  if (body.title) {
    const resTitle = await translate(body.title, { from: "en", to: "ar" });
    translated.title = resTitle;
  }

  if (body.description) {
    const resDesc = await translate(body.description, { from: "en", to: "ar" });
    translated.description = resDesc;
  }

  if (Array.isArray(body.services)) {
    translated.services = [];
    for (const service of body.services) {
      if (service) {
        const res = await translate(service, { from: "en", to: "ar" });
        translated.services.push(res);
      } else {
        translated.services.push("");
      }
    }
  }

  if (Array.isArray(body.reviews)) {
    translated.reviews = [];
    for (const review of body.reviews) {
      const res = await translate(review.comment || "", { from: "en", to: "ar" });
      translated.reviews.push({ ...review, comment: res });
    }
  }

  return translated;
};
