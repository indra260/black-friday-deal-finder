// The "is it really a deal" signal. Each deal carries a verdict key from the
// maker; this module turns it into the label, the short line and the badge
// class the site shows. No verdict is ever invented here — the evidence for
// it lives on the deal itself, in deals.js.

export const VERDICTS = {
  "true-low": {
    label: "TRUE LOW",
    blurb: "Lowest price we have seen for this item.",
    cls: "v-true",
  },
  strong: {
    label: "STRONG DEAL",
    blurb: "A deep cut, near the item's best price.",
    cls: "v-strong",
  },
  good: {
    label: "GOOD PRICE",
    blurb: "A real discount, fairly priced.",
    cls: "v-good",
  },
  routine: {
    label: "ROUTINE SALE",
    blurb: "A modest cut — the same price has been around before.",
    cls: "v-routine",
  },
};

export function verdictOf(deal) {
  return VERDICTS[deal.verdict] ?? VERDICTS.good;
}

export function discountPct(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function savedUsd(deal) {
  return deal.was - deal.price;
}

export function verdictCounts(deals) {
  const counts = { "true-low": 0, strong: 0, good: 0, routine: 0 };
  for (const d of deals) if (counts[d.verdict] !== undefined) counts[d.verdict]++;
  return counts;
}
