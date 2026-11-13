import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import useCategories from "../hooks/useCategories";
import {
  categoryIcons,
  toCircleIcon,
} from "../assets/categoryIcons";
import {
  getCategoryPath,
  orderNavCategories,
} from "../utils/categoryLinks";
import { ShopContext } from "../context/ShopContext";
import SectionHeader from "./SectionHeader";

/** Home / living categories — shown via View all, not in this hardware strip. */
const LIVING_CATEGORIES = new Set([
  "Curtains",
  "Bedsheets",
  "Luxury Bedsheets",
  "Upholstery",
]);

const CategoryGrid = () => {
  const { categories, isLoading } = useCategories();
  const { products } = useContext(ShopContext);

  const hardwareCategories = useMemo(
    () =>
      orderNavCategories(categories).filter(
        (cat) => !LIVING_CATEGORIES.has(cat.name)
      ),
    [categories]
  );

  const productImageByCategory = useMemo(() => {
    const map = {};
    for (const product of products || []) {
      if (!product?.category || map[product.category]) continue;
      const img = product.image?.[0];
      if (img) map[product.category] = toCircleIcon(img);
    }
    return map;
  }, [products]);

  const getCategoryImage = (name) =>
    categoryIcons[name] || productImageByCategory[name] || null;

  return (
    <section className="w-full border-t border-kaboz-line bg-white">
      <div className="kb-container py-8 sm:py-10">
        {/* Mobile: horizontal category strip */}
        <div className="md:hidden">
          <SectionHeader
            eyebrow="Departments"
            title="Shop by category"
            viewAllTo="/collection"
            icon="grid"
            accent="blue"
          />
          {isLoading ? (
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex w-[72px] flex-shrink-0 flex-col items-center gap-1.5"
                >
                  <div className="h-[72px] w-[72px] animate-pulse rounded-full bg-kaboz-soft" />
                  <div className="h-2.5 w-12 animate-pulse rounded bg-kaboz-soft" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {hardwareCategories.map((cat) => {
                const imageSrc = getCategoryImage(cat.name);
                return (
                  <Link
                    key={cat._id}
                    to={getCategoryPath(cat.name)}
                    className="flex w-[76px] flex-shrink-0 flex-col items-center gap-1.5"
                  >
                    <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full bg-kaboz-soft ring-2 ring-kaboz-line">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={cat.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-display text-lg font-bold text-kaboz-purple/45">
                            {cat.name.slice(0, 1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="line-clamp-2 text-center text-[11px] font-semibold leading-tight text-kaboz-ink">
                      {cat.name}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop: Onsus-style circular category strip (Top categories) */}
        <div className="hidden md:block">
          <SectionHeader
            eyebrow="Top categories"
            title="Shop by category"
            viewAllTo="/collection"
            icon="grid"
            accent="blue"
          />

          {isLoading ? (
            <div className="flex w-full justify-between gap-3 sm:gap-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-2.5"
                >
                  <div className="aspect-square w-full max-w-[148px] animate-pulse rounded-full bg-kaboz-soft ring-2 ring-kaboz-line" />
                  <div className="h-3 w-16 animate-pulse rounded bg-kaboz-soft" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex w-full items-start justify-between gap-2 sm:gap-3 md:gap-4">
              {hardwareCategories.map((cat) => {
                const imageSrc = getCategoryImage(cat.name);
                return (
                  <Link
                    key={cat._id}
                    to={getCategoryPath(cat.name)}
                    className="group flex min-w-0 flex-1 flex-col items-center gap-2.5"
                  >
                    <div className="relative aspect-square w-full max-w-[148px] overflow-hidden rounded-full bg-kaboz-soft ring-2 ring-kaboz-line shadow-sm transition-all duration-200 ease-out group-hover:-translate-y-1.5 group-hover:scale-105 group-hover:ring-kaboz-purple group-hover:shadow-md">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={cat.name}
                          className="kb-img-pop h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-display text-2xl font-bold text-kaboz-purple/45">
                            {cat.name.slice(0, 1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="line-clamp-2 text-center text-xs font-semibold leading-snug text-kaboz-ink transition-colors group-hover:text-kaboz-purple sm:text-sm">
                      {cat.name}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
