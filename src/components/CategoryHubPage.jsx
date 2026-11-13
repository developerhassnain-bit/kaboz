import React, { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import CatalogProductCard from "./CatalogProductCard";
import Breadcrumbs from "./Breadcrumbs";
import PaginationBar from "./PaginationBar";
import { getCategoryDisplayName } from "../utils/categoryLinks";
import { IconArrowRight, IconCheck } from "./ui/Icons";

const PAGE_SIZE = 24;

/**
 * Reusable hub page for named category URLs (e.g. /living, /bedsheets).
 * Onsus shop listing chrome with real filtering/pagination.
 */
const CategoryHubPage = ({
  categories = [],
  breadcrumbLabel,
  eyebrow,
  title,
  subtitle,
  heroImage,
  heroAlt,
  pageTitle,
  metaDescription,
  services = [],
}) => {
  const { products, productsLoading } = useContext(ShopContext);
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState("relevant");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    setPage(1);
    setActiveCategory("All");
  }, [breadcrumbLabel]);

  const filteredProducts = useMemo(
    () => products.filter((item) => categories.includes(item.category)),
    [products, categories]
  );

  const categoryShortcuts = useMemo(() => {
    const present = categories.filter((cat) =>
      filteredProducts.some((p) => p.category === cat)
    );
    return ["All", ...present];
  }, [categories, filteredProducts]);

  const sorted = useMemo(() => {
    let list =
      activeCategory === "All"
        ? [...filteredProducts]
        : filteredProducts.filter((p) => p.category === activeCategory);

    switch (sortType) {
      case "low-high":
        return list.sort((a, b) => a.price - b.price);
      case "high-low":
        return list.sort((a, b) => b.price - a.price);
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "latest":
        return list.sort((a, b) => Number(b.date || 0) - Number(a.date || 0));
      default:
        return list;
    }
  }, [filteredProducts, activeCategory, sortType]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = sorted.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );
  const startIndex = sorted.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * PAGE_SIZE, sorted.length);

  return (
    <div className="pb-6">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: breadcrumbLabel }]}
      />

      <div className="mb-6 overflow-hidden rounded-[6px] border border-kaboz-line bg-[#fafafa] sm:mb-8">
        <div
          className={`grid gap-0 ${
            heroImage ? "lg:grid-cols-[1.05fr_0.95fr]" : ""
          }`}
        >
          <div className="flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10">
            {eyebrow ? (
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-kaboz-orange">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-kaboz-ink sm:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-kaboz-mute sm:text-base">
                {subtitle}
              </p>
            ) : null}
            <p className="mt-4 text-sm font-semibold text-kaboz-ink">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>
          {heroImage ? (
            <div className="group relative min-h-[200px] overflow-hidden sm:min-h-[260px] lg:min-h-full">
              <img
                src={heroImage}
                alt={heroAlt || title}
                className="kb-img-pop absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>

      {categoryShortcuts.length > 1 ? (
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
          {categoryShortcuts.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setPage(1);
              }}
              className={`flex-shrink-0 rounded-[6px] border px-3.5 py-2 text-sm font-semibold transition ${
                activeCategory === cat
                  ? "border-kaboz-orange bg-kaboz-orange text-white"
                  : "border-kaboz-line bg-white text-kaboz-ink hover:border-kaboz-orange hover:text-kaboz-orange"
              }`}
            >
              {cat === "All" ? "All" : getCategoryDisplayName(cat)}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mb-5 flex flex-col gap-3 border-y border-kaboz-line bg-[#fafafa] px-3 py-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <p className="text-sm text-kaboz-mute">
          {productsLoading ? (
            "Loading products…"
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-kaboz-ink">
                {startIndex}–{endIndex}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-kaboz-ink">{sorted.length}</span>{" "}
              results
            </>
          )}
        </p>
        <label className="flex items-center gap-2 text-sm text-kaboz-mute">
          Sort by
          <select
            value={sortType}
            onChange={(e) => {
              setSortType(e.target.value);
              setPage(1);
            }}
            className="rounded-[6px] border border-kaboz-line bg-white px-3 py-2 text-sm font-medium text-kaboz-ink outline-none focus:border-kaboz-orange"
          >
            <option value="relevant">Default sorting</option>
            <option value="latest">Sort by latest</option>
            <option value="low-high">Price: low to high</option>
            <option value="high-low">Price: high to low</option>
            <option value="name">Sort by name</option>
          </select>
        </label>
      </div>

      <section>
        {productsLoading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-[6px] bg-kaboz-soft" />
                <div className="mt-3 h-3 w-2/3 rounded bg-kaboz-soft" />
                <div className="mt-2 h-3 w-full rounded bg-kaboz-soft" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <p className="rounded-[6px] border border-dashed border-kaboz-line bg-kaboz-soft px-4 py-14 text-center text-sm text-kaboz-mute">
            No products available right now.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-[1%] xl:grid-cols-4">
              {pageItems.map((item) => (
                <CatalogProductCard
                  key={item._id}
                  id={item._id}
                  slug={item.slug}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                  originalPrice={item.originalPrice}
                />
              ))}
            </div>

            <PaginationBar
              page={safePage}
              totalPages={totalPages}
              totalItems={sorted.length}
              pageSize={PAGE_SIZE}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              itemLabel="products"
            />
          </>
        )}
      </section>

      {services.length > 0 ? (
        <section className="mt-10 rounded-[6px] border border-kaboz-line bg-white p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kaboz-green">
            Services
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-kaboz-ink">
            What we offer
          </h2>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <li
                key={service}
                className="flex items-center gap-2 text-sm text-kaboz-ink sm:text-base"
              >
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-kaboz-green-soft text-kaboz-green">
                  <IconCheck className="h-3 w-3" />
                </span>
                {service}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8 text-center">
        <Link
          to="/collection"
          className="inline-flex items-center gap-1 text-sm font-bold text-kaboz-orange hover:underline"
        >
          Browse full shop
          <IconArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default CategoryHubPage;
