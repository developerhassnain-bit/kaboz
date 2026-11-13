import React, { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import CatalogProductCard from "../components/CatalogProductCard";
import Breadcrumbs from "../components/Breadcrumbs";
import PaginationBar from "../components/PaginationBar";
import useCategories from "../hooks/useCategories";
import {
  cameraRecorderRank,
  getCategoryDisplayName,
  getCategoryPath,
  isLivingCategory,
  isSecurityCategory,
  LIVING_HUB_PATH,
  orderNavCategories,
  SECURITY_RELATED_CATEGORIES,
  sortCameraRecorderSubs,
} from "../utils/categoryLinks";
import { IconChevronDown } from "../components/ui/Icons";

const PAGE_SIZE = 24;

const Accordion = ({ title, open, onToggle, children }) => (
  <div className="border-t border-[#d8dde6] pt-4 pb-3">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-2 text-left"
      aria-expanded={open}
    >
      <span className="text-[15px] font-medium capitalize leading-5 text-[#1d252c] md:text-[16px]">
        {title}
      </span>
      <IconChevronDown
        className={`h-3.5 w-3.5 text-kaboz-ink transition ${open ? "rotate-180" : ""}`}
      />
    </button>
    {open ? <div className="mt-4">{children}</div> : null}
  </div>
);

const Collection = () => {
  const {
    products,
    search,
    setSearch,
    productsLoading,
    productsError,
    refreshProducts,
  } = useContext(ShopContext);
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showFilter, setShowFilter] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [draftMin, setDraftMin] = useState("");
  const [draftMax, setDraftMax] = useState("");
  const [openPanels, setOpenPanels] = useState({
    category: true,
    brand: true,
    price: true,
    subcategory: true,
  });
  const [brandLimit, setBrandLimit] = useState(6);

  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const orderedCategories = useMemo(
    () => orderNavCategories(categories),
    [categories]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, searchParams.get("category")]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const subcategoryFromUrl = searchParams.get("subcategory");
    const searchFromUrl = searchParams.get("search");
    const brandFromUrl = searchParams.get("brand");

    if (categoryFromUrl) {
      setSelectedCategories([categoryFromUrl]);
    } else {
      setSelectedCategories([]);
    }

    if (subcategoryFromUrl) {
      const parent = categories.find((c) => c.name === categoryFromUrl);
      const matched = parent?.subcategories?.find(
        (s) => s.slug === subcategoryFromUrl || s.name === subcategoryFromUrl
      );
      setSelectedSubcategories([matched?.name || subcategoryFromUrl]);
    } else {
      setSelectedSubcategories([]);
    }

    if (brandFromUrl) {
      setSelectedBrands([brandFromUrl]);
    } else {
      setSelectedBrands([]);
    }

    if (searchFromUrl) {
      setSearch(searchFromUrl);
    }
  }, [searchParams, categories, setSearch]);

  const availableSubcategories = useMemo(() => {
    if (selectedCategories.length === 0) return [];
    const names = [];
    const seen = new Set();
    categories
      .filter((cat) => selectedCategories.includes(cat.name))
      .forEach((cat) => {
        const subs = isSecurityCategory(cat.name)
          ? sortCameraRecorderSubs(cat.subcategories || [])
          : cat.subcategories || [];
        subs.forEach((sub) => {
          if (!sub?.name || seen.has(sub.name)) return;
          seen.add(sub.name);
          names.push(sub.name);
        });
      });
    return names;
  }, [categories, selectedCategories]);

  useEffect(() => {
    setSelectedSubcategories((prev) =>
      prev.filter((sub) => availableSubcategories.includes(sub))
    );
  }, [availableSubcategories]);

  const setPage = (page) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    setSearchParams(params, { replace: true });
  };

  const resetPageInParams = (params) => {
    params.delete("page");
    return params;
  };

  const toggleCategory = (value) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];

      const params = resetPageInParams(new URLSearchParams(searchParams));
      if (next.length === 1) {
        params.set("category", next[0]);
      } else {
        params.delete("category");
      }
      params.delete("subcategory");
      setSearchParams(params, { replace: true });
      return next;
    });
    setSelectedSubcategories([]);
  };

  const toggleSubCategory = (value) => {
    setSelectedSubcategories((prev) => {
      const next = prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value];

      const params = resetPageInParams(new URLSearchParams(searchParams));
      if (next.length === 1) {
        const parent = categories.find((c) =>
          c.subcategories?.some((s) => s.name === next[0])
        );
        const slug =
          parent?.subcategories?.find((s) => s.name === next[0])?.slug ||
          next[0];
        params.set("subcategory", slug);
      } else {
        params.delete("subcategory");
      }
      setSearchParams(params, { replace: true });
      return next;
    });
  };

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => {
      const next = prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand];
      const params = resetPageInParams(new URLSearchParams(searchParams));
      if (next.length === 1) params.set("brand", next[0]);
      else params.delete("brand");
      setSearchParams(params, { replace: true });
      return next;
    });
  };

  const applyPrice = () => {
    setPriceMin(draftMin);
    setPriceMax(draftMax);
    setPage(1);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search?.trim()) {
      const q = search.toLowerCase();
      list = list.filter((item) => item.name?.toLowerCase().includes(q));
    }

    if (selectedCategories.length > 0) {
      list = list.filter((item) => selectedCategories.includes(item.category));
    }

    if (selectedSubcategories.length > 0) {
      list = list.filter((item) =>
        selectedSubcategories.includes(item.subCategory)
      );
    }

    if (selectedBrands.length > 0) {
      list = list.filter((item) =>
        selectedBrands.includes((item.brand || "").trim())
      );
    }

    const min = priceMin !== "" ? Number(priceMin) : null;
    const max = priceMax !== "" ? Number(priceMax) : null;
    if (min !== null && !Number.isNaN(min)) {
      list = list.filter((item) => Number(item.price) >= min);
    }
    if (max !== null && !Number.isNaN(max)) {
      list = list.filter((item) => Number(item.price) <= max);
    }

    const securityView =
      selectedCategories.length === 1 &&
      isSecurityCategory(selectedCategories[0]);

    const byCameraThenRecorder = (a, b) =>
      cameraRecorderRank(a.subCategory) - cameraRecorderRank(b.subCategory);

    switch (sortType) {
      case "low-high":
        list.sort((a, b) => a.price - b.price || byCameraThenRecorder(a, b));
        break;
      case "high-low":
        list.sort((a, b) => b.price - a.price || byCameraThenRecorder(a, b));
        break;
      case "name":
        list.sort(
          (a, b) => a.name.localeCompare(b.name) || byCameraThenRecorder(a, b)
        );
        break;
      case "latest":
        list.sort(
          (a, b) =>
            Number(b.date || 0) - Number(a.date || 0) ||
            byCameraThenRecorder(a, b)
        );
        break;
      default:
        if (securityView) {
          list.sort(
            (a, b) =>
              byCameraThenRecorder(a, b) ||
              a.name.localeCompare(b.name)
          );
        }
        break;
    }
    return list;
  }, [
    products,
    search,
    selectedCategories,
    selectedSubcategories,
    selectedBrands,
    sortType,
    priceMin,
    priceMax,
  ]);

  const brandOptions = useMemo(() => {
    const counts = new Map();
    let base = [...products];
    if (selectedCategories.length > 0) {
      base = base.filter((p) => selectedCategories.includes(p.category));
    }
    base.forEach((p) => {
      const b = (p.brand || "").trim();
      if (!b) return;
      counts.set(b, (counts.get(b) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, selectedCategories]);

  const categoryCounts = useMemo(() => {
    const counts = new Map();
    products.forEach((p) => {
      if (!p.category) return;
      counts.set(p.category, (counts.get(p.category) || 0) + 1);
    });
    return counts;
  }, [products]);

  const subcategoryCounts = useMemo(() => {
    const counts = new Map();
    let base = products;
    if (selectedCategories.length > 0) {
      base = products.filter((p) => selectedCategories.includes(p.category));
    }
    base.forEach((p) => {
      if (!p.subCategory) return;
      counts.set(p.subCategory, (counts.get(p.subCategory) || 0) + 1);
    });
    return counts;
  }, [products, selectedCategories]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, safePage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages >= 1) {
      setPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setPriceMin("");
    setPriceMax("");
    setDraftMin("");
    setDraftMax("");
    setSearch("");
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSubcategories.length > 0 ||
    selectedBrands.length > 0 ||
    priceMin !== "" ||
    priceMax !== "" ||
    Boolean(search?.trim());

  const activeCategoryName =
    selectedCategories.length === 1 ? selectedCategories[0] : null;
  const isSecurityHub = isSecurityCategory(activeCategoryName);
  const isLivingHub = isLivingCategory(activeCategoryName);
  const heading = activeCategoryName
    ? getCategoryDisplayName(activeCategoryName)
    : search?.trim()
      ? `Results for “${search.trim()}”`
      : "Shop";

  const shortcutCategories = useMemo(() => {
    if (isSecurityHub) {
      const allowed = new Set(SECURITY_RELATED_CATEGORIES);
      return orderedCategories.filter((c) => allowed.has(c.name));
    }
    if (isLivingHub) {
      return orderedCategories.filter((c) => isLivingCategory(c.name));
    }
    return orderedCategories;
  }, [orderedCategories, isSecurityHub, isLivingHub]);

  const breadcrumbItems = [{ label: "Home", to: "/" }];
  if (isSecurityHub) {
    breadcrumbItems.push({
      label: getCategoryDisplayName(activeCategoryName),
      to: getCategoryPath(activeCategoryName),
    });
  } else if (isLivingHub) {
    breadcrumbItems.push({ label: "Kaboz Living", to: LIVING_HUB_PATH });
    if (activeCategoryName !== "Curtains") {
      breadcrumbItems.push({
        label: getCategoryDisplayName(activeCategoryName),
        to: getCategoryPath(activeCategoryName),
      });
    }
  } else {
    breadcrumbItems.push({ label: "Shop", to: "/collection" });
    if (activeCategoryName) {
      breadcrumbItems.push({
        label: getCategoryDisplayName(activeCategoryName),
        to: `/collection?category=${encodeURIComponent(activeCategoryName)}`,
      });
    }
  }
  if (selectedSubcategories.length === 1) {
    breadcrumbItems.push({ label: selectedSubcategories[0] });
  } else if (!activeCategoryName && search?.trim()) {
    breadcrumbItems.push({ label: "Search" });
  }

  const pageTitle = isSecurityHub
    ? "CCTV Cameras | Cameras & Smart Protection"
    : isLivingHub
      ? `${heading} | Kaboz Living`
      : search?.trim()
        ? `${search.trim()} | Kaboz Shop`
        : "Shop | Kaboz";

  const togglePanel = (key) =>
    setOpenPanels((prev) => ({ ...prev, [key]: !prev[key] }));

  const sortOptions = [
    { value: "relevant", label: "Default sorting" },
    { value: "latest", label: "Sort by latest" },
    { value: "low-high", label: "Price: low to high" },
    { value: "high-low", label: "Price: high to low" },
    { value: "name", label: "Sort by name" },
  ];

  const sidebar = (
    <div className="space-y-0">
      {hasActiveFilters ? (
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-sm font-medium text-kaboz-orange underline"
          >
            Clear all
          </button>
        </div>
      ) : null}

      <Accordion
        title="category"
        open={openPanels.category}
        onToggle={() => togglePanel("category")}
      >
        <div className="flex max-h-[300px] flex-col gap-3.5 overflow-y-auto pr-3">
          {isLoadingCategories ? (
            <p className="text-xs text-kaboz-mute">Loading…</p>
          ) : (
            (isSecurityHub || isLivingHub
              ? shortcutCategories
              : orderedCategories
            ).map((cat) => {
              const count = categoryCounts.get(cat.name) || 0;
              const active = selectedCategories.includes(cat.name);
              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => toggleCategory(cat.name)}
                  className={`flex w-full items-center justify-between gap-2 text-left text-[14px] transition hover:underline md:text-[15px] ${
                    active
                      ? "font-semibold text-kaboz-orange"
                      : "text-kaboz-ink"
                  }`}
                >
                  <span className="truncate">
                    {getCategoryDisplayName(cat.name)}
                  </span>
                  <span className="flex-shrink-0 text-[13px] text-kaboz-mute">
                    {count}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </Accordion>

      {availableSubcategories.length > 0 ? (
        <Accordion
          title="subcategory"
          open={openPanels.subcategory}
          onToggle={() => togglePanel("subcategory")}
        >
          <div className="flex max-h-[240px] flex-col gap-3 overflow-y-auto pr-3">
            {availableSubcategories.map((label) => {
              const active = selectedSubcategories.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleSubCategory(label)}
                  className={`flex w-full items-center justify-between gap-2 text-left text-[14px] transition hover:underline ${
                    active
                      ? "font-semibold text-kaboz-orange"
                      : "text-kaboz-ink"
                  }`}
                >
                  <span className="truncate">{label}</span>
                  <span className="text-[13px] text-kaboz-mute">
                    {subcategoryCounts.get(label) || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </Accordion>
      ) : null}

      {brandOptions.length > 0 ? (
        <Accordion
          title="brand"
          open={openPanels.brand}
          onToggle={() => togglePanel("brand")}
        >
          <div className="flex flex-col gap-3.5">
            {brandOptions.slice(0, brandLimit).map(({ name, count }) => (
              <label
                key={name}
                className="flex cursor-pointer items-center justify-between gap-2 text-[14px] text-kaboz-ink"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded-[2px] border-[#c5cbd5] accent-kaboz-orange"
                    checked={selectedBrands.includes(name)}
                    onChange={() => toggleBrand(name)}
                  />
                  <span className="truncate">{name}</span>
                </span>
                <span className="text-[13px] text-kaboz-mute">{count}</span>
              </label>
            ))}
            {brandOptions.length > brandLimit ? (
              <button
                type="button"
                onClick={() => setBrandLimit((n) => n + 12)}
                className="text-left text-sm font-medium text-kaboz-orange underline"
              >
                View more
              </button>
            ) : brandOptions.length > 6 && brandLimit > 6 ? (
              <button
                type="button"
                onClick={() => setBrandLimit(6)}
                className="text-left text-sm font-medium text-kaboz-orange underline"
              >
                View less
              </button>
            ) : null}
          </div>
        </Accordion>
      ) : null}

      <Accordion
        title="price"
        open={openPanels.price}
        onToggle={() => togglePanel("price")}
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={draftMin}
            onChange={(e) => setDraftMin(e.target.value)}
            className="w-full rounded-[4px] border border-[#c5cbd5] px-2.5 py-2 text-sm outline-none focus:border-kaboz-orange"
          />
          <span className="text-kaboz-mute">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={draftMax}
            onChange={(e) => setDraftMax(e.target.value)}
            className="w-full rounded-[4px] border border-[#c5cbd5] px-2.5 py-2 text-sm outline-none focus:border-kaboz-orange"
          />
        </div>
        <button
          type="button"
          onClick={applyPrice}
          className="mt-3 w-full rounded-[4px] bg-kaboz-orange px-3 py-2 text-sm font-semibold text-white transition hover:bg-kaboz-orange-dark"
        >
          Apply
        </button>
      </Accordion>
    </div>
  );

  const sortSelect = (
    <label className="hidden items-center gap-2 text-sm text-kaboz-mute sm:flex">
      <span className="font-medium text-[#1d252c]">Sort by</span>
      <select
        value={sortType}
        onChange={(e) => {
          setSortType(e.target.value);
          setPage(1);
        }}
        className="rounded-[4px] border border-[#c5cbd5] bg-white px-3 py-2 text-sm font-medium text-kaboz-ink outline-none focus:border-kaboz-orange"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="pb-16 sm:pb-10">
      <Helmet>
        <title>{pageTitle}</title>
        {isSecurityHub ? (
          <meta
            name="description"
            content="Shop CCTV cameras, recorders, and smart protection systems for homes and businesses across the UAE."
          />
        ) : null}
        {isSecurityHub ? (
          <link
            rel="canonical"
            href={
              typeof window !== "undefined"
                ? `${window.location.origin}${getCategoryPath(activeCategoryName)}`
                : getCategoryPath(activeCategoryName)
            }
          />
        ) : null}
      </Helmet>

      <Breadcrumbs items={breadcrumbItems} />

      {/* Adarc title + sort row */}
      <div className="mb-4 flex items-end justify-between gap-4 sm:mb-5">
        <h1 className="font-display text-[22px] font-bold leading-tight text-kaboz-ink sm:text-[26px]">
          {heading}
        </h1>
        {sortSelect}
      </div>

      {isLivingHub ? (
        <div className="mb-4">
          <Link
            to={LIVING_HUB_PATH}
            className="text-sm font-medium text-kaboz-orange hover:underline"
          >
            ← Living hub
          </Link>
        </div>
      ) : null}

      <div className="flex w-full gap-4 lg:gap-5">
        {/* Desktop sidebar — Adarc ~260px */}
        <aside className="hidden w-[240px] flex-shrink-0 overflow-x-hidden lg:block xl:w-[260px]">
          <div className="sticky top-28 pr-1">{sidebar}</div>
        </aside>

        {/* Mobile filter drawer */}
        {showFilter ? (
          <div className="fixed inset-0 z-[90] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close filters"
              onClick={() => setShowFilter(false)}
            />
            <div className="absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-kaboz-line px-4 py-3">
                <p className="text-base font-bold text-kaboz-ink">Filter</p>
                <button
                  type="button"
                  onClick={() => setShowFilter(false)}
                  className="text-sm font-semibold text-kaboz-orange"
                >
                  Done
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-2">{sidebar}</div>
            </div>
          </div>
        ) : null}

        {/* Mobile sort sheet */}
        {showSortSheet ? (
          <div className="fixed inset-0 z-[90] sm:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close sort"
              onClick={() => setShowSortSheet(false)}
            />
            <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-4 pb-8 shadow-xl">
              <p className="mb-3 text-base font-bold text-kaboz-ink">Sort by</p>
              <ul className="space-y-1">
                {sortOptions.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        setSortType(opt.value);
                        setPage(1);
                        setShowSortSheet(false);
                      }}
                      className={`w-full rounded-[6px] px-3 py-3 text-left text-sm font-medium ${
                        sortType === opt.value
                          ? "bg-kaboz-orange/10 text-kaboz-orange"
                          : "text-kaboz-ink"
                      }`}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          {productsLoading ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse border border-[#c5cbd5] p-3"
                >
                  <div className="aspect-square bg-kaboz-soft" />
                  <div className="mt-3 h-3 w-full rounded bg-kaboz-soft" />
                  <div className="mt-2 h-3 w-2/3 rounded bg-kaboz-soft" />
                  <div className="mt-3 h-6 w-1/3 rounded bg-kaboz-soft" />
                </div>
              ))}
            </div>
          ) : productsError ? (
            <div className="rounded-[6px] border border-red-200 bg-red-50 px-4 py-12 text-center">
              <p className="font-display text-lg font-semibold text-kaboz-ink">
                Couldn’t load products
              </p>
              <p className="mt-1 text-sm text-kaboz-mute">{productsError}</p>
              <button
                type="button"
                onClick={refreshProducts}
                className="mt-4 rounded-[6px] bg-kaboz-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kaboz-orange-dark"
              >
                Retry
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-[6px] border border-dashed border-kaboz-line bg-kaboz-soft px-4 py-16 text-center">
              <p className="font-display text-lg font-semibold text-kaboz-ink">
                No products found
              </p>
              <p className="mt-1 text-sm text-kaboz-mute">
                Try clearing filters or searching a different term.
              </p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 rounded-[6px] bg-kaboz-orange px-4 py-2 text-sm font-semibold text-white hover:bg-kaboz-orange-dark"
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-[1%] xl:grid-cols-4">
                {paginatedProducts.map((item) => (
                  <CatalogProductCard
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    slug={item.slug}
                    price={item.price}
                    originalPrice={item.originalPrice}
                    image={item.image}
                  />
                ))}
              </div>

              <PaginationBar
                page={safePage}
                totalPages={totalPages}
                totalItems={filteredProducts.length}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                itemLabel="results"
              />
            </>
          )}
        </div>
      </div>

      {/* Adarc mobile sticky SORT | FILTER */}
      <div className="fixed inset-x-0 bottom-[3.75rem] z-[70] flex border-t border-[#d8dde6] bg-[#f3f3f3] sm:bottom-0 lg:hidden">
        <button
          type="button"
          onClick={() => {
            setShowSortSheet(true);
            setShowFilter(false);
          }}
          className="flex flex-1 items-center justify-center py-3.5 text-[13px] font-bold uppercase tracking-wide text-kaboz-ink"
        >
          Sort
        </button>
        <div className="w-px self-stretch bg-[#d8dde6]" />
        <button
          type="button"
          onClick={() => {
            setShowFilter(true);
            setShowSortSheet(false);
          }}
          className="flex flex-1 items-center justify-center py-3.5 text-[13px] font-bold uppercase tracking-wide text-kaboz-ink"
        >
          Filter
        </button>
      </div>
    </div>
  );
};

export default Collection;
