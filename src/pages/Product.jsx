import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import { ShopContext } from "../context/ShopContext";
import RelatedProducts from "../components/RelatedProducts";
import RecentlyViewed from "../components/RecentlyViewed";
import CurtainDetails from "../components/CurtainDetails";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getDiscountPercent } from "../utils/pricing";
import {
  getCategoryPath,
  getCategoryDisplayName,
  getLivingShopPath,
  isLivingCategory,
  isSecurityCategory,
  LIVING_HUB_PATH,
  SECURITY_HUB_PATH,
} from "../utils/categoryLinks";
import Breadcrumbs from "../components/Breadcrumbs";
import { toast } from "react-toastify";
import {
  isInWishlist,
  toggleWishlistId,
  WISHLIST_EVENT,
} from "../utils/wishlist";
import { trackRecentlyViewed } from "../utils/recentlyViewed";
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconClose,
} from "../components/ui/Icons";

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const WHATSAPP_NUMBER = "971552693100";

const averageReviewRating = (reviews = []) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return null;
  const scored = reviews
    .map((r) => Number(r?.rating))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (scored.length === 0) return null;
  return scored.reduce((sum, n) => sum + n, 0) / scored.length;
};

/** All unique color swatches across designs */
const collectAllColors = (curtainTypes = []) => {
  const seen = new Set();
  const list = [];
  for (const type of curtainTypes) {
    for (const color of type.colors || []) {
      if (!color?.code || seen.has(color.code)) continue;
      seen.add(color.code);
      list.push({
        code: color.code,
        image: color.image || type.thumbnail || "",
        typeName: type.name,
      });
    }
  }
  return list;
};

const StarRow = ({ rating, size = "h-3.5 w-3.5" }) => (
  <div className="flex items-center gap-0.5" aria-hidden>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        viewBox="0 0 20 20"
        className={`${size} ${
          star <= Math.round(rating) ? "text-kaboz-star" : "text-[#e0e0e0]"
        }`}
        fill="currentColor"
      >
        <path d="M10 1.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 13.8 5.2 16.4l.9-5.4L2.2 7.2l5.4-.8L10 1.5z" />
      </svg>
    ))}
  </div>
);

