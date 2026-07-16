// Country-based contact details (progressive enhancement).
//
// The footer ships with a default email and phone number in the HTML so the
// page is always complete. This module upgrades them to the region that matches
// the visitor's country (resolved from the same signal as pricing), and updates
// the demo form's phone placeholder to a locally-formatted example. If the
// config is unreachable, the static values are left untouched.

import { qs } from "../utils/dom.js";
import { detectCountry } from "../utils/geo.js";
import { loadConfig } from "../utils/config.js";

// Strip anything that isn't a digit or leading "+" for the tel: href.
const telHref = (phone) => "tel:" + phone.replace(/[^\d+]/g, "");

function applyContact(details) {
  if (details.email) {
    const emailLink = qs('[data-contact="email"]');
    if (emailLink) {
      emailLink.textContent = details.email;
      emailLink.href = "mailto:" + details.email;
    }
  }

  if (details.phone) {
    const phoneLink = qs('[data-contact="phone"]');
    if (phoneLink) {
      phoneLink.textContent = details.phone;
      phoneLink.href = telHref(details.phone);
    }
  }

  if (details.phonePlaceholder) {
    const phoneField = qs("#phone");
    if (phoneField) phoneField.placeholder = details.phonePlaceholder;
  }
}

export async function init() {
  const data = await loadConfig();
  if (!data?.contact) return; // keep static fallback

  const country = await detectCountry(data.defaultCountry ?? "IN");
  const currencyCode =
    data.countryToCurrency?.[country] ??
    data.countryToCurrency?.[data.defaultCountry] ??
    "INR";

  const details = data.contact.byCurrency?.[currencyCode] ?? data.contact.default;
  if (details) applyContact(details);
}
