import React from "react";

const PaginationBar = ({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "items",
}) => {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const pages = [];
  const windowSize = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - windowSize && i <= page + windowSize)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-kaboz-line pt-5 sm:flex-row">
      <p className="text-sm text-kaboz-mute">
        Showing{" "}
        <span className="font-semibold text-kaboz-ink">{start}</span>–
        <span className="font-semibold text-kaboz-ink">{end}</span> of{" "}
        <span className="font-semibold text-kaboz-ink">{totalItems}</span>{" "}
        {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-[6px] border border-kaboz-line bg-white px-3 py-1.5 text-sm font-semibold text-kaboz-ink transition hover:border-kaboz-purple hover:text-kaboz-purple disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        {pages.map((p, idx) =>
          p === "…" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1 text-sm text-kaboz-mute"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-9 rounded-[6px] px-2.5 py-1.5 text-sm font-semibold transition ${
                p === page
                  ? "bg-kaboz-orange text-white"
                  : "border border-kaboz-line bg-white text-kaboz-ink hover:border-kaboz-purple hover:text-kaboz-purple"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-[6px] border border-kaboz-line bg-white px-3 py-1.5 text-sm font-semibold text-kaboz-ink transition hover:border-kaboz-purple hover:text-kaboz-purple disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationBar;
