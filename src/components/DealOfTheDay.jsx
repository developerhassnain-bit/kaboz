import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { getDiscountPercent } from "../utils/pricing";
import { pickProductsByIds } from "../utils/homepageProducts";
import { prioritizeCctvProducts } from "../utils/categoryLinks";
import { IconChevronLeft, IconChevronRight } from "./ui/Icons";
import PriceText from "./ui/PriceText";

const pad = (n) => String(n).padStart(2, "0");

const useCountdown = (hoursAhead = 18) => {
  const end = useMemo(
    () => Date.now() + hoursAhead * 60 * 60 * 1000,
    [hoursAhead]
  );
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const left = Math.max(0, end - now);
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return { h, m, s, done: left <= 0 };
};

/**
 * Onsus-style Deal of the Day — discounted products with timer + progress.
 */
const DealOfTheDay = ({ preferredIds = [] }) => {
  const { products, currency } = useContext(ShopContext);
  const scrollerRef = React.useRef(null);
  const { h, m, s } = useCountdown(18);

  const deals = useMemo(() => {
    const curated = pickProductsByIds(products, preferredIds, 12);
    if (curated.length) return prioritizeCctvProducts(curated);
    const withDiscount = (products || []).filter(
      (p) => getDiscountPercent(p.price, p.originalPrice) > 0
    );
    const pool = withDiscount.length ? withDiscount : products || [];
    const sorted = [...pool].sort(
      (a, b) =>
        getDiscountPercent(b.price, b.originalPrice) -
        getDiscountPercent(a.price, a.originalPrice)
    );
    return prioritizeCctvProducts(sorted).slice(0, 8);
  }, [products, preferredIds]);

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-deal-card]");
    const step = card ? card.offsetWidth + 16 : 300;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (!deals.length) return null;

  return (
    <section className="w-full border-t border-kaboz-line bg-white py-8 sm:py-10">
      <div className="kb-container">
        <div className="mb-5 flex items-end justify-between gap-3 sm:mb-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-kaboz-ink sm:text-2xl">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-kaboz-red text-white"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12 2c1.5 3.5-.5 5.5-2 7-.8.8-1.5 1.7-1.5 3A3.5 3.5 0 0012 15.5 3.5 3.5 0 0015.5 12c0-2.2-1.8-4-1.8-6.5C15.5 7 18 9.2 18 13a6 6 0 11-12 0c0-2.4 1.2-4.2 2.5-5.5C10 6 11 4.5 12 2z" />
              </svg>
            </span>
            Deal of the day
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous deals"
              className="hidden h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white text-black transition hover:bg-black hover:text-white sm:flex"
            >
              <IconChevronLeft className="h-5 w-5" strokeWidth={2.75} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next deals"
              className="hidden h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-white text-black transition hover:bg-black hover:text-white sm:flex"
            >
              <IconChevronRight className="h-5 w-5" strokeWidth={2.75} />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto pb-1 sm:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {deals.map((p, i) => {
            const pct = getDiscountPercent(p.price, p.originalPrice);
            const sold = 30 + ((i * 17) % 50);
            const available = 100 - sold;
            return (
              <Link
                key={p._id}
                data-deal-card
                to={`/product/${p.slug || p._id}`}
                className="group w-[78%] max-w-[300px] flex-shrink-0 snap-start overflow-hidden rounded-[6px] border border-kaboz-line bg-white sm:w-[calc((100%-3*1rem)/4)] sm:max-w-none"
              >
                <div className="relative aspect-square bg-white">
                  {pct > 0 ? (
                    <span className="absolute left-2.5 top-2.5 z-[1] rounded-[3px] bg-kaboz-red px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Sale {pct}%
                    </span>
                  ) : null}
                  {p.image?.[0] ? (
                    <img
                      src={p.image[0]}
                      alt={p.name}
                      className="kb-img-pop h-full w-full object-contain p-2"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="p-3.5 sm:p-4">
                  {p.category ? (
                    <p className="text-[11px] text-kaboz-mute">{p.category}</p>
                  ) : null}
                  <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-kaboz-ink transition group-hover:text-kaboz-orange">
                    {p.name}
                  </p>
                  <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    <span className="text-base font-bold text-kaboz-price">
                      <PriceText currency={currency} amount={p.price} />
                    </span>
                    {p.originalPrice &&
                    Number(p.originalPrice) > Number(p.price) ? (
                      <span className="text-xs text-kaboz-faint line-through">
                        <PriceText
                          currency={currency}
                          amount={p.originalPrice}
                        />
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-kaboz-mute">
                    <span className="text-kaboz-red">Time&apos;s up!</span>
                    <span className="rounded bg-kaboz-ink px-1.5 py-0.5 font-mono text-white">
                      {pad(h)}
                    </span>
                    :
                    <span className="rounded bg-kaboz-ink px-1.5 py-0.5 font-mono text-white">
                      {pad(m)}
                    </span>
                    :
                    <span className="rounded bg-kaboz-ink px-1.5 py-0.5 font-mono text-white">
                      {pad(s)}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-[11px] text-kaboz-mute">
                      <span>Sold: {sold}</span>
                      <span>Available: {available}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-kaboz-line">
                      <div
                        className="h-full rounded-full bg-kaboz-gold"
                        style={{ width: `${sold}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;
