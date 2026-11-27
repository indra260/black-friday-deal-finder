// HTML for the deal list and the deal detail page. Every value from the data
// is escaped before it goes into the page; prices are computed from the two
// numbers on the deal so the discount shown always matches them.

import { discountPct, savedUsd, verdictOf } from "./signals.js";
import { CATEGORIES, STORES } from "./deals.js";

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const checkedLine = (iso) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }) + " UTC";

function badge(deal) {
  const v = verdictOf(deal);
  return `<span class="badge ${v.cls}" title="${esc(v.blurb)}">${v.label}</span>`;
}

function priceLine(deal) {
  return `<p class="price">${usd(deal.price)} <s>${usd(deal.was)}</s>
    <span class="off">${discountPct(deal)}% off</span>
    <span class="save">save ${usd(savedUsd(deal))}</span></p>`;
}

export function dealCard(deal) {
  return `<article class="card">
  <h3><a href="#/deal/${encodeURIComponent(deal.id)}">${esc(deal.title)}</a></h3>
  <p class="meta"><span class="store">${esc(deal.store)}</span> · ${esc(deal.category)}</p>
  ${priceLine(deal)}
  <p>${badge(deal)}</p>
  <p class="evidence">${esc(deal.evidence)}</p>
  <p class="checked">Checked ${checkedLine(deal.checked)} · ${esc(deal.source)}</p>
  <p class="actions"><a class="btn" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} ↗</a>
  <a class="btn ghost" href="#/deal/${encodeURIComponent(deal.id)}">Why this verdict</a></p>
</article>`;
}

export function controlBar(state, total) {
  const cats = ["All", ...CATEGORIES]
    .map(
      (c) =>
        `<button type="button" class="chip${state.category === c ? " on" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`,
    )
    .join("");
  const stores = ["All", ...STORES]
    .map((s) => `<option${state.store === s ? " selected" : ""}>${esc(s)}</option>`)
    .join("");
  const offs = [0, 20, 30, 40, 50]
    .map(
      (o) =>
        `<option value="${o}"${state.minOff === o ? " selected" : ""}>${o === 0 ? "Any discount" : o + "% off or more"}</option>`,
    )
    .join("");
  return `<section class="controls" aria-label="Search and filter deals">
  <label class="search">Search deals
    <input type="search" id="q" placeholder="Try “airpods”, “TV”, “lego”…" value="${esc(state.query)}">
  </label>
  <div class="chips" role="group" aria-label="Category">${cats}</div>
  <div class="row">
    <label>Store <select id="store">${stores}</select></label>
    <label>Discount <select id="minoff">${offs}</select></label>
    <label class="check"><input type="checkbox" id="truelows"${state.trueLows ? " checked" : ""}> True lows only</label>
    <label>Sort <select id="sort">
      <option value="discount"${state.sort === "discount" ? " selected" : ""}>Biggest discount %</option>
      <option value="saving"${state.sort === "saving" ? " selected" : ""}>Biggest saving $</option>
      <option value="price"${state.sort === "price" ? " selected" : ""}>Lowest price</option>
      <option value="store"${state.sort === "store" ? " selected" : ""}>Store A–Z</option>
    </select></label>
  </div>
  <p class="count" id="count">${total} deal${total === 1 ? "" : "s"} shown</p>
</section>`;
}

export function listPage(state, shown, total) {
  const body =
    shown.length === 0
      ? `<p class="empty">No deal matches those filters. <button type="button" id="clear">Clear filters</button></p>`
      : `<div class="grid">${shown.map(dealCard).join("")}</div>`;
  return `<h1>Black Friday deals, checked today</h1>
<p class="lede">${total} real deals from Amazon, Best Buy, Walmart and Target — every price read by hand on
27 November 2026, with an honest call on whether each one is really a deal.</p>
${controlBar(state, shown.length)}
${body}`;
}

export function dealPage(deal, siblings) {
  const v = verdictOf(deal);
  const cross = siblings.length
    ? `<section class="compare"><h2>Same product, other stores</h2><ul>${siblings
        .map(
          (s) =>
            `<li><a href="#/deal/${encodeURIComponent(s.id)}">${esc(s.store)} — ${usd(s.price)} (${discountPct(s)}% off)</a></li>`,
        )
        .join("")}</ul></section>`
    : "";
  return `<p><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <h1>${esc(deal.title)}</h1>
  <p class="meta"><span class="store">${esc(deal.store)}</span> · ${esc(deal.category)}</p>
  ${priceLine(deal)}
  <p>${badge(deal)} <span class="blurb">${esc(v.blurb)}</span></p>
  <h2>Why this verdict</h2>
  <p>${esc(deal.evidence)}</p>
  ${deal.alsoAt ? `<p class="also">${esc(deal.alsoAt)}</p>` : ""}
  <dl>
    <dt>Store</dt><dd>${esc(deal.store)}</dd>
    <dt>Sale price</dt><dd>${usd(deal.price)}</dd>
    <dt>Usual price</dt><dd>${usd(deal.was)}</dd>
    <dt>You save</dt><dd>${usd(savedUsd(deal))} (${discountPct(deal)}%)</dd>
    <dt>Checked</dt><dd>${checkedLine(deal.checked)}</dd>
    <dt>Price read in</dt><dd>${esc(deal.source)}</dd>
  </dl>
  <p class="actions"><a class="btn" href="${esc(deal.url)}" target="_blank" rel="noopener">View it at ${esc(deal.store)} ↗</a></p>
  <p class="note">Prices move all day on Black Friday — the price at checkout is the price that counts.
  This page lists the price we saw at the check time above, and where we saw it.</p>
</article>
${cross}`;
}

export function notFoundPage() {
  return `<h1>Deal not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
