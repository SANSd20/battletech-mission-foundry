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
assert.match(pascagoulaVariant.scaleNotesByScale["2"].join(" "), /Mines #1 and Mines #2.*Daimyo DMO-5K.*Dragon DRG-5Nr/);
assert.match(pascagoulaVariant.scaleNotesByScale["3"].join(" "), /Mines #1 and Mines #2.*Daimyo DMO-5K.*Dragon DRG-5Nr.*Nova Cat T/);
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
const leBlanc = HOT_SPOTS.find(item => item.id === "le-blanc");
assert.equal(leBlanc.tracks[0].trackId, "objective-raid", "Le Blanc Track 1 remains an Objective Raid variant");
assert.equal(leBlanc.tracks[0].displayName, "Objective Raid · Wreck the Place");
const leBlancVariant = leBlanc.tracks[0].variant;
assert.equal(leBlancVariant.displayName, "Objective Raid · Wreck the Place");
assert.equal(leBlancVariant.objectiveOverrides["grab-stuff"].name, "Wreck the Place");
assert.equal(leBlancVariant.objectiveOverrides["grab-stuff"].vp, 50);
assert.match(leBlancVariant.objectiveOverrides["grab-stuff"].text, /Each medium objective building destroyed by the Attacker/);
assert.doesNotMatch(leBlancVariant.setup.join(" "), /indestructible/);
assert.match(leBlancVariant.setup.join(" "), /destructible/);
assert.match(leBlancVariant.special.join(" "), /immobile/);
assert.match(leBlancVariant.special.join(" "), /30 damage \(AS: 4 damage\)/);
assert.doesNotMatch(leBlancVariant.special.join(" "), /component|grab and load|carrying reduces/i);
assert.deepEqual(leBlancVariant.sourceRefs, ["Draconis Reach p. 88", "Objective Raid p. 171"]);
const newIvaarsen = HOT_SPOTS.find(item => item.id === "new-ivaarsen");
assert.deepEqual(newIvaarsen.tracks.map(track => [track.sequence, track.trackId, track.attacker, track.defender]), [
  [1, "strike", "stephensons", "isf"],
  [2, "meeting-engagement", "stephensons", "isf"],
  [3, "assault", "isf", "stephensons"]
], "New Ivaarsen retains its source track order and roles");
assert.equal(newIvaarsen.campaignState.fields.length, 5, "New Ivaarsen exposes all cross-track state fields");
assert.deepEqual(newIvaarsen.campaignState.fields.map(field => field.id), [
  "stephensonsBuildingDamage",
  "isfBuildingDamage",
  "sirDuncanStatus",
  "sionaStatus",
  "specialCharactersPresent"
]);
assert.match(newIvaarsen.campaignState.note, /remain associated with their track sequence/);
assert.match(newIvaarsen.campaignState.note, /four buildings designated by the Defender/);
const app = fs.readFileSync(new URL("../dist/hot-spots/app.mjs", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../dist/hot-spots/index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../dist/hot-spots/styles.css", import.meta.url), "utf8");
const data = fs.readFileSync(new URL("../dist/hot-spots/data.mjs", import.meta.url), "utf8");
assert.ok(app.includes("roleChoiceHint"), "role choice hints can describe source-specific role selection");
for (const term of ["progress", "vpSelections", "data-mode", "resetTrack", "window.confirm", "Attacker only", "Defender only", "Both sides"]) {
  assert.ok((app + html).includes(term), term + " tracking behavior is present");
}
for (const term of ["hot-spot-select", "hot-spot-track-select", "hot-spot-side-select", "winner-controls", "winnerSelections", "resultSelections", "FACTION_COLORS", "applyFactionTheme", "--faction-color", "color-mix", "taking-one-for-team", "opfor-display", "OPPOSING_FORCE_TABLES", "Your 1D6 roll"]) {
  assert.ok((app + html + css + fs.readFileSync(new URL("../dist/hot-spots/data.mjs", import.meta.url), "utf8")).includes(term), term + " Hot Spot setup behavior is present");
}
for (const term of ["option-toggle", "opfor-card", "opfor-force-grid"]) {
  assert.ok(css.includes(term), term + " OpFor styling is present");
}
assert.ok(app.includes("Number(completed) * getVp(display, side)"), "repeatable objective counters and scenario overrides feed the VP total");
assert.ok(app.includes("display.vp + \" VP\""), "scenario objective overrides feed the VP badge");
assert.ok(app.includes("renderReferenceObjectives") && css.includes("objective-reference-group") && css.includes("reference-objective-subhead"), "reference objectives group Orders with side subheadings");
assert.ok(app.includes('state.mode = button.dataset.mode') && app.includes('document.body.dataset.mode = state.mode'), "attacker/defender/both tracking views are wired");
assert.ok(app.includes('$("#attacker-bar").style.width') && app.includes('$("#defender-bar").style.width'), "live score comparison bars update from current totals");
assert.ok(app.includes('data-action=\"increment\"') && app.includes('data-action=\"decrement\"'), "repeatable component/VP objectives expose counters");
for (const term of ["referenceTrack", "scaleNotesFor", "scaleNotesByScale", "sourceReferenceText", "displayObjective", "renderCommandComplications", "commandComplications", "objectiveOverrides", "Gem Convoy Raid", "Modified Objective Raid", "one component per functioning hand actuator per turn", "removed from play and cannot return", "Destroying a Ryu does not itself award victory"]) {
  assert.ok((app + data).includes(term), term + " Pascagoula variant behavior is present");
}
for (const term of ["campaignState", "campaignTrackValues", "campaignBuildingTotals", "CROSS-TRACK PRESERVATION", "Reset campaign state", "Stephensons building hexes destroyed this track", "running totals through Tracks 1–2"]) {
  assert.ok((app + data + html).includes(term), term + " New Ivaarsen cross-track preservation behavior is present");
}
assert.ok(css.includes("command-complications-table") && css.includes("complication-roll"), "Command Complications table has focused responsive styling");
assert.ok(css.includes("campaign-state-card") && css.includes("campaign-fields"), "cross-track campaign state has focused responsive styling");
assert.ok(html.includes("master errata") && html.includes("topic,90893.0.html"), "current Draconis Reach master errata is identified in the source verification panel");
assert.ok(css.includes("@media") && css.includes("flex-wrap: wrap"), "responsive layout rules remain present");
assert.ok(HOT_SPOTS.length >= 10, "the location selector includes the Draconis Reach mission briefs currently mapped");
const achernar = HOT_SPOTS.find(item => item.id === "achernar");
assert.equal(achernar.tracks[1].outcomes["home-guard"].trackId, "recon", "Achernar Track 2 resolves from the previous winner");
assert.equal(achernar.tracks[2].outcomes["home-guard|home-guard"].trackId, "defend", "Achernar Track 3 resolves from both prior winners");
const protection = HOT_SPOTS.find(item => item.id === "protection");
assert.equal(protection.tracks[2].outcomes["platinum-sands|kanagawa-group"].roleChoice, true, "Protection mixed results expose the source roll-off choice");
assert.match(protection.note, /contract 138910A–B/);
const protectionTrack1 = protection.tracks[0].variant;
assert.equal(protectionTrack1.displayName, "Protection Recon");
assert.match(protectionTrack1.setupDetails.join(" "), /second month.*Platinum Sands player as Attacker/);
assert.match(protectionTrack1.special.join(" "), /Level 0 ground as Level 0 water/);
assert.match(protectionTrack1.special.join(" "), /six Depth 1 water tokens/);
assert.match(protectionTrack1.special.join(" "), /Atlantis City/);
assert.match(protectionTrack1.special.join(" "), /Do not apply this option unless the table establishes it/);
assert.equal(protectionTrack1.commandComplications.rows.length, 6, "Protection exposes all command complication results");
assert.deepEqual(protectionTrack1.commandComplications.rows.map(row => row.roll), ["1–3", "4", "5", "6", "7", "8+"]);
assert.deepEqual(protectionTrack1.commandComplications.rows.map(row => row.name), ["No Complication", "R&R", "Less Support", "Local Partisans", "Monsoon", "Roll Twice"]);
assert.match(protectionTrack1.commandComplications.rows[2].text, /10 BSP/);
assert.match(protectionTrack1.commandComplications.rows[3].text, /two additional Vedette Medium Tank/);
assert.match(protectionTrack1.commandComplications.rows[4].text, /reduce all hex levels by 1/);
assert.match(protectionTrack1.commandComplications.rows[5].text, /Roll twice and apply both effects/);
assert.equal(protectionTrack1.commandComplications.rows[5].name, "Roll Twice");
assert.match(protectionTrack1.commandComplications.note, /each player rolls 1D6/);
const protectionTrack2 = protection.tracks[1].outcomes["platinum-sands"].variant;
assert.match(protectionTrack2.setupDetails.join(" "), /winner of Track 1 is the Attacker/);
const protectionTrack3Mixed = protection.tracks[2].outcomes["platinum-sands|kanagawa-group"];
assert.match(protectionTrack3Mixed.variant.setupDetails.join(" "), /2D6 roll-off/);
assert.match(protectionTrack3Mixed.variant.setupDetails.join(" "), /higher result may choose Attacker or Defender/);
assert.equal(protectionTrack3Mixed.variant.roleChoiceLabel, "Choose the side assigned to the Attacker role after the 2D6 roll-off");
const protectionTrack4 = protection.tracks[3].variant;
assert.match(protectionTrack4.setupDetails.join(" "), /Mobile HQ/);
assert.match(protectionTrack4.special.join(" "), /successful capture causes no damage/);
assert.match(protectionTrack4.special.join(" "), /maximum combat bonus pay/);
assert.deepEqual(protectionTrack4.sourceRefs, ["Draconis Reach pp. 110–112", "Command complications procedure p. 30", "Current Draconis Reach master errata"]);
assert.doesNotMatch(TRACKS.find(track => track.id === "recon").special.join(" "), /Level 0 ground as Level 0 water/);
assert.doesNotMatch(TRACKS.find(track => track.id === "pursuit").special.join(" "), /Mobile HQ/);
const sunPrairie = HOT_SPOTS.find(item => item.id === "sun-prairie");
assert.equal(sunPrairie.source, "Draconis Reach pp. 113–115");
assert.match(sunPrairie.note, /two 1D6 results/);
assert.equal(sunPrairie.tracks.length, 5);
for (const sunPrairieTrack of sunPrairie.tracks) {
  assert.equal(sunPrairieTrack.results.length, 6, "Sun Prairie exposes six source results for each displayed track sequence");
  const variantResults = sunPrairieTrack.results.filter(result => result.trackId);
  assert.equal(variantResults.length, 5);
  for (const result of variantResults) {
    assert.equal(result.variant.commandComplications.rows.length, 6, "Sun Prairie mission results include the complete Command Complications table");
    assert.deepEqual(result.variant.sourceRefs, ["Draconis Reach pp. 113–115", "Current Draconis Reach master errata"]);
  }
}
const sunPrairieVariant = sunPrairie.tracks[0].results[0].variant;
assert.match(sunPrairieVariant.setupDetails.join(" "), /first 1D6 determines the first track/);
assert.match(sunPrairieVariant.setupDetails.join(" "), /duplicate track result produces no track/);
assert.match(sunPrairieVariant.setupDetails.join(" "), /all six rolls.*1s/);
assert.match(sunPrairieVariant.setupDetails.join(" "), /Open Terrain #2/);
assert.match(sunPrairieVariant.setupDetails.join(" "), /Rolling Hills #3/);
assert.match(sunPrairieVariant.setupDetails.join(" "), /Forward Base/);
assert.match(sunPrairieVariant.special.join(" "), /two tracks in a row/);
assert.match(sunPrairieVariant.special.join(" "), /Temporary Hire/);
assert.match(sunPrairieVariant.special.join(" "), /Prairie Rangers offer four Veteran motorized platoons/);
assert.match(sunPrairieVariant.special.join(" "), /Philips Wilson pilots a Dragon Fire DGR-6FC/);
assert.match(sunPrairieVariant.special.join(" "), /Federated Suns Purchase Options Table/);
assert.match(sunPrairieVariant.commandComplications.note, /each player rolls 1D6/);
assert.deepEqual(sunPrairieVariant.commandComplications.rows.map(row => row.roll), ["1", "2–3", "4–5", "6", "7", "8+"]);
assert.deepEqual(sunPrairieVariant.commandComplications.rows.map(row => row.name), ["Lostech cache found!", "No Complication", "Opportunism and rumors of treasure", "Uneven footing / ghost town rubble", "Tinderbox conditions", "Roll twice and apply both effects"]);
assert.match(sunPrairieVariant.commandComplications.rows[0].text, /additional 100 SP/);
assert.match(sunPrairieVariant.commandComplications.rows[2].text, /first two turns/);
assert.match(sunPrairieVariant.commandComplications.rows[3].text, /6 rubble hexes/);
assert.match(sunPrairieVariant.commandComplications.rows[4].text, /5 heat/);
assert.match(sunPrairieVariant.commandComplications.rows[4].text, /light smoke/);
assert.match(sunPrairieVariant.commandComplications.rows[5].text, /Ignore and do not reroll duplicate effects/);
const sunPrairieNone = sunPrairie.tracks[0].results.find(result => result.id === "none");
assert.equal(sunPrairieNone.trackId, null, "Sun Prairie result 6 remains a no-track result");
assert.equal(sunPrairieNone.variant, undefined, "Sun Prairie no-track result does not apply mission rules automatically");
const tigress = HOT_SPOTS.find(item => item.id === "tigress");
assert.equal(tigress.source, "Draconis Reach pp. 118–119");
assert.match(tigress.note, /Meeting Engagement training mission/);
assert.deepEqual(tigress.tracks.map(track => [track.sequence, track.trackId, track.attacker, track.defender]), [
  [1, "recon", "legion-trainers", "roughriders"],
  [2, "meeting-engagement", "legion-trainers", "roughriders"]
], "Tigress retains its two-track order and roles");
const tigressTrack1 = tigress.tracks[0].variant;
assert.equal(tigressTrack1.displayName, "Training Mission · Meeting Engagement → Recon");
assert.match(tigressTrack1.setup.join(" "), /short edge/);
assert.match(tigressTrack1.setup.join(" "), /Training mission/);
assert.doesNotMatch(tigressTrack1.setup.join(" "), /set up anywhere; at least 50 percent/);
assert.match(tigressTrack1.setupDetails.join(" "), /1D6 − 2 turns/);
assert.match(tigressTrack1.setupDetails.join(" "), /minimum delay of 2 turns/);
assert.match(tigressTrack1.setupDetails.join(" "), /scenario-provided trainee ’Mechs/);
assert.match(tigressTrack1.setupDetails.join(" "), /not purchased units or generated OpFor/);
assert.match(tigressTrack1.setupDetails.join(" "), /combined BV\/PV of the Legion Trainers and their trainee/);
assert.match(tigressTrack1.setupDetails.join(" "), /control.*switches from Roughriders Recon to Legion Trainers/);
assert.match(tigressTrack1.setupDetails.join(" "), /Wooded Terrain table/);
assert.match(tigressTrack1.setupDetails.join(" "), /standard Recon scenario/);
assert.match(tigressTrack1.scaleNotesByScale["1"].join(" "), /Vindicator VND-7L.*Gunnery 4 \/ Piloting 6/);
assert.match(tigressTrack1.scaleNotesByScale["2"].join(" "), /Vindicator VND-7L.*Cicada CDA-4A/);
assert.match(tigressTrack1.scaleNotesByScale["3"].join(" "), /short lance of three.*officer-cadet/);
assert.match(tigressTrack1.special.join(" "), /erase all damage sustained/);
assert.match(tigressTrack1.special.join(" "), /energy weapons return to full power/);
assert.match(tigressTrack1.special.join(" "), /Ammunition-based weapons are effectively defunct/);
assert.match(tigressTrack1.special.join(" "), /Gauss weapons are the exception/);
assert.match(tigressTrack1.special.join(" "), /either or both players may claim victory/);
assert.match(tigressTrack1.special.join(" "), /Joachim Vierziger/);
assert.match(tigressTrack1.special.join(" "), /Sea Fox Random Purchase Table/);
assert.deepEqual(tigressTrack1.commandComplications.rows.map(row => row.roll), ["1–2", "3", "4", "5–6"]);
assert.match(tigressTrack1.commandComplications.rows[1].text, /both players have entered the map/);
assert.match(tigressTrack1.commandComplications.rows[1].text, /Defensive Aerospace Support or Artillery Support/);
assert.match(tigressTrack1.commandComplications.rows[2].text, /Offensive Aerospace Support/);
assert.match(tigressTrack1.commandComplications.rows[3].text, /To-Hit roll of 12/);
assert.match(tigressTrack1.commandComplications.note, /Add 1 for Liaison Command/);
assert.deepEqual(tigressTrack1.sourceRefs, ["Draconis Reach pp. 118–119", "Command complications procedure p. 30", "Current Draconis Reach master errata"]);
const tigressTrack2 = tigress.tracks[1].variant;
assert.equal(tigressTrack2.displayName, "Tigress Meeting Engagement");
assert.match(tigressTrack2.setupDetails.join(" "), /remaining Legion Trainers and trainees/);
assert.match(tigressTrack2.setupDetails.join(" "), /Captain Sutera Galindo/);
assert.match(tigressTrack2.setupDetails.join(" "), /Caesar CES-5D/);
assert.match(tigressTrack2.setupDetails.join(" "), /Gunnery 3 \/ Piloting 3/);
assert.match(tigressTrack2.setupDetails.join(" "), /Hills Terrain table/);
assert.match(tigressTrack2.special.join(" "), /loaded with live ammunition/);
assert.match(tigressTrack2.special.join(" "), /repair armor damage and replenish ammunition/);
assert.match(tigressTrack2.special.join(" "), /internal structure damage and critical hits remain/);
assert.deepEqual(tigressTrack2.sourceRefs, ["Draconis Reach pp. 118–119", "Command complications procedure p. 30", "Current Draconis Reach master errata"]);
assert.doesNotMatch(TRACKS.find(track => track.id === "recon").setup.join(" "), /training mission|Vindicator VND-7L/);
assert.doesNotMatch(TRACKS.find(track => track.id === "meeting-engagement").special.join(" "), /Sutera Galindo|live ammunition/);
for (const hotSpot of HOT_SPOTS) {
  assert.ok(hotSpot.sides.length >= 2, hotSpot.name + " has opposing sides");
  for (const side of hotSpot.sides) assert.ok(Object.values(FACTION_COLORS).includes(side.color), hotSpot.name + " side has a faction UI color");
  for (const sequence of hotSpot.tracks) assert.ok(sequence.sequence >= 1, hotSpot.name + " track sequence is numbered");
}
console.log("Hot Spots mission browser data and interaction smoke tests passed");

