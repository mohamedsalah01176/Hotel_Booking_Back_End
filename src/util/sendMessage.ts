import  twilio  from "twilio"


export async function sendMessage(code:number,userPhone:string){
  const client=twilio(process.env.TWILIO_ACCOUNT_SID , process.env.TWILIO_AUTH_TOKEN  );
  try{
    const message=await client.messages.create({
      body:`Your OTP code is: ${code}`,
      from:process.env.TWILIO_PHONE_NUMBER,
      to:userPhone
    })
  }catch(errors){
    return{
      status:"error",
      errors
    }
  }
}