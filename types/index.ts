import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductSchema,
  insertReviewSchema,
  paymentMethodSchema,
  paymentResultSchema,
  shippingAddressSchema,
  updateProductSchema,
  updateProfileSchema,
} from "@/lib/validators";
import { z } from "zod";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  name: string;
  rating: string;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date | null;
  isPaid: boolean;
  isDelivered: boolean | null;
  deliveredAt: Date | null;
  paidAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
  paymentResult:PaymentResult
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type UserProfile = z.infer<typeof updateProfileSchema>;

export type InsertProductType = z.infer<typeof insertProductSchema>;
export type UpdateProductType = z.infer<typeof updateProductSchema>;

export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date|null;
  user?: { name: string };
};
