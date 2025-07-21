import mongoose from "mongoose";
import { IProperty } from "../interface/property";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, required: true },
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
  description:{
    required:true,
    type:String,
    minlength:3,
    message:"Description is required and it must contain 3 characters"
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
  ordersNumbers: {
    type: Number,
    default: 0
  },
  location: {
    city: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  }
});


const PropertyModelAr= mongoose.model<IProperty>("propertyAr",propertySchema);


export default PropertyModelAr;

