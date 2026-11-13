import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductRail from "./ProductRail";
import { getDiscountPercent } from "../utils/pricing";

/** Onsus “DEALS” / Deal of the Day — only real discounted Kaboz products. */
const DealsRail = () => {
  const { products } = useContext(ShopContext);

  const deals = useMemo(() => {
    return products
      .filter((p) => getDiscountPercent(p.price, p.originalPrice) > 0)
      .sort(
        (a, b) =>
          getDiscountPercent(b.price, b.originalPrice) -
          getDiscountPercent(a.price, a.originalPrice)
      )
      .slice(0, 12);
  }, [products]);

  if (deals.length === 0) return null;

  return (
    <ProductRail
      eyebrow="Limited offers"
      title="Deal of the day"
      viewAllTo="/collection"
      products={deals}
      emptyText=""
      sectionIcon="flame"
      accent="red"
    />
  );
};

export default DealsRail;
