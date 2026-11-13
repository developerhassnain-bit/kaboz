import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { getDiscountPercent } from "../utils/pricing";
import { pickProductsByIds } from "../utils/homepageProducts";
import {
  isInWishlist,
  toggleWishlistId,
} from "../utils/wishlist";
import {
  IconCart,
  IconChevronLeft,
  IconChevronRight,
  IconCompare,
  IconEye,
  IconHeart,
} from "./ui/Icons";

const PER_PAGE = 3;

const actionBtn =
  "flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#ececec] text-[#555] transition hover:bg-black hover:text-white";

/** Onsus column row — hover turns title pink/red and reveals action icons */
const CompactProduct = ({ product, currency }) => {
  const { addToCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (product?._id) setWishlisted(isInWishlist(String(product._id)));
  }, [product?._id]);

  if (!product) return null;

  const href = `/product/${product.slug || product._id}`;
  const needsColor = Array.isArray(product.curtainTypes)
    ? product.curtainTypes.some((t) => (t.colors || []).length > 0)
    : false;

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleQuickView = (e) => {
    stop(e);
    navigate(href);
  };

  const handleWishlist = (e) => {
    stop(e);
    const { added } = toggleWishlistId(String(product._id));
    setWishlisted(added);
    toast[added ? "success" : "info"](
      added ? "Added to wishlist" : "Removed from wishlist"
    );
  };

  const handleCompare = (e) => {
    stop(e);
    toast.info("Compare list coming soon");
  };

  const handleAddToCart = (e) => {
    stop(e);
    if (needsColor) {
      navigate(href);
      return;
    }
    addToCart(product._id, { quantity: 1 });
    toast.success("Added to cart");
  };

  return (
    <div className="group/item relative flex gap-3 border-b border-kaboz-line py-3 last:border-b-0">
      <Link
        to={href}
        className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[4px] bg-kaboz-soft sm:h-[72px] sm:w-[72px]"
      >
        {product.image?.[0] ? (
          <img
            src={product.image[0]}
            alt={product.name}
            className="kb-img-pop h-full w-full object-contain p-1"
            loading="lazy"
          />
        ) : null}
      </Link>

      <div className="min-w-0 flex-1 self-center">
        {product.category ? (
          <p className="text-[11px] text-kaboz-mute">{product.category}</p>
        ) : null}
        <Link
          to={href}
          className="line-clamp-2 text-[13px] font-semibold leading-snug text-kaboz-orange transition group-hover/item:text-kaboz-price group-focus-within/item:text-kaboz-price"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm font-bold text-kaboz-ink">
            {currency}
            {product.price}
          </span>
          {product.originalPrice &&
          Number(product.originalPrice) > Number(product.price) ? (
            <span className="text-xs text-kaboz-faint line-through">
              {currency}
              {product.originalPrice}
            </span>
          ) : null}
        </div>

        {/* Onsus hover actions */}
        <div className="mt-2 flex max-h-0 items-center gap-1.5 overflow-hidden opacity-0 transition-all duration-200 group-hover/item:max-h-10 group-hover/item:opacity-100 group-focus-within/item:max-h-10 group-focus-within/item:opacity-100">
          <button
            type="button"
            aria-label="Quick view"
            title="Quick view"
            onClick={handleQuickView}
            className={actionBtn}
          >
            <IconEye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Wishlist"
            title="Wishlist"
            onClick={handleWishlist}
            className={`${actionBtn} ${wishlisted ? "bg-kaboz-price/15 text-kaboz-price" : ""}`}
          >
            <IconHeart className="h-3.5 w-3.5" filled={wishlisted} />
          </button>
          <button
            type="button"
            aria-label="Compare"
            title="Compare"
            onClick={handleCompare}
            className={actionBtn}
          >
            <IconCompare className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Add to cart"
            title="Add to cart"
            onClick={handleAddToCart}
            className={actionBtn}
          >
            <IconCart className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Column = ({ title, products, currency, accent = "blue" }) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE));
  const visible = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const eye =
    accent === "red"
      ? "border-kaboz-red"
      : accent === "green"
        ? "border-kaboz-green"
        : accent === "gold"
          ? "border-kaboz-gold"
          : accent === "purple"
            ? "border-kaboz-purple"
            : "border-kaboz-orange";

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="min-w-0">
      <div
        className={`mb-1 flex items-center justify-between gap-2 border-b-2 pb-2 ${eye}`}
      >
        <h3 className="min-w-0 font-display text-base font-bold text-kaboz-ink sm:text-lg">
          {title}
        </h3>
        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            disabled={page <= 0}
            aria-label={`Previous ${title}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:border-kaboz-line disabled:text-kaboz-mute disabled:opacity-50"
          >
            <IconChevronLeft className="h-4 w-4" strokeWidth={2.75} />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={page >= totalPages - 1}
            aria-label={`Next ${title}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:border-kaboz-line disabled:text-kaboz-mute disabled:opacity-50"
          >
            <IconChevronRight className="h-4 w-4" strokeWidth={2.75} />
          </button>
        </div>
      </div>
      <div>
        {visible.map((p) => (
          <CompactProduct key={p._id} product={p} currency={currency} />
        ))}
      </div>
    </div>
  );
};

