import React, { useContext, useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import SectionHeader from "./SectionHeader";
import { ShopContext } from "../context/ShopContext";

const RelatedProducts = ({
  category,
  subCategory,
  currentProductSlug,
  currentProductId,
}) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!products || products.length === 0 || !category) {
      setRelated([]);
      return;
    }

    const isCurrentProduct = (item) => {
      if (currentProductId && String(item._id) === String(currentProductId)) {
        return true;
      }
      if (currentProductSlug && item.slug === currentProductSlug) {
        return true;
      }
      return false;
    };

    let productsCopy = products.filter(
      (item) => item.category === category && !isCurrentProduct(item)
    );

    if (subCategory) {
      const sameSub = productsCopy.filter(
        (item) => item.subCategory === subCategory
      );
      const otherSub = productsCopy.filter(
        (item) => item.subCategory !== subCategory
      );
      if (sameSub.length > 0) {
        productsCopy = [...sameSub, ...otherSub];
      }
    }

    // Limit to exactly 1 row (max 5 products on desktop 5-column grid)
    setRelated(productsCopy.slice(0, 5));
  }, [products, category, subCategory, currentProductSlug, currentProductId]);

  if (related.length === 0) return null;

  return (
    <div className="my-6 sm:my-10">
      <SectionHeader title="Products Related To This Item" icon="grid" accent="blue" />

      <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:gap-4 xl:gap-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {related.map((item) => (
          <div
            key={item._id}
            className="w-[45%] min-w-[155px] shrink-0 md:w-auto md:min-w-0 md:shrink flex flex-col h-full"
          >
            <ProductItem
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
