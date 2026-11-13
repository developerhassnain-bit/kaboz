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
      if (sameSub.length > 0) {
        productsCopy = sameSub;
      }
    }

    setRelated(productsCopy.slice(0, 10));
  }, [products, category, subCategory, currentProductSlug, currentProductId]);

  if (related.length === 0) return null;

  return (
    <div className="my-6 sm:my-10">
      <SectionHeader title="Products Related To This Item" icon="grid" accent="blue" />

      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-7 md:grid-cols-4 lg:grid-cols-5 xl:gap-x-5">
        {related.map((item) => (
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

export default RelatedProducts;
