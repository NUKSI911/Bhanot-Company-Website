import ProductPrice from "@/components/shared/product/product-price";
import { Card, CardContent } from "@/components/ui/card";
import { getProductsBySlug } from "@/lib/actions/product.actions";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Detail",
};


const ProductDetailPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await props.params;

  const product = await getProductsBySlug(slug);
  if (!product) {
    notFound();
  }

  const cart = await getMyCart();

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-5">
        <div className="col-span-2">
          <ProductImages images={product.images} />
        </div>
        <div className="col-span-2 p-5">
          <div className="flex flex-col gap-6">
            <p>
              {product.brand} {product.category}
            </p>
            <h1 className="h3-bold">{product.name}</h1>
            <p>
              {product.rating} of {product.numReviews} Reviews
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <ProductPrice
                price={Number(product.price)}
                className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
              />
            </div>
          </div>
          <div className="mt-10">
            <p className="font-semibold">Description</p>
            <p>{product.description}</p>
          </div>
        </div>
        {/* Action  Column */}
        <div className="w-full">
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex justify-between">
                <p>Price</p>
                <div>
                  <ProductPrice price={Number(product.price)} />
                </div>
              </div>

              <div className="mb-2 flex justify-between">
                <p>Status</p>
                {product.stock > 0 ? (
                  <Badge variant="outline">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Out Of Stock</Badge>
                )}
              </div>

              {product.stock > 0 && (
                <div className="flex-center">
                <AddToCart 
                cart={cart}
                item={{
                  name:product.name,
                  price: product.price,
                  slug: product.slug,
                  productId: product.id,
                  qty: 1,
                  image: product.images[0]
                }} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
