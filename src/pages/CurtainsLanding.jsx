import React, { useContext, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import useCategories from "../hooks/useCategories";
import LivingLayout from "../components/living/LivingLayout";
import { LIVING_CATEGORY_NAMES, LIVING_SHOP_PATHS } from "../utils/categoryLinks";

const PRODUCT_CATEGORIES = [
  {
    name: "Luxury Bedsheets",
    to: LIVING_SHOP_PATHS["Luxury Bedsheets"],
    image: "/Lumina.jpg",
    blurb: "Premium bedding for refined spaces",
  },
  {
    name: "Bedsheets",
    to: LIVING_SHOP_PATHS.Bedsheets,
    image: "/Idyllic.jpg",
    blurb: "Everyday comfort in quality fabrics",
  },
  {
    name: "Curtains",
    to: LIVING_SHOP_PATHS.Curtains,
    image: "/Curtains-banner.jpeg",
    blurb: "Blackout, sheer, velvet and more",
  },
  {
    name: "Upholstery",
    to: LIVING_SHOP_PATHS.Upholstery,
    image: "/Terra.jpg",
    blurb: "Sofas, beds and custom fabric work",
  },
];

const LIVING_SERVICES = [
  "Stitching Curtains",
  "Customised Curtains",
  "Upholstery Fabric",
  "Upholstery Work (Sofa, Bed, Chair)",
  "Projects",
  "Installation / Fixing",
  "Events",
];

/**
 * Kaboz Living brand hub — /living
 * Uses shared LivingLayout (navbar + footer) like living shops and PDPs.
 */
const CurtainsLanding = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { products } = useContext(ShopContext);
  const { categories } = useCategories();

  const curtainsCategory = useMemo(
    () => categories.find((c) => c.name === "Curtains"),
    [categories]
  );

  const livingProducts = useMemo(
    () =>
      products.filter((item) => LIVING_CATEGORY_NAMES.includes(item.category)),
    [products]
  );

  return (
    <LivingLayout>
      <Helmet>
        <title>Kaboz Living | Curtains, Bedsheets & Upholstery</title>
        <meta
          name="description"
          content="Kaboz Living — free consultation for curtains, bedsheets and upholstery. FR and antibacterial fabrics for homes and projects in the UAE."
        />
        <link
          rel="canonical"
          href={
            typeof window !== "undefined"
              ? `${window.location.origin}/living`
              : "/living"
          }
        />
      </Helmet>

      {/* Hero */}
      <section className="relative isolate min-h-[400px] overflow-hidden bg-[#2a2420] sm:min-h-[480px] lg:min-h-[540px]">
        <img
          src="/curtains.jpeg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "78% 45%" }}
        />
        <div className="absolute inset-0 bg-black/35" />

        <div className="relative z-[1] flex min-h-[400px] w-full items-center justify-center px-4 py-14 sm:min-h-[480px] lg:min-h-[540px]">
          <div className="living-hero-enter max-w-xl border border-white/30 bg-black/55 px-6 py-8 text-center shadow-2xl sm:px-10 sm:py-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-kaboz-gold">
              Kaboz Living
            </p>
            <h1 className="mt-3 font-display text-2xl font-bold leading-snug text-white sm:text-3xl md:text-4xl">
              Consultation is free of cost
            </h1>
            <p className="mt-4 text-base font-medium text-white/90 sm:text-lg">
              We treat our customers like a family
            </p>
            <p className="mt-2 text-sm text-white/70 sm:text-base">
              Feel free to discuss your space with us
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#products"
                className="inline-flex rounded-full bg-kaboz-orange px-6 py-2.5 text-sm font-bold text-white transition hover:bg-kaboz-orange-dark"
              >
                View products
              </a>
              <Link
                to="/contact"
                className="inline-flex rounded-full border border-white/50 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-kaboz-ink"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products — full-width banner rows */}
      <section id="products" className="scroll-mt-24 py-12 sm:py-16">
        <div className="kb-container">
          <div className="mb-8 sm:mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-kaboz-orange">
              Kaboz Living
            </p>
            <h2 className="mt-1 font-display text-3xl font-bold text-kaboz-ink sm:text-4xl">
              Products
            </h2>
            <p className="mt-2 max-w-xl text-sm text-kaboz-mute sm:text-base">
              Curtains, bedsheets and upholstery for homes and projects.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={cat.to}
                id={cat.name === "Curtains" ? "curtains" : undefined}
                className="group relative block h-40 overflow-hidden rounded-md bg-kaboz-ink sm:h-48 md:h-56"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="kb-img-pop absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
                <div className="absolute inset-0 flex items-center justify-between gap-4 px-5 sm:px-8 md:px-10">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                      {cat.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-white/85 sm:text-base">
                      {cat.blurb}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-kaboz-orange text-lg font-bold text-white transition group-hover:translate-x-1 sm:h-12 sm:w-12"
                  >
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-6 text-center text-sm font-medium italic text-kaboz-mute">
            All fabrics are FR and antibacterial
          </p>
        </div>
      </section>

      {/* Featured living products */}
      {livingProducts.length > 0 ? (
        <section className="border-t border-[#e4dcd2] bg-white py-12 sm:py-14">
          <div className="kb-container">
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kaboz-green">
                  Shop the range
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-kaboz-ink">
                  Featured living products
                </h2>
              </div>
              <Link
                to={LIVING_SHOP_PATHS.Curtains}
                className="text-sm font-semibold text-kaboz-orange hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-7 md:grid-cols-4 lg:grid-cols-5 xl:gap-x-5">
              {livingProducts.slice(0, 10).map((item) => (
                <ProductItem
                  key={item._id}
                  id={item._id}
                  slug={item.slug}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  date={item.date}
                  curtainTypes={item.curtainTypes}
                  category={item.category}
                  subCategory={item.subCategory}
                  sku={item.sku}
                  brand={item.brand}
                  modelName={item.modelName}
                  reviews={item.reviews}
                  compact
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Services strip */}
      <section
        id="services"
        className="scroll-mt-24 border-t border-[#e4dcd2] bg-[#141414] py-12 text-white sm:py-14"
      >
        <div className="kb-container">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-kaboz-orange">
                Services
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                From fabric to finishing
              </h2>
              <p className="mt-3 max-w-md text-sm text-white/65">
                Free consultation — tell us about your space and we will help
                you choose the right living solution.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex rounded-full bg-kaboz-green px-6 py-2.5 text-sm font-bold text-white transition hover:bg-kaboz-green-dark"
              >
                Contact Kaboz Living
              </Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {LIVING_SERVICES.map((service) => (
                <li
                  key={service}
                  className="flex items-center gap-3 border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kaboz-green-soft text-xs font-bold text-kaboz-green">
                    ✓
                  </span>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Curtain catalogue from admin */}
      {curtainsCategory?.subcategories?.length > 0 ? (
        <section className="border-t border-[#e4dcd2] bg-[#faf8f5] py-12 sm:py-14">
          <div className="kb-container">
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kaboz-red">
                Browse
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-kaboz-ink">
                Curtain categories
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {curtainsCategory.subcategories.slice(0, 10).map((item) => (
                <Link
                  key={item._id || item.name}
                  to={`/collection?category=${encodeURIComponent(
                    "Curtains"
                  )}&subcategory=${encodeURIComponent(item.name)}`}
                  className="group overflow-hidden rounded-md border border-[#e4dcd2] bg-white transition hover:border-kaboz-orange/40"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#f3efe9]">
                    <img
                      src={item.image || "/Curtains-banner.jpeg"}
                      alt={item.name}
                      className="kb-img-pop h-full w-full object-cover"
                    />
                  </div>
                  <p className="px-3 py-3 text-sm font-semibold text-kaboz-ink group-hover:text-kaboz-orange">
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </LivingLayout>
  );
};

export default CurtainsLanding;
