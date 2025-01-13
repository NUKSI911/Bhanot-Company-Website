import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";
import { Metadata } from "next";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const products =await getLatestProducts();
  
  return (
    <div>
      <ProductList data={products} title="Newest Arrivals" />
    </div>
  );
}
