import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import useCategories from "../hooks/useCategories";
import ProductItem from "./ProductItem";
import {
  getCategoryDisplayName,
  getCategoryPath,
  orderNavCategories,
} from "../utils/categoryLinks";
import { IconArrowRight } from "./ui/Icons";

const PRODUCTS_PER_TAB = 10;

/**
 * Onsus-style category tabs + product grid.
 * Title on the left, category tabs on the right (or wrapping below on mobile).
 */
const CategoryShopTabs = ({
  title = "Shop by category",
  eyebrow = "Categories",
  accent = "blue",
}) => {
  const { products } = useContext(ShopContext);
  const { categories } = useCategories();

  const tabs = useMemo(() => {
    const withProducts = orderNavCategories(categories).filter((cat) =>
      (products || []).some(
        (p) =>
          p.category &&
          p.category.toLowerCase() === cat.name.toLowerCase()
      )
    );
    return withProducts;
  }, [categories, products]);

  const [activeName, setActiveName] = useState("");

  const resolvedActive = useMemo(() => {
    if (activeName && tabs.some((t) => t.name === activeName)) return activeName;
    return tabs[0]?.name || "";
  }, [activeName, tabs]);

  const visibleProducts = useMemo(() => {
    if (!resolvedActive) return [];
    return (products || [])
      .filter(
        (p) =>
          p.category &&
          p.category.toLowerCase() === resolvedActive.toLowerCase()
      )
      .slice(0, PRODUCTS_PER_TAB);
  }, [products, resolvedActive]);

  const accentActive =
    accent === "green"
      ? "text-kaboz-green"
      : accent === "red"
        ? "text-kaboz-red"
        : accent === "purple"
          ? "text-kaboz-purple"
          : "text-kaboz-orange";
  const accentBar =
    accent === "green"
      ? "bg-kaboz-green"
      : accent === "red"
        ? "bg-kaboz-red"
        : accent === "purple"
          ? "bg-kaboz-purple"
          : "bg-kaboz-orange";
  const accentEye =
    accent === "green"
      ? "text-kaboz-green"
      : accent === "red"
        ? "text-kaboz-red"
        : accent === "purple"
          ? "text-kaboz-purple"
          : "text-kaboz-orange";

  if (!tabs.length) return null;

  return (
    <section className="w-full border-t border-kaboz-line bg-white py-8 sm:py-10">
      <div className="kb-container">
        <div className="mb-5 flex flex-col gap-4 border-b border-kaboz-line pb-0 sm:mb-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0 pb-3">
            <p
              className={`text-[11px] font-bold uppercase tracking-[0.18em] ${accentEye}`}
            >
              {eyebrow}
            </p>
            <h2 className="font-display text-xl font-bold text-kaboz-ink sm:text-2xl">
              {title}
            </h2>
          </div>

          <ul
            className="flex gap-5 overflow-x-auto pb-3 sm:gap-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
          >
            {tabs.map((cat) => {
              const isActive = resolvedActive === cat.name;
              return (
                <li key={cat._id || cat.name} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveName(cat.name)}
                    className={`relative whitespace-nowrap text-sm font-semibold transition sm:text-[15px] ${
                      isActive
                        ? accentActive
                        : "text-kaboz-mute hover:text-kaboz-ink"
                    }`}
                  >
                    {getCategoryDisplayName(cat.name)}
                    {isActive ? (
                      <span
                        className={`absolute inset-x-0 -bottom-3 h-0.5 ${accentBar}`}
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {visibleProducts.length === 0 ? (
          <p className="rounded-[6px] border border-dashed border-kaboz-line bg-kaboz-soft px-4 py-12 text-center text-sm text-kaboz-mute">
            No products in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
            {visibleProducts.map((item) => (
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
        )}

        {resolvedActive ? (
          <div className="mt-6 flex justify-center sm:mt-8">
            <Link
              to={getCategoryPath(resolvedActive)}
              className="inline-flex items-center gap-1.5 rounded-[6px] border border-kaboz-line bg-white px-5 py-2.5 text-sm font-bold text-kaboz-ink transition hover:border-kaboz-orange hover:text-kaboz-orange"
            >
              View all {getCategoryDisplayName(resolvedActive)}
              <IconArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default CategoryShopTabs;
