// 单个商品购买面板
"use client";
import { useState } from "react";
import type { ShopifyProduct } from "@/types/types";
import { useRouter } from "next/navigation";

export default function PurchasePanel({
  product,
}: {
  product: ShopifyProduct;
}) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const addToCart = async () => {
    setLoading(true);
    const variantId = product.variants.nodes[0]?.id;

    if (!variantId) {
      console.error("No product variant is available");
      return;
    }
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lines: [
            {
              merchandiseId: variantId,
              quantity,
            },
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to create cart:", data.details);
        return;
      }
      router.refresh();
      setLoading(false);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const decreaseQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const increaseQuantity = () => {
    setQuantity((q) => q + 1);
  };

  return (
    <>
      <div className="purchase-panel" id="purchase">
        <div className="quantity-preview" aria-label="Quantity">
          <button
            type="button"
            onClick={decreaseQuantity}
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
          >
            −
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={increaseQuantity}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        {loading ? (
          <button className="add-to-cart" disabled={loading}>
            Adding... <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button className="add-to-cart" onClick={() => addToCart()}>
            Add to cart <span aria-hidden="true">→</span>
          </button>
        )}
      </div>

      <div className="product-promises">
        <div>
          <span aria-hidden="true">↗</span>
          <p>
            <strong>Free delivery</strong>On orders over $75
          </p>
        </div>
        <div>
          <span aria-hidden="true">↺</span>
          <p>
            <strong>Easy returns</strong>30-day return window
          </p>
        </div>
        <div>
          <span aria-hidden="true">◇</span>
          <p>
            <strong>Built to last</strong>Selected for daily use
          </p>
        </div>
      </div>
    </>
  );
}
