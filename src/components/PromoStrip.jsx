import React from "react";
import { Link } from "react-router-dom";
import {
  LIVING_HUB_PATH,
  SECURITY_HUB_PATH,
} from "../utils/categoryLinks";
import { IconArrowRight } from "./ui/Icons";

/**
 * Onsus “Shop and SAVE BIG” style promo tiles — edge-to-edge cover fill.
 */
const promos = [
  {
    to: "/collection?category=Kits",
    image: "/hero1.jpeg",
    label: "Complete kits",
    title: "Ready-to-install security kits",
    objectPosition: "object-center",
    bg: "#1a1a1a",
  },
  {
    to: "/collection?category=Network%20Switches",
    image: "/hero2.jpeg",
    label: "Networking",
    title: "Switches & PoE for CCTV",
    objectPosition: "object-center",
    bg: "#1a1a1a",
  },
  {
    to: LIVING_HUB_PATH,
    image: "/Curtains-banner.jpeg",
    label: "Kaboz Living",
    title: "Curtains & home comfort",
    objectPosition: "object-left",
    bg: "#f5efe8",
  },
  {
    to: SECURITY_HUB_PATH,
    image: "/CCTV-Banner.jpeg",
    label: "Kaboz Security",
    title: "Cameras & smart protection",
    objectPosition: "object-center",
    bg: "#fbf4ee",
  },
];

const PromoCard = ({ item, className = "" }) => (
  <Link
    to={item.to}
    className={`group relative block overflow-hidden rounded-[6px] border border-kaboz-line ${className}`}
    style={{ backgroundColor: item.bg }}
  >
    {/* Tight aspect — cover fills the slot edge-to-edge */}
    <div className="relative aspect-[16/10] w-full overflow-hidden">
      <img
        src={item.image}
        alt={item.title}
        className={`kb-img-pop absolute inset-0 h-full w-full object-cover ${item.objectPosition}`}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-4 sm:p-5 lg:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-kaboz-gold">
          {item.label}
        </p>
        <p className="mt-1 font-display text-base font-bold leading-snug text-white lg:text-lg">
          {item.title}
        </p>
        <span className="mt-2.5 inline-flex w-fit items-center gap-1 rounded-[4px] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-kaboz-ink transition group-hover:bg-kaboz-orange group-hover:text-white">
          Shop now
          <IconArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  </Link>
);

const PromoStrip = () => {
  return (
    <section className="py-6 sm:py-8">
      <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-kaboz-orange">
            Promotions
          </p>
          <h2 className="font-display text-lg font-bold text-kaboz-ink sm:text-xl md:text-2xl">
            Shop and explore
          </h2>
        </div>
        <Link
          to="/collection"
          className="inline-flex items-center gap-1 text-sm font-semibold text-kaboz-mute transition hover:text-kaboz-orange"
        >
          View all
          <IconArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Mobile snap row */}
      <div className="flex gap-3 overflow-x-auto pb-1 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {promos.map((item) => (
          <PromoCard
            key={item.to}
            item={item}
            className="w-[78%] max-w-[300px] flex-shrink-0 snap-start"
          />
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-4">
        {promos.map((item) => (
          <PromoCard key={item.to} item={item} />
        ))}
      </div>
    </section>
  );
};

export default PromoStrip;
