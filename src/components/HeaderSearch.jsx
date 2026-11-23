import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import useCategories from "../hooks/useCategories";
import {
  getCategoryDisplayName,
  getCategoryPath,
  getDepartmentCategories,
} from "../utils/categoryLinks";
import { IconChevronDown } from "./ui/Icons";

const MAX_RESULTS = 6;

const HeaderSearch = ({
  className = "",
  inputClassName = "",
  variant = "light",
}) => {
  const { search, setSearch, products, currency } = useContext(ShopContext);
  const { t } = useLanguage();
  const { categories } = useCategories();
  const [focused, setFocused] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();

  const categoryOptions = useMemo(
    () => getDepartmentCategories(categories),
    [categories]
  );

  const results = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return products
      .filter((item) => {
        const nameMatch = item.name?.toLowerCase().includes(q);
        if (!nameMatch) return false;
        if (!categoryFilter) return true;
        return item.category === categoryFilter;
      })
      .slice(0, MAX_RESULTS);
  }, [search, products, categoryFilter]);

  const showDropdown = focused && search.trim().length > 0;

  const goToProduct = (item) => {
    setSearch("");
    setFocused(false);
    navigate(`/product/${item.slug}`);
  };

  const goToAllResults = () => {
    const q = search.trim();
    setFocused(false);
    if (categoryFilter && !q) {
      navigate(getCategoryPath(categoryFilter));
      return;
    }
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (categoryFilter) params.set("category", categoryFilter);
    navigate(`/collection?${params.toString()}`);
  };

  const onCategoryChange = (value) => {
    setCategoryFilter(value);
    if (value && !search.trim()) {
      navigate(getCategoryPath(value));
    }
  };

  const dark = variant === "dark";

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex h-11 w-full items-center rounded-full border-2 border-kaboz-orange bg-white sm:h-12">
        <div className="relative flex h-full flex-shrink-0 items-center border-r border-[#e5e7eb]">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label={t("allCategories")}
            className="h-full max-w-[132px] cursor-pointer appearance-none truncate bg-transparent py-0 pl-4 pr-7 text-[12px] font-medium text-kaboz-ink outline-none sm:max-w-[160px] sm:pl-5 sm:pr-8 sm:text-[13px]"
          >
            <option value="">{t("allCategories")}</option>
            {categoryOptions.map((cat) => (
              <option key={cat._id || cat.name} value={cat.filterName || cat.name}>
                {getCategoryDisplayName(cat.name)}
              </option>
            ))}
          </select>
          <IconChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-kaboz-ink sm:right-3 sm:h-3.5 sm:w-3.5" />
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 160)}
          onKeyDown={(e) => {
            if (e.key === "Enter") goToAllResults();
          }}
          placeholder={t("searchProducts")}
          className={`min-w-0 flex-1 bg-transparent px-3 text-[14px] text-kaboz-ink outline-none placeholder:text-gray-400 sm:px-4 sm:text-[15px] ${inputClassName}`}
        />
        <button
          type="button"
          onClick={goToAllResults}
          className="mr-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-kaboz-orange text-white transition hover:bg-kaboz-orange-dark sm:mr-1.5 sm:h-9 sm:w-9"
          aria-label={t("search")}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </div>

      {showDropdown && (
        <div className="absolute left-0 top-full z-[600] mt-2 w-full overflow-hidden rounded-2xl border border-kaboz-line bg-white text-left shadow-mega mega-enter">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-kaboz-mute">
              No products found.
            </p>
          ) : (
            <>
              <div className="max-h-[320px] divide-y divide-kaboz-line overflow-y-auto">
                {results.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => goToProduct(item)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-kaboz-soft"
                  >
                    <img
                      src={item.image?.[0]}
                      alt={item.name}
                      className="h-11 w-11 flex-shrink-0 rounded object-contain bg-kaboz-soft"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-kaboz-ink">
                        {item.name}
                      </p>
                      <p className="text-xs text-kaboz-mute">
                        {currency}
                        {item.price}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={goToAllResults}
                className="w-full border-t border-kaboz-line bg-kaboz-soft py-2.5 text-xs font-semibold text-kaboz-ink hover:bg-kaboz-line/60"
              >
                See all results for “{search}”
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;
