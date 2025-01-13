"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.actions";
import { getUserById } from "./user.actions";
import { prisma } from "@/db/prisma";
import { insertOrderSchema } from "../validators";
import { CartItem, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";
import { PAGE_SIZE } from "../constant";

export const createOrder = async () => {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const cart = await getMyCart();
    const userId = session.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }
    if (!user?.address) {
      return {
        success: false,
        message: "No Shipping Address",
        redirectTo: "/shipping-address",
      };
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/payment-method",
      };
    }

    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });
    // Create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      const insertedOrder = await tx.order.create({ data: order });
      // Create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      // Clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
};

// Get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return convertToPlainObject(data);
}

export async function createPayPalOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order) {
      const payPalOrder = await paypal.createOrder(Number(order.totalPrice));

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          paymentResult: {
            id: payPalOrder.id,
            email_address: "",
            status: "",
            pricePaid: 0,
          },
        },
      });
      return {
        success: true,
        message: "Item Order Created Successfully",
        data: payPalOrder.id,
      };
    } else {
      throw new Error("Order Not Found");
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// approve paypal order and update order to paid
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order) {
      const capturedPayment = await paypal.capturePayment(data.orderID);

      if (
        !capturedPayment ||
        capturedPayment.id !== (order?.paymentResult as PaymentResult).id ||
        capturedPayment.status !== "COMPLETED"
      ) {
        throw new Error("error in paypal payment");
      }

      await updateOrderToPaid({orderId,paymentResult:{
        id:capturedPayment.id,
        status:capturedPayment.status,
        email_address:capturedPayment.payer.email_address,
        pricePaid:capturedPayment.purchase_units[0]?.payments?.captures[0]?.amount.value
    }})

    revalidatePath(`order/${orderId}`);

    } else {
      throw new Error("Order Not Found");
    }

    return {
      success: true,
      message: "Your order has been paid",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitems: true,
    },
  });

  if(!order) throw new Error('Order not found');
  if(order.isPaid) throw new Error('Order is already paid');

    // Transaction To update order and account for product stock;
    await prisma.$transaction(async (tx)=>{
        for (const items of order.orderitems){
            await tx.product.update({
                where:{
                    id:items.productId
                },
                data:{
                    stock:{
                        increment: -items.qty
                    }
                }
            })
        }

        await tx.order.update({
            where:{
                id:orderId
            },
            data:{
                isPaid:true,
                paidAt:new Date(),
                paymentResult
            }
        })

    })

    const updatedOrder = prisma.order.findFirst({
        where:{
            id:orderId
        },
        include:{
            orderitems:true,
            user:{select:{
                name:true,
                email:true
            }}
        }
    })
    if(!updatedOrder) throw new Error('Order Not Found')
}

// Get User Orders
export const getMyOrders=async ({
  limit=PAGE_SIZE,
  page
}:{
  limit?:number;
  page:number
})=>{
const session = await auth();
if(!session) throw new Error('User is not authorized');
console.log(page, limit)
const data = await prisma.order.findMany({
  where:{userId:session.user?.id},
  orderBy:{ createdAt:'desc'},
  take:limit,
  skip:(page-1) * limit
})

const count = await prisma.order.count({
  where:{userId:session.user?.id}
})

return {
  data,
  totalPages:Math.ceil(count/limit)
}

}