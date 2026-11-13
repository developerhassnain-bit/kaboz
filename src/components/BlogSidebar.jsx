import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const formatDate = (ts) => {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const ChevronIcon = () => (
  <svg
    viewBox="0 0 16 16"
    className="h-3.5 w-3.5 flex-shrink-0 text-kaboz-mute"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    aria-hidden
  >
    <path d="M6 3.5L10.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg
    viewBox="0 0 16 16"
    className="h-3.5 w-3.5 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden
  >
    <circle cx="8" cy="8" r="6" />
    <path d="M8 5v3.5l2 1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Onsus Blog List sidebar — Categories (boxed + chevrons) · Recent posts · Tags
 */
const BlogSidebar = ({
  blogs = [],
  activeCategory = "All",
  onCategorySelect,
  excludeSlug = "",
}) => {
  const categories = useMemo(() => {
    const counts = {};
    blogs.forEach((b) => {
      const cat = (b.category || "").trim();
      if (!cat) return;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [blogs]);

  const recent = useMemo(
    () =>
      [...blogs]
        .filter((b) => b.slug !== excludeSlug)
        .sort((a, b) => Number(b.date || 0) - Number(a.date || 0))
        .slice(0, 5),
    [blogs, excludeSlug]
  );

  const tags = useMemo(() => categories.map((c) => c.name), [categories]);

  const selectCategory = (name) => {
    if (typeof onCategorySelect === "function") onCategorySelect(name);
  };

  const categoryRowClass = (active) =>
    `flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-[14px] transition hover:text-kaboz-orange ${
      active ? "font-semibold text-kaboz-orange" : "text-kaboz-ink"
    }`;

  return (
    <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
      {/* Categories — bordered box + chevrons (Onsus) */}
      <section>
        <h2 className="mb-4 text-[18px] font-semibold text-kaboz-ink">
          Categories
        </h2>
        <ul className="overflow-hidden rounded-[6px] border border-kaboz-line">
          {typeof onCategorySelect === "function" ? (
            <li className="border-b border-kaboz-line last:border-b-0">
              <button
                type="button"
                onClick={() => selectCategory("All")}
                className={categoryRowClass(activeCategory === "All")}
              >
                <span>All</span>
                <ChevronIcon />
              </button>
            </li>
          ) : null}
          {categories.map((cat) => {
            const active = activeCategory === cat.name;
            return (
              <li
                key={cat.name}
                className="border-b border-kaboz-line last:border-b-0"
              >
                {typeof onCategorySelect === "function" ? (
                  <button
                    type="button"
                    onClick={() => selectCategory(cat.name)}
                    className={categoryRowClass(active)}
                  >
                    <span>{cat.name}</span>
                    <ChevronIcon />
                  </button>
                ) : (
                  <Link
                    to={`/blog?category=${encodeURIComponent(cat.name)}`}
                    className={categoryRowClass(active)}
                  >
                    <span>{cat.name}</span>
                    <ChevronIcon />
                  </Link>
                )}
              </li>
            );
          })}
          {categories.length === 0 ? (
            <li className="px-4 py-3 text-sm text-kaboz-mute">
              No categories yet.
            </li>
          ) : null}
        </ul>
      </section>

      {/* Recent posts */}
      <section>
        <h2 className="mb-4 text-[18px] font-semibold text-kaboz-ink">
          Recent posts
        </h2>
        <ul className="space-y-5">
          {recent.map((post) => (
            <li key={post._id || post.slug}>
              <Link to={`/blog/${post.slug}`} className="group flex gap-3.5">
                <div className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[4px] bg-kaboz-soft">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt=""
                      className="kb-img-pop h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-kaboz-ink transition group-hover:text-kaboz-orange">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-kaboz-mute">
                    <ClockIcon />
                    {formatDate(post.date)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
          {recent.length === 0 ? (
            <li className="text-sm text-kaboz-mute">No recent posts.</li>
          ) : null}
        </ul>
      </section>

      {/* Tags */}
      {tags.length > 0 ? (
        <section>
          <h2 className="mb-4 text-[18px] font-semibold text-kaboz-ink">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = activeCategory === tag;
              if (typeof onCategorySelect === "function") {
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => selectCategory(active ? "All" : tag)}
                    className={`rounded-[3px] border px-2.5 py-1 text-[12px] transition ${
                      active
                        ? "border-kaboz-orange bg-kaboz-orange text-white"
                        : "border-kaboz-line bg-white text-kaboz-ink hover:border-kaboz-orange hover:text-kaboz-orange"
                    }`}
                  >
                    {tag}
                  </button>
                );
              }
              return (
                <Link
                  key={tag}
                  to={`/blog?category=${encodeURIComponent(tag)}`}
                  className="rounded-[3px] border border-kaboz-line bg-white px-2.5 py-1 text-[12px] text-kaboz-ink transition hover:border-kaboz-green hover:text-kaboz-green"
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </aside>
  );
};

export default BlogSidebar;
