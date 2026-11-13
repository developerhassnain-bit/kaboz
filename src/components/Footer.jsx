import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import useCategories from "../hooks/useCategories";
import {
  getTopNavCategories,
  getCategoryDisplayName,
  getCategoryPath,
} from "../utils/categoryLinks";

const helpLinks = [
  { label: "Privacy Notice", to: "/about" },
  { label: "Shopping FAQs", to: "/faq" },
  { label: "Returns & Refunds", to: "/faq" },
  { label: "Delivery Information", to: "/contact" },
  { label: "Sale Terms & Conditions", to: "/about" },
];

const customerCareLinks = [
  { label: "Blog", to: "/blog" },
  { label: "Cart", to: "/cart" },
  { label: "Shop", to: "/collection" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Checkout", to: "/place-order" },
  { label: "My Account", to: "/login" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    path: "M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.6L17 11h-3V9c0-.6.4-1 1-1z",
  },
  {
    label: "X",
    href: "https://x.com/kaboz_ae",
    path: "M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.6-7.3L4.2 22H1l8.1-9.3L1 2h7.3l5.1 6.7L18.9 2zm-1.2 18h1.9L7.4 4h-2l12.3 16z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/kaboz.ae/",
    path: "M12 2c2.7 0 3 .01 4.1.06 1.1.05 1.85.23 2.5.48.68.27 1.25.62 1.82 1.19.57.57.92 1.14 1.19 1.82.25.65.43 1.4.48 2.5.05 1.1.06 1.4.06 4.1s-.01 3-.06 4.1c-.05 1.1-.23 1.85-.48 2.5-.27.68-.62 1.25-1.19 1.82a4.9 4.9 0 01-1.82 1.19c-.65.25-1.4.43-2.5.48-1.1.05-1.4.06-4.1.06s-3-.01-4.1-.06c-1.1-.05-1.85-.23-2.5-.48a4.9 4.9 0 01-1.82-1.19 4.9 4.9 0 01-1.19-1.82c-.25-.65-.43-1.4-.48-2.5C2.01 15 2 14.7 2 12s.01-3 .06-4.1c.05-1.1.23-1.85.48-2.5.27-.68.62-1.25 1.19-1.82A4.9 4.9 0 015.55 2.39c.65-.25 1.4-.43 2.5-.48C9.15 2.01 9.45 2 12 2zm0 1.8c-2.65 0-2.96.01-4 .06-.97.04-1.5.2-1.85.34-.46.18-.8.4-1.15.75-.35.35-.57.69-.75 1.15-.14.35-.3.88-.34 1.85-.05 1.04-.06 1.35-.06 4s.01 2.96.06 4c.04.97.2 1.5.34 1.85.18.46.4.8.75 1.15.35.35.69.57 1.15.75.35.14.88.3 1.85.34 1.04.05 1.35.06 4 .06s2.96-.01 4-.06c.97-.04 1.5-.2 1.85-.34.46-.18.8-.4 1.15-.75.35-.35.57-.69.75-1.15.14-.35.3-.88.34-1.85.05-1.04.06-1.35.06-4s-.01-2.96-.06-4c-.04-.97-.2-1.5-.34-1.85a3.1 3.1 0 00-.75-1.15 3.1 3.1 0 00-1.15-.75c-.35-.14-.88-.3-1.85-.34-1.04-.05-1.35-.06-4-.06zm0 3.65a4.55 4.55 0 110 9.1 4.55 4.55 0 010-9.1zm0 1.8a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5zm4.73-1.99a1.06 1.06 0 110 2.13 1.06 1.06 0 010-2.13z",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@kaboz.ae",
    path: "M16.6 5.82a4.28 4.28 0 01-3.13-1.4 4.28 4.28 0 01-1.19-2.97h-3.1v13.68a2.6 2.6 0 11-2.6-2.6c.24 0 .48.03.7.09V9.4a5.75 5.75 0 00-.7-.04A5.75 5.75 0 105.75 21a5.75 5.75 0 005.75-5.75V9.13a7.35 7.35 0 004.3 1.38v-3.1a4.28 4.28 0 01-1.2-.63v-.02z",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/971552693100",
    path: "M12.04 2a9.9 9.9 0 00-8.5 14.9L2 22l5.25-1.38A9.9 9.9 0 1012.04 2zm0 1.8a8.1 8.1 0 110 16.2 8 8 0 01-4.08-1.1l-.29-.17-3.12.82.83-3.04-.19-.31a8.1 8.1 0 016.85-12.4zm4.56 11.5c-.24.67-1.4 1.28-1.93 1.36-.5.08-1.13.11-1.82-.11-.42-.14-.96-.31-1.65-.61-2.9-1.26-4.78-4.2-4.93-4.4-.14-.19-1.2-1.6-1.2-3.05s.76-2.16 1.03-2.46c.27-.3.59-.37.79-.37h.57c.18 0 .43-.07.67.51.24.6.82 2.07.89 2.22.07.15.12.32.02.52-.1.19-.14.32-.29.49-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.17.28.74 1.22 1.59 1.98 1.1.97 2.02 1.27 2.3 1.41.29.14.45.12.62-.07.17-.19.71-.83.9-1.11.19-.28.38-.23.64-.14.27.1 1.7.8 1.99.95.29.14.48.22.55.34.07.12.07.7-.17 1.37z",
  },
];

const FooterColumn = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-kaboz-line md:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3.5 text-left md:pointer-events-none md:cursor-default md:py-0"
        aria-expanded={open}
      >
        <h3 className="text-[16px] font-bold text-kaboz-ink">{title}</h3>
        <span className="text-kaboz-mute md:hidden" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>
      <div className={`${open ? "block pb-4" : "hidden"} md:mt-5 md:block md:pb-0`}>
        {children}
      </div>
    </div>
  );
};

