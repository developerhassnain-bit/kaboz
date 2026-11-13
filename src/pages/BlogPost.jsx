import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { toast } from "react-toastify";
import Breadcrumbs from "../components/Breadcrumbs";
import BlogSidebar from "../components/BlogSidebar";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [allBlogs, setAllBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [comment, setComment] = useState({
    message: "",
    name: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    window.scrollTo(0, 0);

    (async () => {
      setIsLoading(true);
      setNotFound(false);
      try {
        const [postRes, listRes] = await Promise.all([
          axios.get(`${backendUrl}/api/blog/${slug}`),
          axios.get(`${backendUrl}/api/blog/list?published=1`),
        ]);

        if (cancelled) return;

        if (!postRes.data.success || !postRes.data.blog) {
          setNotFound(true);
          return;
        }

        setPost(postRes.data.blog);
        setAllBlogs(listRes.data.blogs || []);
      } catch (error) {
        console.error(error);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const { prevPost, nextPost, relatedPosts } = useMemo(() => {
    if (!post || !allBlogs.length) {
      return { prevPost: null, nextPost: null, relatedPosts: [] };
    }
    const ordered = [...allBlogs].sort(
      (a, b) => Number(b.date || 0) - Number(a.date || 0)
    );
    const idx = ordered.findIndex((b) => b.slug === post.slug);
    return {
      prevPost: idx > 0 ? ordered[idx - 1] : null,
      nextPost: idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null,
      relatedPosts: ordered
        .filter(
          (b) =>
            b.slug !== post.slug &&
            b.category &&
            post.category &&
            b.category === post.category
        )
        .slice(0, 3),
    };
  }, [post, allBlogs]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.message.trim() || !comment.name.trim() || !comment.email.trim()) {
      toast.error("Please fill in all comment fields");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Comment submitted — thank you!");
      setComment({ message: "", name: "", email: "" });
      setSubmitting(false);
    }, 400);
  };

  if (!isLoading && notFound) {
    return <Navigate to="/blog" replace />;
  }

  if (isLoading || !post) {
    return (
      <div className="pb-6">
        <p className="py-16 text-center text-sm text-kaboz-mute">Loading…</p>
      </div>
    );
  }

  const canonicalPath = `/blog/${post.slug || slug}`;
  const pageTitle = post.metaTitle || `${post.title} | Kaboz Blog`;
  const pageDescription = post.metaDescription || post.excerpt || "";
  const canonicalHref =
    typeof window !== "undefined"
      ? `${window.location.origin}${canonicalPath}`
      : canonicalPath;

  const paragraphs = Array.isArray(post.content) ? post.content : [];
  const lead = post.excerpt || paragraphs[0] || "";
  const bodyParas = post.excerpt ? paragraphs : paragraphs.slice(1);

  return (
    <div className="pb-12 sm:pb-16">
      <Helmet>
        <title>{pageTitle}</title>
        {pageDescription ? (
          <meta name="description" content={pageDescription} />
        ) : null}
        <link rel="canonical" href={canonicalHref} />
      </Helmet>

      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Blog", to: "/blog" },
          { label: post.title },
        ]}
      />

      {/* Onsus blog single: article + right sidebar */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_270px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0">
          <h1 className="text-[28px] font-semibold leading-[1.25] tracking-tight text-kaboz-ink sm:text-[36px] lg:text-[44px] xl:text-[50px]">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px]">
            {post.category ? (
              <Link
                to={`/blog?category=${encodeURIComponent(post.category)}`}
                className="inline-flex items-center gap-1.5 font-medium text-kaboz-orange transition hover:underline"
              >
                <FolderIcon />
                {post.category}
              </Link>
            ) : null}
            {post.date ? (
              <span className="text-kaboz-mute">{formatDate(post.date)}</span>
            ) : null}
            {post.author ? (
              <span className="text-kaboz-mute">by {post.author}</span>
            ) : null}
          </div>

          {lead ? (
            <h2 className="mt-8 text-[20px] font-semibold leading-snug text-kaboz-ink sm:text-[22px]">
              {lead}
            </h2>
          ) : null}

          {post.image ? (
            <div className="mt-6 overflow-hidden bg-kaboz-soft">
              <img
                src={post.image}
                alt={post.title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mt-8 space-y-5 text-[15px] leading-[1.85] text-[#444] sm:text-[16px]">
            {bodyParas.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          {post.category ? (
            <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-kaboz-line pt-6">
              <span className="mr-1 text-sm font-semibold text-kaboz-ink">
                Tags:
              </span>
              <Link
                to={`/blog?category=${encodeURIComponent(post.category)}`}
                className="rounded-[3px] border border-kaboz-line px-2.5 py-1 text-[12px] text-kaboz-ink transition hover:border-kaboz-orange hover:text-kaboz-orange"
              >
                {post.category}
              </Link>
            </div>
          ) : null}

          {/* Post navigator */}
          {(prevPost || nextPost) && (
            <nav className="mt-8 grid grid-cols-1 gap-4 border-y border-kaboz-line py-6 sm:grid-cols-2">
              {prevPost ? (
                <Link
                  to={`/blog/${prevPost.slug}`}
                  className="group block text-left"
                >
                  <span className="text-[12px] uppercase tracking-wide text-kaboz-mute">
                    Previous
                  </span>
                  <span className="mt-1 block text-[14px] font-semibold text-kaboz-ink transition group-hover:text-kaboz-orange">
                    {prevPost.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {nextPost ? (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="group block text-left sm:text-right"
                >
                  <span className="text-[12px] uppercase tracking-wide text-kaboz-mute">
                    Next
                  </span>
                  <span className="mt-1 block text-[14px] font-semibold text-kaboz-ink transition group-hover:text-kaboz-orange">
                    {nextPost.title}
                  </span>
                </Link>
              ) : null}
            </nav>
          )}

          {/* Related posts — Onsus 3-col grid */}
          {relatedPosts.length > 0 ? (
            <section className="mt-10">
              <h3 className="border-b border-kaboz-line pb-3 text-[20px] font-semibold text-kaboz-ink">
                Related posts
              </h3>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related._id || related.slug}
                    to={`/blog/${related.slug}`}
                    className="group block"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-kaboz-soft">
                      {related.image ? (
                        <img
                          src={related.image}
                          alt={related.title}
                          className="kb-img-pop h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                    <p className="mt-3 text-[12px] text-kaboz-mute">
                      {formatDate(related.date)}
                    </p>
                    <h4 className="mt-1 text-[15px] font-semibold leading-snug text-kaboz-ink transition group-hover:text-kaboz-orange">
                      {related.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* Comment form — Onsus visual */}
          <section className="mt-12 border-t border-kaboz-line pt-8">
            <h3 className="text-[22px] font-semibold text-kaboz-ink">
              Add Your Comment
            </h3>
            <form onSubmit={handleCommentSubmit} className="mt-6 space-y-4">
              <fieldset>
                <label
                  htmlFor="comment-message"
                  className="mb-1.5 block text-sm font-medium text-kaboz-ink"
                >
                  Comment:
                </label>
                <textarea
                  id="comment-message"
                  name="comment"
                  rows={6}
                  placeholder="Message"
                  value={comment.message}
                  onChange={(e) =>
                    setComment((c) => ({ ...c, message: e.target.value }))
                  }
                  className="w-full rounded-[4px] border border-kaboz-line bg-white px-3 py-2.5 text-sm text-kaboz-ink outline-none transition placeholder:text-kaboz-mute focus:border-kaboz-orange"
                />
              </fieldset>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <fieldset>
                  <label
                    htmlFor="comment-name"
                    className="mb-1.5 block text-sm font-medium text-kaboz-ink"
                  >
                    Name:
                  </label>
                  <input
                    id="comment-name"
                    type="text"
                    placeholder="Your name"
                    value={comment.name}
                    onChange={(e) =>
                      setComment((c) => ({ ...c, name: e.target.value }))
                    }
                    className="w-full rounded-[4px] border border-kaboz-line bg-white px-3 py-2.5 text-sm text-kaboz-ink outline-none transition placeholder:text-kaboz-mute focus:border-kaboz-orange"
                  />
                </fieldset>
                <fieldset>
                  <label
                    htmlFor="comment-email"
                    className="mb-1.5 block text-sm font-medium text-kaboz-ink"
                  >
                    Email:
                  </label>
                  <input
                    id="comment-email"
                    type="email"
                    placeholder="Your email"
                    value={comment.email}
                    onChange={(e) =>
                      setComment((c) => ({ ...c, email: e.target.value }))
                    }
                    className="w-full rounded-[4px] border border-kaboz-line bg-white px-3 py-2.5 text-sm text-kaboz-ink outline-none transition placeholder:text-kaboz-mute focus:border-kaboz-orange"
                  />
                </fieldset>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-[4px] bg-kaboz-orange px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-kaboz-orange-dark disabled:opacity-70"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </form>
          </section>
        </article>

        <BlogSidebar blogs={allBlogs} excludeSlug={post.slug} />
      </div>
    </div>
  );
};

export default BlogPost;
