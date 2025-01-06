import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

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