import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { getDiscountPercent } from "../utils/pricing";

const Star = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill={filled ? "#f5a623" : "none"}
    stroke="#f5a623"
    strokeWidth="1"
    className="w-4 h-4"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.363 1.118l1.287 3.957c.299.922-.755 1.688-1.538 1.118l-3.368-2.446a1 1 0 00-1.176 0l-3.368 2.446c-.783.57-1.837-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.958z" />
  </svg>
);

const BestProductItem = ({ slug, image, name, price, originalPrice, rating = 4 }) => {
  const { currency } = useContext(ShopContext);
  const discountPercent = getDiscountPercent(price, originalPrice);

  return (
    <Link
      to={`/product/${slug}`}
      className="group flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-3"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
        <img
          src={image[0]}
          alt={name}
          className="kb-img-pop h-full w-full object-contain"
        />
        {discountPercent && (
          <span className="absolute top-1 left-1 bg-orange-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Details */}
      <div className="min-w-0">
        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} filled={i < rating} />
          ))}
        </div>

        {/* Name */}
        <h3 className="mt-1 text-sm font-medium text-blue-500 truncate group-hover:underline">
          {name}
        </h3>

        {/* Price */}
        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-base font-bold text-orange-600">
            {currency}
            {price}
          </p>
          {discountPercent && (
            <p className="text-xs text-gray-400 line-through">
              {currency}
              {originalPrice}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BestProductItem;