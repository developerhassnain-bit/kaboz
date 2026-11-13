import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const SafePaymentIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="mb-3 h-10 w-10 text-kaboz-ink"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <rect x="2.5" y="5" width="19" height="14" rx="2.2" />
    <path d="M2.5 10h19" />
    <path d="M6.5 15h4" />
    <path d="M16.2 13.2v-1.1a1.3 1.3 0 0 1 2.6 0v1.1" />
    <rect x="15.4" y="13.2" width="4.2" height="3.2" rx="0.6" />
  </svg>
);

const policies = [
  {
    icon: assets.fast_delivery,
    title: "Fast Delivery",
    linkLabel: "Across the UAE",
    to: "/contact",
  },
  {
    Icon: SafePaymentIcon,
    title: "Safe Payment",
    linkLabel: "Secure checkout",
    to: "/cart",
  },
  {
    icon: assets.support_img,
    title: "24/7 Help Center",
    linkLabel: "Contact Us",
    to: "/contact",
  },
  {
    icon: assets.exchange_icon,
    title: "Hassle-Free Returns",
    linkLabel: "Return policy details",
    to: "/about",
  },
  {
    icon: assets.shield,
    title: "Friendly Services",
    linkLabel: "About Us",
    to: "/about",
  },
];

const OurPolicy = () => {
  return (
    <section className="w-full border-t border-kaboz-line bg-[#fafafa]">
      <div className="kb-container py-10 sm:py-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {policies.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center px-2 text-center"
            >
              {item.Icon ? (
                <item.Icon />
              ) : (
                <img
                  src={item.icon}
                  alt=""
                  className="mb-3 h-10 w-10 object-contain brightness-0"
                />
              )}
              <p className="font-display text-sm font-bold text-kaboz-ink sm:text-base">
                {item.title}
              </p>
              <Link
                to={item.to}
                className="mt-1 text-xs font-medium text-kaboz-mute underline decoration-kaboz-mute/40 underline-offset-4 transition hover:text-kaboz-orange hover:decoration-kaboz-orange"
              >
                {item.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurPolicy;
