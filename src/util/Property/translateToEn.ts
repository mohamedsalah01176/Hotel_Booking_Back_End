import { IProperty } from "../../interface/property";
import { parseServicesFromFlatBody } from "../parseServicesFromFlatBody";
const translate = require("translate-google");

const provincesMapArToEn: Record<string, string> = {
  "ريف دمشق": "Damascus Countryside",
  "حلب": "Aleppo",
  "اللاذقية": "Latakia",
  "طرطوس": "Tartus",
  "إدلب": "Idlib",
  "حماة": "Hama",
  "حمص": "Homs"
};

export const translateToEn = async (body: IProperty): Promise<IProperty> => {
  parseServicesFromFlatBody(body);
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

    if (body.location?.city) {
      const cityAr = body.location.city;

      // ✅ استخدام الماب أولاً
      if (provincesMapArToEn[cityAr]) {
        translatedBody.location.cityAr = cityAr;
        translatedBody.location.cityEn = provincesMapArToEn[cityAr].toLowerCase();
      } else {
        // fallback على Google Translate
        translatedBody.location.cityAr = cityAr;
        translatedBody.location.cityEn = (await translate(cityAr, { from: "ar", to: "en" }))?.toLowerCase();
      }

      translatedBody.location.addressAr = body.location.address;
      translatedBody.location.addressEn = await translate(body.location.address, { from: "ar", to: "en" });
    }

    if (Array.isArray(body.services) && body.services.length > 0) {
      translatedBody.services = [];

      for (const service of body.services) {
        const translatedService = await translate(service.service, { from: "ar", to: "en" });
        translatedBody.services.push({
          service: service.service,
          serviceAr: service.service,
          serviceEn: translatedService
        });
      }
    }

    if (Array.isArray(body.reviews) && body.reviews.length > 0) {
      translatedBody.reviews = [];

      for (const review of body.reviews) {
        const translatedReview = await translate(review.data, { from: "ar", to: "en" });
        translatedBody.reviews.push({
          ...review,
          data: review.data,
          dataAr: review.data,
          dataEn: translatedReview
        });
      }
    }

    console.log(translatedBody);
    return translatedBody;
  } catch (err) {
    console.error("❌ Translation Error:", err);
    return translatedBody;
  }
};
