"use client";

import { Cart, CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToastAction } from "@radix-ui/react-toast";
import { Button } from "@/components/ui/button";
import { currencyFormat } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const CartTable = ({ cart }: { cart?: Cart }) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleAddToCart = async (item: CartItem) => {
    startTransition(async () => {
      const res = await addItemToCart(item);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res.message,
        });
        return;
      }

      toast({
        description: `${res.message}`,
        action: (
          <ToastAction
            className="bg-primary text-white hover:bg-gray-800"
            altText="Go to Cart"
            onClick={() => {
              router.push("/cart");
            }}
          >
            Go To Cart
          </ToastAction>
        ),
      });
    });

    return;
  };

  const handleRemoveFromCart = async (item: CartItem) => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast({
        variant: res.success ? "default" : "destructive",
        description: res.message,
      });
    });
    return;
  };

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        className="flex items-center"
                        href={`/product/${item.slug}`}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        <span className="px-2">{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <div className="flex items-center gap-4 mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleRemoveFromCart(item)}
                        >
                          {isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Minus className="h-4 w-4" />
                          )}
                        </Button>
                        <span>{item.qty}</span>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleAddToCart(item)}
                        >
                          {isPending ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell className="align-super">
                      <p className="w-full flex justify-center">
                        {currencyFormat(item.price)}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className="p-4 gap-4">
              <p className="pb-3 text-xl">
                SubTotal ({cart.items.reduce((acc, x) => acc + x.qty, 0)}):
                <span className="font-bold">
                  {currencyFormat(cart.itemsPrice)}
                </span>
              </p>
              <Button
                className="w-full"
                disabled={isPending}
                onClick={() => startTransition(async () => router.push("/shipping-address"))}
              >
                Proceed To Checkout
                <ArrowRight className="w-4 h-4"/>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default CartTable;
