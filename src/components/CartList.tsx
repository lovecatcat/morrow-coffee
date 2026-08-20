'use client'
import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/until";
import type { CartLine } from "@/types/types";


export type CartView = {
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: { nodes: CartLine[] }; 
  totalQuantity: number;
  checkoutUrl: string;
} | null;



function CartItem({ item }: { item: CartLine }) {
  const merchandise = item.merchandise

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
          <button type="button" disabled aria-label={`Decrease ${merchandise.product.title} quantity`}>
            −
          </button>
          <span>{item.quantity}</span>
          <button type="button" disabled aria-label={`Increase ${merchandise.product.title} quantity`}>
            +
          </button>
        </div>
        <button className="cart-remove" type="button" disabled>
          Remove
        </button>
      </div>

      <strong className="cart-line-total">
        {formatMoney(item.cost.totalAmount.amount, merchandise.price.currencyCode)}
      </strong>
    </article>
  );
}

export default function CartList({ cart }: { cart: CartView | null }) {
  if (!cart || cart.lines.nodes.length === 0) {
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
          <p>{cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}</p>
        </div>

        <div className="cart-items">
          {cart.lines.nodes.map((item) => (
            <CartItem item={item} key={item.id} />
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
             <dd>{formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}</dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd>Calculated at checkout</dd>
          </div>
        </dl>

        <div className="cart-total">
          <span>Estimated total</span>
          <strong>{formatMoney(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}</strong>
        </div>

        <a className="checkout-button" href={cart.checkoutUrl || "#"}>
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
