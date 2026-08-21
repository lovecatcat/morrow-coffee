// 购物车列表组件
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/until";
import type { Cart, CartLine } from "@/types/types";

export type CartView = Cart | null;

function CartItem({
  item,
  isUpdating,
  onQuantityChange,
}: {
  item: CartLine;
  isUpdating: boolean;
  onQuantityChange: (lineId: string, quantity: number) => void;
}) {
  const merchandise = item.merchandise;

  return (
    <article className="cart-item">
      <Link className="cart-item-image" href={`/products/${merchandise.product.handle}`}>
        <Image
          src={merchandise.image?.url || "/placeholder.svg"}
          alt={merchandise.image?.altText || merchandise.title}
          fill
          sizes="(max-width: 700px) 120px, 160px"
        />
      </Link>

      <div className="cart-item-copy">
        <p className="cart-item-label">Coffee equipment</p>
        <Link href={`/products/${merchandise.product.handle}`}>
          <h2>{merchandise.product.title}</h2>
        </Link>
        {/* {merchandise.variantTitle !== "Default Title" && (
          <p className="cart-variant">{merchandise.variantTitle}</p>
        )} */}
        <p className="cart-unit-price">
          {formatMoney(merchandise.price.amount, merchandise.price.currencyCode)} each
        </p>
      </div>

      <div className="cart-item-actions">
        <div className="cart-quantity" aria-label={`Quantity: ${item.quantity}`}>
          <button
            className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
            type="button"
            aria-label={`Decrease ${merchandise.product.title} quantity`}
            disabled={isUpdating || item.quantity <= 1}
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          >
            −
          </button>
          <span>{item.quantity}</span>
          <button
            className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
            type="button"
            aria-label={`Increase ${merchandise.product.title} quantity`}
            disabled={isUpdating}
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
        <button className="cart-remove" type="button" disabled>
          Remove
        </button>
      </div>

      <strong className="cart-line-total">
        {formatMoney(
          item.cost.totalAmount.amount,
          item.cost.totalAmount.currencyCode,
        )}
      </strong>
    </article>
  );
}

export default function CartList({ cart }: { cart: CartView | null }) {
  const [currentCart, setCurrentCart] = useState(cart);
  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function updateQuantity(lineId: string, quantity: number) {
    setUpdatingLineId(lineId);
    setError(null);

    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: [{ id: lineId, quantity }] }),
      });
      const data = (await response.json()) as {
        cart?: Cart;
        error?: string;
      };

      if (!response.ok || !data.cart) {
        throw new Error(data.error || "Unable to update the cart");
      }

      setCurrentCart(data.cart);
      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update the cart",
      );
    } finally {
      setUpdatingLineId(null);
    }
  }

  if (!currentCart || currentCart.lines.nodes.length === 0) {
    return (
      <section className="empty-cart page-shell">
        <p className="eyebrow">Your cart</p>
        <h1>Nothing here—yet.</h1>
        <p>Choose a few thoughtful tools and start building your coffee ritual.</p>
        <Link className="primary-button" href="/products">
          Explore the collection <span aria-hidden="true">→</span>
        </Link>
      </section>
    );
  }

  return (
    <div className="cart-layout page-shell">
      <section className="cart-main">
        <div className="cart-title-row">
          <div>
            <p className="eyebrow">Your selection</p>
            <h1>Shopping cart</h1>
          </div>
          <p>{currentCart.totalQuantity} {currentCart.totalQuantity === 1 ? "item" : "items"}</p>
        </div>

        {error && <p role="alert">{error}</p>}

        <div className="cart-items">
          {currentCart.lines.nodes.map((item) => (
            <CartItem
              item={item}
              isUpdating={updatingLineId === item.id}
              key={item.id}
              onQuantityChange={updateQuantity}
            />
          ))}
        </div>

        <Link className="continue-shopping" href="/products">
          <span aria-hidden="true">←</span> Continue shopping
        </Link>
      </section>

      <aside className="cart-summary">
        <p className="eyebrow">Order summary</p>
        <h2>Ready when you are.</h2>

        <dl>
          <div>
            <dt>Subtotal</dt>
             <dd>{formatMoney(currentCart.cost.subtotalAmount.amount, currentCart.cost.subtotalAmount.currencyCode)}</dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd>Calculated at checkout</dd>
          </div>
        </dl>

        <div className="cart-total">
          <span>Estimated total</span>
          <strong>{formatMoney(currentCart.cost.totalAmount.amount, currentCart.cost.totalAmount.currencyCode)}</strong>
        </div>

        <a className="checkout-button" href={currentCart.checkoutUrl || "#"}>
          Checkout securely <span aria-hidden="true">↗</span>
        </a>
        <p className="checkout-note">Taxes and delivery are calculated at checkout.</p>

        <div className="summary-promise">
          <span aria-hidden="true">◇</span>
          <p><strong>Simple, secure checkout</strong>Completed safely with Shopify.</p>
        </div>
      </aside>
    </div>
  );
}
