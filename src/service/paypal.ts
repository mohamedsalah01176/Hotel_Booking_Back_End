const PAYPAL_BASE_URL =
  process.env.PAYPAL_BASE_URL 




async function getAccessToken(){

    try{
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_SECRET_KEY;
      console.log("clientId",clientId)
      console.log("clientSecret",clientSecret)
        if (!clientId || !clientSecret) {
          throw new Error("PayPal credentials are missing");
        }
      
        const auth = Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64");
console.log("auth",auth)
        
      
        const response = await fetch(
          `${PAYPAL_BASE_URL}/v1/oauth2/token`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials",
          }
        );
      console.log("response",response)
        const data = await response.json();
      
        if (!response.ok || !data.access_token) {
          throw new Error("Failed to authenticate with PayPal");
        }
      
        return data.access_token;
    }catch(errors){
        console.log(errors)
    }
}

export async function createPayPalOrder(amount: number) {

    try{

        const accessToken = await getAccessToken();
      
        const response = await fetch(
          `${PAYPAL_BASE_URL}/v2/checkout/orders`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: amount.toFixed(2),
                  },
                },
              ],
              application_context: {
                    return_url: "http://localhost:5173/payment/success",
                    cancel_url: "http://localhost:5173/payment/cancel",
                    payment_method_preference: "UNRESTRICTED",
                },

            }),
          }
        );
      
        const data = await response.json();
      
        if (!response.ok || !data.id) {
          throw new Error("Failed to create PayPal order");
        }
      
        return data;
    }catch (error: any) {
    console.error(
        "PayPal capture error:",
        JSON.stringify(error.response?.data ?? error.message, null, 2)
    );

    throw error;
    }
}

export async function capturePayPalOrder(orderId: string) {

    try{
        const accessToken = await getAccessToken();
      
        const response = await fetch(
        `${PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
        {
            method: "POST",
            headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            },
            body: JSON.stringify({}),
        }
        );


const data = await response.json();

console.log("PayPal capture status:", response.status);

if (!response.ok) {
  console.error(
    "PayPal capture details:",
    JSON.stringify(data, null, 2)
  );

  throw new Error(
    data.message || "Failed to capture PayPal order"
  );
}

return data;
    }catch (error: any) {
    console.error(
        "PayPal capture error:",
        JSON.stringify(error.response?.data ?? error.message, null, 2)
    );

    throw error;
    }

}


export async function getPayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(orderId)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  console.log("PayPal order status:", {
    httpStatus: response.status,
    id: data.id,
    status: data.status,
    intent: data.intent,
    debug_id: data.debug_id,
  });

  if (!response.ok) {
    throw new Error(data.message || "Failed to get PayPal order");
  }

  return data;
}