import React from "react";
import { Link } from "react-router-dom";
import { IconArrowRight } from "./ui/Icons";

const ACCENT = {
  purple: {
    chip: "bg-kaboz-purple text-white",
    eye: "text-kaboz-purple",
    link: "hover:text-kaboz-purple",
  },
  red: {
    chip: "bg-kaboz-red text-white",
    eye: "text-kaboz-red",
    link: "hover:text-kaboz-red",
  },
  blue: {
    chip: "bg-kaboz-orange text-white",
    eye: "text-kaboz-orange",
    link: "hover:text-kaboz-orange",
  },
  green: {
    chip: "bg-kaboz-green text-white",
    eye: "text-kaboz-green",
    link: "hover:text-kaboz-green",
  },
  gold: {
    chip: "bg-kaboz-gold text-kaboz-ink",
    eye: "text-kaboz-gold-dark",
    link: "hover:text-kaboz-gold-dark",
  },
};

/**
 * Onsus-style section title with multi-accent support (Onsus/Adarc palette).
 */
const SectionHeader = ({
  title,
  eyebrow,
  viewAllTo,
  viewAllLabel = "View all",
  icon = "flame",
  accent = "purple",
  className = "",
}) => {
  const tone = ACCENT[accent] || ACCENT.purple;

  return (
    <div className={className}>
      <div className="kb-section-head">
        <div className="flex min-w-0 items-center gap-2.5">
          {icon === "flame" ? (
            <span
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${tone.chip}`}
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M12 2c1.5 3.5-.5 5.5-2 7-.8.8-1.5 1.7-1.5 3A3.5 3.5 0 0012 15.5 3.5 3.5 0 0015.5 12c0-2.2-1.8-4-1.8-6.5C15.5 7 18 9.2 18 13a6 6 0 11-12 0c0-2.4 1.2-4.2 2.5-5.5C10 6 11 4.5 12 2z" />
              </svg>
            </span>
          ) : icon === "grid" ? (
            <span
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${tone.chip}`}
              aria-hidden
            >
              <span className="grid grid-cols-2 gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-[1px] bg-current opacity-90" />
                ))}
              </span>
            </span>
          ) : null}
          <div className="min-w-0">
            {eyebrow ? (
              <p
                className={`text-[11px] font-bold uppercase tracking-[0.18em] ${tone.eye}`}
              >
                {eyebrow}
              </p>
            ) : null}
            <h2 className="kb-h2">{title}</h2>
          </div>
        </div>
        {viewAllTo ? (
          <Link
            to={viewAllTo}
            className={`inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-kaboz-mute transition ${tone.link}`}
          >
            {viewAllLabel}
            <IconArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default SectionHeader;
