import { IProperty } from "../interface/property";
const translate = require("translate-google");

export const translateToAr = async (body: IProperty): Promise<IProperty> => {
  const translated: IProperty = JSON.parse(JSON.stringify(body));

  try {
    if (body.title) {
      translated.titleEn = body.title;
      translated.titleAr = await translate(body.title, { from: "en", to: "ar" });
    }

    if (body.description) {
      translated.descriptionEn = body.description;
      translated.descriptionAr = await translate(body.description, { from: "en", to: "ar" });
    }

    if (body.location) {
      translated.location.cityEn = body.location.city.toLowerCase();
      translated.location.cityAr = await translate(body.location.city, { from: "en", to: "ar" });

      translated.location.addressEn = body.location.address;
      translated.location.addressAr = await translate(body.location.address, { from: "en", to: "ar" });
    }

    if (Array.isArray(body.services)) {
      translated.servicesEn = [];
      translated.servicesAr = [];

      for (const service of body.services) {
        translated.servicesEn.push(service);
        const translatedService = await translate(service, { from: "en", to: "ar" });
        translated.servicesAr.push(translatedService);
      }
    }

    if (Array.isArray(body.reviews)) {
      translated.reviewsEn = [];
      translated.reviewsAr = [];

      for (const review of body.reviews) {
        translated.reviewsEn.push(review);
        const translatedComment = await translate(review.comment || "", { from: "en", to: "ar" });
        translated.reviewsAr.push({ ...review, comment: translatedComment });
      }
    }

    return translated;
  } catch (err) {
    console.error("❌ Translation Error:", err);
    return translated;
  }
};
