import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constant";

export const currency = z
  .string()
  .refine((val) =>
    /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(val)))
  );

export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(255),
  slug: z.string().min(3, "Slug must be at least 3 characters").max(255),
  category: z
    .string()
    .min(3, "Category must be at least 3 characters")
    .max(255),
  brand: z.string().min(3, "Brand must be at least 3 characters").max(255),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(255),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  price: currency,
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
});

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, 'Id is required'),
});

export const signinFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters') ,
});

export const signUpFormSchema = z.object({
  name: z.string().min(3,'Name must be at least three characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters') ,
  confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters') ,
}).refine((data)=>data.confirmPassword ===data.password,{
    message:"Password Don't Match",
    path:['confirmPassword']
});

export const cartItemSchema = z.object({
    productId:z.string().min(1,'Product id is required'),
    name:z.string().min(3,'Name is required'),
    slug:z.string().min(1,'Slug is required'),
    qty:z.number().int().nonnegative('Qty must be positive'),
    price:currency,
    image:z.string().min(1,'Image is required')
})

export const insertCartSchema = z.object({
    items:z.array(cartItemSchema),
    itemsPrice:currency,
    totalPrice:currency,
    shippingPrice:currency,
    taxPrice:currency,
    sessionCartId:z.string().min(1,'Session cart id is required'),
    userId:z.string().optional().nullable()
})

export const shippingAddressSchema = z.object({
  fullName:z.string().min(3,"Character must be greater than 3"),
  streetAddress:z.string().min(3,"Street Address must be greater than 3"),
  city:z.string().min(3,"City must be greater than 3"),
  country:z.string().min(3,"Country must be greater than 3"),
  postalCode:z.string().min(3,"Postal Code must be greater than 3"),
  lat:z.number().optional(),
  lng:z.number().optional(),
})

export const paymentMethodSchema = z.object({
  type:z.string().min(1,'Payment Method Is Required')
}).refine((data)=>PAYMENT_METHODS.includes(data.type),{
  path:['type'],
  message:"Invalid Payment Method"
})

// Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: 'Invalid payment method',
  }),
  shippingAddress: shippingAddressSchema,
});

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

// Schema for the PayPal paymentResult
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// Schema forupdating the user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3,'Name must be at least 3 characters'),
  email: z.string().min(3,'Email must be at least 3 characters'),
});

export const updateUserSchema = updateProfileSchema.extend({
  id:z.string().min(1,'ID is required'),
  role:z.string().min(1,'Role is required'),
})

export const insertReviewSchema = z.object({
  title:z.string().min(3,'Title must be at least 3 characters'),
  description:z.string().min(3,'Description must be at least 3 characters'),
  productId:z.string().min(1,'ProductId must be at least 3 characters'),
  userId:z.string().min(1,'UserId must be at least 3 characters'),
  rating:z.coerce.number().int().min(1,'Rating must be at least 1').max(5,'Rating must be at most 5'),
})