import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm overflow-clip">
      <CardHeader className="p-0 items-center">
        <Link href={`product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <p className="text-xs">{product.brand}</p>
        <Link href={`product/${product.slug}`}>
          <h3 className="font-medium text-sm">{product.name}</h3>
        </Link>
        <div className="flex-between gap-4">
          <p>{product.rating} rating</p>
          {product.stock > 0 ? (
            <ProductPrice price={Number(product.price)}  />
          ) : (
            <p className="text-destructive"> Out Of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
