import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import SectionHeader from "./SectionHeader";
import { fetchRecentlyViewed } from "../utils/recentlyViewed";

const RecentlyViewed = ({ excludeId, excludeSlug }) => {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const products = await fetchRecentlyViewed({ excludeId });
      if (cancelled) return;

      const filtered = (products || []).filter((p) => {
        if (excludeId && String(p._id) === String(excludeId)) return false;
        if (excludeSlug && p.slug === excludeSlug) return false;
        return true;
      });

      setItems(filtered.slice(0, 4));
      setLoaded(true);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [excludeId, excludeSlug]);

  if (!loaded || items.length === 0) return null;

  return (
    <div className="my-6 sm:my-10">
      <SectionHeader title="Recently viewed" icon="grid" accent="gold" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-7 md:grid-cols-4">
        {items.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            slug={item.slug}
            name={item.name}
            price={item.price}
            originalPrice={item.originalPrice}
            image={item.image}
            category={item.category}
            subCategory={item.subCategory}
            sku={item.sku}
            brand={item.brand}
            modelName={item.modelName}
            curtainTypes={item.curtainTypes}
            date={item.date}
            reviews={item.reviews}
            compact
          />
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
