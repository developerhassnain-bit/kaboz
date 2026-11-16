import React from "react";
import { Link } from "react-router-dom";

/** Onsus/Adarc-style benefit row — multi-accent icons, hero-aligned width. */
const items = [
  {
    title: "Support 24/7",
    subtitle: "Always here to help",
    to: "/contact",
    tone: "text-black",
    hover: "hover:border-black/30",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-black" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3a7 7 0 00-7 7v2a3 3 0 003 3h1v-5H7a5 5 0 0110 0h-2v5h1a3 3 0 003-3v-2a7 7 0 00-7-7z" />
        <path d="M9 19h6" />
      </svg>
    ),
  },
  {
    title: "Safe payment",
    subtitle: "Secure checkout",
    to: "/cart",
    tone: "text-black",
    hover: "hover:border-black/30",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-black" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2.5" y="5" width="19" height="14" rx="2" />
        <path d="M2.5 10h19" />
        <path d="M6.5 15h4" />
      </svg>
    ),
  },
  {
    title: "Trusted service",
    subtitle: "UAE electronics & living",
    to: "/about",
    tone: "text-black",
    hover: "hover:border-black/30",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-black" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Easy returns",
    subtitle: "Hassle-free policy",
    to: "/about",
    tone: "text-black",
    hover: "hover:border-black/30",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-black" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 12a8 8 0 0113.5-5.8L20 4v6h-6l2.2-2.2A6 6 0 106 12" />
      </svg>
    ),
  },
];

const FeatureStrip = () => (
  <section className="w-full bg-white py-4 lg:py-5">
    {/* Same kb-container as hero → left/right empty space matches banners above */}
    <div className="kb-container">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
        {items.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className={`flex min-h-[88px] items-center gap-3 rounded-[8px] border border-kaboz-line bg-white px-3 py-4 transition hover:shadow-sm sm:px-4 lg:min-h-[110px] lg:py-5 ${item.hover}`}
          >
            <span className="flex-shrink-0 text-black">{item.icon}</span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-kaboz-ink sm:text-[15px]">
                {item.title}
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-kaboz-mute sm:text-xs">
                {item.subtitle}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureStrip;
