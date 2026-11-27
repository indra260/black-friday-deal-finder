// Beacon — a Black Friday deal finder (black-friday-deal-finder-01).
//
// The entry is a static site in app/: 32 real Black Friday deals the maker
// found and checked on 27 November 2026, each with its store, a link to the
// product at that store, the sale price, the usual price, the discount and
// the time the price was checked, plus an honest "is it really a deal"
// verdict with its evidence. Search and filters (category, store, discount,
// true lows only) and sorting run entirely in the browser; the site makes no
// network request and loads nothing from outside app/.
//
// This program hands the entry in. It copies app/ and screenshots/ from
// beside this file into the output directory and writes dossier.json there
// with the vendored make.fun library — the summary the judge reads (the
// screenshots, the first load's files and bytes, and the source). The
// vendored library in vendor/makefun-frontend.ts is the kit's copy, left
// exactly as it is: the scorer rebuilds the dossier with its own copy and
// compares the two byte for byte.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// It runs twice in grading and both runs must write the same bytes, so there
// is nothing time- or order-dependent here: plain copies and one
// deterministic dossier build.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The scorer's own caps (from the kit's reference/gate.json): text_max_bytes
// shapes the dossier text; the other caps refuse an entry the scorer would
// refuse — more than 4 screenshots or one over 256 KiB; more than 993 files
// and directories in app/ or 16 MiB of app files. app/ counts beside
// /output's own 1000-entry cap, its screenshots/ and dossier.json.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
