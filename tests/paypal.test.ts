import { generateAccessToken, paypal } from "../lib/paypal";

// test to generate access token from paypal 
test("generate token from paypal", async () => {
  const token = await generateAccessToken();
  expect(token.length).toBeGreaterThan(0);
  console.log(token)
  expect(typeof token).toBe("string");
});

// test to create a paypal order
test('create a paypal order',async ()=>{
    // const token = await generateAccessToken();
    const price = 10.0
    const orderResponse = await paypal.createOrder(price);
    console.log(orderResponse);

    expect(orderResponse).toHaveProperty('id')
    expect(orderResponse).toHaveProperty('status')
    expect(orderResponse.status).toBe('CREATED')
})

// test to capture a paypal payment
test('simulate capturing a payment from an order',()=>{
   const orderId = '100'
    const mockerCapturedPayment  = jest.spyOn(paypal,'capturePayment').mockResolvedValue({
        status:"COMPLETED"
    }) 

    const capturedResponse  =  paypal.capturePayment(orderId);
    expect(capturedResponse).toHaveProperty('status','COMPLETED');

    mockerCapturedPayment.mockRestore()

})