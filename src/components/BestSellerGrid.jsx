import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import SectionHeader from "./SectionHeader";

/**
 * Best Seller — Onsus 2-row product grid (5 × 2 on desktop).
 */
const BestSellerGrid = ({ preferredIds = [] }) => {
  const { products, productsLoading } = useContext(ShopContext);

  const items = useMemo(() => {
    if (preferredIds?.length) {
      const byId = Object.fromEntries(
        (products || []).map((p) => [String(p._id), p])
      );
      const ordered = preferredIds.map((id) => byId[String(id)]).filter(Boolean);
      if (ordered.length) return ordered.slice(0, 10);
    }
    const flagged = (products || []).filter((p) => p.bestseller);
    const source = flagged.length ? flagged : products || [];
    return source.slice(0, 10);
  }, [products, preferredIds]);

  if (productsLoading) {
    return (
      <section className="w-full py-6 sm:py-8">
        <div className="kb-container">
          <SectionHeader title="Best Seller" icon="flame" accent="green" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-[6px] bg-kaboz-soft"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className="w-full py-6 sm:py-8">
      <div className="kb-container">
        <SectionHeader
          title="Best Seller"
          viewAllTo="/collection"
          icon="flame"
          accent="green"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5">
          {items.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              slug={item.slug}
              image={item.image}
              name={item.name}
              price={item.price}
              originalPrice={item.originalPrice}
              curtainTypes={item.curtainTypes}
              category={item.category}
              subCategory={item.subCategory}
              sku={item.sku}
              brand={item.brand}
              modelName={item.modelName}
              variant="light"
              compact
              date={item.date}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellerGrid;
