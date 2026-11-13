import React from "react";
import { Link } from "react-router-dom";
import { IconArrowRight } from "./ui/Icons";

const departments = [
  {
    to: "/living",
    image: "/living-banner.png",
    eyebrow: "Kaboz Living",
    title: "Curtains & home comfort",
    copy: "Premium curtains, upholstery and installation.",
    tone: "light",
  },
  {
    to: "/bedsheets",
    image: "/Idyllic.jpg",
    eyebrow: "Bedsheets",
    title: "Bedsheets & luxury bedding",
    copy: "Everyday comfort and luxury bedsheets.",
    tone: "light",
  },
  {
    to: "/collection?category=Security%20Cameras",
    image: "/cctv-security.png",
    eyebrow: "Kaboz Security",
    title: "CCTV, ACS & Intercom",
    copy: "Professional security for home and business.",
    tone: "dark",
  },
];

const MainCategories = () => {
  return (
    <section className="py-4 sm:py-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-kaboz-orange">
            Departments
          </p>
          <h2 className="font-display text-xl font-bold text-kaboz-ink sm:text-2xl">
            Shop our main collections
          </h2>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
        {departments.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group relative overflow-hidden rounded-xl shadow-header"
          >
            <div className="aspect-[16/7] sm:aspect-[21/9]">
              <img
                src={item.image}
                alt={item.title}
                className="kb-img-pop h-full w-full object-cover"
              />
            </div>
            <div
              className={`absolute inset-0 ${
                item.tone === "dark"
                  ? "bg-gradient-to-r from-black/80 via-black/45 to-transparent"
                  : "bg-gradient-to-r from-white/95 via-white/70 to-transparent"
              }`}
            />
            <div
              className={`absolute inset-0 flex flex-col justify-center px-5 sm:px-8 ${
                item.tone === "dark" ? "text-white" : "text-kaboz-ink"
              }`}
            >
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-xs ${
                  item.tone === "dark" ? "text-kaboz-gold" : "text-kaboz-mute"
                }`}
              >
                {item.eyebrow}
              </p>
              <h3 className="mt-1 font-display text-xl font-bold sm:text-3xl">
                {item.title}
              </h3>
              <p
                className={`mt-1 max-w-xs text-xs sm:text-sm ${
                  item.tone === "dark" ? "text-white/80" : "text-kaboz-mute"
                }`}
              >
                {item.copy}
              </p>
              <span className="mt-3 inline-flex w-fit items-center gap-2 rounded-md bg-kaboz-orange px-3 py-2 text-xs font-semibold text-white transition group-hover:bg-kaboz-orange-dark sm:mt-4 sm:text-sm">
                Shop now
                <IconArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MainCategories;
