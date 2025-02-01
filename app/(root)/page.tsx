import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import ViewAllProductButton from "@/components/view-all-products";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/lib/actions/product.actions";
import { Metadata } from "next";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const products = await getLatestProducts();
  const featuredProduct = await getFeaturedProducts();
  return (
    <div>
      <ProductCarousel data={featuredProduct} />
      <ProductList data={products} title="Newest Arrivals" />
      <ViewAllProductButton />
    </div>
  );
}