const Product = () => {
  const { slug } = useParams();
  const { products, currency, addToCart, productsLoading } =
    useContext(ShopContext);
  const navigate = useNavigate();
  const buyBoxRef = useRef(null);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const item = products.find((p) => p.slug === slug);
    if (item) {
      setProductData(item);
      setImage(item.image?.[0] || "");
      setQuantity(1);
      setSelectedType(null);
      setSelectedColor(null);
      setActiveTab("description");
      setWishlisted(isInWishlist(item._id));
      trackRecentlyViewed(item._id);
    } else if (!productsLoading && products.length > 0) {
      setProductData(null);
    }
  }, [slug, products, productsLoading]);

  useEffect(() => {
    if (!productData?._id) return;
    const sync = () => setWishlisted(isInWishlist(productData._id));
    window.addEventListener(WISHLIST_EVENT, sync);
    return () => window.removeEventListener(WISHLIST_EVENT, sync);
  }, [productData?._id]);

  useEffect(() => {
    const onScroll = () => {
      const el = buyBoxRef.current;
      if (!el) {
        setShowSticky(window.scrollY > 420);
        return;
      }
      const bottom = el.getBoundingClientRect().bottom;
      setShowSticky(bottom < 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [productData?._id]);

  const allColors = useMemo(
    () => collectAllColors(productData?.curtainTypes || []),
    [productData]
  );

  const colorsForSelectedType = useMemo(() => {
    if (!selectedType) return allColors;
    return (selectedType.colors || []).map((c) => ({
      code: c.code,
      image: c.image || selectedType.thumbnail || "",
      typeName: selectedType.name,
    }));
  }, [selectedType, allColors]);

  /** Gallery: product photos only (colors are selected on the right) */
  const galleryImages = useMemo(() => {
    if (!productData) return [];
    return (productData.image || [])
      .filter(Boolean)
      .map((src, i) => ({ src, label: `Photo ${i + 1}` }));
  }, [productData]);

  const galleryIndex = useMemo(() => {
    const idx = galleryImages.findIndex((g) => g.src === image);
    return idx >= 0 ? idx : 0;
  }, [galleryImages, image]);

  const stepGallery = (dir) => {
    if (galleryImages.length < 2) return;
    const next =
      (galleryIndex + dir + galleryImages.length) % galleryImages.length;
    setImage(galleryImages[next].src);
  };

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") {
        if (galleryImages.length < 2) return;
        const idx = galleryImages.findIndex((g) => g.src === image);
        const current = idx >= 0 ? idx : 0;
        const next = (current + 1) % galleryImages.length;
        setImage(galleryImages[next].src);
      }
      if (e.key === "ArrowLeft") {
        if (galleryImages.length < 2) return;
        const idx = galleryImages.findIndex((g) => g.src === image);
        const current = idx >= 0 ? idx : 0;
        const next =
          (current - 1 + galleryImages.length) % galleryImages.length;
        setImage(galleryImages[next].src);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, galleryImages, image]);

  const ratingAvg = useMemo(
    () => averageReviewRating(productData?.reviews),
    [productData]
  );
  const reviewCount = productData?.reviews?.length || 0;

  if (!productData) {
    return (
      <div className="py-20 text-center text-sm text-kaboz-mute">
        {productsLoading ? "Loading product…" : "Product not found."}
      </div>
    );
  }

  const shortDescriptionLines = productData.shortDescription
    ? productData.shortDescription
        .split("\n")
        .filter((line) => line.trim() !== "")
    : [];

  const isLiving = isLivingCategory(productData.category);
  const isSecurity = isSecurityCategory(productData.category);
  const hasFabricOptions =
    Array.isArray(productData.curtainTypes) &&
    productData.curtainTypes.length > 0;
  const discountPercent = getDiscountPercent(
    productData.price,
    productData.originalPrice
  );
  const hasPrice = Number(productData.price) > 0;
  const brandLabel = (productData.brand || "").trim();
  const modelLabel = (productData.modelName || "").trim();
  const skuLabel = selectedColor || (productData.sku || "").trim();

  const additionalRows = [
    brandLabel ? ["Brand", brandLabel] : null,
    modelLabel ? ["Model", modelLabel] : null,
    productData.sku ? ["SKU", productData.sku] : null,
    productData.category
      ? ["Category", getCategoryDisplayName(productData.category)]
      : null,
    productData.subCategory
      ? ["Subcategory", productData.subCategory]
      : null,
  ].filter(Boolean);

  const whatsappMessage = [
    `Hi, I'm interested in "${productData.name}".`,
    selectedType ? `Design: ${selectedType.name}.` : "",
    selectedColor ? `Color: ${selectedColor}.` : "",
    "Can you help me with more details?",
  ]
    .filter(Boolean)
    .join(" ");

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const handleAddToCart = (goToCart = false) => {
    if (allColors.length > 0 && !selectedColor) {
      toast.error("Please select a color before adding to cart");
      return;
    }

    setAdding(true);
    const selectedSwatch = allColors.find((c) => c.code === selectedColor);
    addToCart(productData._id, {
      color: selectedColor || "",
      design: selectedType?.name || selectedSwatch?.typeName || "",
      colorImage: selectedSwatch?.image || "",
      quantity,
      skipDrawer: goToCart,
    });
    toast.success("Added to cart");
    setTimeout(() => {
      setAdding(false);
      if (goToCart) {
        navigate("/cart");
      }
    }, 250);
  };

  const handleWishlist = () => {
    const { added } = toggleWishlistId(productData._id);
    setWishlisted(added);
    toast[added ? "success" : "info"](
      added ? "Added to wishlist" : "Removed from wishlist"
    );
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setSelectedColor(null);
    if (type?.thumbnail) setImage(type.thumbnail);
  };

  const handleColorSelect = (swatch) => {
    setSelectedColor(swatch.code);
    if (swatch.image) setImage(swatch.image);
    if (swatch.typeName) {
      const match = (productData.curtainTypes || []).find(
        (t) => t.name === swatch.typeName
      );
      if (match) setSelectedType(match);
    }
  };

  return (
    <div className={`pb-6 ${showSticky ? "pb-28 md:pb-24" : ""}`}>
      <Helmet>
        <title>{productData.metaTitle || productData.name}</title>
        <meta
          name="description"
          content={
            productData.metaDescription || stripHtml(productData.description)
          }
        />
        {productData.metaKeywords && (
          <meta name="keywords" content={productData.metaKeywords} />
        )}
      </Helmet>

      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          ...(isLiving
            ? [
                { label: "Kaboz Living", to: LIVING_HUB_PATH },
                {
                  label: productData.category,
                  to: getLivingShopPath(productData.category),
                },
              ]
            : isSecurity
              ? [
                  {
                    label: getCategoryDisplayName(productData.category),
                    to: SECURITY_HUB_PATH,
                  },
                ]
              : [
                  { label: "Shop", to: "/collection" },
                  {
                    label: getCategoryDisplayName(productData.category),
                    to: getCategoryPath(productData.category),
                  },
                ]),
          { label: productData.name },
        ]}
      />

      {/* Onsus single: equal gallery + summary columns */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
        {/* Gallery */}
        <div className="flex flex-col gap-3 sm:flex-row lg:sticky lg:top-28 lg:self-start">
          {galleryImages.length > 1 ? (
            <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:max-h-[560px] sm:w-[72px] sm:flex-col sm:overflow-y-auto sm:pb-0">
              {galleryImages.map((item) => (
                <button
                  key={item.src}
                  type="button"
                  title={item.label}
                  onClick={() => setImage(item.src)}
                  className={`h-[68px] w-[68px] flex-shrink-0 overflow-hidden rounded-[6px] border bg-white transition sm:h-16 sm:w-16 ${
                    image === item.src
                      ? "border-kaboz-purple ring-1 ring-kaboz-purple"
                      : "border-kaboz-line hover:border-kaboz-purple/50"
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    className="h-full w-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className="order-1 relative flex aspect-square w-full max-w-[560px] items-center justify-center self-start overflow-hidden rounded-[6px] border border-kaboz-line bg-white sm:order-2 sm:flex-1">
            {discountPercent ? (
              <span className="absolute left-3 top-3 z-[1] flex h-12 w-12 flex-col items-center justify-center rounded-full bg-kaboz-sale text-center leading-none text-white shadow-sm">
                <span className="text-[8px] font-bold uppercase tracking-wide">
                  Sale
                </span>
                <span className="text-[12px] font-extrabold">
                  {discountPercent}%
                </span>
              </span>
            ) : null}

            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="group relative flex h-full w-full items-center justify-center overflow-hidden"
              aria-label="Zoom product image"
            >
              {image ? (
                <img
                  src={image}
                  alt={productData.name}
                  className="kb-img-pop h-full w-full scale-110 object-contain mix-blend-multiply"
                />
              ) : (
                <span className="py-24 text-sm text-kaboz-mute">No image</span>
              )}
              <span className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-kaboz-ink shadow-sm opacity-0 transition group-hover:opacity-100">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3-3M11 8v6M8 11h6" />
                </svg>
              </span>
            </button>

            {galleryImages.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => stepGallery(-1)}
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-kaboz-line bg-white/95 text-kaboz-ink shadow-sm transition hover:border-kaboz-purple hover:text-kaboz-purple"
                >
                  <IconChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => stepGallery(1)}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-kaboz-line bg-white/95 text-kaboz-ink shadow-sm transition hover:border-kaboz-purple hover:text-kaboz-purple"
                >
                  <IconChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* Buy box — Onsus product-info list */}
        <div ref={buyBoxRef}>
          {productData.category ? (
            <p className="text-sm text-kaboz-mute">
              Categories:{" "}
              <Link
                to={
                  isLiving
                    ? getLivingShopPath(productData.category)
                    : getCategoryPath(productData.category)
                }
                className="font-medium text-kaboz-ink transition hover:text-kaboz-purple"
              >
                {getCategoryDisplayName(productData.category)}
              </Link>
              {productData.subCategory ? (
                <>
                  {", "}
                  <span className="font-medium text-kaboz-ink">
                    {productData.subCategory}
                  </span>
                </>
              ) : null}
            </p>
          ) : null}

          <h1 className="mt-2 text-[22px] font-semibold leading-snug text-kaboz-ink sm:text-[26px]">
            {productData.name}
          </h1>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-kaboz-mute">
            {ratingAvg !== null ? (
              <span className="inline-flex items-center gap-1.5">
                <StarRow rating={ratingAvg} />
                <button
                  type="button"
                  onClick={() => setActiveTab("reviews")}
                  className="hover:text-kaboz-purple"
                >
                  Reviews ({reviewCount.toLocaleString()})
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className="hover:text-kaboz-purple"
              >
                Reviews ({reviewCount})
              </button>
            )}
            <span className="hidden text-kaboz-line sm:inline" aria-hidden>
              |
            </span>
            <Link
              to={
                isLiving
                  ? getLivingShopPath(productData.category)
                  : getCategoryPath(productData.category)
              }
              className="font-medium text-kaboz-orange hover:underline"
            >
              View shop
            </Link>
          </div>

          {hasPrice ? (
            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <p className="text-[28px] font-semibold leading-none text-kaboz-price sm:text-[32px]">
                {currency}
                {productData.price}
              </p>
              {discountPercent ? (
                <p className="text-base text-kaboz-faint line-through">
                  {currency}
                  {productData.originalPrice}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm font-semibold text-kaboz-mute">
              Price on request — chat with us for a quote
            </p>
          )}

          {/* Specs strip — Onsus product attributes */}
          {(brandLabel || modelLabel || skuLabel || productData.category) && (
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 border-y border-kaboz-line py-4 text-sm">
              {brandLabel ? (
                <div>
                  <dt className="text-kaboz-mute">Brand</dt>
                  <dd className="mt-0.5 font-semibold text-kaboz-ink">
                    {brandLabel}
                  </dd>
                </div>
              ) : null}
              {modelLabel ? (
                <div>
                  <dt className="text-kaboz-mute">Model</dt>
                  <dd className="mt-0.5 font-semibold text-kaboz-ink">
                    {modelLabel}
                  </dd>
                </div>
              ) : null}
              {skuLabel ? (
                <div>
                  <dt className="text-kaboz-mute">SKU</dt>
                  <dd className="mt-0.5 font-semibold text-kaboz-ink">
                    {skuLabel}
                  </dd>
                </div>
              ) : null}
              {productData.category ? (
                <div>
                  <dt className="text-kaboz-mute">Category</dt>
                  <dd className="mt-0.5 font-semibold text-kaboz-ink">
                    {getCategoryDisplayName(productData.category)}
                  </dd>
                </div>
              ) : null}
            </dl>
          )}

          {shortDescriptionLines.length > 0 ? (
            <div className="mt-5">
              <p className="text-sm font-semibold text-kaboz-ink">
                About this item
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-kaboz-mute">
                {shortDescriptionLines.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
            <IconCheck className="h-4 w-4" />
            Free shipping across the UAE
          </p>

          {/* Design + color variants */}
          {hasFabricOptions ? (
            <div className="mt-6 space-y-5 border-t border-kaboz-line pt-5">
              {(productData.curtainTypes || []).length > 1 ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-kaboz-mute">
                    Design
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {productData.curtainTypes.map((type) => (
                      <button
                        key={type.name}
                        type="button"
                        onClick={() => handleTypeSelect(type)}
                        className={`flex items-center gap-2 rounded-[6px] border px-2.5 py-1.5 text-xs font-semibold transition ${
                          selectedType?.name === type.name
                            ? "border-kaboz-purple bg-kaboz-purple-soft text-kaboz-purple"
                            : "border-kaboz-line bg-white text-kaboz-ink hover:border-kaboz-purple/50"
                        }`}
                      >
                        {type.thumbnail ? (
                          <img
                            src={type.thumbnail}
                            alt=""
                            className="h-7 w-7 rounded object-cover"
                          />
                        ) : null}
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-kaboz-mute">
                    Color
                    {selectedColor ? (
                      <span className="ml-2 font-semibold normal-case tracking-normal text-kaboz-ink">
                        — {selectedColor}
                      </span>
                    ) : null}
                  </p>
                  <span className="text-xs text-kaboz-mute">
                    {allColors.length} colors available
                  </span>
                </div>

                <div className="mt-3 grid max-h-56 grid-cols-5 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 md:grid-cols-7">
                  {(selectedType ? colorsForSelectedType : allColors).map(
                    (swatch) => (
                      <button
                        key={`${swatch.typeName}-${swatch.code}`}
                        type="button"
                        title={swatch.code}
                        onClick={() => handleColorSelect(swatch)}
                        className="group flex flex-col items-center gap-1"
                      >
                        <span
                          className={`aspect-square w-full overflow-hidden rounded-[6px] border-2 bg-kaboz-soft transition ${
                            selectedColor === swatch.code
                              ? "border-kaboz-purple ring-1 ring-kaboz-purple/30"
                              : "border-transparent group-hover:border-kaboz-purple/40"
                          }`}
                        >
                          {swatch.image ? (
                            <img
                              src={swatch.image}
                              alt={swatch.code}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="block h-full w-full bg-[#d5cfc6]" />
                          )}
                        </span>
                        <span
                          className={`max-w-full truncate text-[10px] ${
                            selectedColor === swatch.code
                              ? "font-bold text-kaboz-ink"
                              : "text-kaboz-mute"
                          }`}
                        >
                          {swatch.code}
                        </span>
                      </button>
                    )
                  )}
                </div>

                {selectedType &&
                allColors.length > colorsForSelectedType.length ? (
                  <button
                    type="button"
                    onClick={() => setSelectedType(null)}
                    className="mt-2 text-xs font-bold text-kaboz-orange hover:underline"
                  >
                    Show all {allColors.length} colors
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* Qty */}
          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-kaboz-ink">Quantity</p>
            <div className="inline-flex items-center overflow-hidden rounded-[6px] border border-kaboz-line">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-11 w-10 text-lg font-semibold text-kaboz-ink hover:bg-kaboz-soft"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="flex h-11 w-12 items-center justify-center border-x border-kaboz-line text-sm font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="h-11 w-10 text-lg font-semibold text-kaboz-ink hover:bg-kaboz-soft"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart + Buy now — Onsus dual CTAs */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleAddToCart(false)}
              disabled={adding}
              className="flex h-12 flex-1 items-center justify-center rounded-[6px] bg-kaboz-orange px-6 text-sm font-bold text-white transition hover:bg-kaboz-orange-dark disabled:opacity-80 sm:min-w-[160px] sm:flex-none"
            >
              {adding ? "Adding…" : "Add to cart"}
            </button>
            <button
              type="button"
              onClick={() => {
                handleAddToCart(true);
              }}
              disabled={adding}
              className="flex h-12 flex-1 items-center justify-center rounded-[6px] border-2 border-kaboz-ink bg-white px-6 text-sm font-bold text-kaboz-ink transition hover:bg-kaboz-ink hover:text-white disabled:opacity-80 sm:min-w-[140px] sm:flex-none"
            >
              Buy now
            </button>
            <button
              type="button"
              onClick={handleWishlist}
              title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              className={`flex h-12 w-12 items-center justify-center rounded-[6px] border transition ${
                wishlisted
                  ? "border-kaboz-red bg-kaboz-red-soft text-kaboz-red"
                  : "border-kaboz-line bg-white text-kaboz-ink hover:border-kaboz-red hover:text-kaboz-red"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill={wishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
            </button>
          </div>

          {isLiving ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-[6px] border border-emerald-600 bg-white px-6 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 sm:w-auto"
            >
              Chat on WhatsApp
            </a>
          ) : null}

          <div className="mt-6 space-y-2 border-t border-kaboz-line pt-4 text-sm text-kaboz-mute">
            <p>
              <span className="font-semibold text-kaboz-ink">Details</span>
            </p>
            <p>
              <span className="font-medium text-kaboz-ink">Return policy:</span>{" "}
              Eligible for Return, Refund or Replacement within 7 days of
              receipt
            </p>
            <p>
              <span className="font-medium text-kaboz-ink">Support:</span> Free
              UAE customer support included
            </p>
          </div>
        </div>
      </div>

      {isLiving && hasFabricOptions ? (
        <CurtainDetails productName={productData.name} />
      ) : null}

      {/* Tabs — Onsus-style organized detail sections */}
      <div className="mt-10 sm:mt-12">
        <div className="flex gap-1 overflow-x-auto border-b border-kaboz-line">
          {[
            ["description", "Description"],
            ["additional", "Product information"],
            ["reviews", `Reviews (${reviewCount})`],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex-shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                activeTab === id
                  ? "border-kaboz-orange text-kaboz-orange"
                  : "border-transparent text-kaboz-mute hover:text-kaboz-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "description" ? (
          <div
            className="rich-content prose prose-sm mt-5 max-w-none rounded-[6px] border border-kaboz-line bg-white px-4 py-5 text-kaboz-ink sm:px-6"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                productData.description || "<p>No description available.</p>"
              ),
            }}
          />
        ) : null}

        {activeTab === "additional" ? (
          <div className="mt-5 overflow-hidden rounded-[6px] border border-kaboz-line">
            {additionalRows.length > 0 ? (
              <table className="w-full text-sm">
                <tbody>
                  {additionalRows.map(([label, value]) => (
                    <tr
                      key={label}
                      className="border-b border-kaboz-line last:border-0"
                    >
                      <th className="w-[38%] bg-[#fafafa] px-4 py-3 text-left font-semibold text-kaboz-ink sm:w-48">
                        {label}
                      </th>
                      <td className="px-4 py-3 text-kaboz-mute">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="px-4 py-8 text-center text-sm text-kaboz-mute">
                No additional information for this product.
              </p>
            )}
          </div>
        ) : null}

        {activeTab === "reviews" ? (
          <div className="mt-5 rounded-[6px] border border-kaboz-line p-4 sm:p-6">
            {reviewCount > 0 ? (
              productData.reviews.map((review, index) => {
                const r = Number(review?.rating);
                const hasRating = Number.isFinite(r) && r > 0;
                return (
                  <div
                    key={index}
                    className="border-b border-kaboz-line py-4 last:border-0"
                  >
                    <p className="font-semibold text-kaboz-ink">
                      {review.name || "Customer"}
                    </p>
                    {hasRating ? (
                      <div className="mt-1">
                        <StarRow rating={r} />
                      </div>
                    ) : null}
                    {review.text ? (
                      <p className="mt-2 text-sm text-kaboz-mute">
                        {review.text}
                      </p>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-kaboz-mute">No reviews yet.</p>
            )}
          </div>
        ) : null}
      </div>

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
        currentProductSlug={productData.slug || slug}
        currentProductId={productData._id}
      />

      <RecentlyViewed
        excludeId={productData._id}
        excludeSlug={productData.slug || slug}
      />

      {/* Sticky add-to-cart — appears after buy box leaves viewport */}
      {showSticky ? (
        <div className="fixed inset-x-0 bottom-[3.75rem] z-[80] border-t border-kaboz-line bg-white/95 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:bottom-0">
          <div className="kb-container flex items-center justify-between gap-3 py-2.5 sm:py-3">
            <div className="flex min-w-0 items-center gap-3">
              {image ? (
                <img
                  src={image}
                  alt=""
                  className="hidden h-12 w-12 flex-shrink-0 rounded-[6px] border border-kaboz-line object-contain sm:block"
                />
              ) : null}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-kaboz-ink">
                  {productData.name}
                </p>
                {hasPrice ? (
                  <p className="text-sm font-bold text-kaboz-price">
                      {currency}
                      {productData.price}
                      {discountPercent ? (
                      <span className="ml-2 text-xs font-normal text-kaboz-faint line-through">
                        {currency}
                        {productData.originalPrice}
                      </span>
                    ) : null}
                  </p>
                ) : (
                  <p className="text-xs text-kaboz-mute">Price on request</p>
                )}
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleWishlist}
                className={`hidden h-10 w-10 items-center justify-center rounded-[6px] border sm:inline-flex ${
                  wishlisted
                    ? "border-kaboz-red text-kaboz-red"
                    : "border-kaboz-line text-kaboz-ink"
                }`}
                aria-label="Wishlist"
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
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                className="rounded-[6px] bg-kaboz-orange px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-kaboz-orange-dark sm:px-6 sm:text-sm"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Image lightbox / zoom */}
      {lightboxOpen ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl text-kaboz-ink"
            aria-label="Close gallery"
          >
            <IconClose className="h-5 w-5" />
          </button>
          {galleryImages.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  stepGallery(-1);
                }}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-kaboz-ink sm:left-6"
              >
                <IconChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  stepGallery(1);
                }}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-kaboz-ink sm:right-6"
              >
                <IconChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}
          <img
            src={image}
            alt={productData.name}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Product;
