import React from "react";

const WHATSAPP_NUMBER = "971552693100";

/**
 * Living-product consultation strip — no invented product copy.
 * Variant picking lives in the main buy box.
 */
const CurtainDetails = ({ productName = "" }) => {
  const message = productName
    ? `Hi, I'd like a free consultation about "${productName}".`
    : "Hi, I'd like a free consultation for curtains.";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="mt-10 rounded-[6px] border border-kaboz-line bg-[#fafafa] px-5 py-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-7">
      <div className="max-w-xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kaboz-purple">
          Kaboz Living
        </p>
        <h3 className="mt-1 font-display text-lg font-bold text-kaboz-ink sm:text-xl">
          Need help choosing fabric or color?
        </h3>
        <p className="mt-1 text-sm text-kaboz-mute">
          Chat with our team for a free consultation on fit, design, and
          installation.
        </p>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex h-11 flex-shrink-0 items-center justify-center rounded-[6px] bg-emerald-600 px-6 text-sm font-bold text-white transition hover:bg-emerald-700 sm:mt-0"
      >
        Chat on WhatsApp
      </a>
    </div>
  );
};

export default CurtainDetails;
