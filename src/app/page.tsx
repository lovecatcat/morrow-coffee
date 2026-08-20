import { getProducts } from "@/lib/shopify";
import Products from "@/components/Products";
import Header from "@/components/Header";
import type { ShopifyProduct } from "@/types/types";
import Footer from "@/components/Footer";


function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}


 
export default async function Home() {
  let products: ShopifyProduct[] = [];
  let hasProductError = false;

  try {
    products = await getProducts(3);
  } catch (error) {
    hasProductError = true;
    console.error("Unable to load Shopify products:", error);
  }
  return (
    <main>
      <Header />

      <section className="hero page-shell" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Coffee, considered.</p>
          <h1>
            Better coffee.
            <br />
            <em>Made simple.</em>
          </h1>
          <p className="hero-description">
            Thoughtful coffee gear selected for your taste, budget, and daily
            ritual.
          </p>
          <a className="primary-button" href="#shop">
            Shop the collection <ArrowIcon />
          </a>
        </div>

        <div className="hero-art" aria-label="Abstract coffee brewing still life">
          <div className="sun" />
          <div className="steam steam-one" />
          <div className="steam steam-two" />
          <div className="kettle">
            <span className="kettle-lid" />
            <span className="kettle-handle" />
            <span className="kettle-spout" />
          </div>
          <div className="cup">
            <span />
          </div>
          <div className="table-line" />
          <p>Slow mornings,<br />exceptional coffee.</p>
        </div>
      </section>

      <Products products={products} hasError={hasProductError} />

      <section className="assistant page-shell" id="assistant">
        <div className="assistant-mark" aria-hidden="true">✳</div>
        <div>
          <p className="eyebrow">AI shopping assistant</p>
          <h2>Not sure what to buy?</h2>
          <p>Tell us how you make coffee. We&apos;ll find the right setup for you.</p>
        </div>
        <button type="button">
          Ask our assistant <ArrowIcon />
        </button>
      </section>

     <Footer/>
    </main>
  );
}
