import  mongoose  from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
      trim: true,
      minlength: 3,
      message: "Name of city is required and greater than 3 char",
    },
    nameEn: {
      type: String,
      trim: true,
      lowercase: true,
    },
    nameAr: {
      type: String,
      trim: true,
    },
    numberOfHotel: {
      type: Number,
      default: 0,
    },
    isDangerousPlace: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

schema.index(
  { nameEn: 1 },
  { unique: true, partialFilterExpression: { nameEn: { $type: "string" } } }
);

const CityModel = mongoose.model("city", schema);

export default CityModel;