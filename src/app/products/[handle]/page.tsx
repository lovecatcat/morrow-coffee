import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PurchasePanel from "@/components/PurchasePanel";
import { getProduct } from "@/lib/shopify";

type ProductPageProps = {
  params: Promise<{
    handle: string;
  }>;
};

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return { title: "Product not found — Morrow Coffee" };
  }

  return {
    title: `${product.title} — Morrow Coffee`,
    description:
      product.description || `Shop ${product.title} from Morrow Coffee.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) {
    notFound();
  }

  const price = product.priceRange.minVariantPrice;

  return (
    <main>
      <Header />

      <div className="product-page page-shell">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/products">Shop</Link>
          <span aria-hidden="true">/</span>
          <span>{product.title}</span>
        </nav>

        <section className="product-overview">
          <div className="product-gallery">
            <span className="product-badge">Morrow selection</span>
            <Image
              src={product.featuredImage?.url || "/placeholder.svg"}
              alt={product.featuredImage?.altText || product.title}
              fill
              priority
              sizes="(max-width: 800px) 100vw, 58vw"
            />
            <span className="gallery-count">01 / 01</span>
          </div>

          <div className="product-info">
            <p className="eyebrow">Coffee equipment</p>
            <h1>{product.title}</h1>
            <p className="product-price">
              {formatMoney(price.amount, price.currencyCode)}
            </p>
            <div className="product-description">
              <p>
                {product.description ||
                  "A considered everyday essential, selected to make better coffee feel simple."}
              </p>
            </div>

            <PurchasePanel product={product} />
          </div>
        </section>

        <section className="product-story">
          <p className="eyebrow">Why we chose it</p>
          <h2>
            Less guesswork.
            <br />
            More great coffee.
          </h2>
          <p>
            We choose equipment that is intuitive, dependable, and genuinely
            useful. No complicated rituals—just thoughtful tools that help you
            brew with confidence every day.
          </p>
        </section>
      </div>

      <Footer />
    </main>
  );
}
