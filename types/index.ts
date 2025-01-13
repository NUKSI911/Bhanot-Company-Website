import { cartItemSchema, insertCartSchema, insertOrderItemSchema, insertOrderSchema, insertProductSchema, paymentMethodSchema, paymentResultSchema, shippingAddressSchema, updateProfileSchema } from '@/lib/validators';
import { z } from 'zod'

export type Product = z.infer<typeof insertProductSchema> & {
    id:string;
    name:string;
    rating:string;
}

export type Cart = z.infer<typeof insertCartSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type ShippingAddress = z.infer<typeof shippingAddressSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type OrderItem = z.infer<typeof insertOrderItemSchema>
export type Order = z.infer<typeof insertOrderSchema> & {
    id:string;
    createdAt:Date|null;
    isPaid:boolean;
    isDelivered:boolean |null;
    deliveredAt:Date | null;
    paidAt:Date | null;
    orderitems:OrderItem[];
    user:{name:string,email:string}
}

export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type UserProfile = z.infer<typeof updateProfileSchema>