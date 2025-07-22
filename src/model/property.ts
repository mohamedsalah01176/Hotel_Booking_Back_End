import mongoose from "mongoose";
import { IProperty } from "../interface/property";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: { type: String},
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  image:String
});

const propertySchema = new mongoose.Schema({
  title:{
    required:true,
    type:String,
    minlength:3,
    message:"Title is required and it must contain 3 characters"
  },
  titleEn:{
    type:String,
  },
  titleAr:{
    type:String,
  },
  description:{
    required:true,
    type:String,
    minlength:3,
    message:"Description is required and it must contain 3 characters"
  },
  descriptionEn:{
    type:String,
  },
  descriptionAr:{
    type:String,
  },
  category: {
    type: String,
    required: true,
    enum: ["home", "department"]
  },
  rate: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [reviewSchema], 
  reviewsEn: [reviewSchema], 
  reviewsAr: [reviewSchema], 
  admin: adminSchema,     
  images: [String],       
  nightPrice: {
    type: Number,
    required: true,
    min: 0
  },
  guestNumber: {
    type: Number,
    required: true,
    min: 1
  },
  services:{
    type:[String]
  },
  servicesEn:{
    type:[String]
  },
  servicesAr:{
    type:[String]
  },
  ordersNumbers: {
    type: Number,
    default: 0
  },
  location: {
    city: { type: String, required: true },
    cityEn: { type: String },
    cityAr: { type: String },
    address: { type: String, required: true },
    addressEn: { type: String },
    addressAr: { type: String },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  }
});


const PropertyModel= mongoose.model<IProperty>("property",propertySchema);


export default PropertyModel;

