// Beacon — a Black Friday deal finder that runs from static files alone.
// Routes: #/ is the searchable, filterable list; #/deal/<id> is one deal
// with its verdict, evidence and cross-store comparison. The filter state
// lives in the address bar (hash query) so a filtered view can be linked
// and a screenshot can open it directly. No network request is ever made:
// the deals are in deals.js and everything else is this site's own files.
//
// window.__shotReady is false while a view renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from "./deals.js";
import { blankState, applyFilters } from "./filters.js";
import { listPage, dealPage, notFoundPage } from "./render.js";

const app = document.getElementById("app");

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path, query] = raw.split("?");
  const params = new URLSearchParams(query ?? "");
  const state = blankState();
  state.query = params.get("q") ?? "";
  if (params.get("cat")) state.category = params.get("cat");
  if (params.get("store")) state.store = params.get("store");
  if (params.get("off")) state.minOff = Number(params.get("off")) || 0;
  state.trueLows = params.get("lows") === "1";
  if (params.get("sort")) state.sort = params.get("sort");
  return { path, state };
}

function writeHash(state) {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category !== "All") params.set("cat", state.category);
  if (state.store !== "All") params.set("store", state.store);
  if (state.minOff) params.set("off", String(state.minOff));
  if (state.trueLows) params.set("lows", "1");
  if (state.sort !== "discount") params.set("sort", state.sort);
  const qs = params.toString();
  history.replaceState(null, "", "#/" + (qs ? "?" + qs : ""));
}

function bindControls(state) {
  const q = document.getElementById("q");
  if (q) {
    q.addEventListener("input", () => {
      state.query = q.value;
      writeHash(state);
      renderList(state, false);
    });
  }
  for (const chip of document.querySelectorAll("[data-cat]")) {
    chip.addEventListener("click", () => {
      state.category = chip.dataset.cat;
      writeHash(state);
      renderList(state, true);
    });
  }
  const store = document.getElementById("store");
  if (store) store.addEventListener("change", () => { state.store = store.value; writeHash(state); renderList(state, true); });
  const minoff = document.getElementById("minoff");
  if (minoff) minoff.addEventListener("change", () => { state.minOff = Number(minoff.value); writeHash(state); renderList(state, true); });
  const lows = document.getElementById("truelows");
  if (lows) lows.addEventListener("change", () => { state.trueLows = lows.checked; writeHash(state); renderList(state, true); });
  const sort = document.getElementById("sort");
  if (sort) sort.addEventListener("change", () => { state.sort = sort.value; writeHash(state); renderList(state, true); });
  const clear = document.getElementById("clear");
  if (clear) clear.addEventListener("click", () => renderList(blankState(), true));
}

function renderList(state, full) {
  const shown = applyFilters(deals, state);
  if (full) {
    app.innerHTML = listPage(state, shown, deals.length);
  } else {
    // Re-render the whole list view for a search keystroke: it keeps the
    // count, the cards and the input in sync with one code path, then puts
    // the caret back where the shopper left it.
    const focus = document.activeElement === document.getElementById("q");
    const value = state.query;
    app.innerHTML = listPage(state, shown, deals.length);
    const next = document.getElementById("q");
    if (focus && next) {
      next.focus();
      next.setSelectionRange(value.length, value.length);
    }
  }
  bindControls(state);
  document.title = "Beacon — Black Friday deals, checked today";
}

function render() {
  window.__shotReady = false;
  const { path, state } = parseHash();
  const match = path.match(/^deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    if (!found) {
      app.innerHTML = notFoundPage();
    } else {
      const siblings = deals.filter(
        (d) => d.id !== found.id && d.title === found.title,
      );
      app.innerHTML = dealPage(found, siblings);
      document.title = `${found.title} — ${found.store} | Beacon`;
    }
  } else {
    renderList(state, true);
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
