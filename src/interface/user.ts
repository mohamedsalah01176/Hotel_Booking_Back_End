export interface IUserBody{
  name:string,
  phone:string,
  email:string,
  password:string,
  role:'user' | 'admin' | "manager",
  birthDate:Date,
  _id:string
}
export interface ILoginUser{
  emailOrPhone:string,
  password:string
}