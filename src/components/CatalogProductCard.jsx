import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { getDiscountPercent } from "../utils/pricing";
import { toast } from "react-toastify";
import PriceText from "./ui/PriceText";

/**
 * Adarc-style catalog card: bordered tile, square image (scale on hover),
 * hover Add to Cart button, 3-line title, large price. Whole card is clickable.
 */
const CatalogProductCard = ({
  id,
  slug,
  image,
  name,
  price,
  originalPrice,
}) => {
  const { currency, addToCart } = useContext(ShopContext);
  const [adding, setAdding] = useState(false);
  const href = `/product/${slug || id}`;
  const src = image?.[0] || "";
  const discount = getDiscountPercent(price, originalPrice);
  const onSale =
    originalPrice && Number(originalPrice) > Number(price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;
    setAdding(true);
    addToCart(id, { quantity: 1 });
    toast.success("Added to cart");
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <Link
      to={href}
      className="group relative flex h-full flex-col overflow-hidden border border-[#c5cbd5] bg-white p-3 transition hover:border-kaboz-orange sm:p-4"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        {src ? (
          <img
            src={src}
            alt={name}
            className="kb-img-pop h-full w-full object-contain p-2 sm:p-3"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-kaboz-mute">
            No image
          </div>
        )}
        {discount ? (
          <span className="absolute left-2 top-2 rounded-[3px] bg-kaboz-sale px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
            -{discount}%
          </span>
        ) : null}

        {/* Floating centered Add to Cart — appears on card hover */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding}
          className="pointer-events-none absolute bottom-2.5 left-1/2 z-[3] flex w-[88%] -translate-x-1/2 translate-y-2 items-center justify-center gap-1.5 rounded bg-kaboz-orange px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-white opacity-0 shadow-md transition-all duration-300 hover:bg-kaboz-orange-dark disabled:opacity-80 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 sm:text-[13px]"
        >
          {adding ? (
            "Added"
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
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

      <div className="mt-3 flex min-h-[60px] flex-1 flex-col">
        <h2 className="line-clamp-3 text-left text-[13px] font-medium leading-snug text-kaboz-ink transition group-hover:text-kaboz-orange md:text-[14px]">
          {name}
        </h2>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-[19px] font-semibold leading-7 text-kaboz-orange sm:text-[22px]">
            <PriceText currency={currency} amount={price} />
          </span>
          {onSale ? (
            <span className="text-sm text-kaboz-faint line-through">
              <PriceText currency={currency} amount={originalPrice} />
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default CatalogProductCard;
