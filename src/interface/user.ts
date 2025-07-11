export interface IUserBody{
  name:string,
  phone:string,
  email:string,
  role:'user' | 'host' | "manager",
  birthDate:Date
}
export interface ILoginUser{

  email:string,
  password:string
}