import assert from "node:assert/strict";
import fs from "node:fs";
import { achernarInitialDefectors, calculateAchernarVictory, calculateReconDenyVp, FACTION_COLORS, GENERAL_RULES, HOT_SPOTS, MISSION_OPFOR_OVERRIDES, normalizeAchernarCampaignState, OPPOSING_FORCE_TABLES, RECON_DENY_ATTACKER_OBJECTIVE_IDS, RECON_DENY_VP_SCHEDULE, SOURCES, SPECIAL_TRACKS, TRACKS } from "../dist/hot-spots/data.mjs";

const expected = ["Assault", "Breakthrough", "Defend", "Flank", "Meeting Engagement", "Objective Raid", "Pursuit", "Pushback", "Recon", "Retreat", "Strike"];
assert.deepEqual(TRACKS.map(track => track.name), expected, "all eleven Draconis Reach standard tracks are present");
assert.equal(new Set(TRACKS.map(track => track.id)).size, 11, "track ids are unique");
assert.equal(GENERAL_RULES.length, 5, "shared p. 167 reference includes the five browser sections");
assert.match(SOURCES.supersession, /supersedes/i);
assert.match(SOURCES.militaryPalette, /military-ui\.yaml/);
assert.equal(FACTION_COLORS["Federated Suns"], "#7FA52F", "Federated Suns uses the brighter Hot Spots consumer adaptation");
assert.match(SOURCES.errata, /official master errata/i);
assert.match(SOURCES.pascagoula, /pp\. 104–106/);
const cripplingDamage = GENERAL_RULES.find(rule => rule.title === "Crippling Damage").text;
assert.match(cripplingDamage, /torso internal structure damage does not count while that location still has front armor/);
assert.match(cripplingDamage, /half starting structure, rounded up/);
assert.match(cripplingDamage, /begins with only 1 structure starts withdrawing as soon as it loses all armor/);
assert.match(cripplingDamage, /all weapons destroyed and no ability to move is considered destroyed/);
const scanning = GENERAL_RULES.find(rule => rule.title === "Scanning").text;
const scanningRange = GENERAL_RULES.find(rule => rule.title === "Scanning range").table;
assert.match(scanning, /BattleTech:.*BattleMechs and vehicle assets.*within 4 hexes and LOS.*Physical Attack Phase.*in place of making a physical attack/i, "BattleTech scanning preserves scanner eligibility, range, LOS, phase, and initial physical-attack replacement");
assert.match(scanning, /End Phase of the following turn.*physical attacks.*may not make weapon attacks/i, "BattleTech scanning preserves its two-turn procedure and second-turn attack restrictions");
assert.match(scanning, /fails if the target is destroyed or out of range.*destroyed units cannot be scanned/i, "BattleTech scanning preserves failure and destroyed-target restrictions");
assert.match(scanning, /Sensor critical hit.*functioning probe/i, "BattleTech scanning preserves the Sensor critical-hit restriction and probe exception");
assert.match(scanning, /probe.*removes the LOS requirement.*weapon and physical attacks.*enemy ECM/i, "BattleTech scanning preserves probe range, LOS, attack, and ECM interactions");
assert.match(scanning, /Alpha Strike:.*within 8 inches and LOS.*Combat Phase/i, "Alpha Strike scanning uses the errata-corrected declaration range");
assert.match(scanning, /may not make a physical attack during the initial turn.*End Phase of the following turn.*may make physical attacks/i, "Alpha Strike scanning preserves its two-turn physical-attack procedure");
assert.match(scanning, /sprinting unit cannot scan.*Fire Control critical hit.*functioning probe/i, "Alpha Strike scanning preserves sprinting and Fire Control restrictions plus the probe exception");
assert.match(scanning, /probe that is not blocked by enemy ECM.*removes the LOS requirement.*Scanning Range Table range.*weapon or physical attacks/i, "Alpha Strike scanning preserves probe range, LOS, attack, and ECM interactions");
assert.deepEqual(scanningRange.headers, ["Scanning Equipment", "BT Range", "AS Range", "LOS Required", "Weapon Attacks on 2nd Turn"]);
assert.deepEqual(scanningRange.rows, [
  ["Default Sensors", "4", "8″", "Yes", "No"],
  ["Light Active Probe (LPRB)", "3", "6″", "No", "Yes"],
  ["Watchdog (WAT)", "3", "6″", "No", "Yes"],
  ["Beagle Active Probe (PRB)", "4", "9″", "No", "Yes"],
  ["Asset with PRB", "4", "N/A", "No", "Yes"],
  ["Clan Active Probe", "5", "N/A", "No", "Yes"],
  ["Bloodhound (BH)", "8", "12″", "No", "Yes"]
], "Scanning Range Table matches Draconis Reach pp. 167–168 with current errata");
for (const trackId of ["recon", "retreat", "strike"]) {
  const track = TRACKS.find(candidate => candidate.id === trackId);
  assert.match(track.special.join(" "), /Scanning: refer to the Scanning rules on page 167/i, track.name + " retains the central shared Scanning reference");
}
const strikeScanning = TRACKS.find(track => track.id === "strike").special.join(" ");
assert.match(strikeScanning, /Buildings may be scanned.*Defender reveals whether it is the headquarters/i, "Strike retains its building scanning and reveal procedure");
assert.match(strikeScanning, /Battle armor and infantry may scan only when adjacent to or inside the building.*may not have attacked/i, "Strike retains its battle armor and infantry scanning restrictions");
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
const assault = TRACKS.find(track => track.id === "assault");
assert.match(assault.special.join(" "), /at least one side has no units in play/);
assert.doesNotMatch(assault.special.join(" "), /no ’Mech units in play/);
const breakthrough = TRACKS.find(track => track.id === "breakthrough");
assert.equal(breakthrough.pageRef, "pp. 168–169");
const meetingEngagement = TRACKS.find(track => track.id === "meeting-engagement");
assert.equal(meetingEngagement.pageRef, "pp. 170–171");
const pushback = TRACKS.find(track => track.id === "pushback");
const retreat = TRACKS.find(track => track.id === "retreat");
const strike = TRACKS.find(track => track.id === "strike");
assert.match(pushback.setup.join(" "), /Defender sets up first.*5 hexes \(AS: 10 inches\).*Scale 2\+.*10 hexes \/ 16 inches/i, "Pushback preserves setup order and Scale-dependent distances");
assert.match(pushback.special.join(" "), /shared pool.*take turns selecting one unit at a time.*successfully completed the track chooses first/i, "Pushback preserves alternating salvage with the successful player choosing first");
assert.match(pushback.special.join(" "), /neither side completed.*both completed all objectives.*each side gets its own destroyed or crippled units returned/i, "Pushback preserves both salvage exceptions");
assert.equal(retreat.pageRef, "pp. 174–175", "Retreat uses its complete source-page range");
assert.match(strike.special.join(" "), /shared pool.*take turns selecting one unit at a time.*successfully completed the track chooses first/i, "Strike preserves alternating salvage with the successful player choosing first");
assert.match(strike.special.join(" "), /neither side completed.*both completed all objectives.*each side gets its own destroyed or crippled units returned/i, "Strike preserves both salvage exceptions");
assert.deepEqual(pushback.objectives.map(({ id, side, vp }) => [id, side, vp]), [
  ["orders-attacker", "attacker", 50], ["orders-defender", "defender", 50], ["push", "attacker", 200], ["crush", "attacker", 400],
  ["gutted", "attacker", 150], ["advance-to-rear", "defender", 200], ["make-them-hurt", "defender", 400], ["lead-to-victory", "defender", 150]
], "Pushback objectives and VP remain unchanged");
assert.deepEqual(retreat.objectives.map(({ id, side, vp }) => [id, side, vp]), [
  ["orders-attacker", "attacker", 50], ["orders-defender", "defender", 50], ["identify-weaknesses", "attacker", 200],
  ["hammer", "both", 100], ["gauntlet", "defender", 200]
], "Retreat objectives and VP remain unchanged");
assert.deepEqual(strike.objectives.map(({ id, side, vp }) => [id, side, vp]), [
  ["orders-attacker", "attacker", 50], ["orders-defender", "defender", 50], ["identify-destroy", "attacker", 200],
  ["rough-up-place", "both", 100], ["seek-destroy", "defender", 200]
], "Strike objectives and VP remain unchanged");
assert.ok(raid.objectives.some(objective => objective.repeatable), "Objective Raid includes repeatable objectives");
assert.equal(raid.objectives.filter(objective => objective.repeatable).length, 2);
assert.match(raid.setup.join(" "), /two Medium objective buildings/, "standard Objective Raid retains its building setup");
assert.match(raid.setup.join(" "), /battlefield center/, "standard Objective Raid retains its center-area placement");
assert.match(raid.special.join(" "), /Turn 12/, "standard Objective Raid retains its 12-turn limit");
assert.match(raid.setup.join(" "), /indestructible/, "standard Objective Raid retains its building durability rule");
const recon = TRACKS.find(track => track.id === "recon");
assert.match(recon.setup.join(" "), /50 percent.*including assets.*occupy hexes fully within the half of the play area closest to the Attacker’s home edge/i, "Recon Defender deployment requires fully enclosed hexes in the Attacker-side half");
const reconDeny = recon.objectives.find(objective => objective.id === "deny");
assert.deepEqual(reconDeny.vpOptions, [50, 100, 200, 300], "Deny retains the source's printed VP range");
assert.match(reconDeny.text, /not met by the end of Turn 8.*withdrawing from their home edge before Turn 8.*Scanned and Destroyed/i, "Recon Deny retains Turn 8 timing and the Defender withdrawal penalty");
assert.doesNotMatch(reconDeny.text, /select the applicable value/i, "Recon Deny no longer instructs the player to select a manual VP value");
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
assert.ok(app.includes('referenceTrack.pageRef || "p. " + referenceTrack.page'), "mission heading and citation use the complete pageRef metadata");
assert.ok(app.includes('track.pageRef || "p. " + track.page'), "objective tracker uses the complete pageRef metadata");
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
assert.ok(app.includes("const objectives = variant?.objectives || track.objectives"), "variant-specific objectives feed the live VP total");
assert.ok(app.includes("const objectives = variant?.objectives || track?.objectives || []"), "variant-specific objectives render in the live tracker");
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
const achernarOutcomes = [
  achernar.tracks[0],
  ...Object.values(achernar.tracks[1].outcomes),
  ...Object.values(achernar.tracks[2].outcomes),
  achernar.tracks[3],
  achernar.tracks[4]
];
assert.equal(achernarOutcomes.length, 9, "Achernar exposes all nine resolved tactical outcomes");
assert.deepEqual(achernarOutcomes.map(outcome => [outcome.trackId, outcome.attacker, outcome.defender]), [
  ["meeting-engagement", "tybalt", "home-guard"],
  ["pursuit", "tybalt", "home-guard"],
  ["recon", "home-guard", "tybalt"],
  ["strike", "tybalt", "home-guard"],
  ["meeting-engagement", "home-guard", "tybalt"],
  ["breakthrough", "tybalt", "home-guard"],
  ["defend", "tybalt", "home-guard"],
  ["breakthrough", "tybalt", "home-guard"],
  ["retreat", "home-guard", "tybalt"]
], "Achernar preserves every standard track and tactical role");
for (const outcome of achernarOutcomes) {
  assert.ok(outcome.variant, outcome.trackId + " inherits the Achernar overlay");
  assert.equal(outcome.variant.commandComplications.rows.length, 6, outcome.trackId + " exposes every Achernar complication result");
  assert.match(outcome.variant.commandComplications.note, /each player rolls 1D6.*Tybalt.*no modifier.*Home Guard.*adds 1/i);
  assert.deepEqual(outcome.variant.commandComplications.rows.map(row => row.roll), ["1", "2–3", "4", "5", "6", "7+"]);
  assert.match(outcome.variant.sourceRefs.join(" "), /Draconis Reach pp\. 74–77/);
  assert.match(outcome.variant.sourceRefs.join(" "), /Shared rules pp\. 167–168/);
  assert.match(outcome.variant.sourceRefs.join(" "), /Current Draconis Reach master errata/);
  assert.match(outcome.variant.special.join(" "), /at least one defector vehicle survives all tracks/i);
  assert.match(outcome.variant.special.join(" "), /five or more Battlefield Support units granted to Tybalt/i);
  assert.equal(outcome.variant.objectives, undefined, "Achernar overlay does not replace standard objectives");
}
const achernarComplications = achernar.tracks[0].variant.commandComplications;
assert.match(achernarComplications.rows[0].text, /SDR-8R Spider.*Gunnery 3.*Piloting 4.*Skill 3.*lost first-turn Initiative.*player who did not damage it/i);
assert.match(achernarComplications.rows[0].text, /both players roll.*Gunnery 2.*Piloting 3.*Skill 2/i);
assert.match(achernarComplications.rows[2].text, /six heavy-density Battlefield Support minefields.*before units deploy/i);
assert.match(achernarComplications.rows[3].text, /six hexes.*three 2-inch AoE counters.*rubble/i);
assert.match(achernarComplications.rows[4].text, /multiply.*Scale.*two Mechanized Infantry Platoons.*two Fox Armored Cars.*one Vedette Medium Tank/i);
assert.match(achernarComplications.rows[5].text, /Roll twice.*Ignore duplicate/i);
for (const outcome of Object.values(achernar.tracks[2].outcomes)) {
  assert.match(outcome.variant.setupDetails.join(" "), /two J\. Edgar Hover Tanks per Scale.*Gunnery 4 \/ Piloting 5.*Skill 4/i);
  assert.deepEqual(outcome.variant.scaleNotesByScale, {
    "1": ["Track 3 defector force: two J. Edgar Hover Tanks join Tybalt."],
    "2": ["Track 3 defector force: four J. Edgar Hover Tanks join Tybalt."],
    "3": ["Track 3 defector force: six J. Edgar Hover Tanks join Tybalt."]
  });
}
for (const outcome of [achernar.tracks[3], achernar.tracks[4]]) {
  assert.match(outcome.variant.setupDetails.join(" "), /only the J\. Edgar Hover Tanks that survived the previous track.*Do not restore destroyed vehicles/i);
}
assert.equal(achernar.campaignState.kind, "achernar", "Achernar uses its bounded cross-track record");
assert.deepEqual([1, 2, 3].map(achernarInitialDefectors), [2, 4, 6], "Achernar allocates two J. Edgar tanks per Scale");
assert.deepEqual(normalizeAchernarCampaignState({ survivorsAfterTrack3: 7, survivorsAfterTrack4: 5, finalSurvivors: 4 }, 2), {
  initialDefectors: 4,
  survivorsAfterTrack3: 4,
  survivorsAfterTrack4: 4,
  finalSurvivors: 4,
  strikeWinner: "not-recorded",
  retreatWinner: "not-recorded",
  qualifyingSupportDestroyed: 0
}, "Achernar survivor counts cannot exceed the Scale allocation or prior survivors");
assert.deepEqual(normalizeAchernarCampaignState({ survivorsAfterTrack3: 3, survivorsAfterTrack4: 2, finalSurvivors: 5 }, 3).finalSurvivors, 2, "destroyed defector vehicles do not reappear");
assert.equal(calculateAchernarVictory({ survivorsAfterTrack3: 4, survivorsAfterTrack4: 2, finalSurvivors: 1 }, { scale: 2, strikePlayed: true }).tybalt, "victory", "one final defector survivor gives Tybalt victory");
assert.deepEqual(calculateAchernarVictory({ survivorsAfterTrack3: 4, survivorsAfterTrack4: 1, finalSurvivors: 0, strikeWinner: "tybalt", retreatWinner: "tybalt" }, { scale: 2, strikePlayed: true }), {
  initialDefectors: 4,
  survivorsAfterTrack3: 4,
  survivorsAfterTrack4: 1,
  finalSurvivors: 0,
  strikeWinner: "tybalt",
  retreatWinner: "tybalt",
  qualifyingSupportDestroyed: 0,
  tybalt: "victory",
  homeGuard: "not-qualified",
  supportVictory: false,
  ambiguity: null
}, "Tybalt can use the recorded Strike-and-Retreat alternative when Strike was played");
assert.equal(calculateAchernarVictory({ survivorsAfterTrack3: 2, survivorsAfterTrack4: 0, finalSurvivors: 0, strikeWinner: "home-guard", retreatWinner: "tybalt" }, { scale: 1, strikePlayed: true }).homeGuard, "victory", "Home Guard wins when Tybalt fails an unambiguous alternative");
const dualAchernarVictory = calculateAchernarVictory({ survivorsAfterTrack3: 2, survivorsAfterTrack4: 1, finalSurvivors: 1, qualifyingSupportDestroyed: 5 }, { scale: 1, strikePlayed: true });
assert.deepEqual([dualAchernarVictory.tybalt, dualAchernarVictory.homeGuard], ["victory", "victory"], "both printed victory conditions remain independently available");
assert.match(dualAchernarVictory.ambiguity, /does not establish precedence or a tiebreaker/i);
const nonStrikeAchernarVictory = calculateAchernarVictory({ survivorsAfterTrack3: 2, survivorsAfterTrack4: 0, finalSurvivors: 0, retreatWinner: "tybalt" }, { scale: 1, strikePlayed: false });
assert.deepEqual([nonStrikeAchernarVictory.tybalt, nonStrikeAchernarVictory.homeGuard], ["ambiguous", "ambiguous"], "non-Strike Track 3 branches are not auto-resolved");
assert.match(nonStrikeAchernarVictory.ambiguity, /did not produce a Strike track/i);
for (const term of ["renderAchernarCampaignState", "survivorsAfterTrack3", "survivorsAfterTrack4", "finalSurvivors", "qualifyingSupportDestroyed", "strikeWinner", "retreatWinner", "data-achernar-field", "campaign-ambiguity"]) {
  assert.ok(app.includes(term), term + " Achernar campaign behavior is wired into the browser");
}
assert.match(html, /Source-specific cross-track records are included only where a tactical force or contract-victory rule requires them/);
const protection = HOT_SPOTS.find(item => item.id === "protection");
assert.equal(protection.tracks[2].outcomes["platinum-sands|kanagawa-group"].roleChoice, true, "Protection mixed results expose the source roll-off choice");
assert.match(protection.note, /contract 138910A–B/);
const protectionTrack1 = protection.tracks[0].variant;
assert.equal(protectionTrack1.displayName, "Protection Recon");
assert.deepEqual(RECON_DENY_ATTACKER_OBJECTIVE_IDS, ["orders-attacker", "identify-opposition", "preemptive-strike", "observe-report"]);
assert.deepEqual(RECON_DENY_VP_SCHEDULE, [300, 200, 100, 50, 0]);
assert.equal(calculateReconDenyVp([]), 300, "Recon Deny starts at 300 projected VP");
for (const objectiveId of RECON_DENY_ATTACKER_OBJECTIVE_IDS) {
  assert.equal(calculateReconDenyVp([objectiveId]), 200, objectiveId + " counts as one completed Recon Deny objective");
}
assert.equal(calculateReconDenyVp(["orders-attacker", "identify-opposition"]), 100, "two completed Recon Attacker objectives reduce Deny to 100 VP");
assert.equal(calculateReconDenyVp(["identify-opposition", "preemptive-strike"]), 100, "Deny depends on the completed-objective count, not which two objectives were completed");
assert.equal(calculateReconDenyVp(["orders-attacker", "identify-opposition", "preemptive-strike"]), 50, "three completed Recon Attacker objectives reduce Deny to 50 VP");
assert.equal(calculateReconDenyVp(RECON_DENY_ATTACKER_OBJECTIVE_IDS), 0, "all four Recon Attacker objectives reduce Deny to 0 VP");
assert.equal(calculateReconDenyVp(["orders-defender"]), 300, "Defender Orders does not alter projected Recon Deny VP");
assert.ok(app.includes("function isReconDeny") && app.includes('state.trackId === "recon"') && app.includes("Read-only projection"), "every Recon track renders Deny as a shared calculated read-only value");
assert.doesNotMatch(app, /isProtectionTrack1Deny|protectionDenyVp/, "Recon Deny no longer uses Protection-specific scoring logic");
assert.ok(app.indexOf('if (isReconDeny(objective, side))') < app.indexOf("const vpControl = objective.vpOptions"), "automatic Recon Deny rendering bypasses the manual variable-VP selector");
assert.ok(app.includes("Remaining Deny points are awarded at the end of Turn 8"), "shared Recon Deny distinguishes projected scoring from final Turn 8 scoring");
assert.match(protectionTrack1.setupDetails.join(" "), /second month.*Platinum Sands player as Attacker/);
assert.match(protectionTrack1.special.join(" "), /Level 0 ground as Level 0 water/);
assert.match(protectionTrack1.special.join(" "), /six Depth 1 water tokens/);
assert.match(protectionTrack1.special.join(" "), /Atlantis City/);
assert.match(protectionTrack1.special.join(" "), /Do not apply this option unless the table establishes it/);
assert.match(protectionTrack1.special.join(" "), /50 Support Points per track/);
assert.doesNotMatch(protectionTrack1.special.join(" "), /Warchest Points/);
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
assert.match(sunPrairieVariant.special.join(" "), /Phillips Watson pilots a Dragon Fire DGR-6FC/);
assert.doesNotMatch(sunPrairieVariant.special.join(" "), /Philips Wilson/);
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
const xhosa = HOT_SPOTS.find(item => item.id === "xhosa-vii");
assert.equal(xhosa.source, "Draconis Reach pp. 122–123");
assert.match(xhosa.note, /three-track opposing contract/);
assert.deepEqual(xhosa.tracks.map(track => [track.sequence, track.trackId, track.attacker, track.defender]), [
  [1, "recon", "federated-suns", "draconis-combine"],
  [2, "breakthrough", "federated-suns", "draconis-combine"],
  [3, undefined, undefined, undefined]
], "Xhosa VII retains its source track sequence and winner-dependent Track 3");
const xhosaTrack1 = xhosa.tracks[0].variant;
assert.equal(xhosaTrack1.displayName, "Operation Cold Relief · Reconnaissance");
assert.match(xhosaTrack1.setupDetails.join(" "), /first month.*standard Recon/);
assert.match(xhosaTrack1.setupDetails.join(" "), /Woodland.*Scattered Woods.*Desert #3.*Badlands #1/);
assert.match(xhosaTrack1.special.join(" "), /winner of the final track is the victor/);
assert.deepEqual(xhosaTrack1.commandComplications.rows.map(row => row.roll), ["1–3", "4", "5", "6", "7", "8+"]);
assert.match(xhosaTrack1.commandComplications.rows[1].text, /heavy snowfall/);
assert.match(xhosaTrack1.commandComplications.rows[2].text, /pulse and direct-fire energy weapons/);
assert.match(xhosaTrack1.commandComplications.rows[3].text, /damage of all Battlefield Support Strikes/);
assert.match(xhosaTrack1.commandComplications.rows[4].text, /extra 4 points of heat/);
assert.match(xhosaTrack1.commandComplications.rows[4].text, /2\/-\/- attacking a target 4 inches away/);
assert.match(xhosaTrack1.commandComplications.rows[5].text, /reroll any other duplicate effects/);
assert.match(xhosaTrack1.commandComplications.note, /each player rolls 1D6/);
assert.match(xhosaTrack1.commandComplications.note, /Liaison Command/);
assert.deepEqual(xhosaTrack1.sourceRefs, ["Draconis Reach pp. 122–123", "Command complications procedure p. 30", "Current Draconis Reach master errata"]);
const xhosaTrack2 = xhosa.tracks[1].variant;
assert.equal(xhosaTrack2.displayName, "Operation Cold Relief · Supply Breakthrough");
assert.match(xhosaTrack2.setupDetails.join(" "), /four MASH vehicles/);
assert.match(xhosaTrack2.setupDetails.join(" "), /lack the MASH special ability/);
assert.match(xhosaTrack2.setupDetails.join(" "), /50 VP for each logistics truck/);
assert.match(xhosaTrack2.setupDetails.join(" "), /at least two of the four supply trucks/);
assert.equal(xhosaTrack2.objectives.filter(objective => objective.id === "supply-trucks-exit").length, 1);
assert.equal(xhosaTrack2.objectives.filter(objective => objective.id === "stop-supply-trucks").length, 1);
assert.equal(xhosaTrack2.objectives.find(objective => objective.id === "supply-trucks-exit").repeatable, true);
assert.equal(xhosaTrack2.objectives.find(objective => objective.id === "stop-supply-trucks").repeatable, true);
assert.match(xhosaTrack2.objectives.find(objective => objective.id === "stop-supply-trucks").text, /destroyed, crippled, or otherwise prevented/);
const xhosaAssault = xhosa.tracks[2].outcomes["federated-suns"].variant;
const xhosaStrike = xhosa.tracks[2].outcomes["draconis-combine"].variant;
assert.equal(xhosaAssault.displayName, "Operation Cold Relief · Counterattack");
assert.match(xhosaAssault.summary, /50 percent.*supply trucks/);
assert.match(xhosaAssault.setupDetails.join(" "), /Federated Suns.*Attacker.*Assault/);
assert.equal(xhosaStrike.displayName, "Operation Cold Relief · Strike");
assert.match(xhosaStrike.summary, /less than 50 percent.*supply trucks/);
assert.match(xhosaStrike.setupDetails.join(" "), /Draconis Combine.*Attacker.*Strike/);
assert.equal(xhosaStrike.page, 123);
assert.match(xhosaTrack1.special.join(" "), /Avery pilots a Wasp WSP-5A/);
assert.match(xhosaTrack1.special.join(" "), /Morgan pilots a Stinger STG-6G/);
assert.match(xhosaTrack1.special.join(" "), /Purchase Options/);
assert.match(xhosaTrack1.special.join(" "), /automatically Retainer contracts/);
assert.doesNotMatch(TRACKS.find(track => track.id === "breakthrough").setup.join(" "), /MASH vehicles/);
assert.doesNotMatch(TRACKS.find(track => track.id === "breakthrough").objectives.map(objective => objective.text).join(" "), /logistics truck/);
const actOfPiracy = HOT_SPOTS.find(item => item.id === "act-of-piracy");
assert.equal(actOfPiracy.source, "Draconis Reach pp. 124–126");
assert.match(actOfPiracy.note, /one-track contracts/);
assert.deepEqual(actOfPiracy.tracks.map(track => [track.sequence, track.trackId, track.attacker, track.defender]), [
  [1, "objective-raid", "pirates", "law"]
]);
const actOfPiracyVariant = actOfPiracy.tracks[0].variant;
assert.equal(actOfPiracyVariant.displayName, "Act of Piracy · Objective Raid");
assert.equal(actOfPiracyVariant.type, "Opposing Contract");
assert.match(actOfPiracyVariant.setup.join(" "), /two Medium objective buildings/);
assert.match(actOfPiracyVariant.setup.join(" "), /Pirates are always the Attacker/);
assert.match(actOfPiracyVariant.setupDetails.join(" "), /The Law rolls 1D6/);
assert.match(actOfPiracyVariant.setupDetails.join(" "), /Pirates then roll 1D6/);
assert.match(actOfPiracyVariant.setupDetails.join(" "), /generated local militia garrison force/);
assert.match(actOfPiracyVariant.setupDetails.join(" "), /Beaumont.*Agricultural Machinery.*Federated Suns/);
assert.match(actOfPiracyVariant.setupDetails.join(" "), /De Berry.*Mining Machinery.*Ice/);
assert.match(actOfPiracyVariant.setupDetails.join(" "), /Tancredi IV.*Laser Weapons.*repair-only/);
assert.match(actOfPiracyVariant.setupDetails.join(" "), /Mirach.*Ores.*Low Gravity/);
assert.match(actOfPiracyVariant.setupDetails.join(" "), /Johnsondale.*Combat Vehicles.*Striker Light Tank/);
assert.match(actOfPiracyVariant.setupDetails.join(" "), /Hazelhurst.*Casks of Wine.*half their MV/);
assert.match(actOfPiracyVariant.setupDetails.join(" "), /Piracy Goods & Components Table/);
assert.match(actOfPiracyVariant.special.join(" "), /if either player successfully completes the track/);
assert.match(actOfPiracyVariant.special.join(" "), /no employer, combat bonus, or Base Pay/);
assert.match(actOfPiracyVariant.special.join(" "), /negative warchest becomes debt/);
assert.match(actOfPiracyVariant.special.join(" "), /Sea Fox Purchase Options Table/);
assert.deepEqual(actOfPiracyVariant.commandComplications.rows.map(row => row.roll), ["1–3", "4", "5", "6"]);
assert.match(actOfPiracyVariant.commandComplications.note, /once for the track, not once per player/);
assert.match(actOfPiracyVariant.commandComplications.rows[1].text, /two Minefield Supports/);
assert.match(actOfPiracyVariant.commandComplications.rows[2].text, /half.*rounded up/);
assert.match(actOfPiracyVariant.commandComplications.rows[3].text, /mud/);
assert.match(actOfPiracyVariant.commandComplications.rows[3].text, /bog down/);
assert.equal(actOfPiracy.opforMode, "source-table");
assert.deepEqual(actOfPiracyVariant.sourceRolls.map(roll => [roll.id, roll.options.length]), [
  ["law-protected-system", 6],
  ["pirates-attacked-system", 6]
]);
assert.match(actOfPiracyVariant.sourceRolls[0].note, /Law rolls 1D6/);
assert.match(actOfPiracyVariant.sourceRolls[1].note, /Pirates roll 1D6/);
assert.deepEqual(actOfPiracyVariant.sourceRefs, ["Draconis Reach pp. 124–126", "Objective Raid p. 171", "Command complications procedure p. 30", "Opposing Force Tables p. 186", "Piracy rules pp. 25, 36, 176", "Current Draconis Reach master errata"]);
assert.doesNotMatch(TRACKS.find(track => track.id === "objective-raid").setup.join(" "), /Pirates are always the Attacker/);
assert.doesNotMatch(TRACKS.find(track => track.id === "objective-raid").special.join(" "), /Piracy contract terms cannot be negotiated/);
assert.ok(app.includes("sourceRollSelections") && app.includes("data-source-roll-id"), "Act of Piracy source-roll selectors are wired");
assert.ok(app.includes('opforMode === "source-table"'), "source-defined opposing-force tables can disable generic OpFor controls");
const gameWorlds = HOT_SPOTS.find(item => item.id === "game-worlds");
assert.ok(gameWorlds, "Game Worlds is available as a Hot Spot");
assert.equal(gameWorlds.source, "Draconis Reach pp. 128–131");
assert.equal(gameWorlds.tracks.length, 3, "Game Worlds exposes the source intensity of one to three duel tracks");
assert.equal(gameWorlds.opforMode, "gladiator");
assert.equal(gameWorlds.hideScaleSelector, true, "Game Worlds does not use the normal Force Scale selector");
assert.equal(gameWorlds.hideSideSelector, true, "Game Worlds does not use the normal military-side selector");
assert.equal(SPECIAL_TRACKS.find(track => track.id === "game-world-duel").objectives.length, 10, "Game Worlds has the complete duel objective list");
for (const track of gameWorlds.tracks) {
  assert.equal(track.resultLabel, "Game world");
  assert.deepEqual(track.results.map(result => result.id), ["carcassonne", "xhosa-vii", "tybalt"]);
  for (const result of track.results) {
    assert.equal(result.trackId, "game-world-duel");
    assert.equal(result.variant.selectionControls.length, 1);
    assert.equal(result.variant.selectionControls[0].id, "duel-class");
    assert.equal(result.variant.gladiatorGenerator.skillLevels.rows.length, 3);
    assert.match(result.variant.special.join(" "), /Victory is Victory/);
    assert.match(result.variant.special.join(" "), /Turn 12/);
  }
}
const carcassonne = gameWorlds.tracks[0].results.find(result => result.id === "carcassonne").variant;
assert.match(carcassonne.setupDetails.join(" "), /Fungal Crevasse/);
assert.match(carcassonne.setupDetails.join(" "), /No Class Six/);
assert.equal(carcassonne.selectionControls[0].options.length, 4);
const xhosaGameWorld = gameWorlds.tracks[0].results.find(result => result.id === "xhosa-vii").variant;
assert.match(xhosaGameWorld.special.join(" "), /Freezing Blizzard/);
assert.match(xhosaGameWorld.special.join(" "), /50 percent to combat pay/);
assert.match(xhosaGameWorld.setupDetails.join(" "), /Easter/);
assert.equal(xhosaGameWorld.selectionControls[0].options.length, 5);
const tybalt = gameWorlds.tracks[0].results.find(result => result.id === "tybalt").variant;
assert.match(tybalt.setupDetails.join(" "), /collapsed, with CF 0/);
assert.match(tybalt.special.join(" "), /Tybalt Hiring Hall.*Clan Sea Fox Purchase Options Tables.*p\. 176/);
assert.deepEqual(tybalt.sourceRefs, ["Draconis Reach pp. 128–131", "Tybalt Hiring Hall p. 69", "Clan Sea Fox Purchase Options Tables p. 176"]);
assert.equal(tybalt.selectionControls[0].options.length, 4);
assert.match(SPECIAL_TRACKS.find(track => track.id === "game-world-duel").special.join(" "), /100 SP for Victory!/);
assert.match(gameWorlds.note, /Gladiator Generator/);
assert.ok(app.includes("selectionValues") && app.includes("data-selection-id"), "Game Worlds setup selectors are wired");
assert.ok(app.includes('opforMode === "gladiator"') && app.includes("renderGladiatorGenerator"), "Game Worlds Gladiator Generator control is wired");
assert.ok(html.includes('id="scale-choice"'), "Force Scale control has a scoped container for source-specific hiding");
assert.ok(css.includes("gladiator-tables"), "Gladiator Generator tables retain focused responsive styling");
const mallory = HOT_SPOTS.find(item => item.id === "mallorys-world");
assert.ok(mallory, "Mallory’s World is available as a Hot Spot");
assert.equal(mallory.name, "Mallory’s World");
assert.equal(mallory.region, "Loneliness Island");
assert.equal(mallory.trackSelectorLabel, "Strategic Hex Type");
assert.equal(mallory.fixedScale, 3, "Mallory’s World is fixed to Scale 3 in the browser");
assert.equal(mallory.fixedScaleNote, "Mallory's World is designed and balanced for Scale 3. See Veteran Command (p. 19) for starting directly at this Scale.");
assert.deepEqual(mallory.sides.map(side => [side.id, side.faction]), [
  ["dragon-banner", "Draconis Combine"],
  ["sword-sunburst", "Federated Suns"]
]);
const malloryPlayableTracks = mallory.tracks.filter(track => track.trackId);
assert.equal(malloryPlayableTracks.length, 13, "Mallory’s World exposes all 13 playable strategic hex types");
assert.deepEqual([
  protection.tracks[0].trackId,
  sunPrairie.tracks[0].results.find(result => result.id === "recon").trackId,
  tigress.tracks[0].trackId,
  xhosa.tracks[0].trackId,
  mallory.tracks[0].trackId
], ["recon", "recon", "recon", "recon", "recon"], "Protection, Sun Prairie, Tigress, Xhosa VII, and Mallory’s World inherit shared Recon Deny scoring");
assert.deepEqual(malloryPlayableTracks.map(track => [track.label, track.trackId]), [
  ["Empty Hexes", "recon"],
  ["Operating Base / Landing Zone", "retreat"],
  ["AgroMech Repair Facilities", "defend"],
  ["Defensive Position", "assault"],
  ["Irrigation Control", "pushback"],
  ["BPWW Facilities", "meeting-engagement"],
  ["Boshi-gumi Yakuza Operating Bases", "strike"],
  ["City Hexes", "pursuit"],
  ["Manufacturing Plant", "objective-raid"],
  ["Communication Array", "objective-raid"],
  ["Biotech Research Centre", "breakthrough"],
  ["Shipping Port", "flank"],
  ["Training Simulators", "pushback"]
], "each strategic hex type resolves to its printed standard track without collapsing duplicate track types");
for (const hexTrack of malloryPlayableTracks) {
  const standardTrack = TRACKS.find(track => track.id === hexTrack.trackId);
  assert.ok(standardTrack, hexTrack.label + " resolves to an existing standard track");
  assert.equal(hexTrack.roleChoice, true, hexTrack.label + " lets the user identify the strategic attacking formation");
  assert.deepEqual(hexTrack.variant.objectives, standardTrack.objectives, hexTrack.label + " preserves the standard objective and VP schedule");
  assert.match(hexTrack.variant.setupDetails.join(" "), /Battlefield size: normally use one mapsheet/);
  assert.match(hexTrack.variant.setupDetails.join(" "), /multiple formations on each side.*second mapsheet.*Savannah Terrain table/i);
  assert.match(hexTrack.variant.setupDetails.join(" "), /Pre-battle withdrawal: if the defending formation has not yet moved/);
  assert.match(hexTrack.variant.setupDetails.join(" "), /without time to repair/);
  assert.match(hexTrack.variant.special.join(" "), /21 BSP.*Alpha Strike: 5 BSP/);
  assert.match(hexTrack.variant.special.join(" "), /Forced Withdrawal is not in effect/);
  assert.match(hexTrack.variant.special.join(" "), /Command Complications: none/);
  assert.match(hexTrack.variant.special.join(" "), /do not receive the standard Combat Pay/);
  assert.match(hexTrack.variant.special.join(" "), /does not determine eligibility or award those benefits automatically/);
}
const malloryRestricted = mallory.tracks.find(track => !track.trackId);
assert.equal(malloryRestricted.label, "RSIS/FABL Research Facility · Hex 0507 · Non-playable");
assert.equal(malloryRestricted.variant.nonPlayable, true);
assert.match(malloryRestricted.variant.setupDetails.join(" "), /No formations may enter this hex/);
assert.match(malloryRestricted.variant.special.join(" "), /No tactical scenario, objectives, VP, or track-end procedure applies/);
const malloryDefensive = mallory.tracks.find(track => track.label === "Defensive Position").variant;
assert.match(malloryDefensive.setupDetails.join(" "), /0307, 0312, 0505, 0510, 0910, and 1004/);
assert.match(malloryDefensive.setupDetails.join(" "), /move four terrain pieces up to 6 inches/);
assert.match(malloryDefensive.setupDetails.join(" "), /Defensive Garrison.*within movement range.*have not moved/i);
const malloryIrrigation = mallory.tracks.find(track => track.label === "Irrigation Control").variant;
assert.match(malloryIrrigation.setupDetails.join(" "), /Wide River.*large building token/i);
assert.match(malloryIrrigation.special.join(" "), /10 contiguous hexes as Depth 1 water/);
assert.deepEqual(malloryIrrigation.sourceRefs, ["Draconis Reach pp. 135–139", "Pushback p. 173", "Current Draconis Reach master errata"]);
const malloryBpww = mallory.tracks.find(track => track.label === "BPWW Facilities").variant;
assert.match(malloryBpww.setupDetails.join(" "), /Large Lakes #1.*dock facility/i);
assert.deepEqual(malloryBpww.sourceRefs, ["Draconis Reach pp. 135–139", "Meeting Engagement pp. 170–171", "Current Draconis Reach master errata"]);
const malloryCity = mallory.tracks.find(track => track.label === "City Hexes");
assert.equal(malloryCity.reverseRoles, true, "City Pursuit reverses the strategic attacker into the tactical Defender role");
assert.match(malloryCity.variant.setupDetails.join(" "), /Plaza.*Roundabout/);
assert.match(malloryCity.variant.special.join(" "), /additional 21 BSP.*Infantry/);
const standardPursuit = TRACKS.find(track => track.id === "pursuit");
assert.match(standardPursuit.setup[0], /At Scale 1[–-]2, use two mapsheets/);
assert.match(standardPursuit.scaleNotes.join(" "), /two mapsheets.*four mapsheets/i, "standard Pursuit retains its printed Scale-dependent footprint");
assert.deepEqual(malloryCity.variant.setup, standardPursuit.setup.slice(1), "City Pursuit retains standard setup except for the superseded battlefield dimensions");
assert.deepEqual(malloryCity.variant.setupDetails.slice(0, standardPursuit.setupDetails.length), standardPursuit.setupDetails, "City Pursuit inherits the standard deployment and movement-qualification details");
assert.doesNotMatch([...malloryCity.variant.setup, ...malloryCity.variant.scaleNotes, ...malloryCity.variant.setupDetails].join(" "), /At Scale 1.*mapsheets.*Scale 3|two mapsheets.*four mapsheets/i, "City Pursuit does not display standard Pursuit battlefield dimensions");
assert.match(malloryCity.variant.setup.join(" "), /opposite short edge/i, "City Pursuit retains standard home-edge setup");
assert.match(malloryCity.variant.setup.join(" "), /Attacker[’']s home edge/i, "City Pursuit retains standard entry setup");
const malloryOperatingBase = mallory.tracks.find(track => track.label === "Operating Base / Landing Zone").variant;
const standardRetreat = TRACKS.find(track => track.id === "retreat");
assert.match(standardRetreat.setup[0], /At Scale 1[–-]2, use two mapsheets/);
assert.match(standardRetreat.scaleNotes.join(" "), /two mapsheets.*four mapsheets/i, "standard Retreat retains its printed Scale-dependent footprint");
assert.deepEqual(malloryOperatingBase.setup, standardRetreat.setup.slice(1), "Mallory Operating Base retains standard Retreat setup except for the superseded battlefield dimensions");
assert.deepEqual(malloryOperatingBase.setupDetails.slice(0, standardRetreat.setupDetails.length), standardRetreat.setupDetails, "Mallory Operating Base inherits the standard Turn 1 and Turn 2 deployment details");
assert.doesNotMatch([...malloryOperatingBase.setup, ...malloryOperatingBase.scaleNotes, ...malloryOperatingBase.setupDetails].join(" "), /At Scale 1.*mapsheets.*Scale 3|two mapsheets.*four mapsheets/i, "Mallory Operating Base does not display standard Retreat battlefield dimensions");
assert.match(malloryOperatingBase.setup.join(" "), /opposite short edge/i, "Mallory Operating Base retains standard home-edge setup");
assert.match(malloryOperatingBase.setup.join(" "), /Attacker[’']s edge/i, "Mallory Operating Base retains standard entry setup");
assert.deepEqual(malloryOperatingBase.sourceRefs, ["Draconis Reach pp. 135–139", "Retreat pp. 174–175", "Current Draconis Reach master errata"]);
const malloryManufacturing = mallory.tracks.find(track => track.label === "Manufacturing Plant").variant;
assert.match(malloryManufacturing.setupDetails.join(" "), /HPG Heliport/);
assert.match(malloryManufacturing.special.join(" "), /additional 24 BSP.*vehicles or emplacements/);
assert.match(mallory.tracks.find(track => track.label === "Communication Array").variant.setupDetails.join(" "), /HPG Offices/);
const malloryBiotech = mallory.tracks.find(track => track.label === "Biotech Research Centre").variant;
assert.match(malloryBiotech.setupDetails.join(" "), /CityTech.*six large building tokens/i);
assert.deepEqual(malloryBiotech.sourceRefs, ["Draconis Reach pp. 135–139", "Breakthrough pp. 168–169", "Current Draconis Reach master errata"]);
const malloryShipping = mallory.tracks.find(track => track.label === "Shipping Port").variant;
assert.match(malloryShipping.setupDetails.join(" "), /River Delta\/Drainage Basin #1.*resemble a port/i);
assert.deepEqual(malloryShipping.sourceRefs, ["Draconis Reach pp. 135–139", "Flank pp. 170–171", "Current Draconis Reach master errata"]);
const malloryTraining = mallory.tracks.find(track => track.label === "Training Simulators").variant;
assert.match(malloryTraining.setupDetails.join(" "), /Park District/);
assert.deepEqual(malloryTraining.sourceRefs, ["Draconis Reach pp. 135–139", "Pushback p. 173", "Current Draconis Reach master errata"]);
assert.ok(html.includes('id="hot-spot-track-label"'), "the sequence selector has a location-specific label target");
assert.ok(app.includes('hotSpot.trackSelectorLabel || "Track sequence"'), "Mallory’s World changes the selector label without changing other Hot Spots");
assert.ok(app.includes("if (hotSpot.fixedScale) state.scale = hotSpot.fixedScale"), "Mallory’s World applies its fixed Scale before each render");
assert.ok(app.includes("button.disabled = Boolean(fixedScale)"), "the Scale selector locks for fixed-Scale Hot Spots and unlocks elsewhere");
assert.ok(html.includes('id="scale-restriction-note"'), "the fixed-Scale explanation has a dedicated display target");
assert.ok(app.includes("outcome.reverseRoles") && app.includes("attacker: opposingSide, defender: selectedInitiator"), "City Pursuit role reversal assigns objective and VP columns to the correct tactical sides");
assert.ok(app.includes("variant?.nonPlayable") && app.includes("This strategic hex cannot be entered and has no tactical objectives"), "the restricted research facility renders without a tactical tracker");
for (const standardTrack of TRACKS) {
  assert.doesNotMatch([...standardTrack.setup, ...(standardTrack.setupDetails || []), ...standardTrack.special].join(" "), /Loneliness Island|Strategic hex type|RSIS\/FABL/, standardTrack.name + " remains free of Mallory-specific rules");
}
for (const hotSpot of HOT_SPOTS) {
  assert.ok(hotSpot.sides.length >= 2, hotSpot.name + " has opposing sides");
  for (const side of hotSpot.sides) assert.ok(Object.values(FACTION_COLORS).includes(side.color), hotSpot.name + " side has a faction UI color");
  for (const sequence of hotSpot.tracks) assert.ok(sequence.sequence >= 1, hotSpot.name + " track sequence is numbered");
}
console.log("Hot Spots mission browser data and interaction smoke tests passed");

