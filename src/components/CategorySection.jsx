import React from "react";
import { Link } from "react-router-dom";
import ProductItem from "./ProductItem";
import SectionHeader from "./SectionHeader";
import { categoryBanners } from "../assets/categoryBanners";
import {
  getCategoryPath,
  getCategoryDisplayName,
} from "../utils/categoryLinks";

const PRODUCTS_PER_SECTION = 5;
const SECTION_ACCENTS = ["blue", "purple", "green", "red", "gold"];

/** Categories whose landscape banners already include designed headlines. */
const CATEGORIES_WITH_BAKED_BANNER_TEXT = new Set([
  "Curtains",
  "Access Control",
  "Single ACS Devices",
  "Video Intercom",
  "Security Cameras",
  "Network Switches",
  "Kits",
  "Accessories",
]);

const accentForCategory = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash + name.charCodeAt(i) * (i + 1)) % 997;
  return SECTION_ACCENTS[hash % SECTION_ACCENTS.length];
};

const CategorySection = ({ category, products, bannerOverride = "" }) => {
  const banners = categoryBanners[category];
  const bannerSrc =
    bannerOverride || banners?.landscape || banners?.portrait;
  const visibleProducts = products.slice(0, PRODUCTS_PER_SECTION);
  const categoryLink = getCategoryPath(category);
  const displayName = getCategoryDisplayName(category);
  const baked = CATEGORIES_WITH_BAKED_BANNER_TEXT.has(category);
  const accent = accentForCategory(category || displayName);
  const accentEye =
    accent === "gold"
      ? "text-kaboz-gold"
      : accent === "blue"
        ? "text-kaboz-orange"
        : accent === "green"
          ? "text-kaboz-green"
          : accent === "red"
            ? "text-kaboz-red"
            : "text-kaboz-purple";
  const accentBtn =
    accent === "gold"
      ? "bg-kaboz-gold text-kaboz-ink group-hover:bg-kaboz-gold-dark"
      : accent === "blue"
        ? "bg-kaboz-orange text-white group-hover:bg-kaboz-orange-dark"
        : accent === "green"
          ? "bg-kaboz-green text-white group-hover:bg-kaboz-green-dark"
          : accent === "red"
            ? "bg-kaboz-red text-white group-hover:bg-kaboz-red-dark"
            : "bg-kaboz-purple text-white group-hover:bg-kaboz-purple-dark";

  if (!visibleProducts.length) return null;

  return (
    <section className="w-full border-t border-kaboz-line bg-white py-8 sm:py-10">
      <div className="kb-container">
        {bannerSrc ? (
          <Link
            to={categoryLink}
            aria-label={`Shop ${displayName}`}
            className="group relative mb-6 block overflow-hidden rounded-[6px] border border-kaboz-line bg-kaboz-soft"
          >
            {/* Onsus-style landscape promo band */}
            <div className="relative aspect-[21/6] min-h-[120px] w-full sm:min-h-[140px] md:min-h-[160px]">
              <img
                src={bannerSrc}
                alt={displayName}
                className="kb-img-pop absolute inset-0 h-full w-full object-cover"
              />
              {!baked ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-center p-5 sm:p-8 md:p-10">
                    <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${accentEye}`}>
                      Shop the collection
                    </p>
                    <p className="mt-1 font-display text-xl font-bold text-white sm:text-2xl md:text-3xl">
                      {displayName}
                    </p>
                    <span className={`mt-3 inline-flex w-fit items-center rounded-[4px] px-3.5 py-2 text-[11px] font-bold uppercase tracking-wide transition ${accentBtn}`}>
                      Browse collection
                    </span>
                  </div>
                </>
              ) : null}
            </div>
          </Link>
        ) : null}

        <SectionHeader
          title={displayName}
          viewAllTo={categoryLink}
          icon="grid"
          accent={accent}
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5 md:gap-4">
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
      </div>
    </section>
  );
};

export default CategorySection;
