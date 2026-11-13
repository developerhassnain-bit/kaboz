import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import Breadcrumbs from "../components/Breadcrumbs";
import RecentlyViewed from "../components/RecentlyViewed";

const ADDRESS_SHORT = "Amber Gem Tower - 2602, Al Rashidiya 3, Ajman";
const ADDRESS_FULL =
  "KABOZ FZE LLC, Amber Gem Tower - 2602, Al Rashidiya 3, Ajman";
const PHONE_DISPLAY = "+971 55 269 3100";
const PHONE_TEL = "+971552693100";
const EMAIL = "sales@kaboz.ae";
const MAP_EMBED =
  "https://maps.google.com/maps?q=Amber%20Gem%20Tower%2C%20Al%20Rashidiya%203%2C%20Ajman&t=m&z=14&output=embed&iwloc=near";
const MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=Amber+Gem+Tower+Al+Rashidiya+3+Ajman";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[#e1e1e1] bg-white px-3.5 py-2.5 text-sm text-kaboz-ink outline-none transition placeholder:text-kaboz-mute focus:border-kaboz-purple";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Message sent! We'll get back to you shortly.");
      setFormData({ name: "", subject: "", message: "" });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden pb-10 pt-4 sm:pt-6">
      <Helmet>
        <title>Contact Us | Kaboz</title>
        <meta
          name="description"
          content="Contact Kaboz.ae for product advice, orders, and installation support across the UAE. Call, WhatsApp, or send a message."
        />
      </Helmet>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Contact" }]}
        />

        {/* Map with stacked location card + quote form (Onsus) */}
        <div className="relative mb-8 w-full overflow-x-hidden rounded-2xl bg-[#e8eef3] sm:mb-10 lg:mb-12">
          <div className="relative h-[640px] w-full sm:h-[680px] lg:h-[720px]">
            <iframe
              title="Kaboz location map"
              src={MAP_EMBED}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            {/* Stacked overlays — location card above quote form, no overlap */}
            <div className="absolute top-4 left-4 z-20 flex w-[calc(100%-2rem)] max-w-md flex-col gap-3 sm:left-4 sm:gap-4">
              {/* Small map location card */}
              <div className="rounded-xl bg-white p-3.5 shadow-xl sm:p-4">
                <p className="text-[13px] font-medium leading-snug text-kaboz-ink sm:text-[14px]">
                  {ADDRESS_SHORT}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={MAP_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a73e8] px-3.5 py-2 text-[12px] font-semibold text-white transition hover:bg-[#1557b0] sm:text-[13px]"
                  >
                    Open in Maps
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      aria-hidden
                    >
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </a>
                  <a
                    href={MAP_LINK}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Get directions"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f0fe] text-[#1a73e8] transition hover:bg-[#d2e3fc]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M21.7 11.3l-9-9a1 1 0 00-1.4 0l-9 9a1 1 0 001.4 1.4L4 12.4V20a2 2 0 002 2h4v-6h4v6h4a2 2 0 002-2v-7.6l.3.3a1 1 0 001.4-1.4z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Get A Quote form — directly under location card */}
              <div className="w-full rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-kaboz-ink sm:text-[26px]">
                  Get A Quote
                </h1>
                <p className="mt-1.5 text-[13px] leading-relaxed text-kaboz-mute sm:text-[14px]">
                  Fill up the form and our Team will get back to you within 24
                  hours.
                </p>

                <form onSubmit={onSubmitHandler} className="mt-4 space-y-3">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="text-sm font-semibold text-kaboz-ink"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={onChangeHandler}
                      required
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="text-sm font-semibold text-kaboz-ink"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={onChangeHandler}
                      required
                      disabled={isSubmitting}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="text-sm font-semibold text-kaboz-ink"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={onChangeHandler}
                      required
                      disabled={isSubmitting}
                      rows={3}
                      className={`${inputClass} min-h-[72px] resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-kaboz-orange px-6 py-2.5 text-sm font-bold text-white transition hover:bg-kaboz-orange-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[160px]"
                  >
                    {isSubmitting ? "Sending…" : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information — horizontal inline bar */}
        <section className="mb-10 sm:mb-12">
          <h2 className="mb-5 text-left text-[22px] font-semibold tracking-tight text-kaboz-ink sm:mb-6 sm:text-left sm:text-[26px]">
            Contact Information
          </h2>
          <ul className="flex flex-col items-stretch divide-y divide-kaboz-line rounded-xl border border-kaboz-line bg-white sm:flex-row sm:items-center sm:justify-between sm:divide-x sm:divide-y-0 sm:px-2 sm:py-1">
            <li className="flex-1">
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-start gap-3 px-5 py-4 text-kaboz-ink transition hover:text-kaboz-green sm:justify-start"
              >
                <span
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-kaboz-green-soft text-kaboz-green transition group-hover:bg-kaboz-green group-hover:text-white"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </span>
                <span className="text-[13px] leading-snug sm:text-[14px]">
                  {ADDRESS_FULL}
                </span>
              </a>
            </li>
            <li className="flex-1">
              <a
                href={`tel:${PHONE_TEL}`}
                className="group flex items-center justify-start gap-3 px-5 py-4 text-kaboz-ink transition hover:text-kaboz-red sm:justify-center"
              >
                <span
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-kaboz-red-soft text-kaboz-red transition group-hover:bg-kaboz-red group-hover:text-white"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
                  </svg>
                </span>
                <span className="text-[13px] sm:text-[14px]">{PHONE_DISPLAY}</span>
              </a>
            </li>
            <li className="flex-1">
              <a
                href={`mailto:${EMAIL}`}
                className="group flex items-center justify-start gap-3 px-5 py-4 text-kaboz-ink transition hover:text-kaboz-orange sm:justify-center"
              >
                <span
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-kaboz-orange-soft text-kaboz-orange transition group-hover:bg-kaboz-orange group-hover:text-white"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 6h16v12H4z" />
                    <path d="M4 7l8 6 8-6" />
                  </svg>
                </span>
                <span className="text-[13px] sm:text-[14px]">{EMAIL}</span>
              </a>
            </li>
          </ul>
        </section>

        <RecentlyViewed />
      </div>
    </div>
  );
};

export default Contact;
