import React, { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import CatalogProductCard from "./CatalogProductCard";
import Breadcrumbs from "./Breadcrumbs";
import PaginationBar from "./PaginationBar";
import { getCategoryDisplayName } from "../utils/categoryLinks";
import { IconArrowLeft } from "./ui/Icons";

const PAGE_SIZE = 24;

/**
 * Living category shop — Onsus left-sidebar grid layout.
 */
const LivingCategoryLanding = ({
  categories = [],
  breadcrumbLabel,
  eyebrow = "Kaboz Living",
  title,
  subtitle,
  heroImage,
  heroAlt,
  pageTitle,
  metaDescription,
  emptyMessage = "No products in this category right now.",
}) => {
  const { products, productsLoading } = useContext(ShopContext);
  const [page, setPage] = useState(1);
  const [activeSub, setActiveSub] = useState("All");
  const [sortType, setSortType] = useState("relevant");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPage(1);
    setActiveSub("All");
    setShowFilter(false);
  }, [breadcrumbLabel]);

  const categoryProducts = useMemo(
    () => products.filter((item) => categories.includes(item.category)),
    [products, categories]
  );

  const subcategories = useMemo(() => {
    const set = new Set(
      categoryProducts.map((p) => p.subCategory).filter(Boolean)
    );
    return ["All", ...[...set].sort()];
  }, [categoryProducts]);

  const filtered = useMemo(() => {
    let list =
      activeSub === "All"
        ? [...categoryProducts]
        : categoryProducts.filter((p) => p.subCategory === activeSub);

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
  }, [categoryProducts, activeSub, sortType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );
  const startIndex = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * PAGE_SIZE, filtered.length);

  return (
    <div className="pb-6">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <Breadcrumbs
        items={[
          { label: "Kaboz Living", to: "/living" },
          { label: breadcrumbLabel },
        ]}
      />

      {/* Slim Onsus-style category banner */}
      <div className="group relative mb-5 overflow-hidden rounded-[6px] border border-kaboz-line sm:mb-6">
        <div className="relative aspect-[21/5] min-h-[100px] w-full overflow-hidden sm:min-h-[120px]">
          <img
            src={heroImage}
            alt={heroAlt || title}
            className="kb-img-pop absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-kaboz-orange">
              {eyebrow}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1.5 max-w-xl text-sm text-white/75 line-clamp-2">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Toolbar — results + filters toggle + sort */}
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
              <span className="font-semibold text-kaboz-ink">
                {filtered.length}
              </span>{" "}
              results
            </>
          )}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilter((v) => !v)}
            className="inline-flex items-center gap-2 rounded-[6px] border border-kaboz-line bg-white px-3 py-2 text-sm font-semibold text-kaboz-ink lg:hidden"
          >
            Filters {showFilter ? "−" : "+"}
          </button>
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
      </div>

      {/* Onsus shop: left sidebar + product grid */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside
          className={`w-full flex-shrink-0 lg:block lg:w-[267px] ${
            showFilter ? "block" : "hidden"
          }`}
        >
          <div className="sticky top-28 space-y-4">
            <div className="overflow-hidden rounded-[6px] border border-kaboz-line bg-white">
              <div className="bg-[#f5f5f5] px-4 py-3">
                <h2 className="text-sm font-bold text-kaboz-ink">
                  Filter Categories
                </h2>
              </div>
              <div className="max-h-72 space-y-1 overflow-y-auto px-2 py-3">
                {subcategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      setActiveSub(sub);
                      setPage(1);
                    }}
                    className={`flex w-full items-center rounded-[6px] px-2.5 py-2 text-left text-sm transition ${
                      activeSub === sub
                        ? "bg-kaboz-orange-soft font-semibold text-kaboz-orange"
                        : "text-kaboz-ink hover:bg-kaboz-soft"
                    }`}
                  >
                    {sub === "All" ? "All products" : getCategoryDisplayName(sub)}
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/living"
              className="inline-flex items-center gap-1.5 px-1 text-sm font-bold text-kaboz-green hover:underline"
            >
              <IconArrowLeft className="h-3.5 w-3.5" />
              Back to Kaboz Living
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square rounded-[6px] bg-kaboz-soft" />
                  <div className="mt-3 h-3 w-2/3 rounded bg-kaboz-soft" />
                  <div className="mt-2 h-3 w-full rounded bg-kaboz-soft" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="rounded-[6px] border border-dashed border-kaboz-line bg-kaboz-soft px-4 py-14 text-center text-sm text-kaboz-mute">
              {emptyMessage}
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
                totalItems={filtered.length}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                itemLabel="products"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivingCategoryLanding;
