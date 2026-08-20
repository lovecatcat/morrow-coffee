import type { Metadata } from "next";
import CartList, { CartView } from "@/components/CartList";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getCart } from "@/lib/shopify";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Your Cart — Morrow Coffee",
  description: "Review your Morrow Coffee selection and continue to checkout.",
};

 
export default async function CartPage() {
const cookieStore = await cookies();
  const cartId = cookieStore.get("shopifyCartId")?.value;
  let data: CartView = null;
  try {
    if (cartId) {
      const cart = await getCart(cartId);
      console.log(cart);
      data = cart
    }
  } catch (error) {
    data = null;
     console.error("Failed to load cart:", error);
  }
  return (
    <main>
      <Header />
      <CartList cart={data} />
      <Footer />
    </main>
  );
}
