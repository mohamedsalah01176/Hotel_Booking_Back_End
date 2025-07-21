export interface IUserBody{
  name:string,
  phone:string,
  email:string,
  password:string,
  role:'user' | 'host' | "manager",
  birthDate:Date,
  _id:string
}
export interface ILoginUser{
  emailOrPhone:string, 
  password:string
}

export interface IUserPayload {
  _id: string;
  role: "manager" | "host" | "user";
  email: string;
  image?:string,
    name?: string;
}