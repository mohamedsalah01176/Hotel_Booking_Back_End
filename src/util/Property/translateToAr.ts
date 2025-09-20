import { IProperty } from "../../interface/property";
import { parseServicesFromFlatBody } from "../parseServicesFromFlatBody";
const translate = require("translate-google");

// ✅ mapping ثابت EN → AR
const provincesMapEnToAr: Record<string, string> = {
  "Rif Dimashq": "ريف دمشق",
  "Aleppo": "حلب",
  "Latakia": "اللاذقية",
  "Tartus": "طرطوس",
  "Idlib": "إدلب",
  "Hama": "حماة",
  "Homs": "حمص",
};

export const translateToAr = async (body: IProperty): Promise<IProperty> => {
  parseServicesFromFlatBody(body);

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
      const city = body.location.city;

      // ✅ الأول نشوف هل المدينة في الماب؟
      const mappedCityAr = provincesMapEnToAr[city];

      translated.location.cityEn = city === "Rif Dimashq"?"damascus countryside":city;
      translated.location.cityAr = mappedCityAr
        ? mappedCityAr
        : await translate(city, { from: "en", to: "ar" });

      translated.location.addressEn = body.location.address;
      translated.location.addressAr = await translate(body.location.address, { from: "en", to: "ar" });
    }

    if (Array.isArray(body.services) && body.services.length > 0) {
      translated.services = [];
      for (const service of body.services) {
        const translatedService = await translate(service.service || "", { from: "en", to: "ar" });
        translated.services.push({
          service: service.service,
          serviceEn: service.service,
          serviceAr: translatedService,
        });
      }
    }

    if (Array.isArray(body.reviews) && body.reviews.length > 0) {
      translated.reviews = [];
      for (const review of body.reviews) {
        const translatedComment = await translate(review.data || "", { from: "en", to: "ar" });
        translated.reviews.push({
          ...review,
          data: review.data,
          dataEn: review.data,
          dataAr: translatedComment,
        });
      }
    }

    console.log(body, "before");
    console.log(translated, "after");
    return translated;
  } catch (err) {
    console.error("❌ Translation Error:", err);
    return translated;
  }
};
