const base = process.env.PAYMENT_API_URL || "https//api-m.sanbox.paypal.com";

export const paypal = {
  createOrder: async function createOrder(price: number) {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price,
            },
          },
        ],
      }),
    });
    return  await handleResponse(response);
  },
  capturePayment:async  function(orderId:string){
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/order/${orderId}/capture`;

    const response = await fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':"application/json",
            Authorization:`Bearer ${accessToken}`
        }
    })
    return await handleResponse(response)
  }
};

export async function generateAccessToken() {
  const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
    "base64"
  );

  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return (await handleResponse(response)).access_token;
}

export async function handleResponse(response: Response) {
  if (response.ok) {
    const jsonData = await response.json();
    return jsonData;
  } else {
    const errorMessage = await response.text();
    console.log('error',errorMessage)
    throw new Error(errorMessage);
  }
}
