import React from "react";
import { Link } from "react-router-dom";
import { IconArrowRight } from "./ui/Icons";

/**
 * Homepage banner.
 * variants: full | half | square
 * With label/title → promo overlay + Shop now CTA (Onsus style).
 */
const HomeBanner = ({
  to = "/collection",
  image,
  alt = "",
  label = "",
  title = "",
  objectPosition = "object-center",
  variant = "full",
  className = "",
}) => {
  // square tiles crop to fill. full/slim/half creatives keep intrinsic ratio
  // so baked-in text is never side-cropped on mobile.
  const coverFill = variant === "square";
  const frameClass = variant === "square" ? "aspect-square" : "";

  const showPromo = Boolean(label || title);

  return (
    <Link
      to={to}
      className={`group relative block overflow-hidden rounded-[6px] border border-kaboz-line bg-kaboz-soft ${className}`}
      aria-label={title || alt || "Shop collection"}
    >
      {coverFill ? (
        <div className={`relative w-full overflow-hidden ${frameClass}`}>
          <img
            src={image}
            alt={alt || title || ""}
            className={`kb-img-pop absolute inset-0 h-full w-full object-cover ${objectPosition}`}
            loading="lazy"
          />
          {showPromo ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-3.5 sm:p-4 lg:p-5">
                {label ? (
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-kaboz-gold">
                    {label}
                  </p>
                ) : null}
                {title ? (
                  <p className="mt-1 font-display text-sm font-bold leading-snug text-white sm:text-base lg:text-[17px]">
                    {title}
                  </p>
                ) : null}
                <span className="mt-2.5 inline-flex w-fit items-center gap-1 rounded-[4px] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-kaboz-ink transition group-hover:bg-kaboz-orange group-hover:text-white">
                  Shop now
                  <IconArrowRight className="h-3 w-3" />
                </span>
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <img
          src={image}
          alt={alt || title || ""}
          className="kb-img-pop block h-auto w-full"
          loading="lazy"
        />
      )}
    </Link>
  );
};

/** 4 square promo banners in one row — label, title, Shop now */
export const BannerQuad = ({ items = [] }) => {
  if (!items.length) return null;
  return (
    <section className="w-full py-4 sm:py-6">
      <div className="kb-container">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {items.map((item) => (
            <HomeBanner
              key={item.to + item.image}
              {...item}
              variant="square"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/** Full-width single banner — pass slim for Onsus-style short strip */
export const BannerFull = ({ item, slim = false }) => {
  if (!item?.image) return null;
  return (
    <section className="w-full py-3 sm:py-4">
      <div className="kb-container">
        <HomeBanner {...item} variant={slim ? "slim" : "full"} />
      </div>
    </section>
  );
};

/** 2 banners in one row */
export const BannerPair = ({ items = [] }) => {
  if (!items.length) return null;
  return (
    <section className="w-full py-4 sm:py-6">
      <div className="kb-container">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {items.map((item) => (
            <HomeBanner
              key={item.to + item.image}
              {...item}
              variant="half"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
