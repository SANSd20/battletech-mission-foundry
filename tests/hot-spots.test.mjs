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
assert.match(SOURCES.errata, /official master errata/i);
assert.match(SOURCES.pascagoula, /pp\. 104–106/);
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
assert.match(raid.setup.join(" "), /two Medium objective buildings/, "standard Objective Raid retains its building setup");
assert.match(raid.setup.join(" "), /battlefield center/, "standard Objective Raid retains its center-area placement");
assert.match(raid.special.join(" "), /Turn 12/, "standard Objective Raid retains its 12-turn limit");
assert.match(raid.setup.join(" "), /indestructible/, "standard Objective Raid retains its building durability rule");
const recon = TRACKS.find(track => track.id === "recon");
assert.deepEqual(recon.objectives.find(objective => objective.id === "deny").vpOptions, [50, 100, 200, 300], "Deny retains the source's variable VP range");
const pascagoula = HOT_SPOTS.find(item => item.id === "pascagoula");
assert.equal(pascagoula.tracks[0].trackId, "objective-raid", "Pascagoula Track 1 uses Objective Raid");
assert.equal(pascagoula.tracks[0].displayName, undefined, "Pascagoula Track 1 does not expose contract naming");
assert.equal(pascagoula.tracks[1].outcomes["jewel-thieves"].trackId, "pursuit", "Pascagoula Track 2 remains Pursuit");
const pascagoulaVariant = pascagoula.tracks[0].variant;
assert.equal(pascagoulaVariant.displayName, "Gem Convoy Raid", "Pascagoula Track 1 exposes the scenario title in its variant card");
assert.equal(pascagoulaVariant.type, "Modified Objective Raid", "Pascagoula Track 1 identifies the modified track type");
assert.match(pascagoulaVariant.setup.join(" "), /Mines #1/);
assert.match(pascagoulaVariant.setup.join(" "), /four Ryu Heavy Transport WiGEs/);
assert.match(pascagoulaVariant.setup.join(" "), /Vedette Medium Tank BSP asset cards/);
assert.doesNotMatch(pascagoulaVariant.setup.join(" "), /two Medium objective buildings|height 1|battlefield center|indestructible/);
assert.match(pascagoulaVariant.scaleNotesByScale["1"].join(" "), /Mines #1/);
assert.match(pascagoulaVariant.scaleNotesByScale["2"].join(" "), /Mines #2/);
assert.match(pascagoulaVariant.scaleNotesByScale["3"].join(" "), /Daimyo DMO-5K/);
assert.match(pascagoulaVariant.setupDetails.join(" "), /Chimera CHA-2K and Jenner JR7-C2/);
assert.match(pascagoulaVariant.setupDetails.join(" "), /Gunnery 3 \/ Piloting 4/);
assert.match(pascagoulaVariant.setupDetails.join(" "), /opposite the Defender’s home edge/);
assert.match(pascagoulaVariant.setupDetails.join(" "), /Defender selects a short edge/);
assert.match(pascagoulaVariant.special.join(" "), /working interpretation, not an official errata ruling/);
assert.match(pascagoulaVariant.special.join(" "), /one component per functioning hand actuator per turn/);
assert.match(pascagoulaVariant.special.join(" "), /transfer one carried component/);
assert.match(pascagoulaVariant.special.join(" "), /removed from play and cannot return/);
assert.match(pascagoulaVariant.special.join(" "), /Destroying a Ryu does not itself award victory/);
assert.match(pascagoulaVariant.special.join(" "), /replace Objective Raid’s generic 12-turn limit/);
assert.match(pascagoulaVariant.special.join(" "), /damage and ammunition expenditure carry over/);
assert.match(pascagoulaVariant.objectiveOverrides["orders-defender"].text, /mobile Ryu/);
assert.equal(pascagoulaVariant.objectiveOverrides["grab-stuff"].name, "Grab the Stuff");
assert.match(pascagoulaVariant.objectiveOverrides["grab-stuff"].text, /extracted from a Ryu/);
assert.equal(pascagoulaVariant.objectiveOverrides["pay-for-that"].name, "You Must Pay for That");
assert.match(pascagoulaVariant.objectiveOverrides["pay-for-that"].text, /qualifying non-asset Attacker unit/);
assert.equal(pascagoulaVariant.commandComplications.rows.length, 6, "Pascagoula exposes all six Command Complications results");
assert.deepEqual(pascagoulaVariant.commandComplications.rows.map(row => row.name), ["No complications", "Shifting Sand", "Ash Fall", "Volcanic Geysers", "Delayed Deployment", "Increased Repair Costs"]);
assert.match(pascagoulaVariant.commandComplications.rows[1].text, /40\+ ton units/);
assert.match(pascagoulaVariant.commandComplications.rows[2].text, /direct and pulse energy/);
assert.match(pascagoulaVariant.commandComplications.rows[3].text, /ends the Movement Phase/);
assert.match(pascagoulaVariant.commandComplications.rows[4].text, /delayed one turn/);
assert.match(pascagoulaVariant.commandComplications.rows[5].text, /additional 50 percent/);
assert.match(pascagoulaVariant.commandComplications.note, /does not specify a separate roll timing/);
assert.match(pascagoulaVariant.commandComplications.note, /each player rolling separately/);
assert.deepEqual(pascagoulaVariant.sourceRefs, ["Draconis Reach pp. 104–106", "Objective Raid p. 171", "Campaign withdrawal and exit rules p. 31", "Command complications procedure p. 30", "Current Draconis Reach master errata"]);
assert.equal(MISSION_OPFOR_OVERRIDES.pascagoula["jewel-thieves"].scales["1"].primary, "Chimera CHA-2K (3/4) | Jenner JR7-C2 (3/4)");
const app = fs.readFileSync(new URL("../dist/hot-spots/app.mjs", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../dist/hot-spots/index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../dist/hot-spots/styles.css", import.meta.url), "utf8");
const data = fs.readFileSync(new URL("../dist/hot-spots/data.mjs", import.meta.url), "utf8");
for (const term of ["progress", "vpSelections", "data-mode", "resetTrack", "window.confirm", "Attacker only", "Defender only", "Both sides"]) {
  assert.ok((app + html).includes(term), term + " tracking behavior is present");
}
for (const term of ["hot-spot-select", "hot-spot-track-select", "hot-spot-side-select", "winner-controls", "winnerSelections", "resultSelections", "FACTION_COLORS", "applyFactionTheme", "--faction-color", "color-mix", "taking-one-for-team", "opfor-display", "OPPOSING_FORCE_TABLES", "Your 1D6 roll"]) {
  assert.ok((app + html + css + fs.readFileSync(new URL("../dist/hot-spots/data.mjs", import.meta.url), "utf8")).includes(term), term + " Hot Spot setup behavior is present");
}
for (const term of ["option-toggle", "opfor-card", "opfor-force-grid"]) {
  assert.ok(css.includes(term), term + " OpFor styling is present");
}
assert.ok(app.includes("Number(completed) * getVp(objective, side)"), "repeatable objective counters feed the VP total");
assert.ok(app.includes('state.mode = button.dataset.mode') && app.includes('document.body.dataset.mode = state.mode'), "attacker/defender/both tracking views are wired");
assert.ok(app.includes('$("#attacker-bar").style.width') && app.includes('$("#defender-bar").style.width'), "live score comparison bars update from current totals");
assert.ok(app.includes('data-action=\"increment\"') && app.includes('data-action=\"decrement\"'), "repeatable component/VP objectives expose counters");
for (const term of ["referenceTrack", "scaleNotesFor", "scaleNotesByScale", "sourceReferenceText", "displayObjective", "renderCommandComplications", "commandComplications", "objectiveOverrides", "Gem Convoy Raid", "Modified Objective Raid", "one component per functioning hand actuator per turn", "removed from play and cannot return", "Destroying a Ryu does not itself award victory"]) {
  assert.ok((app + data).includes(term), term + " Pascagoula variant behavior is present");
}
assert.ok(css.includes("command-complications-table") && css.includes("complication-roll"), "Command Complications table has focused responsive styling");
assert.ok(html.includes("master errata") && html.includes("topic,90893.0.html"), "current Draconis Reach master errata is identified in the source verification panel");
assert.ok(css.includes("@media") && css.includes("flex-wrap: wrap"), "responsive layout rules remain present");
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

