// Country-based pricing (progressive enhancement).
//
// The page ships with static INR pricing cards in the HTML so the section is
// always complete — even with JS disabled or the pricing data unreachable.
// This module upgrades that: it detects the visitor's country, loads the
// per-currency prices from `js/data/pricing.json`, and re-renders the cards in
// the matching currency. If anything fails, the static markup is left untouched.

import { qs } from "../utils/dom.js";
import { detectCountry } from "../utils/geo.js";
import { loadConfig } from "../utils/config.js";
import { observeVisibility } from "../utils/observer.js";
import { prefersReducedMotion } from "../utils/env.js";

const escape = (str) =>
  String(str).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

// Group a whole number for the given locale ("9999" → "9,999" / "9.999").
const groupNumber = (value, locale) => {
  try {
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(
      value
    );
  } catch {
    return String(value);
  }
};

const money = (amount, currency) => {
  const formatted = groupNumber(amount, currency.locale);
  return currency.position === "after"
    ? `${formatted}${currency.symbol}`
    : `${currency.symbol}${formatted}`;
};

function priceCardMarkup(plan, currencyCode, currency, period, customLabel) {
  const featured = plan.featured ? " price-card--featured" : "";
  const badge = plan.badge
    ? `<span class="price-card__badge">${escape(plan.badge)}</span>`
    : "";

  let priceBlock;
  if (plan.custom) {
    priceBlock = `<p class="price-card__price price-card__price--custom">${escape(
      customLabel
    )}</p>`;
  } else {
    const p = plan.prices?.[currencyCode];
    if (!p) return null; // no price for this currency — bail, keep static markup
    const offer =
      p.was != null
        ? `<p class="price-card__offer">
             <span class="price-card__was">${money(p.was, currency)}</span>
             ${p.save ? `<span class="price-card__save">${escape(p.save)}</span>` : ""}
           </p>`
        : "";
    priceBlock = `${offer}
      <p class="price-card__price">
        <sup>${escape(currency.symbol.trim())}</sup>${groupNumber(
      p.now,
      currency.locale
    )}<span>${escape(period)}</span>
      </p>`;
  }

  const features = plan.features
    .map((f) => `<li>${escape(f)}</li>`)
    .join("\n");

  const cta = plan.cta;
  return `
    <article class="price-card${featured} reveal" data-plan="${escape(plan.id)}">
      ${badge}
      <h3>${escape(plan.name)}</h3>
      <p class="price-card__for">${escape(plan.for)}</p>
      ${priceBlock}
      <ul class="price-card__list">
        ${features}
      </ul>
      <a class="btn btn--${escape(cta.style)} btn--block" href="${escape(
    cta.href
  )}">${escape(cta.label)}</a>
    </article>`;
}

function render(container, data, currencyCode) {
  const currency = data.currencies?.[currencyCode];
  if (!currency) return false;

  const cards = data.plans.map((plan) =>
    priceCardMarkup(
      plan,
      currencyCode,
      currency,
      data.period ?? "/yr",
      data.customLabel ?? "Custom"
    )
  );
  if (cards.some((c) => c === null)) return false; // incomplete data — abort

  container.innerHTML = cards.join("\n");
  container.dataset.currency = currencyCode;

  // scrollReveal already ran and observed the original (now replaced) cards,
  // so re-apply the reveal treatment to the freshly rendered ones — otherwise
  // they'd stay at opacity 0. Mirrors js/features/scrollReveal.js.
  const fresh = Array.from(container.children).filter((el) =>
    el.classList.contains("reveal")
  );
  fresh.forEach((el, i) => el.style.setProperty("--i", i));

  if (prefersReducedMotion()) {
    fresh.forEach((el) => el.classList.add("is-visible"));
  } else {
    observeVisibility(
      fresh,
      (el, isVisible) => {
        if (isVisible) el.classList.add("is-visible");
      },
      { once: true, observer: { threshold: 0.12, rootMargin: "0px 0px -6% 0px" } }
    );
  }
  return true;
}

export async function init() {
  const container = qs(".pricing");
  if (!container) return;

  const data = await loadConfig();
  if (!data) return; // offline / blocked / bad JSON — keep static fallback

  const country = await detectCountry(data.defaultCountry ?? "IN");
  const currencyCode =
    data.countryToCurrency?.[country] ??
    data.countryToCurrency?.[data.defaultCountry] ??
    "INR";

  render(container, data, currencyCode);
}
