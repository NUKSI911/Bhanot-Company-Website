"use server";

import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validators";
import { CartItem } from "@/types";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// calculate cart prices
export const calcPrice = async (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};
export const addItemToCart = async (data: CartItem) => {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session Not Found");
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get Cart
    const cart = await getMyCart();

    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error("Product Not Found");

    if (!cart) {
      // Create New Cart
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...(await calcPrice([item])),
      });
      //   add to database
      await prisma.cart.create({
        data: newCart,
      });
       // Revalidate product path
       revalidatePath(`product/${product.slug}`);
       revalidatePath(`cart`);
      return { success: true, message: `${product.name} added to cart` };
    } else {
      // check if item already exist in cart

      const existItem = cart.items.find((x) => x.productId === item.productId);

      if (existItem) {
        if (product.stock < existItem.qty + 1) {
          throw new Error("Not Enough stock");
        }

        cart.items.find((x) => x.productId === item.productId)!.qty =
          existItem.qty + 1;
      } else {
        if (product.stock < 1) {
          throw new Error("Not Enough stock");
        }

        cart.items.push(item);
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...(await calcPrice(cart.items as CartItem[])),
        },
      });
            // Revalidate product path
            revalidatePath(`product/${product.slug}`);
            revalidatePath(`cart`);
      return {
        success: true,
        message: `${product.name} ${
          existItem ? "updated in" : "added to"
        }  cart`,
      };
    }
  } catch (error) {
    console.log("error", error);
    return { success: false, message: formatError(error) };
  }
};

export async function getMyCart() {
  // check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart Session Not Found");
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    // check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart Session Not Found");
    // const session = await auth();
    // const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Product No Found");

    const cart = await getMyCart();
    if (!cart) throw new Error("Cart not found");

    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) throw new Error("Item not found");

    if (exist.qty === 1) {
      cart.items = cart.items.filter((x) => x.productId !== productId);
    } else {
      cart.items.find((x) => x.productId === productId)!.qty = exist.qty - 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...(await calcPrice(cart.items as CartItem[])),
      },
    });

    revalidatePath(`product/${product.slug}`);

    return {
        success:true,
        message: `${product.name} was removed from cart`
    }
  } catch (error) {
    console.error("error", error);
    return { success: false, message: formatError(error) };
  }
}
