import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import Breadcrumbs from "../components/Breadcrumbs";

const SECTIONS = [
  {
    id: "story",
    label: "Our story",
    title: "About Kaboz",
  },
  {
    id: "mission",
    label: "Mission",
    title: "Our mission",
  },
  {
    id: "why",
    label: "Why choose us",
    title: "Why choose Kaboz",
  },
];

const reasons = [
  {
    title: "Quality products",
    copy: "We carefully select products from trusted brands to ensure quality, durability, and value across every category.",
  },
  {
    title: "Competitive prices",
    copy: "Genuine products at fair UAE prices—so you get the best value without compromising on quality.",
  },
  {
    title: "Reliable support",
    copy: "Smooth shopping with responsive service, secure ordering, and dependable help whenever you need it.",
  },
];

const About = () => {
  const [activeId, setActiveId] = useState("story");

  const active = useMemo(
    () => SECTIONS.find((s) => s.id === activeId) || SECTIONS[0],
    [activeId]
  );

  return (
    <div className="pb-12 sm:pb-16">
      <Helmet>
        <title>About Us | Kaboz</title>
        <meta
          name="description"
          content="Learn about Kaboz.ae — trusted online shopping for electronics, security & IT, curtains, bedsheets, and home essentials in the UAE."
        />
      </Helmet>

      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "About us" }]}
      />

      {/* Onsus FAQ/Blog-style centered intro */}
      <header className="mx-auto max-w-3xl pb-8 text-center sm:pb-10">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-kaboz-ink sm:text-[40px] lg:text-[50px]">
          About us
        </h1>
        <p className="mt-3 text-[14px] text-kaboz-mute sm:text-[15px]">
          Security, IT & living essentials for the UAE — genuine products and
          dependable support.
        </p>
      </header>

      {/* Hot Topics sidebar + content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-[16px] font-bold text-kaboz-ink sm:text-[17px]">
            About Kaboz
          </h2>
          <ul
            className="mt-4 space-y-0 border-t border-kaboz-line"
            role="tablist"
          >
            {SECTIONS.map((section) => {
              const isActive = section.id === active.id;
              return (
                <li key={section.id} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveId(section.id)}
                    className={`flex w-full items-center border-b border-kaboz-line py-3 text-left text-[14px] transition ${
                      isActive
                        ? "font-semibold text-kaboz-orange"
                        : "font-medium text-kaboz-ink hover:text-kaboz-purple"
                    }`}
                  >
                    {section.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 hidden space-y-0 border-t border-kaboz-line pt-4 lg:block">
            <p className="mb-2 text-[13px] font-bold text-kaboz-ink">
              Quick links
            </p>
            {[
              { to: "/collection", label: "Shop" },
              { to: "/services", label: "Services" },
              { to: "/faq", label: "FAQs" },
              { to: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center border-b border-kaboz-line py-2.5 text-[14px] font-medium text-kaboz-ink transition hover:text-kaboz-orange"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <h3 className="text-[20px] font-semibold text-kaboz-ink sm:text-[22px]">
            {active.title}
          </h3>

          {active.id === "story" ? (
            <div className="mt-5">
              {/* Blog-list style image */}
              <div className="group overflow-hidden rounded-[4px] bg-kaboz-soft">
                <img
                  src={assets.about_img}
                  alt="About Kaboz"
                  className="kb-img-pop aspect-[16/9] w-full object-cover object-center"
                />
              </div>

              <div className="mt-8 space-y-5 text-[15px] leading-7 text-kaboz-mute sm:text-[16px] sm:leading-8">
                <p>
                  Welcome to{" "}
                  <span className="font-semibold text-kaboz-ink">Kaboz.ae</span>
                  , your trusted online shopping destination in the UAE. We
                  offer a carefully selected range of quality products across
                  electronics, security &amp; IT, curtains, bedsheets,
                  furniture, and home essentials.
                </p>
                <p>
                  Our goal is simple: genuine products, competitive prices, and
                  a smooth shopping experience backed by reliable customer
                  service—whether you are upgrading your home, office, or
                  everyday setup.
                </p>
              </div>
            </div>
          ) : null}

          {active.id === "mission" ? (
            <div className="mt-5 space-y-5 text-[15px] leading-7 text-kaboz-mute sm:text-[16px] sm:leading-8">
              <p>
                To make quality products easily accessible with trusted brands,
                fair prices, and excellent support—while expanding our range to
                meet your needs across security, IT, and living.
              </p>
              <p>
                We focus on clear product information, secure checkout, and
                responsive help so shopping with Kaboz stays straightforward
                from browse to delivery.
              </p>
              <div className="border-y border-kaboz-line py-6">
                <p className="text-[13px] font-bold uppercase tracking-wide text-kaboz-orange">
                  What we stand for
                </p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Genuine products from trusted brands",
                    "Fair UAE pricing and transparent offers",
                    "Reliable delivery and customer care",
                  ].map((item, i) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className={`mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                          i === 0
                            ? "bg-kaboz-purple"
                            : i === 1
                              ? "bg-kaboz-green"
                              : "bg-kaboz-orange"
                        }`}
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {active.id === "why" ? (
            <div className="mt-6 space-y-0">
              {reasons.map((item, index) => (
                <div
                  key={item.title}
                  className="border-b border-kaboz-line py-5 last:border-b-0"
                >
                  <h4 className="text-[16px] font-semibold text-kaboz-ink">
                    {index + 1}. {item.title}
                  </h4>
                  <p className="mt-2 text-[14px] leading-7 text-kaboz-mute sm:text-[15px]">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-kaboz-line bg-[#fafafa] px-5 py-4">
            <div>
              <p className="text-sm font-bold text-kaboz-ink">
                Ready to shop or ask a question?
              </p>
              <p className="text-xs text-kaboz-mute">
                Browse the catalog or message our team.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/collection"
                className="inline-flex rounded-[6px] bg-kaboz-orange px-4 py-2.5 text-sm font-bold text-white transition hover:bg-kaboz-orange-dark"
              >
                Shop now
              </Link>
              <Link
                to="/contact"
                className="inline-flex rounded-[6px] border border-kaboz-line bg-white px-4 py-2.5 text-sm font-bold text-kaboz-ink transition hover:border-kaboz-orange hover:text-kaboz-orange"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
