import type { Metadata } from "next";
import Products from "@/components/Products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/shopify";
import type { ShopifyProduct } from "@/types/types";

export const metadata: Metadata = {
  title: "Shop Coffee Gear — Morrow Coffee",
  description:
    "Explore coffee grinders, brewers, kettles, scales, and drinkware from Morrow Coffee.",
};

export default async function ProductsPage() {
  let products: ShopifyProduct[] = [];
  let hasProductError = false;

  try {
    products = await getProducts(10);
  } catch (error) {
    hasProductError = true;
    console.error("Unable to load Shopify products:", error);
  }

  return (
    <main>
     <Header />

      <Products
        products={products}
        hasError={hasProductError}
        eyebrow="Shop the collection"
        title="All products"
        showAllLink={false}
      />

     <Footer/>
    </main>
  );
}
