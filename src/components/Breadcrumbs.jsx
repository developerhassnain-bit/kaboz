import React from "react";
import { Link } from "react-router-dom";
import { IconChevronRight } from "./ui/Icons";

/**
 * items: [{ label: string, to?: string }]
 * Last item is current page (no link).
 */
const Breadcrumbs = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-5">
      <ol className="kb-breadcrumb mb-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 && (
                <IconChevronRight className="h-3 w-3 text-kaboz-faint" />
              )}
              {isLast || !item.to ? (
                <span
                  className="font-medium text-kaboz-ink"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="transition hover:text-kaboz-purple"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
