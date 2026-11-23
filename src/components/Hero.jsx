import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import useCategories from "../hooks/useCategories";
import {
  getCategoryDisplayName,
  getCategoryPath,
  getDepartmentCategories,
  LIVING_HUB_PATH,
  SECURITY_HUB_PATH,
} from "../utils/categoryLinks";
import { IconChevronRight } from "./ui/Icons";
import CategoryDepartmentIcon from "./ui/CategoryIcon";
import livingHero from "../assets/banners/kaboz-living-hero.jpg";
import securityHero from "../assets/banners/kaboz-security-hero.jpg";
import centerHero from "../assets/banners/hero-section-main-banner.jpg";

const centerBanner = {
  image: centerHero,
  link: SECURITY_HUB_PATH,
  title: "Next-Gen Security Cameras",
};

const sideCards = [
  {
    to: LIVING_HUB_PATH,
    image: livingHero,
    title: "Kaboz Living",
    fit: "cover",
    bg: "#6b0f16",
  },
  {
    to: SECURITY_HUB_PATH,
    image: securityHero,
    title: "Kaboz Security",
    fit: "cover",
    bg: "#0b1a3a",
  },
];

const SideBannerCard = ({ card, className = "" }) => {
  const bg = card.bg || "#f5f5f5";
  return (
    <Link
      to={card.to}
      aria-label={card.title}
      style={{ backgroundColor: bg }}
      className={`${className} group relative block overflow-hidden p-0`}
    >
      <img
        src={card.image}
        alt={card.title}
        className="kb-img-pop absolute inset-0 h-full w-full object-cover object-center"
      />
    </Link>
  );
};

const DepartmentsPanel = ({ categories, isLoading }) => (
  <aside className="box-border flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[6px] border border-kaboz-line bg-white">
    <div className="flex h-[52px] flex-shrink-0 items-center gap-3 bg-kaboz-orange px-4 text-white xl:h-[56px]">
      <span className="grid grid-cols-3 gap-[3px]" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="h-[5px] w-[5px] rounded-[1px] bg-white" />
        ))}
      </span>
      <p className="truncate text-[14px] font-bold tracking-wide xl:text-[15px]">
        All Departments
      </p>
    </div>

    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      {isLoading ? (
        <p className="px-4 py-6 text-xs text-kaboz-mute">Loading…</p>
      ) : (
        <ul className="flex min-h-0 flex-1 flex-col">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="flex min-h-0 flex-1 border-b border-[#ececec] last:border-b-0"
            >
              <Link
                to={cat.href || getCategoryPath(cat.name)}
                className="group box-border flex h-full min-h-[44px] w-full items-center gap-2.5 px-3 text-[13px] text-kaboz-slate transition hover:bg-[#fafafa] hover:text-kaboz-purple xl:min-h-[48px] xl:gap-3 xl:px-4 xl:text-[14px]"
              >
                <span
                  aria-hidden
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[#555] transition-colors group-hover:bg-kaboz-orange-soft group-hover:text-kaboz-orange"
                >
                  <CategoryDepartmentIcon name={cat.name} className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 truncate font-medium leading-snug">
                  {getCategoryDisplayName(cat.name)}
                </span>
                <IconChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-kaboz-faint transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  </aside>
);

const Hero = () => {
  const { categories, isLoading } = useCategories();

  const departmentCategories = useMemo(
    () => getDepartmentCategories(categories),
    [categories]
  );

  return (
    <section className="box-border w-full overflow-x-hidden bg-white">
      {/* —— Mobile —— */}
      <div className="md:hidden">
        <Link
          to={centerBanner.link}
          aria-label={centerBanner.title}
          className="group block w-full overflow-hidden"
        >
          <img
            src={centerBanner.image}
            alt={centerBanner.title}
            className="kb-img-pop block h-auto w-full max-w-full"
          />
        </Link>

        <div className="kb-container grid grid-cols-2 gap-3 py-3">
          {sideCards.map((card) => (
            <SideBannerCard
              key={card.to}
              card={card}
              className="aspect-[4/5] rounded-[6px]"
            />
          ))}
        </div>
      </div>

      {/* —— Tablet / Desktop —— */}
      <div className="hidden w-full md:block">
        <div className="kb-container box-border py-3 lg:py-4">
          {/* Tablet */}
          <div className="space-y-3 lg:hidden">
            <Link
              to={centerBanner.link}
              aria-label={centerBanner.title}
              className="group relative block aspect-[2/1] w-full overflow-hidden rounded-[6px] bg-[#f5f5f5]"
            >
              <img
                src={centerBanner.image}
                alt={centerBanner.title}
                className="kb-img-pop absolute inset-0 h-full w-full object-cover object-center"
              />
            </Link>
            <div className="grid grid-cols-2 gap-3">
              {sideCards.map((card) => (
                <SideBannerCard
                  key={card.to}
                  card={card}
                  className="aspect-[4/5] rounded-[6px]"
                />
              ))}
            </div>
          </div>

          {/*
            Desktop lg+: Onsus proportions
            grid-cols-[260px_1fr_300px] · items-stretch
            Centre aspect-[2/1] sets row height; menu + right stack match it.
          */}
          <div className="hidden w-full items-stretch gap-3 lg:grid lg:grid-cols-[260px_minmax(0,1fr)_300px] xl:grid-cols-[280px_minmax(0,1fr)_320px] xl:gap-4">
            {/* 1. Departments — full column height */}
            <div className="min-h-0 min-w-0 self-stretch">
              <div className="flex h-full min-h-0 flex-col">
                <DepartmentsPanel
                  categories={departmentCategories}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* 2. Centre banner — fixed 2:1 frame, object-cover fill */}
            <Link
              to={centerBanner.link}
              aria-label={centerBanner.title}
              className="group relative block aspect-[2/1] w-full min-w-0 overflow-hidden rounded-[6px] bg-[#f5f5f5]"
            >
              <img
                src={centerBanner.image}
                alt={centerBanner.title}
                className="kb-img-pop absolute inset-0 h-full w-full object-cover object-center"
              />
            </Link>

            {/* 3. Right stack — equal halves; Security uses contain so artwork isn't clipped */}
            <div className="flex h-full min-h-0 min-w-0 flex-col justify-between gap-3 self-stretch">
              {sideCards.map((card) => (
                <SideBannerCard
                  key={card.to}
                  card={card}
                  className="h-[calc(50%-0.375rem)] min-h-0 w-full rounded-[6px]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
