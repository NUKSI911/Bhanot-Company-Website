

export const APP_NAME = "Bhanot Global Resources";
export const APP_DESCRIPTION = "Distributor of food and beverages";
export const APP_URL = "https://bhanotglobal.com";
export const APP_LOGO = "/logo.png";
export const APP_LOGO_ALT = "Bhanot Global Resources logo";
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const shippingAddressDefaultValues = {
  fullName:'',
  lng:0,
  lat:0,
  country:'',
  city:'',
  streetAddress: "string",
  postalCode: "string",
}

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(', '):["PayPal","Stripe","CashOnDelivery"]
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD ??'PayPal';

export const PAGE_SIZE=Number(process.env.PAGE_SIZE)??2