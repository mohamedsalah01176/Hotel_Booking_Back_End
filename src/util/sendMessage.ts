// import twilio from "twilio";

import axios from "axios";


export async function sendMessageSMS(code: number, userPhone: string) {
  try {
    const from = process.env.VONAGE_API_PHONE; // your approved sender/virtual number
    const to = "4368864870135"; // E.164 format like "+4368864870135"
    const text = `Your OTP code is: ${code}`;
    const payload = new URLSearchParams({
      api_key: process.env.VONAGE_API_KEY!,
      api_secret: process.env.VONAGE_API_SECRET!,
      to,
      from: 'VonageTest',
      text
    }).toString();

    const url = 'https://rest.nexmo.com/sms/json';
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return { status: 'success' };
  } catch (err) {
    console.error('There was an error sending the messages.');
    console.error(err);
    return { status: 'error', errors: err };
  }
}


// export async function sendMessageSMS(code: number, userPhone: string) {
//   try {
//     const from = "Vonage APIs"
//     const to = "4368864870135"
//     const text = 'A text message sent using the Vonage SMS API'
//     const resp="sssss"
//     async function sendSMS() {
//         await vonage.sms.send({to, from, text})
//             .then((resp: any) => { console.log('Message sent successfully'); console.log(resp); })
//             .catch((err: any) => { console.log('There was an error sending the messages.'); console.error(err); });
//     }

//     sendSMS();


//     // Twilio (اختياري)
//     // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//     // const message = await client.messages.create({
//     //   body: `Your OTP code is: ${code}`,
//     //   from: process.env.TWILIO_PHONE_NUMBER,
//     //   to: userPhone,
//     // });

//     return { status: "success", resp };
//   } catch (errors) {
//     console.error("❌ Error sending SMS:", errors);
//     return { status: "error", errors };
//   }
// }

export async function sendMessageWhatsUp(code: number, userPhone: string) {
  const to = "4368864870135"; // E.164 format like "+4368864870135"
  const text = `Your OTP code is: ${code}`;
  const url = 'https://messages-vonage-compute.api.nexmo.com/v0.1/messages';
  const data = {
    from: { type: "whatsapp", number: process.env.WHATSAPP_NUMBER }, // رقم WhatsApp المسجل
    to: { type: "whatsapp", number: to },
    message: { content: { type: "text", text: text } }
  };

  const headers = {
    'Authorization': `Bearer ${process.env.VONAGE_API_KEY}:${process.env.VONAGE_API_SECRET}`,
    'Content-Type': 'application/json'
  };


  try {
    const response = await axios.post(url, data, { headers });

  } catch (error: any) {
    return { status: "error", error };
  }

}
// export async function sendMessageWhatsUp(code: number, userPhone: string) {
//   const client=twilio(process.env.TWILIO_ACCOUNT_SID , process.env.TWILIO_AUTH_TOKEN  );

//   try {
//     const message = await client.messages.create({
//       body: `Your OTP code is: ${code}`,
//       from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
//       to:   `whatsapp:${userPhone}`
//     });

//     return { status: "success", sid: message.sid };

//   } catch (error: any) {
//     return { status: "error", error };
//   }
// }