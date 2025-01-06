import { Button } from "@/components/ui/button";
import { toast, useToast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { ToastAction } from "@/components/ui/toast";
import { Plus } from "lucide-react";
import { CartItem } from "@/types";

const AddToCart = async ({ item }: { item: CartItem }) => {
  const router = useRouter();
  const toaster = useToast();

  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast({
        variant: "default",
        description: res.message,
      });
      return;
    }
    
    toast({
      description: `${item.name} added to cart`,
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
    return;
  };

  return <Button className="w-full" onClick={handleAddToCart}>
    Add To Cart
  </Button>;
};

export default AddToCart;
 