import  twilio  from "twilio"


export async function sendMessageSMS(code:number,userPhone:string){
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

export async function sendMessageWhatsUp(code: number, userPhone: string) {
  const client=twilio(process.env.TWILIO_ACCOUNT_SID , process.env.TWILIO_AUTH_TOKEN  );
  console.log("➡️ Starting WhatsApp send…");

  try {
    const message = await client.messages.create({
      body: `Your OTP code is: ${code}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to:   `whatsapp:${userPhone}`
    });

    console.log("✅ Sent! SID:", message.sid); // سيظهر هذا عند النجاح
    return { status: "success", sid: message.sid };

  } catch (error: any) {
    console.error("❌ Twilio error:", error?.message || error);
    return { status: "error", error };
  }
}