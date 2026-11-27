[![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/indra260/black-friday-deal-finder/rank.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/indra260/black-friday-deal-finder/reward.svg)](https://make.fun/c/black-friday-deal-finder-01)

# Beacon — Black Friday deals, checked today

A Black Friday deal finder for the [make.fun Black Friday deal finder bounty](https://make.fun/c/black-friday-deal-finder-01):
32 real Black Friday and Cyber Monday deals from Amazon, Best Buy, Walmart and Target, every price
read by hand on 27 November 2026 — each with its store, a link to the product at that store, the
sale price, the usual price, the discount, and the time the price was checked.

What makes it more than a list is the verdict. Every deal carries an honest call on whether it is
really a deal — **TRUE LOW** (lowest price we have seen), **STRONG DEAL** (a deep cut near the best
price), **GOOD PRICE** (a real discount, fairly priced) or **ROUTINE SALE** (a modest cut the same
price has had before) — with the evidence written on the deal. The Switch 2 bundle and the iPads
are on this board as routine sales on purpose: a finder that calls everything a bargain is lying.

## Use it

Search, filter by category, store and discount, show true lows only, and sort by biggest discount,
biggest saving, lowest price or store. Open any deal for the full story: why it earned its verdict,
what the same product costs at other stores, and where the price was read.

The site is static files under `app/` — no build step, no network request. Serve it with any
static server pointed at `app/` and open `index.html`, on a desktop or a phone.

## How the deals were checked

The maker read each price on 27 November 2026 (Black Friday) in the deals source named on the
deal — CNN Underscored, Mashable, 9to5Toys, Slickdeals, DealNews, Popular Science, Gizmodo and
the Black Friday Deals Diary — each of which names the store and the price. The check time on
every deal is that read, in UTC. Prices move all day on Black Friday, so the site tells shoppers
to verify the price at checkout.

## Layout

- `main.ts` — hands the entry in: copies `app/` and `screenshots/` to `/output` and writes
  `dossier.json` with the vendored make.fun library.
- `app/index.html` — the page shell.
- `app/deals.js` — the 32 checked deals and their sources.
- `app/signals.js` — the "is it really a deal" verdicts and the discount math.
- `app/filters.js` — search, filter and sort logic.
- `app/render.js` — the list and detail-page HTML.
- `app/main.js` — routing (`#/` list, `#/deal/<id>` detail) and control wiring.
- `app/style.css` — the design.
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.
- `screenshots/` — real renders of the site in a browser (desktop list, deal detail, filtered
  list, phone list).

## License

MIT — see [LICENSE](LICENSE).
