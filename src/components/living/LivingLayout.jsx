import React, { useEffect } from "react";
import LivingNavbar from "./LivingNavbar";
import LivingFooter from "./LivingFooter";

/**
 * Kaboz Living microsite shell — dark nav/footer + warm page background.
 * Used for /living, living category shops, and living product PDPs.
 */
const LivingLayout = ({ children, contained = false }) => {
  useEffect(() => {
    document.documentElement.classList.add("living-page-active");
    document.body.classList.add("living-page-active");
    return () => {
      document.documentElement.classList.remove("living-page-active");
      document.body.classList.remove("living-page-active");
    };
  }, []);

  return (
    <div className="living-page flex min-h-screen flex-col bg-[#faf8f5] text-kaboz-ink">
      <LivingNavbar />
      <div className="w-full flex-1">
        {contained ? (
          <div className="kb-container bg-transparent py-4 sm:py-6">{children}</div>
        ) : (
          children
        )}
      </div>
      <LivingFooter />
    </div>
  );
};

export default LivingLayout;
