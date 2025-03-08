export const APP_NAME = "Bhanot Global Resources";
export const APP_DESCRIPTION = "Distributor of food and beverages";
export const APP_URL = "https://bhanotglobal.com";
export const SERVER_URL = "https://bhanotglobal.com";
export const APP_LOGO = "/logo.png";
export const APP_LOGO_ALT = "Bhanot Global Resources logo";
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const shippingAddressDefaultValues = {
  fullName: "",
  lng: 0,
  lat: 0,
  country: "",
  city: "",
  streetAddress: "",
  postalCode: "",
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["PayPal",'Paystack', "Stripe", "CashOnDelivery"];
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD ?? "PayPal";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) ?? 2;

export const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: "0",
  stock: 0,
  rating: "0",
  numReviews: "0",
  isFeatured: false,
  banner: null,
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["user", "admin"];

  export const SENDER_EMAIL =process.env.SENDER_EMAIL??"onboarding@resend.dev"