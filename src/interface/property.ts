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
  description: string;
  category: string;
  guestNumber: number;
  location: {
    city: string;
    address: string;
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
  services: string[];
  admin: {
    name: string;
    email: string;
    phone: string;
    image?: string;
  };
  nightPrice: number;
}
