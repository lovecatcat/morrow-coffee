import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/types/types";

// 格式化Shopify价格
function formatShopifyPrice(amount: string, currencyCode: string) {
  if (!amount || !currencyCode) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

function ProductCard({ product }: { product: ShopifyProduct }) {
  const featuredImage = product.featuredImage;
  const price = product.priceRange.minVariantPrice;

  return (
    <article className="product-card">
      <div className="product-art">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText ?? product.title}
            fill
            sizes="(max-width: 800px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <Image
            src="/placeholder.svg"
            alt={product.title}
            fill
            sizes="(max-width: 800px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        )}
      </div>

      <div className="product-details">
        <div>
          <h3>{product.title}</h3>
          <p>{product.description || "Built for better everyday brews."}</p>
        </div>
        <strong>{formatShopifyPrice(price.amount, price.currencyCode)}</strong>
      </div>
    </article>
  );
}

export default function Products({
  products,
  hasError = false,
  eyebrow = "The essentials",
  title = "Featured products",
  showAllLink = true,
}: {
  products: ShopifyProduct[];
  hasError?: boolean;
  eyebrow?: string;
  title?: string;
  showAllLink?: boolean;
}) {
  return (
    <section className="products page-shell" id="shop">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {showAllLink && (
          <Link href="/products">
            Shop all <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      {hasError ? (
        <p className="product-status" role="alert">
          We couldn&apos;t load the products. Please try again soon.
        </p>
      ) : products.length === 0 ? (
        <p className="product-status">New products are coming soon.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.handle}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
