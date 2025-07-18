import * as yup from "yup"



export const regiterBodySchema=yup.object({
  name:yup.string().min(3,'Password must be at least 3 characters').required('Name is required'),
  phone: yup.string().required('Phone is required'),
  email: yup.string().email("Email Not Valid").required('Email is required'),
  password:yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/,'Password must contain at least one letter and one number').required('Password is required'),
  role: yup.string().oneOf(['user', 'admin', 'manager'],"This Not Valid"),
  birthDate: yup.date().optional()
})


export const loginBodySchema=yup.object({
  emailOrPhone:yup.string().test("email-or-phone","Invalid Phone Number Or Email",(value)=>testFunction(value as string)).required('Email is required'),
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