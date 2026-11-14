import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 4000;
const API_ORIGIN = "https://fakestoreapi.com";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

app.use(cors());
app.use(express.json());

let productCache = { data: null, fetchedAt: 0 };
const CACHE_TTL = 5 * 60 * 1000;

async function fetchProducts() {
  const fresh = productCache.data && Date.now() - productCache.fetchedAt < CACHE_TTL;
  if (fresh) return productCache.data;

  const response = await fetch(`${API_ORIGIN}/products`);
  if (!response.ok) throw new Error(`FakeStoreAPI returned ${response.status}`);
  const products = await response.json();

  if (!Array.isArray(products)) throw new Error("Unexpected product response");
  productCache = { data: products, fetchedAt: Date.now() };
  return products;
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "commerce-api" });
});

app.get("/api/products", async (_req, res) => {
  try {
    const products = await fetchProducts();
    res.set("Cache-Control", "public, max-age=60");
    res.json({ products, source: "FakeStoreAPI" });
  } catch (error) {
    console.error("Product fetch failed:", error.message);
    res.status(502).json({
      message: "We couldn't load the catalogue. Please try again in a moment."
    });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const products = await fetchProducts();
    const product = products.find((item) => item.id === Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (error) {
    console.error("Product lookup failed:", error.message);
    res.status(502).json({ message: "Product service is temporarily unavailable." });
  }
});

// In production, Express serves the compiled React application from the same origin.
const distPath = path.join(projectRoot, "dist");
app.use(express.static(distPath));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(distPath, "index.html"), (error) => {
    if (error) next();
  });
});

app.listen(PORT, () => {
  console.log(`Commerce server listening on http://localhost:${PORT}`);
});
