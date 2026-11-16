import assert from "node:assert/strict";
import fs from "node:fs";
import { FACTION_COLORS, GENERAL_RULES, HOT_SPOTS, MISSION_OPFOR_OVERRIDES, OPPOSING_FORCE_TABLES, SOURCES, TRACKS } from "../dist/hot-spots/data.mjs";

const expected = ["Assault", "Breakthrough", "Defend", "Flank", "Meeting Engagement", "Objective Raid", "Pursuit", "Pushback", "Recon", "Retreat", "Strike"];
assert.deepEqual(TRACKS.map(track => track.name), expected, "all eleven Draconis Reach standard tracks are present");
assert.equal(new Set(TRACKS.map(track => track.id)).size, 11, "track ids are unique");
assert.equal(GENERAL_RULES.length, 5, "shared p. 167 reference includes the five browser sections");
assert.match(SOURCES.supersession, /supersedes/i);
assert.match(SOURCES.militaryPalette, /military-ui\.yaml/);
assert.equal(FACTION_COLORS["Federated Suns"], "#7FA52F", "Federated Suns uses the brighter Hot Spots consumer adaptation");
assert.deepEqual(Object.keys(OPPOSING_FORCE_TABLES).sort(), ["capellan", "draconis-combine", "federated-suns", "mercenary-pirate", "raven-alliance"], "all five Draconis Reach OpFor tables are present");
for (const table of Object.values(OPPOSING_FORCE_TABLES)) {
  assert.equal(Object.keys(table.scales).length, 3, table.label + " includes all three scales");
  for (const scale of Object.values(table.scales)) {
    assert.equal(scale.rows.length, 6, table.label + " scale has six 1D6 rows");
    for (const row of scale.rows) assert.ok(row.roll, table.label + " OpFor row has a roll marker");
  }
}
assert.match(OPPOSING_FORCE_TABLES["raven-alliance"].scales["3"].rows[5].primary, /Charger C/);
for (const track of TRACKS) {
  assert.ok(track.page >= 168 && track.page <= 175, track.name + " has a track page");
  assert.ok(track.setup.length >= 1, track.name + " has setup");
  assert.ok(track.objectives.length >= 1, track.name + " has objectives");
  assert.ok(track.special.length >= 1, track.name + " has track-end or salvage text");
  for (const objective of track.objectives) {
    assert.ok(["attacker", "defender", "both"].includes(objective.side), track.name + " objective side is valid");
    assert.ok(Number.isFinite(objective.vp), track.name + " objective VP is numeric");
  }
}
const raid = TRACKS.find(track => track.id === "objective-raid");
assert.ok(raid.objectives.some(objective => objective.repeatable), "Objective Raid includes repeatable objectives");
assert.equal(raid.objectives.filter(objective => objective.repeatable).length, 2);
const recon = TRACKS.find(track => track.id === "recon");
assert.deepEqual(recon.objectives.find(objective => objective.id === "deny").vpOptions, [50, 100, 200, 300], "Deny retains the source's variable VP range");
const app = fs.readFileSync(new URL("../dist/hot-spots/app.mjs", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../dist/hot-spots/index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../dist/hot-spots/styles.css", import.meta.url), "utf8");
for (const term of ["progress", "vpSelections", "data-mode", "resetTrack", "window.confirm", "Attacker only", "Defender only", "Both sides"]) {
  assert.ok((app + html).includes(term), term + " tracking behavior is present");
}
for (const term of ["hot-spot-select", "hot-spot-track-select", "hot-spot-side-select", "winner-controls", "winnerSelections", "resultSelections", "FACTION_COLORS", "applyFactionTheme", "--faction-color", "color-mix", "taking-one-for-team", "opfor-display", "OPPOSING_FORCE_TABLES", "Your 1D6 roll", "opfor-roll", "scale-choice", "scale-buttons", "scale-button"]) {
  assert.ok((app + html + css + fs.readFileSync(new URL("../dist/hot-spots/data.mjs", import.meta.url), "utf8")).includes(term), term + " Hot Spot setup behavior is present");
}
for (const term of ["option-toggle", "opfor-card", "opfor-force-grid", "opfor-roll-control"]) {
  assert.ok(css.includes(term), term + " OpFor styling is present");
}
assert.ok(!app.includes("Math.random"), "OpFor result is selected by the player rather than generated randomly");
assert.ok(html.indexOf('id="scale-select"') < html.indexOf('id="taking-one-for-team"'), "Force Scale appears before Taking one for the team");
assert.match(app, /scale:\s*1,/, "application defaults to Scale 1");
assert.match(html, /data-scale="1" aria-pressed="true">1<\/button>/, "Scale 1 is selected by default");
assert.ok(!html.includes('<select id="scale-select">'), "Force Scale uses buttons instead of a dropdown");
assert.ok(app.includes('Array.from(document.querySelectorAll(".scale-button")).forEach'), "Scale buttons use the multi-element selector");
assert.ok(app.includes("renderTrackOptions();" + String.fromCharCode(10) + "  renderReference();"), "Scale selection refreshes the selected button state");
assert.ok(app.includes('const label = value === 1 ? "1−"') && app.includes('const label = value === 6 ? "6+"'), "OpFor roll selector uses the table boundary labels");
assert.equal(MISSION_OPFOR_OVERRIDES.pascagoula["jewel-thieves"].scales["1"].primary, "CMA-2K Chimera (3/4) | JR7-C2 Jenner (3/4)", "Pascagoula Scale 1 uses the mission-specific Fifth Ghost roster");
assert.match(MISSION_OPFOR_OVERRIDES.pascagoula["jewel-thieves"].scales["2"].primary, /DMO-5K Daimyo/);
assert.match(MISSION_OPFOR_OVERRIDES.pascagoula["jewel-thieves"].scales["3"].primary, /Nova Cat T/);
assert.ok(app.includes("MISSION_OPFOR_OVERRIDES") && app.includes("Mission-specific opposing force"), "Pascagoula uses the mission-specific OpFor override");
assert.ok(HOT_SPOTS.length >= 10, "the location selector includes the Draconis Reach mission briefs currently mapped");
const achernar = HOT_SPOTS.find(item => item.id === "achernar");
assert.equal(achernar.tracks[1].outcomes["home-guard"].trackId, "recon", "Achernar Track 2 resolves from the previous winner");
assert.equal(achernar.tracks[2].outcomes["home-guard|home-guard"].trackId, "defend", "Achernar Track 3 resolves from both prior winners");
const protection = HOT_SPOTS.find(item => item.id === "protection");
assert.equal(protection.tracks[2].outcomes["platinum-sands|kanagawa-group"].roleChoice, true, "Protection mixed results expose the source roll-off choice");
for (const hotSpot of HOT_SPOTS) {
  assert.ok(hotSpot.sides.length >= 2, hotSpot.name + " has opposing sides");
  for (const side of hotSpot.sides) assert.ok(Object.values(FACTION_COLORS).includes(side.color), hotSpot.name + " side has a faction UI color");
  for (const sequence of hotSpot.tracks) assert.ok(sequence.sequence >= 1, hotSpot.name + " track sequence is numbered");
}
console.log("Hot Spots mission browser data and interaction smoke tests passed");

