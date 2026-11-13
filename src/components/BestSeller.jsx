import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductRail from "./ProductRail";

const BestSeller = ({ preferredIds = [] }) => {
  const { products, productsLoading, productsError, refreshProducts } =
    useContext(ShopContext);

  const bestSeller = useMemo(() => {
    if (preferredIds?.length) {
      const byId = Object.fromEntries(
        products.map((p) => [String(p._id), p])
      );
      const ordered = preferredIds
        .map((id) => byId[String(id)])
        .filter(Boolean);
      if (ordered.length) return ordered.slice(0, 12);
    }
    const flagged = products.filter((item) => item.bestseller);
    const source = flagged.length > 0 ? flagged : products;
    return source.slice(0, 12);
  }, [products, preferredIds]);

  const usingFallback =
    products.length > 0 &&
    !(preferredIds?.length > 0) &&
    products.filter((item) => item.bestseller).length === 0;

  if (productsLoading) {
    return (
      <section className="py-6 sm:py-8">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kaboz-green">
            Best sellers
          </p>
          <h2 className="font-display text-xl font-bold text-kaboz-ink sm:text-2xl">
            Loading catalog…
          </h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 w-[200px] flex-shrink-0 animate-pulse rounded-lg bg-kaboz-soft"
            />
          ))}
        </div>
      </section>
    );
  }

  if (productsError) {
    return (
      <section className="py-6 sm:py-8">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center">
          <p className="font-display text-lg font-semibold text-kaboz-ink">
            Couldn’t load products
          </p>
          <p className="mt-1 text-sm text-kaboz-mute">{productsError}</p>
          <button
            type="button"
            onClick={refreshProducts}
            className="mt-4 rounded-md bg-kaboz-green px-4 py-2 text-sm font-semibold text-white hover:bg-kaboz-green-dark"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <ProductRail
      eyebrow={usingFallback ? "Popular picks" : "Best sellers"}
      title={usingFallback ? "Trending this week" : "Best Seller"}
      viewAllTo="/collection"
      products={bestSeller}
      emptyText="No products in the catalog yet."
      sectionIcon="flame"
      accent="green"
    />
  );
};

export default BestSeller;
