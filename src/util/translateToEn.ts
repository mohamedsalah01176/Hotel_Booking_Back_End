import { IProperty } from "../interface/property";
const translate = require("translate-google");

export const translateToEn = async (body: IProperty): Promise<IProperty> => {
  let translatedBody: IProperty = JSON.parse(JSON.stringify(body));

  try {
    if (body.title) {
      translatedBody.titleAr = body.title;
      translatedBody.titleEn = await translate(body.title, { from: "ar", to: "en" });
    }

    if (body.description) {
      translatedBody.descriptionAr = body.description;
      translatedBody.descriptionEn = await translate(body.description, { from: "ar", to: "en" });
    }

    if (body.location) {
      translatedBody.location.cityAr = body.location.city;
      translatedBody.location.cityEn = await translate(body.location.city, { from: "ar", to: "en" }).toLowerCase();

      translatedBody.location.addressAr = body.location.address;
      translatedBody.location.addressEn = await translate(body.location.address, { from: "ar", to: "en" });
    }

    if (Array.isArray(body.services) && body.services.length > 0) {
      translatedBody.servicesAr = [];
      translatedBody.servicesEn = [];

      for (const service of body.services) {
        translatedBody.servicesAr.push(service);
        const translatedService = await translate(service, { from: "ar", to: "en" });
        translatedBody.servicesEn.push(translatedService);
      }
    }

    if (Array.isArray(body.reviews)) {
      translatedBody.reviewsAr = [];
      translatedBody.reviewsEn = [];

      for (const review of body.reviews) {
        translatedBody.reviewsAr.push(review);
        const translatedReview = await translate(review, { from: "ar", to: "en" });
        translatedBody.reviewsEn.push(translatedReview);
      }
    }

    // console.log("✅ Translated Body:", JSON.stringify(translatedBody, null, 2));
    return translatedBody;
  } catch (err) {
    console.error("❌ Translation Error:", err);
    return translatedBody;
  }
};
