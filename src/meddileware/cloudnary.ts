import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../util/cloudnary"
import multer from "multer"

const storage=new CloudinaryStorage({
  cloudinary,
  params: () => {
    return {
      folder: "property-images",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    }
  }
})

const upload=multer({storage})

export default upload;
