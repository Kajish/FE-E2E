"use client";
import {  useState } from "react";
import {
  ArrowRight,
  Check,
  ShoppingBag,
  X,
  Eye,
  Zap,
  ShieldCheck,
  Activity,
} from "lucide-react";
import Header from "../components/header";
import { track } from "../lib/tracking";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  emoji: string;
  tint: string;
  description: string;
};
const products: Product[] = [
  {
    id: "HP-101",
    name: "Studio Headphones",
    category: "Audio",
    price: 4999,
    emoji: "🎧",
    tint: "aqua",
    description: "Immersive wireless sound with a minimal silhouette.",
  },
  {
    id: "SP-202",
    name: "Portable Speaker",
    category: "Audio",
    price: 3299,
    emoji: "🔊",
    tint: "violet",
    description: "Room-filling sound for wherever the day takes you.",
  },
  {
    id: "WM-303",
    name: "Smart Watch",
    category: "Wearables",
    price: 8999,
    emoji: "⌚",
    tint: "peach",
    description: "A cleaner way to stay connected and on schedule.",
  },
  {
    id: "CM-404",
    name: "Digital Camera",
    category: "Cameras",
    price: 12999,
    emoji: "📷",
    tint: "mint",
    description: "Capture the moments that deserve to last.",
  },
];
const rupees = (v: number) => `₹${v.toLocaleString("en-IN")}`;
export default function Home() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showCart, setShowCart] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = products.reduce(
    (sum, p) => sum + p.price * (cart[p.id] || 0),
    0,
  );
  const viewProduct = (p: Product) => {
    setSelected(p);
    track({
      tealium_event: "product_view",
      product_id: p.id,
      product_name: p.name,
      product_category: p.category,
      product_price: p.price,
      currency: "INR",
    });
  };
  const add = (p: Product) => {
    setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }));
    setPurchased(false);
    track({
      tealium_event: "cart_add",
      product_id: p.id,
      product_name: p.name,
      product_category: p.category,
      product_price: p.price,
      product_quantity: 1,
      currency: "INR",
    });
  };
  const checkout = () => {
    if (!count) return;
    track({
      tealium_event: "checkout_started",
      order_value: total,
      currency: "INR",
    });
    // Simulated demo purchase; no payment backend exists.
    track({
      tealium_event: "purchase",
      order_id: `DEMO-${Date.now()}`,
      order_value: total,
      currency: "INR",
    });
    setCart({});
    setPurchased(true);
  };
  return (
    <>
      <Header cartCount={count} />
      <main className="container">
        <section className="hero">
          <div>
            <span className="eyebrow">
              <Zap size={14} /> THE CONNECTED COMMERCE DEMO
            </span>
            <h1>
              Discover better.
              <br />
              <span>Track smarter.</span>
            </h1>
            <p>
              A premium mini-store that demonstrates real user interaction
              events, structured data layers, and Tealium-ready frontend
              tracking.
            </p>
            <a className="btn primary" href="#products">
              Explore products <ArrowRight size={17} />
            </a>
          </div>
          <div className="hero-art">
            <span>✦</span>
            <div className="hero-emoji">🎧</div>
            <div className="floating-card">
              <Activity size={16} /> Events captured as you browse
            </div>
          </div>
        </section>
        <div className="section-head" id="products">
          <div>
            <span className="eyebrow">CURATED COLLECTION</span>
            <h2>Featured products</h2>
            <p>Every interaction creates a trackable event.</p>
          </div>
          <button className="btn ghost" onClick={() => setShowCart(true)}>
            <ShoppingBag size={17} /> View bag ({count})
          </button>
        </div>
        <div className="products">
          {products.map((p) => (
            <article key={p.id} className="product">
              <button
                className={`product-image ${p.tint}`}
                onClick={() => viewProduct(p)}
                aria-label={`View ${p.name}`}
              >
                <span>{p.emoji}</span>
                <span className="view-pill">
                  <Eye size={14} /> Quick view
                </span>
              </button>
              <div className="product-meta">
                <span>{p.category}</span>
                <span>{p.id}</span>
              </div>
              <h3>{p.name}</h3>
              <div className="product-foot">
                <strong>{rupees(p.price)}</strong>
                <button className="btn small" onClick={() => add(p)}>
                  Add to bag <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="section-head" id="productsDuplicate">
          <div>
            <span className="eyebrow">CURATED COLLECTION</span>
            <h2>Featured products</h2>
            <p>Every interaction creates a trackable event.</p>
          </div>
          <button className="btn ghost" onClick={() => setShowCart(true)}>
            <ShoppingBag size={17} /> View bag ({count})
          </button>
        </div>
        <div className="products">
          {products.map((p) => (
            <article key={p.id} className="product">
              <button
                className={`product-image ${p.tint}`}
                onClick={() => viewProduct(p)}
                aria-label={`View ${p.name}`}
              >
                <span>{p.emoji}</span>
                <span className="view-pill">
                  <Eye size={14} /> Quick view
                </span>
              </button>
              <div className="product-meta">
                <span>{p.category}</span>
                <span>{p.id}</span>
              </div>
              <h3>{p.name}</h3>
              <div className="product-foot">
                <strong>{rupees(p.price)}</strong>
                <button className="btn small" onClick={() => add(p)}>
                  Add to bag <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
        
        <div className="info-strip">
          <ShieldCheck size={19} />
          <div>
            <strong>Demo experience — no real purchases.</strong>
            <p>
              All events are logged in this browser. Tealium forwarding is
              enabled only when configured and consented.
            </p>
          </div>
        </div>
      </main>
      <footer>
        Signal Store · Frontend-only CDP tracking proof of concept
      </footer>
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <section
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-label={selected.name}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <X />
            </button>
            <div className={`dialog-image ${selected.tint}`}>
              {selected.emoji}
            </div>
            <span className="eyebrow">
              {selected.category} · {selected.id}
            </span>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
            <div className="dialog-action">
              <strong>{rupees(selected.price)}</strong>
              <button
                className="btn primary"
                onClick={() => {
                  add(selected);
                  setSelected(null);
                }}
              >
                Add to bag <ArrowRight size={16} />
              </button>
            </div>
          </section>
        </div>
      )}
      {showCart && (
        <div className="overlay" onClick={() => setShowCart(false)}>
          <aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-top">
              <h2>
                Shopping bag <span>({count})</span>
              </h2>
              <button
                className="close"
                onClick={() => setShowCart(false)}
                aria-label="Close"
              >
                <X />
              </button>
            </div>
            <div className="drawer-items">
              {count === 0 ? (
                <div className="empty">
                  {purchased ? (
                    <>
                      <Check size={30} /> Demo checkout complete. Check the
                      event monitor.
                    </>
                  ) : (
                    "Your bag is empty."
                  )}
                </div>
              ) : (
                products
                  .filter((p) => cart[p.id])
                  .map((p) => (
                    <div className="cart-item" key={p.id}>
                      <div className={`cart-icon ${p.tint}`}>{p.emoji}</div>
                      <div>
                        <strong>{p.name}</strong>
                        <p>
                          {cart[p.id]} × {rupees(p.price)}
                        </p>
                      </div>
                      <b>{rupees(p.price * cart[p.id])}</b>
                    </div>
                  ))
              )}
            </div>
            <div className="drawer-bottom">
              <div className="total">
                <span>Total</span>
                <strong>{rupees(total)}</strong>
              </div>
              <button
                className="btn primary full"
                disabled={!count}
                onClick={checkout}
              >
                Simulate checkout <ArrowRight size={17} />
              </button>
              <small>
                Demo only. No money is charged and no real order is created.
              </small>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
