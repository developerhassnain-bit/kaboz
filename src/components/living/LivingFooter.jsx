import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import {
  LIVING_HUB_PATH,
  LIVING_SHOP_PATHS,
} from "../../utils/categoryLinks";

const HELP_LINKS = [
  { label: "Contact us", to: "/contact" },
  { label: "FAQ", to: "/faq" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
];

const SERVICE_LINKS = [
  { label: "Curtains Installation", to: "/services#curtains-installation" },
  { label: "Upholstery", to: "/services#upholstery" },
  { label: "Stitching & custom work", to: "/services" },
  { label: "Projects", to: "/contact" },
];

const PRODUCT_LINKS = [
  { label: "Curtains", to: LIVING_SHOP_PATHS.Curtains },
  { label: "Bedsheets", to: LIVING_SHOP_PATHS.Bedsheets },
  { label: "Luxury Bedsheets", to: LIVING_SHOP_PATHS["Luxury Bedsheets"] },
  { label: "Upholstery", to: LIVING_SHOP_PATHS.Upholstery },
  { label: "Kaboz Living home", to: LIVING_HUB_PATH },
];

/** Dark Kaboz Living microsite footer */
const LivingFooter = () => (
  <footer className="mt-10 w-full">
    <div className="bg-kaboz-ink text-white">
      <div className="kb-container py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to={LIVING_HUB_PATH} className="inline-block">
              <img
                src={assets.logo}
                alt="Kaboz"
                className="mb-5 h-10 w-auto rounded bg-white px-2 py-1"
              />
            </Link>
            <p className="text-sm leading-7 text-white/65">
              Kaboz Living — curtains, bedsheets, and upholstery for homes and
              projects across the UAE. Free consultation, quality fabrics, and
              reliable installation.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-white">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm text-white/65">
              {SERVICE_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="transition hover:text-kaboz-purple"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-white">
              Living products
            </h3>
            <ul className="space-y-2.5 text-sm text-white/65">
              {PRODUCT_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="transition hover:text-kaboz-purple"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-white">
              Help & info
            </h3>
            <ul className="space-y-2.5 text-sm text-white/65">
              {HELP_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="transition hover:text-kaboz-purple"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-base font-semibold text-white">
              Connect with us
            </h3>
            <div className="space-y-3 text-sm text-white/70">
              <a
                href="https://wa.me/971552693100"
                className="flex items-start gap-3 transition hover:text-kaboz-purple"
              >
                <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-kaboz-green text-[11px] font-bold text-white">
                  ☎
                </span>
                <span>+971 55 269 3100</span>
              </a>
              <a
                href="mailto:sales@kaboz.ae"
                className="flex items-start gap-3 transition hover:text-kaboz-purple"
              >
                <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-kaboz-orange text-[11px] font-bold text-white">
                  ✉
                </span>
                <span>sales@kaboz.ae</span>
              </a>
              <p className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-kaboz-gold text-[11px] font-bold text-kaboz-ink">
                  📍
                </span>
                <span>
                  KABOZ FZE LLC, Amber Gem Tower - 2602, Al Rashidiya 3, Ajman
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="kb-container flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Kaboz Living. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/about" className="hover:text-kaboz-purple">
              Privacy policy
            </Link>
            <Link to="/about" className="hover:text-kaboz-purple">
              Terms and Conditions
            </Link>
            <Link to="/" className="hover:text-kaboz-purple">
              Kaboz store
            </Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default LivingFooter;
