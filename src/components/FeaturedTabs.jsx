import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { getCategoryPath } from "../utils/categoryLinks";
import { pickProductsByIds } from "../utils/homepageProducts";
import { isInWishlist, toggleWishlistId } from "../utils/wishlist";
import {
  IconCart,
  IconCompare,
  IconEye,
  IconHeart,
} from "./ui/Icons";

const TABS = [
  { id: "feature", label: "Feature" },
  { id: "bestselling", label: "Best Selling" },
  { id: "onsale", label: "On Sale" },
];

const actionBtn =
  "flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#ececec] text-[#555] transition hover:bg-black hover:text-white";

const useProductHoverActions = (product) => {
  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (product?._id) setWishlisted(isInWishlist(String(product._id)));
  }, [product?._id]);

  const href = product ? `/product/${product.slug || product._id}` : "#";
  const needsColor = Array.isArray(product?.curtainTypes)
    ? product.curtainTypes.some((t) => (t.colors || []).length > 0)
    : false;

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return {
    href,
    wishlisted,
    handleQuickView: (e) => {
      stop(e);
      navigate(href);
    },
    handleWishlist: (e) => {
      stop(e);
      if (!product?._id) return;
      const { added } = toggleWishlistId(String(product._id));
      setWishlisted(added);
      toast[added ? "success" : "info"](
        added ? "Added to wishlist" : "Removed from wishlist"
      );
    },
    handleCompare: (e) => {
      stop(e);
      toast.info("Compare list coming soon");
    },
    handleAddToCart: (e) => {
      stop(e);
      if (!product?._id) return;
      if (needsColor) {
        navigate(href);
        return;
      }
      addToCart(product._id, { quantity: 1 });
      toast.success("Added to cart");
    },
  };
};

const HoverActions = ({
  wishlisted,
  onQuickView,
  onWishlist,
  onCompare,
  onAddToCart,
  className = "",
}) => (
  <div
    className={`flex max-h-0 items-center gap-1.5 overflow-hidden opacity-0 transition-all duration-200 group-hover/item:max-h-10 group-hover/item:opacity-100 group-focus-within/item:max-h-10 group-focus-within/item:opacity-100 ${className}`}
  >
    <button
      type="button"
      aria-label="Quick view"
      title="Quick view"
      onClick={onQuickView}
      className={actionBtn}
    >
      <IconEye className="h-3.5 w-3.5" />
    </button>
    <button
      type="button"
      aria-label="Wishlist"
      title="Wishlist"
      onClick={onWishlist}
      className={`${actionBtn} ${wishlisted ? "bg-kaboz-price/15 text-kaboz-price" : ""}`}
    >
      <IconHeart className="h-3.5 w-3.5" filled={wishlisted} />
    </button>
    <button
      type="button"
      aria-label="Compare"
      title="Compare"
      onClick={onCompare}
      className={actionBtn}
    >
      <IconCompare className="h-3.5 w-3.5" />
    </button>
    <button
      type="button"
      aria-label="Add to cart"
      title="Add to cart"
      onClick={onAddToCart}
      className={actionBtn}
    >
      <IconCart className="h-3.5 w-3.5" />
    </button>
  </div>
);

