// Filtering and sorting: the pure logic behind the search box, the category
// chips, the store and discount filters and the sort control. Kept separate
// from rendering so the same rules drive the list and the result count.

import { discountPct, savedUsd } from "./signals.js";

export const SORTS = {
  discount: { label: "Biggest discount %", key: "discount" },
  saving: { label: "Biggest saving $", key: "saving" },
  price: { label: "Lowest price", key: "price" },
  store: { label: "Store A–Z", key: "store" },
};

export function blankState() {
  return { query: "", category: "All", store: "All", minOff: 0, trueLows: false, sort: "discount" };
}

export function applyFilters(deals, state) {
  const q = state.query.trim().toLowerCase();
  let out = deals.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (discountPct(d) < state.minOff) return false;
    if (state.trueLows && d.verdict !== "true-low") return false;
    if (q !== "" && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const by = {
    discount: (a, b) => discountPct(b) - discountPct(a) || savedUsd(b) - savedUsd(a),
    saving: (a, b) => savedUsd(b) - savedUsd(a) || discountPct(b) - discountPct(a),
    price: (a, b) => a.price - b.price,
    store: (a, b) => a.store.localeCompare(b.store) || discountPct(b) - discountPct(a),
  }[state.sort] ?? ((a, b) => 0);
  return [...out].sort(by);
}
