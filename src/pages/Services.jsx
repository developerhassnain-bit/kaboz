import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const WHATSAPP_NUMBER = "971552693100";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Consultation",
    text: "We understand your requirements, inspect your space, and discuss the best solution for your project.",
  },
  {
    step: "02",
    title: "Planning & Quote",
    text: "We prepare a suitable plan and transparent quotation based on your needs and budget.",
  },
  {
    step: "03",
    title: "Installation",
    text: "Our experienced team carries out the work professionally with attention to quality and finishing.",
  },
  {
    step: "04",
    title: "Support & Maintenance",
    text: "We remain available for maintenance, repairs, upgrades, and ongoing technical support.",
  },
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/service/list?active=1`
        );
        if (!cancelled && response.data.success) {
          const list = response.data.services || [];
          setServices(list);

          const hash = window.location.hash.replace(/^#/, "");
          const fromHash = list.find((s) => s.slug === hash || s._id === hash);
          const first = fromHash || list[0];
          if (first) {
            setActiveId(first.slug || first._id);
          }
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

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) => {
      const hay = [
        s.title,
        s.shortDescription,
        s.overview,
        ...(s.details || []),
        s.idealFor,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [services, query]);

  const activeService = useMemo(() => {
    if (!filteredServices.length) return null;
    return (
      filteredServices.find((s) => (s.slug || s._id) === activeId) ||
      filteredServices[0]
    );
  }, [filteredServices, activeId]);

  const activeIndex = useMemo(() => {
    if (!activeService) return 0;
    const idx = filteredServices.findIndex(
      (s) => (s.slug || s._id) === (activeService.slug || activeService._id)
    );
    return idx >= 0 ? idx : 0;
  }, [filteredServices, activeService]);

  const isImageRight = activeIndex % 2 === 0;

  useEffect(() => {
    if (!activeService) return;
    const id = activeService.slug || activeService._id;
    if (activeId !== id) setActiveId(id);
  }, [activeService, activeId]);

  const selectService = (service) => {
    const id = service.slug || service._id;
    setActiveId(id);
    if (service.slug) {
      window.history.replaceState(null, "", `#${service.slug}`);
    }
  };

  const whatsappHref = (service) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      service?.whatsappMessage ||
        `Hi, I'm interested in ${service?.title || "your services"}`
    )}`;

  return (
    <div className="pb-12 sm:pb-16">
      <Helmet>
        <title>Our Services | Kaboz</title>
        <meta
          name="description"
          content="Explore Kaboz Electronics services including CCTV installation, access control, YouTube Live, curtains, upholstery, electrical and sound works, glass doors, interior design, home renovation, and sports court installation."
        />
      </Helmet>

      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Services" }]}
      />

      {/* FAQ/Blog-style centered intro */}
      <header className="mx-auto max-w-3xl pb-8 text-center sm:pb-10">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-kaboz-ink sm:text-[40px] lg:text-[50px]">
          Our Services
        </h1>
        <p className="mt-3 text-[14px] text-kaboz-mute sm:text-[15px]">
          Security, living, and project installation across the UAE — choose a
          service to learn more.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-6 flex max-w-xl items-stretch overflow-hidden rounded-[6px] border border-kaboz-line bg-white shadow-sm"
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
            className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-[14px] text-kaboz-ink outline-none placeholder:text-kaboz-mute"
            aria-label="Search services"
          />
          <button
            type="submit"
            className="flex w-12 flex-shrink-0 items-center justify-center bg-kaboz-orange text-white transition hover:bg-kaboz-orange-dark"
            aria-label="Search"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
        </form>
      </header>

      {isLoading ? (
        <p className="py-16 text-center text-sm text-kaboz-mute">
          Loading services…
        </p>
      ) : services.length === 0 ? (
        <p className="border border-dashed border-kaboz-line bg-kaboz-soft px-4 py-14 text-center text-sm text-kaboz-mute">
          No services available right now.
        </p>
      ) : (
        <>
          {/* Hot Topics-style sidebar + detail (FAQ) / list+sidebar (Blog) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-[16px] font-bold text-kaboz-ink sm:text-[17px]">
                Services
              </h2>
              <ul
                className="mt-4 space-y-0 border-t border-kaboz-line"
                role="tablist"
              >
                {filteredServices.map((service) => {
                  const id = service.slug || service._id;
                  const active = id === (activeService?.slug || activeService?._id);
                  return (
                    <li key={id} role="presentation">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => selectService(service)}
                        className={`flex w-full items-center border-b border-kaboz-line py-3 text-left text-[14px] transition ${
                          active
                            ? "font-semibold text-kaboz-orange"
                            : "font-medium text-kaboz-ink hover:text-kaboz-orange"
                        }`}
                      >
                        {service.title}
                      </button>
                    </li>
                  );
                })}
                {filteredServices.length === 0 ? (
                  <li className="py-4 text-sm text-kaboz-mute">
                    No services match “{query}”.
                  </li>
                ) : null}
              </ul>

              <div className="mt-8 hidden rounded-[6px] border border-kaboz-line p-4 lg:block">
                <p className="text-sm font-bold text-kaboz-ink">Need a quote?</p>
                <p className="mt-1 text-[12px] leading-relaxed text-kaboz-mute">
                  Talk to Kaboz about installation and project work.
                </p>
                <Link
                  to="/contact"
                  className="mt-3 inline-flex text-[13px] font-bold text-kaboz-green hover:underline"
                >
                  Contact us
                </Link>
              </div>
            </aside>

            <div className="min-w-0">
              {activeService ? (
                <article
                  id={activeService.slug || activeService._id}
                  className="scroll-mt-28"
                >
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10 items-start">
                    {/* Content Column */}
                    <div
                      className={`min-w-0 ${
                        isImageRight ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <h3 className="text-[24px] font-bold text-kaboz-ink sm:text-[30px] lg:text-[32px] leading-tight">
                        {activeService.title}
                      </h3>
                      {activeService.shortDescription ? (
                        <p className="mt-2.5 text-[15px] leading-relaxed text-kaboz-mute sm:text-[16px]">
                          {activeService.shortDescription}
                        </p>
                      ) : null}

                      {activeService.overview ? (
                        <div className="mt-6 border-b border-kaboz-line pb-6">
                          <h4 className="text-[14px] font-bold uppercase tracking-wide text-kaboz-orange">
                            Overview
                          </h4>
                          <p className="mt-2.5 text-[15px] leading-7 text-kaboz-mute">
                            {activeService.overview}
                          </p>
                        </div>
                      ) : null}

                      {(activeService.details || []).length > 0 ? (
                        <div className="mt-6 border-b border-kaboz-line pb-6">
                          <h4 className="text-[14px] font-bold uppercase tracking-wide text-kaboz-orange">
                            What we provide
                          </h4>
                          <ul className="mt-3.5 space-y-2.5">
                            {activeService.details.map((detail, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2.5 text-[14px] leading-relaxed text-kaboz-mute sm:text-[15px]"
                              >
                                <span
                                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-kaboz-orange"
                                  aria-hidden
                                />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {activeService.idealFor ? (
                        <div className="mt-6 border-b border-kaboz-line pb-6">
                          <h4 className="text-[14px] font-bold uppercase tracking-wide text-kaboz-orange">
                            Ideal for
                          </h4>
                          <p className="mt-2.5 text-[15px] leading-7 text-kaboz-mute">
                            {activeService.idealFor}
                          </p>
                        </div>
                      ) : null}

                      <div className="mt-6 flex flex-wrap gap-3">
                        <a
                          href={whatsappHref(activeService)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-[6px] bg-kaboz-orange px-6 py-3 text-sm font-bold text-white transition hover:bg-kaboz-orange-dark shadow-sm"
                        >
                          WhatsApp us
                        </a>
                        <Link
                          to="/contact"
                          className="inline-flex items-center justify-center rounded-[6px] border border-kaboz-line px-6 py-3 text-sm font-bold text-kaboz-ink transition hover:border-kaboz-orange hover:text-kaboz-orange"
                        >
                          Contact form
                        </Link>
                      </div>
                    </div>

                    {/* Image Column (Sticky on Desktop) */}
                    {activeService.image ? (
                      <div
                        className={`overflow-hidden rounded-[8px] border border-kaboz-line bg-kaboz-soft shadow-sm lg:sticky lg:top-28 lg:self-start ${
                          isImageRight ? "lg:order-2" : "lg:order-1"
                        }`}
                      >
                        <img
                          src={activeService.image}
                          alt={activeService.title}
                          className="kb-img-pop aspect-[4/3] w-full object-cover"
                        />
                      </div>
                    ) : null}
                  </div>
                </article>
              ) : (
                <p className="border border-dashed border-kaboz-line bg-kaboz-soft px-4 py-14 text-center text-sm text-kaboz-mute">
                  Select a service from the list.
                </p>
              )}
            </div>
          </div>

          {/* How it works — clean section like FAQ/blog spacing */}
          <section className="mt-14 border-t border-kaboz-line pt-10 sm:mt-16 sm:pt-12">
            <div className="mb-8 max-w-2xl text-left sm:mx-auto sm:text-center sm:mb-10">
              <h2 className="text-[22px] font-semibold text-kaboz-ink sm:text-[26px]">
                How it works
              </h2>
              <p className="mt-2 text-sm text-kaboz-mute">
                A simple process from first idea to finished installation.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {PROCESS_STEPS.map((item, i) => (
                <div key={item.step}>
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border text-[13px] font-bold ${
                      i % 4 === 0
                        ? "border-kaboz-orange text-kaboz-orange"
                        : i % 4 === 1
                          ? "border-kaboz-purple text-kaboz-purple"
                          : i % 4 === 2
                            ? "border-kaboz-green text-kaboz-green"
                            : "border-kaboz-red text-kaboz-red"
                    }`}
                  >
                    {item.step}
                  </div>
                  <p className="text-[15px] font-semibold text-kaboz-ink">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-kaboz-mute">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-kaboz-line bg-[#fafafa] px-5 py-4 sm:mt-12">
            <div>
              <p className="text-sm font-bold text-kaboz-ink">
                Ready to get started?
              </p>
              <p className="text-xs text-kaboz-mute">
                Contact us for a consultation and a tailored quote.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex rounded-[6px] bg-kaboz-orange px-4 py-2.5 text-sm font-bold text-white transition hover:bg-kaboz-orange-dark"
            >
              Contact us
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Services;
