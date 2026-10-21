# Mission Foundry — BattleTech Core Rulebook v0.1

Responsive public web application for generating two-sided Standard Missions from the BattleTech Core Rulebook. This repository contains the page-reference build only; the separate rules-included build is kept local and is not published here.

## Preview

Serve `dist/` with any static file server, then open the local URL. Example: `python3 -m http.server 4173 --directory dist` and visit `http://localhost:4173`.

Only the public page-reference build is included in this repository. The local rules build, `dist/local-rules/`, and `dist/rules-enhancements.js` are intentionally excluded.

## Verification

Run `node tests/mission-data.test.mjs` for the data smoke test. The app intentionally does not build forces, select physical maps, place counters on a real board, or resolve player choices left to players by the rulebook.
