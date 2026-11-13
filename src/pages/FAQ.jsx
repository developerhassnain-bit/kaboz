import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";

/** Onsus FAQ structure: Hot Topics tabs + numbered accordion panels */
const FAQ_TOPICS = [
  {
    id: "account",
    label: "My account",
    items: [
      {
        q: "How do I create an account?",
        a: "Go to Login, choose Sign up, and register with your name, email, and a password of at least 8 characters.",
      },
      {
        q: "What can I do if I forgot my password?",
        a: "On the Login page, use the password reset option with your registered email. If you need help, contact sales@kaboz.ae or WhatsApp +971 55 269 3100.",
      },
      {
        q: "How do I view my orders?",
        a: "After signing in, open Orders from your account to see status and history for every purchase.",
      },
    ],
  },
  {
    id: "ordering",
    label: "Ordering & delivery",
    items: [
      {
        q: "Do you deliver across the UAE?",
        a: "Yes. We deliver across the UAE. Timelines vary by location and product availability—contact us if you need an estimate for your area.",
      },
      {
        q: "How can I track my order?",
        a: "Log in and open your Orders page for the latest status. For extra help, email sales@kaboz.ae or WhatsApp +971 55 269 3100.",
      },
      {
        q: "When will I receive my order?",
        a: "Most UAE orders ship after confirmation and stock check. Exact timing depends on your city and the items ordered—our team can share a delivery window at checkout or by chat.",
      },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We support online payment options available at checkout (such as Stripe) and cash on delivery where enabled for your order.",
      },
      {
        q: "Is checkout secure?",
        a: "Yes. Card payments go through secure payment providers. Kaboz never stores your full card details on our servers.",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns & exchanges",
    items: [
      {
        q: "Can I return or exchange a product?",
        a: "Eligible returns follow our return guidelines. Unused items in original packaging are usually easiest to process—reach out with your order details.",
      },
      {
        q: "How do I start a return?",
        a: "Contact sales@kaboz.ae or WhatsApp +971 55 269 3100 with your order number and reason. We will guide you through the next steps.",
      },
    ],
  },
  {
    id: "products",
    label: "Products & installation",
    items: [
      {
        q: "What products does Kaboz sell?",
        a: "We offer security cameras, access control, video intercom, network switches, kits, accessories, curtains, bedsheets, upholstery, and related living essentials for the UAE.",
      },
      {
        q: "Do you offer installation for CCTV or curtains?",
        a: "Yes—professional installation and related services are available for many security and living products. Contact us for a consultation.",
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    items: [
      {
        q: "Who do I contact for support?",
        a: "Email sales@kaboz.ae, call or WhatsApp +971 55 269 3100, or use the Contact us form on this site.",
      },
      {
        q: "What are your support hours?",
        a: "Our team typically responds during UAE business hours. WhatsApp messages outside those hours are usually answered on the next working day.",
      },
    ],
  },
];

const FAQ = () => {
  const [activeTopicId, setActiveTopicId] = useState(FAQ_TOPICS[0].id);
  const [openIndex, setOpenIndex] = useState(0);
  const [query, setQuery] = useState("");

  const activeTopic = useMemo(
    () => FAQ_TOPICS.find((t) => t.id === activeTopicId) || FAQ_TOPICS[0],
    [activeTopicId]
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return activeTopic.items;
    return activeTopic.items.filter(
      (item) =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [activeTopic, query]);

  const handleTopicChange = (id) => {
    setActiveTopicId(id);
    setOpenIndex(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Keep focus on current topic; filter updates live via query state
  };

  return (
    <div className="pb-12 sm:pb-16">
      <Helmet>
        <title>FAQ | Kaboz</title>
        <meta
          name="description"
          content="Frequently asked questions about Kaboz shopping, delivery, payments, returns, installation, and support."
        />
      </Helmet>

      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "FAQs" }]} />

      {/* Onsus-style centered page intro */}
      <header className="mx-auto max-w-3xl pb-8 text-center sm:pb-10">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-kaboz-ink sm:text-[40px] lg:text-[50px]">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-[14px] text-kaboz-mute sm:text-[15px]">
          Please check this FAQ first before contacting us.
        </p>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-6 flex max-w-xl items-stretch overflow-hidden rounded-[6px] border border-kaboz-line bg-white shadow-sm"
        >
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your question or keyword"
            className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-[14px] text-kaboz-ink outline-none placeholder:text-kaboz-mute"
            aria-label="Search FAQs"
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

      {/* Hot Topics (left) + accordion (right) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside>
          <h2 className="text-[16px] font-bold text-kaboz-ink sm:text-[17px]">
            Hot Topics
          </h2>
          <ul className="mt-4 space-y-0 border-t border-kaboz-line" role="tablist">
            {FAQ_TOPICS.map((topic) => {
              const active = topic.id === activeTopicId;
              return (
                <li key={topic.id} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleTopicChange(topic.id)}
                    className={`flex w-full items-center border-b border-kaboz-line py-3 text-left text-[14px] transition ${
                      active
                            ? "font-semibold text-kaboz-orange"
                            : "font-medium text-kaboz-ink hover:text-kaboz-orange"
                    }`}
                  >
                    {topic.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="min-w-0">
          <h3 className="text-[20px] font-semibold text-kaboz-ink sm:text-[22px]">
            {activeTopic.label}
          </h3>

          <div className="mt-5 space-y-0">
            {filteredItems.length === 0 ? (
              <p className="border border-dashed border-kaboz-line bg-kaboz-soft px-4 py-10 text-center text-sm text-kaboz-mute">
                No questions match “{query}”. Try another keyword or topic.
              </p>
            ) : (
              filteredItems.map((item, index) => {
                const open = openIndex === index;
                return (
                  <div
                    key={item.q}
                    className="border-b border-kaboz-line last:border-b-0"
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenIndex(open ? -1 : index)}
                      className="flex w-full items-start justify-between gap-4 py-4 text-left transition hover:text-kaboz-orange"
                    >
                      <span
                        className={`text-[15px] leading-snug sm:text-[16px] ${
                          open
                            ? "font-semibold text-kaboz-orange"
                            : "font-medium text-kaboz-ink"
                        }`}
                      >
                        {index + 1}. {item.q}
                      </span>
                      <span
                        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center text-lg leading-none ${
                          open ? "text-kaboz-orange" : "text-kaboz-mute"
                        }`}
                        aria-hidden
                      >
                        {open ? "−" : "+"}
                      </span>
                    </button>
                    {open ? (
                      <div className="pb-5 pr-8 text-[14px] leading-7 text-kaboz-mute sm:text-[15px] sm:leading-8">
                        {item.a}
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-kaboz-line bg-[#fafafa] px-5 py-4">
            <div>
              <p className="text-sm font-bold text-kaboz-ink">Still need help?</p>
              <p className="text-xs text-kaboz-mute">
                Products, orders, and installations—we’re here.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex rounded-[6px] bg-kaboz-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-kaboz-green-dark"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
