import { Types } from "mongoose";

export interface IReview {
  _id: Types.ObjectId;
  user: {
    name: string;
    image: string;
    role: string;
    email: string;
  };
  data: string;
  dataEn: string;
  dataAr: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IReviewBody {
  data: string;
  dataAr?: string;
  dataEn?: string;
  rating: number;
}

export interface IAdmin {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILocation {
  city: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface IProperty {
  _id?: Types.ObjectId;
  title: string;
  titleEn?: string;
  titleAr?: string;
  description: string;
  descriptionEn?: string;
  descriptionAr?: string;
  category: "home" | "partment";
  rate: number;
  reviews: IReview[];
  admin: IAdmin;
  images: string[];
  nightPrice: number;
  guestNumber: number;
  bathroomNumber: number;
  badroomNumber: number;
  bedNumber: number;
  isActive: boolean;
  services: {
    service: string;
    serviceEn?: string;
    serviceAr?: string;
  }[];
  ordersNumbers?: number;
  location: {
    city: string;
    cityEn?: string;
    cityAr?: string;
    address: string;
    addressEn?: string;
    addressAr?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  isDangerousPlace:boolean
  isConfirmed:boolean
}