import * as yup from "yup"



export const regiterBodySchema=yup.object({
  name:yup.string().min(3,'Password must be at least 3 characters').required('Name is required'),
  phone: yup.string().required('Phone is required'),
  email: yup.string().email("Email Not Valid").required('Email is required'),
  password:yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/,'Password must contain at least one letter and one number').required('Password is required'),
  role: yup.string().oneOf(['user', 'host', 'manager'],"This Not Valid"),
  birthDate: yup.date().optional()
})


export const loginBodySchema=yup.object({
  emailOrPhone:yup.string().test("email-or-phone","Invalid Phone Number Or Email",(value)=>testFunction(value as string)).required('Email is required Or Phone'),
  password:yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/,'Password must contain at least one letter and one number').required('Password is required'),
})
export const forgetPasswordBodySchema=yup.object({
  password:yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/,'Password must contain at least one letter and one number').required('Password is required'),
})

const emailRGX =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRGX = /^\+?[1-9]\d{6,14}$/;
export const testFunction=(value:string)=>{
  return phoneRGX.test(value) || emailRGX.test(value)
}


export const propertySchema=yup.object({
  title:yup.string().required("Title is required").min(3,"Title must be at least 3 characters"),
  description:yup.string().required("Description is required").min(3,"Title must be at least 3 characters"),
  category:yup.string().required("Category is required").oneOf(["home","partment"],"Invalid category"),
  guestNumber:yup.number().required("Gest Number is required").min(1,"At least one guest is required"),
  bathroomNumber:yup.number().required("Bathroom Number is required").min(1,"At least one guest is required"),
  badroomNumber:yup.number().required("Badroom Number is required").min(1,"At least one guest is required"),
  bedNumber:yup.number().required("Bed Number is required").min(1,"At least one guest is required"),
  services:yup.array().of(yup.string()).min(1, "At least one service is required"),
  reviews:yup.array().of(yup.string()),
  images:yup.array().min(1, "At least one service is required"),
  location:yup.object({
    city:yup.string().required("City is required"),
    address:yup.string().required("Adress is required"),
    coordinates: yup.object({
      lat: yup.number().required("Latitude is required"),
      lng: yup.number().required("Longitude is required"),
    })
  }).required("Location is required")
})

export const DateSchema=yup.object({
  startDate:yup.date().required("stert date is required"),
  endDate:yup.date().required("End date is required").min(yup.ref("startDate"), "End date must be the same or after the start date"),
})