const Footer = () => {
  const year = new Date().getFullYear();
  const { categories } = useCategories();
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const productLinks = useMemo(
    () => getTopNavCategories(categories, 7),
    [categories]
  );

  const onNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    const subject = encodeURIComponent("Kaboz updates request");
    const body = encodeURIComponent(
      `Please keep me updated at: ${email}\n\nSent from the Kaboz website footer.`
    );
    window.location.href = `mailto:sales@kaboz.ae?subject=${subject}&body=${body}`;
    toast.success("Opening your email to contact Kaboz…");
    setNewsletterEmail("");
  };

  return (
    <footer className="mt-12 w-full">
      {/* —— 1. Main columns (Onsus) —— */}
      <div className="border-t border-kaboz-line bg-[#f7f7f7]">
        <div className="kb-container py-10 md:py-14 lg:py-16">
          <div className="grid gap-0 md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-12 lg:gap-8">
            {/* Brand + payments */}
            <div className="border-b border-kaboz-line pb-6 md:border-0 md:pb-0 lg:col-span-3">
              <Link to="/" className="inline-block">
                <img
                  src={assets.kabozLogo}
                  alt="Kaboz"
                  className="mb-6 h-10 w-auto lg:h-11"
                />
              </Link>
              <p className="mb-3 text-sm text-kaboz-mute">We accept:</p>
              <div
                className="flex flex-wrap items-center gap-4 sm:gap-5"
                aria-label="Accepted payment methods"
              >
                <img
                  src={assets.visa}
                  alt="Visa"
                  className="h-[22px] w-auto object-contain sm:h-6"
                />
                <img
                  src={assets.maestrocard}
                  alt="Mastercard"
                  className="h-8 w-auto object-contain sm:h-9"
                />
              </div>
            </div>

            <div className="md:contents lg:col-span-9 lg:grid lg:grid-cols-4 lg:gap-8">
              <FooterColumn title="Get help" defaultOpen>
                <ul className="space-y-2.5 text-[14px] text-kaboz-mute">
                  {helpLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="transition hover:text-kaboz-purple"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>

              <FooterColumn title="Popular categories">
                <ul className="space-y-2.5 text-[14px] text-kaboz-mute">
                  {productLinks.map((cat) => (
                    <li key={cat._id || cat.name}>
                      <Link
                        to={getCategoryPath(cat.name)}
                        className="transition hover:text-kaboz-purple"
                      >
                        {getCategoryDisplayName(cat.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>

              <FooterColumn title="Customer Care">
                <ul className="space-y-2.5 text-[14px] text-kaboz-mute">
                  {customerCareLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="transition hover:text-kaboz-purple"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>

              <FooterColumn title="Contact">
                <ul className="space-y-4 text-[14px] text-kaboz-mute">
                  <li className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center text-kaboz-ink"
                      aria-hidden
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                    </span>
                    <span className="font-semibold text-kaboz-orange">
                      KABOZ FZE LLC, Amber Gem Tower - 2602, Al Rashidiya 3,
                      Ajman
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span
                      className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-kaboz-ink"
                      aria-hidden
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M5 4h4l2 5-2.5 1.5a12 12 0 006 6L16 14l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
                      </svg>
                    </span>
                    <a
                      href="tel:+971552693100"
                      className="font-semibold text-kaboz-orange transition hover:text-kaboz-orange-dark"
                    >
                      +971 55 269 3100
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span
                      className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-kaboz-ink"
                      aria-hidden
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path d="M4 6h16v12H4z" />
                        <path d="m4 7 8 6 8-6" />
                      </svg>
                    </span>
                    <a
                      href="mailto:sales@kaboz.ae"
                      className="kb-link font-semibold !text-kaboz-orange hover:!text-kaboz-orange-dark"
                    >
                      sales@kaboz.ae
                    </a>
                  </li>
                </ul>
              </FooterColumn>
            </div>
          </div>
        </div>
      </div>

      {/* —— 2. Newsletter bar (Onsus dark strip) —— */}
      <div className="bg-[#2f3742] text-white">
        <div className="kb-container flex flex-col items-stretch justify-between gap-5 py-7 lg:flex-row lg:items-center lg:gap-10 lg:py-8">
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <span
              className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center text-white sm:mt-0"
              aria-hidden
            >
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 7 9-7" />
              </svg>
            </span>
            <div>
              <p className="text-[17px] font-bold leading-snug sm:text-[18px]">
                Join our newsletter for exclusive offers
              </p>
              <p className="mt-1 text-[13px] text-white/60 sm:text-sm">
                Register now to get latest updates on promotions &amp; coupons.
              </p>
            </div>
          </div>

          <form
            onSubmit={onNewsletterSubmit}
            className="flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:items-center"
          >
            <label className="sr-only" htmlFor="footer-newsletter-email">
              Email address
            </label>
            <input
              id="footer-newsletter-email"
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="h-12 min-h-[48px] w-full flex-shrink-0 rounded-full sm:flex-1 border-0 bg-white px-5 text-base sm:text-sm text-kaboz-ink outline-none placeholder:text-kaboz-mute focus:ring-2 focus:ring-kaboz-orange"
            />
            <button
              type="submit"
              className="h-12 min-h-[48px] w-full flex-shrink-0 rounded-full bg-kaboz-orange px-7 sm:w-auto text-sm font-bold text-white transition hover:bg-kaboz-orange-dark"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* —— 3. Social + promo links (Onsus) —— */}
      <div className="bg-[#fafafa]">
        <div className="kb-container flex flex-col items-center gap-5 py-7 md:py-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-kaboz-ink/25 text-kaboz-ink transition hover:border-kaboz-orange hover:bg-kaboz-orange hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* —— 4. Copyright —— */}
      <div className="border-t border-kaboz-line bg-white">
        <div className="kb-container py-4 text-center text-[13px] text-kaboz-mute">
          Kaboz.ae © {year}. All rights reserved — Designed by{" "}
          <a
            href="https://depthic.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kaboz-orange hover:underline"
          >
            Depthic
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
