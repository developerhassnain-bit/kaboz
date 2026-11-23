import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import SectionHeader from "./SectionHeader";
import { isCctvProduct } from "../utils/categoryLinks";

/**
 * Best Seller — Onsus 2-row product grid (5 × 2 on desktop).
 * Row 1 is 100% CCTV Cameras, Row 2 contains other products without duplicates.
 */
const BestSellerGrid = ({ preferredIds = [] }) => {
  const { products, productsLoading } = useContext(ShopContext);

  const items = useMemo(() => {
    const list = products || [];
    if (!list.length) return [];

    // Row 1: First 5 items must be CCTV camera products
    const cctv = list.filter(isCctvProduct);
    const row1 = cctv.slice(0, 5);
    const row1Ids = new Set(row1.map((p) => String(p._id)));

    // Row 2: Next 5 items (other bestsellers or products, no duplicates from row 1)
    const remaining = list.filter((p) => !row1Ids.has(String(p._id)));
    const bestsellers = remaining.filter((p) => p.bestseller);
    const candidateList = bestsellers.length >= 5 ? bestsellers : remaining;
    const row2 = candidateList.slice(0, 5);

    return [...row1, ...row2];
  }, [products]);

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
              hideDiscountBadge
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellerGrid;
