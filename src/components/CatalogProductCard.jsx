import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { getDiscountPercent } from "../utils/pricing";

/**
 * Adarc-style catalog card: bordered tile, square image (scale on hover),
 * 3-line title (blue on hover), large price. Whole card is clickable.
 */
const CatalogProductCard = ({
  id,
  slug,
  image,
  name,
  price,
  originalPrice,
}) => {
  const { currency } = useContext(ShopContext);
  const href = `/product/${slug || id}`;
  const src = image?.[0] || "";
  const discount = getDiscountPercent(price, originalPrice);
  const onSale =
    originalPrice && Number(originalPrice) > Number(price);

  return (
    <Link
      to={href}
      className="group flex h-full flex-col overflow-hidden border border-[#c5cbd5] bg-white p-3 transition hover:border-kaboz-orange sm:p-4"
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
      </div>

      <div className="mt-3 flex min-h-[60px] flex-1 flex-col">
        <h2 className="line-clamp-3 text-left text-[13px] font-medium leading-snug text-kaboz-ink transition group-hover:text-kaboz-orange md:text-[14px]">
          {name}
        </h2>

        <div className="mt-3 flex flex-wrap items-baseline gap-2">
          <span className="text-[19px] font-semibold leading-7 text-kaboz-orange sm:text-[22px]">
            {currency}
            {price}
          </span>
          {onSale ? (
            <span className="text-sm text-kaboz-faint line-through">
              {currency}
              {originalPrice}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
};

export default CatalogProductCard;
