import React, { useContext, useEffect, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDiscountPercent } from "../utils/pricing";
import {
  isInWishlist,
  toggleWishlistId,
  WISHLIST_EVENT,
} from "../utils/wishlist";
import { IconClose } from "./ui/Icons";
import PriceText from "./ui/PriceText";

/** Flatten curtainTypes → unique color swatches for card UI */
const collectColorSwatches = (curtainTypes = []) => {
  const seen = new Set();
  const swatches = [];
  for (const type of curtainTypes) {
    for (const color of type.colors || []) {
      if (!color?.code || seen.has(color.code)) continue;
      seen.add(color.code);
      swatches.push({
        code: color.code,
        image: color.image || type.thumbnail || "",
      });
    }
  }
  return swatches;
};

const averageReviewRating = (reviews = []) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return null;
  const scored = reviews
    .map((r) => Number(r?.rating))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (scored.length === 0) return null;
  return scored.reduce((sum, n) => sum + n, 0) / scored.length;
};

const ProductItem = ({
  id,
  slug,
  image,
  name,
  price,
  originalPrice,
  date,
  compact = false,
  curtainTypes = [],
  category = "",
  sku = "",
  brand = "",
  modelName = "",
  reviews = [],
  hideDiscountBadge = false,
}) => {
  const { currency, addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const discountPercent = getDiscountPercent(price, originalPrice);
  const colorSwatches = useMemo(
    () => collectColorSwatches(curtainTypes),
    [curtainTypes]
  );
  const [previewImage, setPreviewImage] = useState(null);
  const [activeColor, setActiveColor] = useState(null);
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const primaryImage = image?.[0] || "";
  const secondaryImage = image?.[1] || "";
  const displayImage = previewImage || primaryImage;
  const needsColor = colorSwatches.length > 0;
  // Only real product brand / model fields (not category fallbacks)
  const brandLabel = (brand || "").trim();
  const modelLabel = (modelName || "").trim();
  const showSecondaryOnHover =
    !previewImage && Boolean(primaryImage && secondaryImage);

  useEffect(() => {
    if (!id) return;
    const sync = () => setWishlisted(isInWishlist(id));
    sync();
    window.addEventListener(WISHLIST_EVENT, sync);
    return () => window.removeEventListener(WISHLIST_EVENT, sync);
  }, [id]);

  const isNew = useMemo(() => {
    if (!date) return false;
    const ts = Number(date);
    if (!Number.isFinite(ts) || ts <= 0) return false;
    const ageMs = Date.now() - ts;
    return ageMs >= 0 && ageMs < 1000 * 60 * 60 * 24 * 45;
  }, [date]);

  const ratingAvg = useMemo(() => averageReviewRating(reviews), [reviews]);
  const reviewCount = Array.isArray(reviews) ? reviews.length : 0;

  const visibleSwatches = colorSwatches.slice(0, 6);
  const extraColors = Math.max(0, colorSwatches.length - visibleSwatches.length);

  const handleAddToCart = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (!id) {
      navigate(`/product/${slug}`);
      return;
    }

    if (needsColor && !activeColor) {
      setQuickViewOpen(false);
      navigate(`/product/${slug}`);
      return;
    }

    setAdding(true);
    const swatch = colorSwatches.find((c) => c.code === activeColor);
    addToCart(id, {
      color: activeColor || "",
      colorImage: swatch?.image || "",
      quantity: 1,
    });
    toast.success(activeColor ? `Added (${activeColor})` : "Added to cart");
    setTimeout(() => setAdding(false), 600);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;

    const { added } = toggleWishlistId(id);
    setWishlisted(added);
    toast[added ? "success" : "info"](
      added ? "Added to wishlist" : "Removed from wishlist"
    );
  };

  const openQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info("Compare list coming soon");
  };

  const actionBtnClass =
    "relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-kaboz-ink shadow-md transition-colors duration-200 hover:bg-black hover:text-white";

  const ActionIcon = ({ label, onClick, className = "", children }) => (
    <div className="group/tip relative">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={`${actionBtnClass} ${className}`}
      >
        {children}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-full top-1/2 z-10 mr-2 -translate-y-1/2 whitespace-nowrap rounded bg-[#1a1a1a] px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity duration-200 group-hover/tip:opacity-100"
      >
        {label}
        <span
          aria-hidden
          className="absolute left-full top-1/2 -ml-px -translate-y-1/2 border-4 border-transparent border-l-[#1a1a1a]"
        />
      </span>
    </div>
  );

  return (
    <>
      <div className="group relative flex h-full flex-col bg-transparent">
        {/* Outer shell stays overflow-visible so tooltips + floating ATC aren't clipped */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-[6px] border border-[#eee] bg-white">
            <Link to={`/product/${slug}`} className="absolute inset-0 z-0 block">
              {displayImage ? (
                <>
                  <img
                    src={displayImage}
                    alt={name}
                    className={`kb-img-pop h-full w-full object-contain transition-opacity duration-500 ${
                      showSecondaryOnHover
                        ? "opacity-100 group-hover:opacity-0"
                        : ""
                    } ${compact ? "p-3" : "p-4 sm:p-5"}`}
                    loading="lazy"
                  />
                  {showSecondaryOnHover ? (
                    <img
                      src={secondaryImage}
                      alt=""
                      aria-hidden
                      className={`kb-img-pop absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${
                        compact ? "p-3" : "p-4 sm:p-5"
                      }`}
                      loading="lazy"
                    />
                  ) : null}
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-kaboz-mute">
                  No image
                </div>
              )}
            </Link>

            {/* Soft vignette on card hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            {!hideDiscountBadge && (discountPercent ? (
              <span className="absolute left-2.5 top-2.5 z-[2] flex h-11 w-11 flex-col items-center justify-center rounded-full bg-kaboz-sale text-center leading-none text-white shadow-sm">
                <span className="text-[8px] font-bold uppercase tracking-wide">
                  Sale
                </span>
                <span className="text-[11px] font-extrabold">
                  {discountPercent}%
                </span>
              </span>
            ) : isNew ? (
              <span className="absolute left-2.5 top-2.5 z-[2] rounded-sm bg-kaboz-gold px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-kaboz-ink">
                New Arrival
              </span>
            ) : null)}
          </div>

          {/* Right-side action icons + left tooltips */}
          <div className="pointer-events-none absolute right-2.5 top-2.5 z-[3] flex translate-x-2 flex-col gap-2 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100">
            <ActionIcon label="Quick View" onClick={openQuickView}>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </ActionIcon>
            <ActionIcon
              label="Wishlist"
              onClick={toggleWishlist}
              className={wishlisted ? "text-kaboz-red" : ""}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill={wishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
            </ActionIcon>
            <ActionIcon label="Compare" onClick={handleCompare}>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M16 3h5v5" />
                <path d="M8 21H3v-5" />
                <path d="M21 3l-7 7" />
                <path d="M3 21l7-7" />
              </svg>
            </ActionIcon>
          </div>

          {/* Floating centered Add to Cart — sits just above image bottom edge */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className="pointer-events-none absolute bottom-3 left-1/2 z-[3] flex w-[85%] -translate-x-1/2 translate-y-2 items-center justify-center gap-2 rounded-lg bg-kaboz-orange px-3 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white opacity-0 shadow-md transition-all duration-300 hover:bg-kaboz-orange-dark disabled:opacity-80 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 sm:text-[13px]"
          >
            {adding ? (
              "Added"
            ) : needsColor && !activeColor ? (
              "Select options"
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6" />
                  <circle cx="10" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
                Add to cart
              </>
            )}
          </button>
        </div>

        <div
          className={`flex flex-1 flex-col bg-transparent ${
            compact ? "pt-2.5" : "pt-3"
          }`}
        >
          {brandLabel ? (
            <p className="mb-0.5 text-[11px] text-[#999]">
              {brandLabel}
            </p>
          ) : category ? (
            <p className="mb-0.5 text-[11px] text-[#999]">{category}</p>
          ) : null}

          <Link to={`/product/${slug}`}>
            <h3
              className={`font-semibold leading-snug text-kaboz-ink transition hover:text-kaboz-orange ${
                compact
                  ? "line-clamp-2 min-h-[2.5em] text-[13px]"
                  : "line-clamp-2 min-h-[2.7em] text-[14px]"
              }`}
            >
              {name}
            </h3>
          </Link>

          {ratingAvg !== null ? (
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="flex items-center gap-0.5" aria-label={`${ratingAvg.toFixed(1)} out of 5`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    viewBox="0 0 20 20"
                    className={`h-3 w-3 ${
                      star <= Math.round(ratingAvg)
                        ? "text-[#f5a623]"
                        : "text-[#e0e0e0]"
                    }`}
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M10 1.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 13.8 5.2 16.4l.9-5.4L2.2 7.2l5.4-.8L10 1.5z" />
                  </svg>
                ))}
              </div>
              {reviewCount > 0 ? (
                <span className="text-[11px] text-[#999]">({reviewCount})</span>
              ) : null}
            </div>
          ) : null}

          {visibleSwatches.length > 0 ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {visibleSwatches.map((swatch) => (
                <button
                  key={swatch.code}
                  type="button"
                  title={swatch.code}
                  aria-label={`Color ${swatch.code}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveColor(swatch.code);
                    if (swatch.image) setPreviewImage(swatch.image);
                  }}
                  className={`h-5 w-5 overflow-hidden rounded-full border transition ${
                    activeColor === swatch.code
                      ? "border-kaboz-purple ring-1 ring-kaboz-purple/40"
                      : "border-[#e5e5e5] hover:border-kaboz-purple"
                  }`}
                >
                  {swatch.image ? (
                    <img
                      src={swatch.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="block h-full w-full bg-[#e8e8e8]" />
                  )}
                </button>
              ))}
              {extraColors > 0 ? (
                <Link
                  to={`/product/${slug}`}
                  className="text-[10px] font-bold text-[#999]"
                >
                  +{extraColors}
                </Link>
              ) : null}
            </div>
          ) : null}

          <Link
            to={`/product/${slug}`}
            className="mt-auto flex items-baseline gap-2 pt-2.5"
          >
            <p className="text-[18px] font-bold tracking-tight text-kaboz-price sm:text-[20px]">
              <PriceText currency={currency} amount={price} />
            </p>
            {discountPercent ? (
              <p className="text-xs text-kaboz-faint line-through sm:text-sm">
                <PriceText currency={currency} amount={originalPrice} />
              </p>
            ) : null}
          </Link>
        </div>
      </div>

      {/* Quick view modal */}
      {quickViewOpen ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setQuickViewOpen(false)}
        >
          <div
            className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:grid-cols-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setQuickViewOpen(false)}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-kaboz-ink shadow"
              aria-label="Close quick view"
            >
              <IconClose className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center bg-[#ebe6df] p-6">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={name}
                  className="max-h-72 w-full object-contain"
                />
              ) : null}
            </div>

            <div className="flex flex-col p-5 sm:p-6">
              {brandLabel ? (
                <p className="text-[11px] font-bold uppercase tracking-wide text-kaboz-orange">
                  {brandLabel}
                </p>
              ) : null}
              <h3 className="mt-1 font-display text-lg font-bold leading-snug text-kaboz-ink sm:text-xl">
                {name}
              </h3>
              {modelLabel ? (
                <p className="mt-2 text-sm text-kaboz-mute">
                  Model:{" "}
                  <span className="font-semibold text-kaboz-ink">{modelLabel}</span>
                </p>
              ) : null}
              {sku ? (
                <p className="mt-1 text-sm text-kaboz-mute">
                  SKU:{" "}
                  <span className="font-semibold text-kaboz-ink">{sku}</span>
                </p>
              ) : null}

              <p className="mt-4 font-display text-2xl font-bold text-kaboz-price">
                <PriceText currency={currency} amount={price} />
                {discountPercent ? (
                  <span className="ml-2 text-base font-normal text-kaboz-mute line-through">
                    <PriceText currency={currency} amount={originalPrice} />
                  </span>
                ) : null}
              </p>

              <div className="mt-auto flex flex-col gap-2 pt-6">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="rounded-lg bg-kaboz-green py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-kaboz-green-dark"
                >
                  {needsColor && !activeColor ? "Select options" : "Add to cart"}
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={toggleWishlist}
                    className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold ${
                      wishlisted
                        ? "border-kaboz-red text-kaboz-red"
                        : "border-kaboz-line text-kaboz-ink hover:border-kaboz-red hover:text-kaboz-red"
                    }`}
                  >
                    {wishlisted ? "Wishlisted" : "Wishlist"}
                  </button>
                  <Link
                    to={`/product/${slug}`}
                    onClick={() => setQuickViewOpen(false)}
                    className="flex flex-1 items-center justify-center rounded-lg border border-kaboz-line py-2.5 text-sm font-semibold text-kaboz-ink hover:border-kaboz-orange hover:text-kaboz-orange"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ProductItem;
