
const PAYPAL_BASE_URL =
  process.env.PAYPAL_BASE_URL ||
  "https://api-m.sandbox.paypal.com";

type PayPalResponse = Record<string, any>;

async function readPayPalResponse(
  response: Response
): Promise<PayPalResponse | null> {
  const text = await response.text();

  let data: PayPalResponse | null = null;

  if (text.trim()) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `Invalid PayPal JSON response. HTTP ${response.status}, ` +
        `Debug ID: ${response.headers.get("paypal-debug-id") ?? "N/A"}`
      );
    }
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
      data?.error_description ||
      `PayPal request failed with HTTP ${response.status}`
    );

    console.error("PayPal API error:", {
      status: response.status,
      name: data?.name,
      message: data?.message || data?.error_description,
      details: data?.details,
      debugId: response.headers.get("paypal-debug-id"),
    });

    throw error;
  }

  return data;
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET_KEY;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are missing");
  }

  const auth = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

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

  const data = await readPayPalResponse(response);

  if (!data?.access_token) {
    throw new Error("PayPal did not return an access token");
  }

  return data.access_token;
}

export async function createPayPalOrder(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid PayPal order amount");
  }

  try {
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

    const data = await readPayPalResponse(response);

    if (!data?.id) {
      throw new Error("PayPal did not return an order ID");
    }

    return data;
  } catch (error) {
    console.error("Create PayPal order failed:", error);
    throw error;
  }
}

export async function capturePayPalOrder(orderId: string) {
  try {
    if (!orderId?.trim()) {
      throw new Error("PayPal order ID is required");
    }

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

    const data = await readPayPalResponse(response);

    if (!data) {
      throw new Error("PayPal returned an empty capture response");
    }

    console.log("PayPal capture result:", {
      status: response.status,
      orderId: data.id,
      orderStatus: data.status,
      debugId: response.headers.get("paypal-debug-id"),
    });

    return data;
  } catch (error) {
    console.error("PayPal capture failed:", error);
    throw error;
  }
}

export async function getPayPalOrder(orderId: string) {
  if (!orderId?.trim()) {
    throw new Error("PayPal order ID is required");
  }

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

  const data = await readPayPalResponse(response);

  if (!data?.id) {
    throw new Error("PayPal order response did not contain an order ID");
  }

  console.log("PayPal order status:", {
    httpStatus: response.status,
    id: data.id,
    status: data.status,
    intent: data.intent,
    debugId: response.headers.get("paypal-debug-id"),
  });

  return data;
}
