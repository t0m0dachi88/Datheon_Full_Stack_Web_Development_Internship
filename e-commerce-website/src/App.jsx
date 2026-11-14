import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown, Heart,
  Menu, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, Sparkles,
  Star, Trash2, X
} from "lucide-react";

const categories = [
  { id: "all", label: "All products" },
  { id: "electronics", label: "Electronics" },
  { id: "jewelery", label: "Jewelry" },
  { id: "men's clothing", label: "Men's clothing" },
  { id: "women's clothing", label: "Women's clothing" }
];

const money = (value) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD"
}).format(value);

function readCart() {
  try {
    return JSON.parse(localStorage.getItem("form-function-cart") || "[]");
  } catch {
    return [];
  }
}

function ProductCard({ product, onAdd, onQuickView, index }) {
  const [saved, setSaved] = useState(false);
  const isPopular = product.rating?.rate >= 4.5;
  return (
    <article className="group">
      <div className="product-image-wrap relative">
        <button
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2.5 text-ink shadow-sm transition hover:scale-105"
          onClick={() => setSaved(!saved)}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={17} fill={saved ? "#536b50" : "none"} color={saved ? "#536b50" : "currentColor"} />
        </button>
        {isPopular && <span className="product-tag">CUSTOMER FAVOURITE</span>}
        <button className="flex h-full w-full items-center justify-center p-8" onClick={() => onQuickView(product)}>
          <img src={product.image} alt={product.title} loading={index > 5 ? "lazy" : "eager"} className="product-image transition duration-500 group-hover:scale-105" />
        </button>
        <button onClick={() => onAdd(product)} className="quick-add absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 py-3 text-sm font-semibold">
          <Plus size={16} /> Quick add
        </button>
      </div>
      <div className="flex items-start justify-between gap-3 pt-4">
        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[.16em] text-moss">{product.category}</p>
          <button onClick={() => onQuickView(product)} className="line-clamp-2 text-left text-sm font-medium leading-5 text-ink hover:underline">
            {product.title}
          </button>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
            <Star size={12} fill="#b48a4a" color="#b48a4a" />
            <span className="font-semibold text-ink">{product.rating?.rate?.toFixed(1) ?? "—"}</span>
            <span>({product.rating?.count ?? 0})</span>
          </div>
        </div>
        <span className="whitespace-nowrap text-sm font-semibold">{money(product.price)}</span>
      </div>
    </article>
  );
}