/** Compact horizontal row — Onsus side-column style + hover actions */
const CompactRow = ({ product, currency }) => {
  const {
    href,
    wishlisted,
    handleQuickView,
    handleWishlist,
    handleCompare,
    handleAddToCart,
  } = useProductHoverActions(product);

  if (!product) return null;

  const img = product.image?.[0];
  const onSale =
    product.originalPrice &&
    Number(product.originalPrice) > Number(product.price);

  return (
    <div className="group/item relative flex gap-3 border-b border-kaboz-line py-3.5 last:border-b-0">
      <Link
        to={href}
        className="h-[78px] w-[78px] flex-shrink-0 overflow-hidden rounded-[4px] bg-white"
      >
        {img ? (
          <img
            src={img}
            alt={product.name}
            className="kb-img-pop h-full w-full object-contain p-1"
            loading="lazy"
          />
        ) : null}
      </Link>
      <div className="min-w-0 flex-1 self-center">
        {product.category ? (
          <p className="text-[11px] leading-none text-kaboz-mute">
            {product.category}
          </p>
        ) : null}
        <Link
          to={href}
          className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-kaboz-orange transition group-hover/item:text-kaboz-price group-focus-within/item:text-kaboz-price"
        >
          {product.name}
        </Link>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm font-bold text-kaboz-price">
            {currency}
            {product.price}
          </span>
          {onSale ? (
            <span className="text-xs text-kaboz-faint line-through">
              {currency}
              {product.originalPrice}
            </span>
          ) : null}
        </div>
        <HoverActions
          className="mt-2"
          wishlisted={wishlisted}
          onQuickView={handleQuickView}
          onWishlist={handleWishlist}
          onCompare={handleCompare}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

/** Center featured card with vertical image thumbs (Onsus style) */
const FeaturedCenter = ({ product, currency }) => {
  const {
    href,
    wishlisted,
    handleQuickView,
    handleWishlist,
    handleCompare,
    handleAddToCart,
  } = useProductHoverActions(product);

  const images = useMemo(() => {
    const imgs = (product?.image || []).filter(Boolean);
    return imgs.length ? imgs : [];
  }, [product]);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setActiveImg(0);
  }, [product?._id]);

  if (!product) return null;

  const onSale =
    product.originalPrice &&
    Number(product.originalPrice) > Number(product.price);
  const saveAmount = onSale
    ? (Number(product.originalPrice) - Number(product.price)).toFixed(0)
    : null;
  const mainSrc = images[activeImg] || images[0];
  const thumbs = images.slice(0, 4);

  return (
    <div className="group/item relative flex h-full min-w-0 flex-col overflow-hidden rounded-[6px] border border-kaboz-line bg-white p-4 sm:p-5">
      {saveAmount ? (
        <span className="absolute left-4 top-4 z-[2] rounded-[4px] bg-kaboz-red px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Save {currency}
          {saveAmount}
        </span>
      ) : (
        <span className="absolute left-4 top-4 z-[2] rounded-[4px] bg-kaboz-orange px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Featured
        </span>
      )}

      {/* Image + vertical thumbs */}
      <div className="mt-4 flex h-[190px] gap-3 xl:h-[220px]">
        <Link
          to={href}
          className="relative flex h-full min-w-0 flex-1 items-center justify-center overflow-hidden bg-white"
        >
          {mainSrc ? (
            <img
              src={mainSrc}
              alt={product.name}
              className="kb-img-pop h-[170%] w-[170%] max-w-none flex-shrink-0 object-contain"
              loading="lazy"
            />
          ) : null}
        </Link>

        {thumbs.length > 1 ? (
          <div className="flex w-[64px] flex-shrink-0 flex-col gap-2 sm:w-[72px]">
            {thumbs.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActiveImg(i)}
                className={`flex aspect-square items-center justify-center overflow-hidden rounded-[4px] border bg-white p-1 transition ${
                  activeImg === i
                    ? "border-kaboz-orange ring-1 ring-kaboz-orange"
                    : "border-kaboz-line hover:border-kaboz-orange/50"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Title + price — Onsus style */}
      <div className="mt-4">
        {product.category ? (
          <p className="text-[12px] text-kaboz-mute">{product.category}</p>
        ) : null}
        <Link
          to={href}
          className="mt-1 block line-clamp-2 font-display text-lg font-semibold leading-snug text-kaboz-orange transition group-hover/item:text-kaboz-price group-focus-within/item:text-kaboz-price xl:text-xl"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-bold text-kaboz-price">
            {currency}
            {product.price}
          </span>
          {onSale ? (
            <span className="text-sm text-kaboz-faint line-through">
              {currency}
              {product.originalPrice}
            </span>
          ) : null}
        </div>
        <HoverActions
          className="mt-3"
          wishlisted={wishlisted}
          onQuickView={handleQuickView}
          onWishlist={handleWishlist}
          onCompare={handleCompare}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

/**
 * Onsus Feature / Best Selling / On Sale:
 * left 3 rows · center featured (+ thumbs) · right 3 rows
 */
const FeaturedTabs = ({
  featureIds = [],
  bestSellingIds = [],
  onSaleIds = [],
}) => {
  const { products, currency } = useContext(ShopContext);
  const [active, setActive] = useState("feature");

  const pools = useMemo(() => {
    const list = products || [];
    const onSale = list.filter(
      (p) =>
        p.originalPrice && Number(p.originalPrice) > Number(p.price || 0)
    );
    const bestsellers = list.filter((p) => p.bestseller);
    const featured = list.filter((p) => p.featured || p.bestseller);
    const curatedFeature = pickProductsByIds(list, featureIds, 12);
    const curatedBest = pickProductsByIds(list, bestSellingIds, 12);
    const curatedSale = pickProductsByIds(list, onSaleIds, 12);

    const fill = (preferred, fallback) => {
      const src = preferred.length
        ? preferred
        : fallback.length
          ? fallback
          : list;
      if (!src.length) return [];
      // Ensure up to 7 unique items for L/C/R layout
      const out = [];
      const seen = new Set();
      for (let i = 0; out.length < 7 && i < src.length * 2; i += 1) {
        const p = src[i % src.length];
        const id = String(p._id);
        if (seen.has(id)) continue;
        seen.add(id);
        out.push(p);
      }
      return out;
    };

    return {
      feature: fill(curatedFeature, featured),
      bestselling: fill(curatedBest, bestsellers),
      onsale: fill(curatedSale, onSale),
    };
  }, [products, featureIds, bestSellingIds, onSaleIds]);

  const items = pools[active] || [];

  // Onsus split: 3 left · 1 center · 3 right
  const left = items.slice(0, 3);
  const center = items[3] || items[0] || null;
  const right = items.slice(4, 7);

  if (!items.length) return null;

  return (
    <section className="w-full border-t border-kaboz-line bg-white py-8 sm:py-10">
      <div className="kb-container">
        <div className="mb-6 border-b border-kaboz-line">
          <ul
            className="flex gap-6 overflow-x-auto sm:gap-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
          >
            {TABS.map((tab) => {
              const isActive = active === tab.id;
              return (
                <li key={tab.id} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(tab.id)}
                    className={`relative whitespace-nowrap pb-3 text-lg font-semibold transition sm:text-xl md:text-[22px] ${
                      isActive
                        ? "text-kaboz-red"
                        : "text-kaboz-ink hover:text-kaboz-orange"
                    }`}
                  >
                    {tab.label}
                    {isActive ? (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-kaboz-red" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Desktop Onsus 3-column layout */}
        <div className="hidden items-center gap-8 lg:grid lg:grid-cols-[1fr_1.55fr_1fr] xl:gap-10">
          <div className="min-w-0 self-center">
            {left.map((p) => (
              <CompactRow key={p._id} product={p} currency={currency} />
            ))}
          </div>

          <FeaturedCenter product={center} currency={currency} />

          <div className="min-w-0 self-center">
            {right.map((p) => (
              <CompactRow key={p._id} product={p} currency={currency} />
            ))}
          </div>
        </div>

        {/* Mobile / tablet */}
        <div className="lg:hidden">
          {center ? (
            <div className="mb-5">
              <FeaturedCenter product={center} currency={currency} />
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {items
              .filter((p) => String(p._id) !== String(center?._id))
              .slice(0, 6)
              .map((item) => (
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

        <div className="mt-7 text-center">
          <Link
            to={
              active === "onsale"
                ? "/collection?sort=sale"
                : center?.category
                  ? getCategoryPath(center.category)
                  : "/collection"
            }
            className="inline-flex text-sm font-bold text-kaboz-orange hover:underline"
          >
            View all products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTabs;
