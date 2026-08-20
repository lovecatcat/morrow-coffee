import Link from "next/link";
import { getCart } from "@/lib/shopify";
import { cookies } from "next/headers";

export default async function Header() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("shopifyCartId")?.value;
  let cartQuantity = 0;
  try {
    if (cartId) {
      const cart = await getCart(cartId);
      cartQuantity = cart?.totalQuantity || 0;
      console.log(cartQuantity);
    }
  } catch {
    cartQuantity = 0;
  }
  return (
    <header className="site-header page-shell">
      <Link className="brand" href="/" aria-label="Morrow Coffee home">
        MORROW<span>.</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/products">Shop</Link>
        <Link href="/#story">Our story</Link>
        <Link href="/#assistant">Ask AI</Link>
      </nav>
      <Link className="cart-button" href="/cart" aria-label="Open cart">
        Cart <span>{cartQuantity}</span>
      </Link>
    </header>
  );
}