/**
 * Onsus 4-column block: Top 20 · Featured · Top Selling · On Sale
 * Each column has prev/next arrows to page through products.
 */
const ProductColumns = ({
  top20Ids = [],
  featuredIds = [],
  topSellingIds = [],
  onSaleIds = [],
}) => {
  const { products, currency } = useContext(ShopContext);

  const columns = useMemo(() => {
    const list = products || [];
    const bestsellers = list.filter((p) => p.bestseller);
    const featured = list.filter((p) => p.featured || p.bestseller);
    const onSale = list
      .filter((p) => getDiscountPercent(p.price, p.originalPrice) > 0)
      .sort(
        (a, b) =>
          getDiscountPercent(b.price, b.originalPrice) -
          getDiscountPercent(a.price, a.originalPrice)
      );
    const topRated = [...list]
      .filter((p) => Number(p.ratingAvg || p.averageRating || 0) > 0)
      .sort(
        (a, b) =>
          Number(b.ratingAvg || b.averageRating || 0) -
          Number(a.ratingAvg || a.averageRating || 0)
      );

    const pool = (arr, max = 12, offset = 0) => {
      const src = arr.length ? arr : list;
      if (!src.length) return [];
      const out = [];
      for (let i = 0; i < max && i < Math.max(src.length, max); i += 1) {
        out.push(src[(offset + i) % src.length]);
      }
      const seen = new Set();
      return out.filter((p) => {
        const id = String(p._id);
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    };

    const curatedOr = (ids, fallback) => {
      const curated = pickProductsByIds(list, ids, 12);
      return curated.length ? curated : fallback;
    };

    return [
      {
        title: "Top 20",
        products: curatedOr(
          top20Ids,
          pool(topRated.length ? topRated : list, 12, 0)
        ),
        accent: "blue",
      },
      {
        title: "Featured products",
        products: curatedOr(
          featuredIds,
          pool(featured.length ? featured : list, 12, 2)
        ),
        accent: "purple",
      },
      {
        title: "Top selling products",
        products: curatedOr(
          topSellingIds,
          pool(bestsellers.length ? bestsellers : list, 12, 4)
        ),
        accent: "green",
      },
      {
        title: "On-sale products",
        products: curatedOr(
          onSaleIds,
          pool(onSale.length ? onSale : list, 12, 1)
        ),
        accent: "red",
      },
    ];
  }, [products, top20Ids, featuredIds, topSellingIds, onSaleIds]);

  if (!products?.length) return null;

  return (
    <section className="w-full py-6 sm:py-8">
      <div className="kb-container">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {columns.map((col) => (
            <Column
              key={col.title}
              title={col.title}
              products={col.products}
              currency={currency}
              accent={col.accent}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductColumns;
