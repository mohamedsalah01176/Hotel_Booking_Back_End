import { Types } from "mongoose";

export interface IReview {
  userId: Types.ObjectId;
  comment: string;
  rating: number;
  createdAt?: Date;
}

export interface IAdmin {
  name: string;
  email: string;
  phone: string;
  image?: string;
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
  title: string;
  titleEn?: string;
  titleAr?: string;
  description: string;
  descriptionEn?: string;
  descriptionAr?: string;
  category: string;
  guestNumber: number;
  location: {
    city: string;
    cityEn: string;
    cityAr: string;
    address: string;
    addressEn: string;
    addressAr: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  reviews: {
    userId: string;
    comment: string;
    rating: number;
  }[];
  reviewsEn: {
    userId: string;
    comment: string;
    rating: number;
  }[];
  reviewsAr: {
    userId: string;
    comment: string;
    rating: number;
  }[];
  services: string[];
  servicesEn: string[];
  servicesAr: string[];
  admin: {
    name: string;
    email: string;
    phone: string;
    image?: string;
  };
  nightPrice: number;
}
