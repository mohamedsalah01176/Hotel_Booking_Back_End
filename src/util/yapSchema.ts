import * as yup from "yup"



export const regiterBodySchema=yup.object({
  name:yup.string().min(3,'Password must be at least 3 characters').required('Name is required'),
  phone: yup.string().required('Phone is required'),
  email: yup.string().email("Email Not Valid").required('Email is required'),
  password:yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/,'Password must contain at least one letter and one number').required('Password is required'),
  role: yup.string().oneOf(['user', 'host', 'manager']),
  birthDate: yup.date().optional()
})


export const loginBodySchema=yup.object({
  email:yup.string().email("Email Not Valid").required('Email is required'),
  password:yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/,'Password must contain at least one letter and one number').required('Password is required'),
})
export const forgetPasswordBodySchema=yup.object({
  password:yup.string().matches(/^(?=.*[a-zA-Z])(?=.*\d)/,'Password must contain at least one letter and one number').required('Password is required'),
})