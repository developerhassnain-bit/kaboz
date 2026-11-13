import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import BlogSidebar from "../components/BlogSidebar";
import PaginationBar from "../components/PaginationBar";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const PAGE_SIZE = 6;

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

const FolderIcon = () => (
  <svg
    className="h-3.5 w-3.5 flex-shrink-0"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.279 10.488c0 2.385-1.406 3.791-3.791 3.791H5.3C2.909 14.279 1.5 12.873 1.5 10.488V5.288C1.5 2.906 2.376 1.5 4.762 1.5h1.333c.479 0 .93.225 1.216.609l.609.809c.288.383.739.608 1.217.609h1.887C13.415 3.527 14.298 4.744 14.298 7.178l-.019 3.31z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.987 9.642h5.824"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setActiveCategory(categoryParam || "All");
    setPage(1);
  }, [categoryParam]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/blog/list?published=1`
        );
        if (!cancelled && response.data.success) {
          setBlogs(response.data.blogs || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredBlogs = useMemo(
    () =>
      activeCategory === "All"
        ? blogs
        : blogs.filter((blog) => blog.category === activeCategory),
    [blogs, activeCategory]
  );

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredBlogs.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="pb-12 sm:pb-16">
      <Helmet>
        <title>Blog | Kaboz</title>
        <meta
          name="description"
          content="Guides and tips on security, access control, networking, and living solutions from Kaboz."
        />
      </Helmet>

      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Blog List" }]}
      />

      {/* Onsus Blog List: single-column feed + right sidebar */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 xl:gap-14">
        <div className="min-w-0">
          {isLoading ? (
            <div className="space-y-12">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/9] rounded-[4px] bg-kaboz-soft" />
                  <div className="mt-5 space-y-3">
                    <div className="h-3 w-40 rounded bg-kaboz-soft" />
                    <div className="h-7 w-4/5 rounded bg-kaboz-soft" />
                    <div className="h-4 w-full rounded bg-kaboz-soft" />
                    <div className="h-4 w-3/4 rounded bg-kaboz-soft" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <p className="border border-dashed border-kaboz-line bg-kaboz-soft px-4 py-14 text-center text-sm text-kaboz-mute">
              No posts in this category yet.
            </p>
          ) : (
            <>
              <div className="space-y-12 lg:space-y-14">
                {pageItems.map((blog) => (
                  <article key={blog._id || blog.slug} className="group">
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="relative block aspect-[16/9] overflow-hidden rounded-[4px] bg-kaboz-soft"
                    >
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="kb-img-pop h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : null}
                    </Link>

                    <div className="mt-5">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] sm:text-[14px]">
                        {blog.category ? (
                          <button
                            type="button"
                            onClick={() => handleCategoryChange(blog.category)}
                            className="inline-flex items-center gap-1.5 font-medium text-kaboz-orange transition hover:underline"
                          >
                            <FolderIcon />
                            {blog.category}
                          </button>
                        ) : null}
                        {blog.date ? (
                          <span className="text-kaboz-mute">
                            {formatDate(blog.date)}
                          </span>
                        ) : null}
                      </div>

                      <h2 className="mt-3 text-[22px] font-semibold leading-snug text-kaboz-ink sm:text-[26px] lg:text-[28px]">
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="transition hover:text-kaboz-orange"
                        >
                          {blog.title}
                        </Link>
                      </h2>

                      {blog.excerpt ? (
                        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-kaboz-mute sm:text-[16px] sm:leading-7">
                          {blog.excerpt}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>

              <PaginationBar
                page={safePage}
                totalPages={totalPages}
                totalItems={filteredBlogs.length}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                itemLabel="posts"
              />
            </>
          )}
        </div>

        <BlogSidebar
          blogs={blogs}
          activeCategory={activeCategory}
          onCategorySelect={handleCategoryChange}
        />
      </div>
    </div>
  );
};

export default Blog;