function Drawer({ open, onClose, cart, updateQuantity, removeItem, subtotal, tax, shipping, total, onCheckout }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <>
      <div className={`drawer-backdrop ${open ? "visible" : ""}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? "drawer-open" : ""}`} aria-hidden={!open}>
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">Your selection</p>
            <h2 className="font-display text-2xl">Shopping bag <span className="text-neutral-400">({cart.reduce((n, x) => n + x.quantity, 0)})</span></h2>
          </div>
          <button className="rounded-full p-2 hover:bg-black/5" onClick={onClose} aria-label="Close cart"><X /></button>
        </div>
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-5 rounded-full bg-sand p-5"><ShoppingBag size={27} /></div>
            <h3 className="font-display text-2xl">Your bag is taking a break.</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-neutral-500">Find something you love and it will be waiting here.</p>
            <button onClick={onClose} className="dark-button mt-7">Explore collection <ArrowRight size={15} /></button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4">
                  <div className="flex h-28 w-24 shrink-0 items-center justify-center rounded-xl bg-[#f1f0eb] p-3">
                    <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-medium leading-5">{product.title}</p>
                      <button onClick={() => removeItem(product.id)} className="h-fit text-neutral-400 hover:text-red-600" aria-label="Remove item"><Trash2 size={15} /></button>
                    </div>
                    <p className="mt-1 text-xs capitalize text-neutral-500">{product.category}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-black/10">
                        <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-2" aria-label="Decrease quantity"><Minus size={13} /></button>
                        <span className="w-6 text-center text-xs font-semibold">{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-2" aria-label="Increase quantity"><Plus size={13} /></button>
                      </div>
                      <span className="text-sm font-semibold">{money(product.price * quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-black/10 bg-white px-6 py-5">
              <div className="mb-4 rounded-xl bg-[#f4f4ef] p-3 text-xs text-moss">You’re getting closer to the good stuff. Shipping is free on orders over $150.</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-neutral-500">Subtotal</span><span>{money(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Estimated tax (8%)</span><span>{money(tax)}</span></div>
                <div className="flex justify-between"><span className="text-neutral-500">Shipping</span><span>{shipping === 0 ? "Free" : money(shipping)}</span></div>
                <div className="mt-3 flex justify-between border-t border-black/10 pt-3 text-base font-bold"><span>Total</span><span>{money(total)}</span></div>
              </div>
              <button onClick={onCheckout} className="dark-button mt-5 w-full justify-center py-4">Continue to checkout <ArrowRight size={16} /></button>
              <p className="mt-3 text-center text-[10px] text-neutral-400">Taxes and shipping are estimates. Demo checkout only.</p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function CheckoutModal({ open, onClose, onConfirm, total, complete }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <button onClick={onClose} className="float-right rounded-full p-2 hover:bg-black/5"><X size={18} /></button>
        {complete ? (
          <div className="py-7 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9efe6] text-moss"><Check size={30} /></div>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">Order confirmed</p>
            <h2 className="mt-2 font-display text-3xl">Lovely choice.</h2>
            <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-neutral-500">Your demo order has been placed. No payment was collected.</p>
            <button onClick={onClose} className="dark-button mt-7 w-full justify-center">Back to shopping</button>
          </div>
        ) : (
          <>
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-moss">Almost yours</p>
            <h2 className="mt-2 font-display text-3xl">Checkout</h2>
            <p className="mt-2 text-sm text-neutral-500">This is a simulated checkout experience.</p>
            <div className="mt-6 space-y-4">
              <label className="block text-xs font-semibold">Email address<input className="checkout-input mt-2" type="email" placeholder="you@example.com" /></label>
              <label className="block text-xs font-semibold">Full name<input className="checkout-input mt-2" placeholder="Your name" /></label>
              <label className="block text-xs font-semibold">Delivery address<input className="checkout-input mt-2" placeholder="Street address" /></label>
            </div>
            <div className="mt-6 flex justify-between border-t border-black/10 pt-4 font-semibold"><span>Order total</span><span>{money(total)}</span></div>
            <button onClick={onConfirm} className="dark-button mt-5 w-full justify-center py-4">Place demo order <ArrowRight size={16} /></button>
          </>
        )}
      </div>
    </div>
  );
}

function QuickView({ product, onClose, onAdd }) {
  if (!product) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white md:grid-cols-2">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow"><X size={18} /></button>
        <div className="flex min-h-72 items-center justify-center bg-[#f2f1ec] p-12"><img src={product.image} alt={product.title} className="max-h-64 max-w-full object-contain mix-blend-multiply" /></div>
        <div className="flex flex-col justify-center p-8 md:p-10">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-moss">{product.category}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight">{product.title}</h2>
          <div className="mt-4 flex items-center gap-2 text-sm"><Star size={14} fill="#b48a4a" color="#b48a4a" /> {product.rating?.rate} <span className="text-neutral-400">({product.rating?.count} reviews)</span></div>
          <p className="mt-5 line-clamp-5 text-sm leading-6 text-neutral-500">{product.description}</p>
          <p className="mt-6 text-xl font-semibold">{money(product.price)}</p>
          <button onClick={() => { onAdd(product); onClose(); }} className="dark-button mt-6 w-full justify-center">Add to bag <Plus size={16} /></button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load products from the store.");
        return res.json();
      })
      .then((data) => { if (active) setProducts(data.products || []); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem("form-function-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      const categoryMatch = category === "all" || p.category === category;
      const searchMatch = `${p.title} ${p.description} ${p.category}`.toLowerCase().includes(search.toLowerCase());
      return categoryMatch && searchMatch;
    });
    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating.rate - a.rating.rate);
    return result;
  }, [products, category, search, sort]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal === 0 || subtotal >= 150 ? 0 : 8.95;
  const total = subtotal + tax + shipping;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function notify(message) {
    setToast(message);
    window.clearTimeout(notify.timeout);
    notify.timeout = window.setTimeout(() => setToast(""), 2200);
  }

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      return existing
        ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { product, quantity: 1 }];
    });
    notify("Added to your bag");
  }

  function updateQuantity(id, quantity) {
    if (quantity <= 0) return removeItem(id);
    setCart((current) => current.map((item) => item.product.id === id ? { ...item, quantity } : item));
  }

  function removeItem(id) {
    setCart((current) => current.filter((item) => item.product.id !== id));
  }

  function finishOrder() {
    setCart([]);
    setOrderComplete(true);
  }

  const openCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
    setOrderComplete(false);
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="announcement flex items-center justify-center gap-2 px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[.16em]">
        <Sparkles size={12} /> A little something for your everyday <span className="hidden sm:inline">— complimentary shipping over $150</span>
      </div>
      <header className="sticky top-0 z-30 border-b border-black/[.07] bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 md:px-10">
          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X /> : <Menu />}</button>
          <a href="#" className="brand-mark"><span>form <i>&</i> function</span><small>OBJECTS FOR LIVING</small></a>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#shop" className="nav-link">Shop all</a>
            <a href="#shop" onClick={() => setCategory("electronics")} className="nav-link">Technology</a>
            <a href="#shop" onClick={() => setCategory("jewelery")} className="nav-link">Accessories</a>
            <a href="#story" className="nav-link">Our point of view</a>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => document.getElementById("search-field")?.focus()} className="rounded-full p-2 hover:bg-black/5" aria-label="Search"><Search size={19} /></button>
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold transition hover:bg-white">
              <ShoppingBag size={17} /><span className="hidden sm:inline">Bag</span>
              <span className="cart-count">{itemCount}</span>
            </button>
          </div>
        </div>
        {mobileMenu && <div className="space-y-3 border-t border-black/10 bg-paper px-6 py-5 md:hidden"><a className="block" href="#shop" onClick={() => setMobileMenu(false)}>Shop all</a><a className="block" href="#shop" onClick={() => { setCategory("electronics"); setMobileMenu(false); }}>Technology</a><a className="block" href="#shop" onClick={() => { setCategory("jewelery"); setMobileMenu(false); }}>Accessories</a></div>}
      </header>

      <main>
        <section className="hero-shell mx-auto max-w-[1440px] px-5 pt-6 md:px-10 md:pt-9">
          <div className="hero relative overflow-hidden rounded-[28px]">
            <div className="hero-copy relative z-10 flex min-h-[480px] flex-col items-start justify-center px-8 py-14 md:min-h-[570px] md:px-16 lg:px-24">
              <p className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-white/75"><span className="h-px w-7 bg-white/70" /> The considered edit · No. 01</p>
              <h1 className="max-w-xl font-display text-5xl leading-[1.02] tracking-[-.04em] text-white md:text-7xl">Good things.<br /><em className="font-normal">Better living.</em></h1>
              <p className="mt-6 max-w-sm text-sm leading-7 text-white/75">Thoughtful everyday finds, selected to bring a little more intention to the way you live.</p>
              <a href="#shop" className="mt-9 inline-flex items-center gap-5 border-b border-white/70 pb-2 text-xs font-semibold uppercase tracking-[.15em] text-white">Explore the collection <ArrowUpRight size={16} /></a>
            </div>
            <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
            <div className="hero-stamp"><span>CURATED</span><span>WITH CARE</span><Sparkles size={20} /></div>
          </div>
        </section>

        <section id="shop" className="mx-auto max-w-[1440px] scroll-mt-28 px-5 pb-24 pt-20 md:px-10 md:pt-28">
          <div className="mb-9 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">A good place to start</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">The collection<span className="text-moss">.</span></h2>
              <p className="mt-3 text-sm text-neutral-500">Useful things, beautiful details, everyday favourites.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="search-box flex min-w-[220px] flex-1 items-center gap-2 rounded-full px-4 py-3 md:flex-none">
                <Search size={16} className="text-neutral-400" />
                <input id="search-field" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find your thing..." className="w-full bg-transparent text-xs outline-none placeholder:text-neutral-400 md:w-40" />
                {search && <button onClick={() => setSearch("")}><X size={14} /></button>}
              </div>
              <label className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 text-xs">
                <SlidersHorizontal size={14} />
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent outline-none">
                  <option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mb-9 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button key={item.id} onClick={() => setCategory(item.id)} className={`category-pill ${category === item.id ? "category-active" : ""}`}>{item.label}</button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i}><div className="skeleton aspect-[4/4.6] rounded-2xl" /><div className="skeleton mt-4 h-3 w-2/3 rounded" /><div className="skeleton mt-3 h-3 w-1/3 rounded" /></div>)}</div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"><p className="font-medium">{error}</p><button className="dark-button mx-auto mt-4" onClick={() => window.location.reload()}>Try again</button></div>
          ) : filteredProducts.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-14">
              {filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onAdd={addToCart} onQuickView={setQuickView} />)}
            </div>
          ) : (
            <div className="py-20 text-center"><p className="font-display text-2xl">Nothing found just yet.</p><p className="mt-2 text-sm text-neutral-500">Try another search or category.</p><button onClick={() => { setSearch(""); setCategory("all"); }} className="mt-5 text-xs font-bold underline underline-offset-4">Clear filters</button></div>
          )}
          <div className="mt-14 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[.15em] text-neutral-400"><span className="h-px w-8 bg-neutral-300" /> {filteredProducts.length} thoughtfully selected finds <span className="h-px w-8 bg-neutral-300" /></div>
        </section>

        <section id="story" className="border-y border-black/[.06] bg-[#eeeee8]">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-16 md:grid-cols-2 md:items-center md:px-10 md:py-24">
            <div><p className="eyebrow">A simpler kind of shopping</p><h2 className="mt-4 max-w-lg font-display text-4xl leading-tight md:text-5xl">Less noise.<br /><em>More meaning.</em></h2></div>
            <div className="max-w-lg md:justify-self-end"><p className="text-sm leading-7 text-neutral-600">We believe the best everyday objects earn their place. Explore a considered mix of useful technology, personal pieces and wardrobe staples — all in one easy edit.</p><a href="#shop" className="mt-7 inline-flex items-center gap-3 border-b border-ink pb-2 text-xs font-bold uppercase tracking-[.14em]">Find your favourite <ArrowRight size={15} /></a></div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 px-5 py-9 text-xs text-neutral-500 md:flex-row md:items-center md:px-10">
        <a href="#" className="brand-mark"><span>form <i>&</i> function</span><small>OBJECTS FOR LIVING</small></a>
        <p>© 2026 form & function. A storefront demo powered by FakeStoreAPI.</p>
        <p>Made for the everyday.</p>
      </footer>

      <Drawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQuantity={updateQuantity} removeItem={removeItem} subtotal={subtotal} tax={tax} shipping={shipping} total={total} onCheckout={openCheckout} />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} onConfirm={finishOrder} total={total} complete={orderComplete} />
      <QuickView product={quickView} onClose={() => setQuickView(null)} onAdd={addToCart} />
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  );
}
