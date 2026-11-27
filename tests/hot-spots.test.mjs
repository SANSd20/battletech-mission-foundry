import assert from "node:assert/strict";
import fs from "node:fs";
import { adjustDaharEarnedVp, achernarInitialDefectors, ALTA_VISTA_COMMAND_COMPLICATIONS, ALTA_VISTA_MUTUAL_WITHDRAWAL_CLARIFICATION, ALTA_VISTA_PROVISIONAL_RULES, calculateAchernarVictory, calculateReconDenyVp, DAHAR_COMMAND_COMPLICATIONS, DAHAR_INDUSTRIALMECH_TABLE, DAHAR_MAPSHEET_TABLE, DAHAR_PROVISIONAL_RULES, DAHAR_TRACK_RESULTS, evaluateAltaVistaCampaign, evaluateProtectionPursuit, FACTION_COLORS, GENERAL_RULES, groupComplicationEffectEntries, HOT_SPOTS, LE_BLANC_COMMAND_COMPLICATIONS, LE_BLANC_MAPSHEET_TABLE, LE_BLANC_PARTISAN_PACKAGES, LE_BLANC_PROVISIONAL_RULES, LE_BLANC_TEMPORARY_HIRES, LUCERNE_COMMAND_COMPLICATIONS, LUCERNE_MAPSHEET_TABLE, LUCERNE_PROVISIONAL_RULES, LUCERNE_TEMPORARY_HIRES, LUCERNE_TRACK_RESULTS, MELCHER_BLACK_MARKET, MELCHER_COMMAND_COMPLICATIONS, MELCHER_GRASSLANDS_MAPSHEETS, MELCHER_TEMPORARY_HIRES, MISSION_OPFOR_OVERRIDES, NEW_IVAARSEN_CHARACTERS, NEW_IVAARSEN_COMMAND_COMPLICATIONS, NEW_IVAARSEN_LIGHT_URBAN_MAPSHEETS, NEW_IVAARSEN_RYUKEN_SUPPORT, normalizeAchernarCampaignState, normalizeAltaVistaCampaignState, OPPOSING_FORCE_TABLES, PASCAGOULA_COMMAND_COMPLICATIONS, PASCAGOULA_MOUNTAINS_MAPSHEETS, PASCAGOULA_PROVISIONAL_RULES, PLAYER_VISIBLE_HOT_SPOT_IDS, PROTECTION_ATLANTIS_MAPSHEETS, PROTECTION_COMMAND_COMPLICATIONS, PROTECTION_PROVISIONAL_RULES, PROTECTION_STANDARD_MAPSHEETS, PROTECTION_TEMPORARY_HIRES, protectionPartisanSupport, RECON_DENY_ATTACKER_OBJECTIVE_IDS, RECON_DENY_VP_SCHEDULE, resolveDaharComplications, resolveLeBlancComplications, resolveLucerneComplications, SOURCES, SPECIAL_TRACKS, TRACKS } from "../dist/hot-spots/data.mjs";
import { SUN_PRAIRIE_COMMAND_COMPLICATIONS, SUN_PRAIRIE_MAPSHEET_TABLE, SUN_PRAIRIE_TACTICAL_SUPPORT, SUN_PRAIRIE_TEMPORARY_HIRES, TIGRESS_COMMAND_COMPLICATIONS, TIGRESS_HILLS_MAPSHEETS, TIGRESS_PROVISIONAL_RULES, TIGRESS_SUTERA_SUPPORT, TIGRESS_TEMPORARY_HIRES, TIGRESS_TRAINEE_SUPPORT, TIGRESS_WOODED_MAPSHEETS } from "../dist/hot-spots/data.mjs";

const expected = ["Assault", "Breakthrough", "Defend", "Flank", "Meeting Engagement", "Objective Raid", "Pursuit", "Pushback", "Recon", "Retreat", "Strike"];
assert.deepEqual(TRACKS.map(track => track.name), expected, "all eleven Draconis Reach standard tracks are present");
assert.equal(new Set(TRACKS.map(track => track.id)).size, 11, "track ids are unique");
assert.equal(GENERAL_RULES.length, 5, "shared p. 167 reference includes the five browser sections");
assert.match(SOURCES.supersession, /supersedes/i);
assert.match(SOURCES.militaryPalette, /military-ui\.yaml/);
assert.equal(FACTION_COLORS["Federated Suns"], "#7FA52F", "Federated Suns uses the brighter Hot Spots consumer adaptation");
assert.match(SOURCES.errata, /official master errata/i);
assert.match(SOURCES.pascagoula, /pp\. 103–107.*Pursuit p\. 172.*Mountains Terrain Table p\. 150.*Alpha Strike terrain p\. 154/);
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
assert.equal(pascagoula.tracks[0].displayName, "Gem Convoy Raid", "Pascagoula Track 1 exposes its tactical title");
assert.equal(pascagoula.tracks[1].outcomes["jewel-thieves"].trackId, "pursuit", "Pascagoula Track 2 remains Pursuit");
const pascagoulaVariant = pascagoula.tracks[0].variant;
assert.equal(pascagoulaVariant.displayName, "Gem Convoy Raid", "Pascagoula Track 1 exposes the scenario title in its variant card");
assert.equal(pascagoulaVariant.type, "Modified Objective Raid", "Pascagoula Track 1 identifies the modified track type");
assert.deepEqual(pascagoula.sides.map(side => [side.name, side.faction]), [["Jewel Thieves", "Mercenary"], ["Ranger Raiders", "Mercenary"]], "both Pascagoula participating forces are Mercenary");
assert.match(pascagoula.contractReference.summary.join(" "), /145202A.*Oyabun Jamal Matsumoto.*145202B.*Colonel Kenneth Ramaley.*three months/i);
assert.match(pascagoula.contractReference.progression.join(" "), /No repairs or ammunition reloading.*purchases cannot be made between tracks.*one Draconis Combine faction purchase.*one Federated Suns faction purchase/i);
assert.match(pascagoula.contractReference.victory.join(" "), /successfully complete both tracks.*does not equate/i);
assert.match(pascagoulaVariant.setup.join(" "), /Mines #1.*Scales 2–3/);
assert.match(pascagoulaVariant.setup.join(" "), /four Ryu Heavy Transport WiGEs/);
assert.match(pascagoulaVariant.setup.join(" "), /Vedette Medium Tank BSP asset cards/);
assert.doesNotMatch(pascagoulaVariant.setup.join(" "), /two Medium objective buildings|height 1|battlefield center|indestructible/);
assert.match(pascagoulaVariant.scaleNotesByScale["1"].join(" "), /Mines #1/);
assert.match(pascagoulaVariant.scaleNotesByScale["2"].join(" "), /Mines #1 and Mines #2.*Daimyo DMO-5K.*Dragon DRG-5Nr/);
assert.match(pascagoulaVariant.scaleNotesByScale["3"].join(" "), /Mines #1 and Mines #2.*Daimyo DMO-5K.*Dragon DRG-5Nr.*Nova Cat T/);
assert.doesNotMatch(pascagoulaVariant.scaleNotesByScale["3"].join(" "), /additional mapsheets|Mountains Terrain table/i, "Scale 3 uses only the two designated Mines mapsheets");
assert.match(pascagoulaVariant.setupDetails.join(" "), /Chimera CHA-2K and Jenner JR7-C2/);
assert.match(pascagoulaVariant.setupDetails.join(" "), /Gunnery 3 \/ Piloting 4/);
assert.match(pascagoulaVariant.setupDetails.join(" "), /opposite the Defender’s home edge/);
assert.match(pascagoulaVariant.setupDetails.join(" "), /Defender selects a short edge/);
assert.doesNotMatch(pascagoulaVariant.special.join(" "), /agreed table interpretation|working interpretation|internal finding/i);
assert.match(pascagoulaVariant.special.join(" "), /one component per functioning hand actuator per turn/);
assert.match(pascagoulaVariant.special.join(" "), /transfer one carried component/);
assert.match(pascagoulaVariant.special.join(" "), /removed from play and cannot return/);
assert.match(pascagoulaVariant.special.join(" "), /Special tactical victory.*all surviving Ryus.*at least one Ryu.*every opposing unit has fled or been destroyed/i);
assert.match(pascagoulaVariant.special.join(" "), /damage and ammunition expenditure carry over/);
assert.match(pascagoulaVariant.objectiveOverrides["orders-defender"].text, /mobile Ryu/);
assert.equal(pascagoulaVariant.objectiveOverrides["grab-stuff"].name, "Grab the Stuff");
assert.match(pascagoulaVariant.objectiveOverrides["grab-stuff"].text, /extracted from a Ryu/);
assert.equal(pascagoulaVariant.objectiveOverrides["pay-for-that"].name, "You Must Pay for That");
assert.match(pascagoulaVariant.objectiveOverrides["pay-for-that"].text, /qualifying non-asset Attacker unit/);
assert.equal(pascagoulaVariant.commandComplications.rows.length, 6, "Pascagoula exposes all six Command Complications results");
assert.equal(pascagoulaVariant.commandComplications, PASCAGOULA_COMMAND_COMPLICATIONS);
assert.deepEqual(pascagoulaVariant.commandComplications.rows.map(row => row.name), ["No Complication", "Shifting Sand", "Ash Fall", "Volcanic Eruptions", "Crevasse", "Increased Repair Costs"]);
assert.match(pascagoulaVariant.commandComplications.rows[1].text, /40\+ ton units/);
assert.match(pascagoulaVariant.commandComplications.rows[2].text, /direct and pulse energy/i);
assert.deepEqual(
  pascagoulaVariant.commandComplications.rows.slice(1, 3).map(row => [row.name, row.effectScope, row.effectId]),
  [
    ["Shifting Sand", "shared-battlefield", "pascagoula-shifting-sand"],
    ["Ash Fall", "shared-battlefield", "pascagoula-ash-fall"]
  ],
  "Pascagoula battlefield-wide effects have stable identities for shared presentation"
);
assert.equal(pascagoulaVariant.commandComplications.rows.slice(3).every(row => row.effectScope === undefined && row.effectId === undefined), true, "Pascagoula player-specific effects remain independent");
const pascagoulaComplicationRows = Object.fromEntries(PASCAGOULA_COMMAND_COMPLICATIONS.rows.map(row => [row.name, row]));
const jewel = { id: "jewel-thieves", name: "Jewel Thieves" };
const ranger = { id: "ranger-raiders", name: "Ranger Raiders" };
const groupPascagoulaEffects = entries => groupComplicationEffectEntries(entries.map(([name, side]) => ({ row: pascagoulaComplicationRows[name], side })));
for (const sharedName of ["Shifting Sand", "Ash Fall"]) {
  assert.equal(groupPascagoulaEffects([[sharedName, jewel]]).length, 1, sharedName + " displays once when selected only for Jewel Thieves");
  assert.equal(groupPascagoulaEffects([[sharedName, ranger]]).length, 1, sharedName + " displays once when selected only for Ranger Raiders");
  const both = groupPascagoulaEffects([[sharedName, jewel], [sharedName, ranger]]);
  assert.equal(both.length, 1, sharedName + " displays once when both players select it");
  assert.deepEqual(both[0].sides.map(side => side.id), ["jewel-thieves", "ranger-raiders"], sharedName + " preserves both recorded selections");
  assert.equal(groupPascagoulaEffects([[sharedName, jewel]]).length, 1, "removing one duplicate " + sharedName + " selection leaves the shared effect active");
  assert.equal(groupPascagoulaEffects([]).length, 0, "removing both " + sharedName + " selections removes the shared effect");
}
assert.equal(groupPascagoulaEffects([["Shifting Sand", jewel], ["Ash Fall", ranger]]).length, 2, "different shared Pascagoula effects each display once");
for (const playerSpecificName of ["Volcanic Eruptions", "Crevasse", "Increased Repair Costs"]) {
  const both = groupPascagoulaEffects([[playerSpecificName, jewel], [playerSpecificName, ranger]]);
  assert.equal(both.length, 2, playerSpecificName + " remains separate for both players");
  assert.equal(both.every(effect => effect.shared === false), true, playerSpecificName + " is not treated as a shared battlefield effect");
}
assert.equal(groupPascagoulaEffects([["Ash Fall", jewel], ["Ash Fall", ranger], ["Crevasse", jewel]]).length, 2, "mixed shared and player-specific effects preserve one card for each actual effect");
assert.equal(groupPascagoulaEffects([["Shifting Sand", jewel]]).length, 1, "a shared effect remains active alongside an omitted No Complication result");
assert.equal(groupPascagoulaEffects([]).length, 0, "No Complication selections produce no active effect cards");
const daharSandstorm = DAHAR_COMMAND_COMPLICATIONS.rows.find(row => row.name === "Sandstorm");
assert.equal(groupComplicationEffectEntries([{ row: daharSandstorm, side: jewel, sharedEffectId: "dahar::Sandstorm" }, { row: daharSandstorm, side: ranger, sharedEffectId: "dahar::Sandstorm" }]).length, 1, "Dahar shared environmental effects remain deduplicated");
const leBlancSandstorm = LE_BLANC_COMMAND_COMPLICATIONS.rows.find(row => row.name === "Unexpected Sandstorm");
assert.equal(groupComplicationEffectEntries([{ row: leBlancSandstorm, side: jewel, sharedEffectId: "le-blanc::Unexpected Sandstorm" }, { row: leBlancSandstorm, side: ranger, sharedEffectId: "le-blanc::Unexpected Sandstorm" }]).length, 1, "Le Blanc shared sandstorm remains deduplicated");
const lucerneRain = LUCERNE_COMMAND_COMPLICATIONS.rows.find(row => row.name === "Heavy Rainfall");
const lucerneSwarms = LUCERNE_COMMAND_COMPLICATIONS.rows.find(row => row.name === "Voracious Reptile Swarms");
assert.equal(groupComplicationEffectEntries([{ row: lucerneRain, side: jewel, sharedEffectId: "lucerne::Heavy Rainfall" }, { row: lucerneRain, side: ranger, sharedEffectId: "lucerne::Heavy Rainfall" }]).length, 1, "Lucerne shared weather remains deduplicated");
assert.equal(groupComplicationEffectEntries([{ row: lucerneSwarms, side: jewel }, { row: lucerneSwarms, side: ranger }]).length, 2, "Lucerne player-specific reptile swarms remain independently additive");
assert.match(pascagoulaVariant.commandComplications.rows[3].text, /ending the Movement Phase/);
assert.match(pascagoulaVariant.commandComplications.rows[4].text, /delayed one turn/);
assert.match(pascagoulaVariant.commandComplications.rows[5].text, /additional 50 percent/);
assert.match(pascagoulaVariant.commandComplications.note, /each player’s complication separately.*Independent Command Rights \(\+0\)/i);
assert.deepEqual(pascagoulaVariant.sourceRefs, ["Draconis Reach pp. 103–107", "Objective Raid p. 171", "Campaign withdrawal and exit rules p. 31", "Command complications procedure p. 30", "Current Draconis Reach master errata"]);
assert.equal(MISSION_OPFOR_OVERRIDES.pascagoula["jewel-thieves"].scales["1"].primary, "Chimera CHA-2K (3/4) | Jenner JR7-C2 (3/4)");
assert.match(MISSION_OPFOR_OVERRIDES.pascagoula["jewel-thieves"].scales["2"].primary, /Daimyo DMO-5K.*Dragon DRG-5Nr/);
assert.match(MISSION_OPFOR_OVERRIDES.pascagoula["jewel-thieves"].scales["3"].primary, /Nova Cat T/);
assert.deepEqual(PASCAGOULA_MOUNTAINS_MAPSHEETS.map(row => row[1]), ["Foothills #1", "Foothills #2", "Washout #1", "Washout #2", "Mines #1", "Mines #2"]);
assert.equal(PASCAGOULA_PROVISIONAL_RULES.length, 3);
assert.match(PASCAGOULA_PROVISIONAL_RULES.join(" "), /manual.*tactical winner.*all surviving Ryus.*at least one Ryu.*remains unresolved/i);

const jewelDefender = pascagoula.tracks[1].outcomes["jewel-thieves"];
const rangerDefender = pascagoula.tracks[1].outcomes["ranger-raiders"];
assert.deepEqual([jewelDefender.attacker, jewelDefender.defender], ["ranger-raiders", "jewel-thieves"], "Jewel victory makes Jewel Thieves the Track 2 Defender");
assert.deepEqual([rangerDefender.attacker, rangerDefender.defender], ["jewel-thieves", "ranger-raiders"], "Ranger victory makes Ranger Raiders the Track 2 Defender");
for (const outcome of [jewelDefender, rangerDefender]) {
  assert.equal(outcome.variant.commandComplications, PASCAGOULA_COMMAND_COMPLICATIONS);
  assert.deepEqual(outcome.variant.referenceTables[0].rows, PASCAGOULA_MOUNTAINS_MAPSHEETS);
  assert.match(outcome.variant.setupDetails.join(" "), /damage and ammunition expenditure carry over.*No repairs, ammunition reloading, or purchases/i);
  assert.match(outcome.variant.setupDetails.join(" "), /standard Pursuit footprint.*Mountains Terrain table.*at least half.*hills/i);
}
assert.match(jewelDefender.variant.setupDetails.join(" "), /Jewel Thieves \(Defender\).*own Scale-based force.*surviving Ryu.*Ranger Raiders \(Attacker\).*surviving Fifth Ghost/i);
assert.match(jewelDefender.variant.defenderExtractionText, /Defender home edge/);
assert.match(rangerDefender.variant.setupDetails.join(" "), /Ranger Raiders \(Defender\).*surviving force from Track 1.*captured Ryu/i);
assert.match(rangerDefender.variant.setupDetails.join(" "), /Mule DropShip.*5 hexes.*10 inches.*central hex plus all six adjacent.*6-inch AOE.*Gunnery 4 \/ Piloting 5.*within 2 inches/i);
assert.match(rangerDefender.variant.defenderExtractionText, /Mule.*removed from play/);
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
assert.equal(leBlanc.source, "Draconis Reach pp. 86–89");
assert.equal(leBlanc.campaignState, undefined, "Le Blanc has no player-facing campaign record");
assert.ok(leBlanc.contractReference, "Le Blanc exposes a collapsed contract reference");
assert.deepEqual(leBlanc.tracks[1].previousOutcomeOptions.map(option => option.value), ["yes", "no"]);
assert.equal(leBlanc.tracks[1].outcomes.yes.trackId, "strike");
assert.deepEqual([leBlanc.tracks[1].outcomes.yes.attacker, leBlanc.tracks[1].outcomes.yes.defender], ["draconis-combine", "federated-suns"]);
assert.equal(leBlanc.tracks[1].outcomes.no.trackId, "retreat");
assert.deepEqual([leBlanc.tracks[1].outcomes.no.attacker, leBlanc.tracks[1].outcomes.no.defender], ["federated-suns", "draconis-combine"]);
for (const variant of [leBlancVariant, leBlanc.tracks[1].outcomes.yes.variant, leBlanc.tracks[1].outcomes.no.variant]) {
  assert.equal(variant.commandComplications, LE_BLANC_COMMAND_COMPLICATIONS);
  assert.equal(variant.temporaryHires, LE_BLANC_TEMPORARY_HIRES);
  assert.deepEqual(variant.referenceTables[0].rows, LE_BLANC_MAPSHEET_TABLE);
  assert.match(variant.setupDetails.join(" "), /MapPack: City|City mapsheet/i);
  assert.match(variant.special.join(" "), /Successful track completion.*complete at least one objective.*more objective VP.*Equal VP/i);
  assert.match(variant.sourceRefs.join(" "), /pp\. 86–89.*pp\. 26, 29.*p\. 154/i);
}
assert.match(leBlanc.tracks[1].outcomes.yes.variant.special.join(" "), /Turn 10 \(Turn 8 in Alpha Strike\)/);
assert.match(leBlanc.tracks[1].outcomes.no.variant.special.join(" "), /after the end of Turn 10/);
assert.deepEqual(LE_BLANC_MAPSHEET_TABLE.map(row => row[1]), ["Corporate Campus", "Business District", "Family Quarters", "Shopping District"]);
assert.ok(LE_BLANC_MAPSHEET_TABLE.every(row => row[2] === "MapPack: City"));
assert.deepEqual(LE_BLANC_TEMPORARY_HIRES.map(hire => [hire.name, hire.unit, hire.bv, hire.pv]), [
  ["Weeper", "Lament LMT-2R", "1,999", "43"],
  ["Kyodai", "Hitotsume Kozo HKZ-1F", "1,998", "42"]
]);
assert.match(LE_BLANC_TEMPORARY_HIRES[1].abilities, /Melee Specialist/);
assert.match(LE_BLANC_TEMPORARY_HIRES[1].restriction, /Mercenary.*Operation Sundown/);
assert.equal(LE_BLANC_COMMAND_COMPLICATIONS.rows.length, 6);
assert.deepEqual(LE_BLANC_COMMAND_COMPLICATIONS.rows.map(row => row.roll), ["1–3", "4", "5", "6", "7", "8+"]);
assert.match(LE_BLANC_COMMAND_COMPLICATIONS.rows[1].text, /25 SP.*Run\/Flank.*MV −2.*assets lose 1 MP/);
assert.match(LE_BLANC_COMMAND_COMPLICATIONS.rows[2].text, /half ammunition.*after Turn 3.*ENE/);
assert.match(LE_BLANC_COMMAND_COMPLICATIONS.rows[4].text, /Battlefield-wide.*medium range.*long range/);
assert.match(LE_BLANC_PARTISAN_PACKAGES.defender.join(" "), /2 × Scale MG Nest.*CF 10.*CF 3.*1\/1\/0/);
assert.match(LE_BLANC_PARTISAN_PACKAGES.attacker.join(" "), /Motorized Conventional Infantry.*Galleon GAL-100/);
assert.equal(LE_BLANC_PROVISIONAL_RULES.length, 2);
assert.doesNotMatch(LE_BLANC_PROVISIONAL_RULES.join(" "), /LEBLANC-AMB|both Le Blanc tracks/i);
for (const [rights, modifier] of [["independent", 0], ["liaison", 1], ["house", 2], ["integrated", 3]]) {
  assert.equal(resolveLeBlancComplications({ initial: 1 }, rights).modifier, modifier);
}
assert.deepEqual(resolveLeBlancComplications({ initial: 6, secondaryOne: 1, secondaryTwo: 2 }, "house").effects, [4], "modified secondary no-complication and direct effect resolve correctly");
assert.deepEqual(resolveLeBlancComplications({ initial: 5, secondaryOne: 3, secondaryTwo: 3 }, "integrated").effects, [6], "duplicate secondary effects apply once");
assert.deepEqual(resolveLeBlancComplications({ initial: 5, secondaryOne: 4, secondaryTwo: 5 }, "integrated").effects, [7], "secondary Roll Twice is ignored");
assert.equal(resolveLeBlancComplications({ initial: 5, secondaryOne: 5, secondaryTwo: 6 }, "integrated").effects.length, 0, "secondary 8+ results do not recurse");
const newIvaarsen = HOT_SPOTS.find(item => item.id === "new-ivaarsen");
assert.deepEqual(newIvaarsen.tracks.map(track => [track.sequence, track.trackId, track.attacker, track.defender]), [
  [1, "strike", "stephensons", "isf"],
  [2, "meeting-engagement", "stephensons", "isf"],
  [3, "assault", "isf", "stephensons"]
], "New Ivaarsen retains its source track order and roles");
assert.equal(newIvaarsen.campaignState, undefined, "New Ivaarsen does not expose obsolete cross-track campaign bookkeeping");
assert.deepEqual(newIvaarsen.sides.map(side => side.faction), ["Mercenary", "Mercenary"], "both New Ivaarsen participants are Mercenary");
assert.deepEqual(newIvaarsen.tracks.map(track => track.variant.sourceRefs[0]), ["Draconis Reach pp. 99–102", "Draconis Reach pp. 99–102", "Draconis Reach pp. 99–102"]);
assert.equal(NEW_IVAARSEN_LIGHT_URBAN_MAPSHEETS.length, 6, "New Ivaarsen includes all Light Urban Table 7 results");
assert.equal(NEW_IVAARSEN_RYUKEN_SUPPORT.length, 6, "New Ivaarsen includes the complete Ryuken support table");
assert.deepEqual(NEW_IVAARSEN_CHARACTERS.map(character => [character.name, character.unit, character.bv, character.pv]), [["Sir Duncan Atterton", "Sentry SNT-W5", "1,143", "27"], ["Siona Stephenson", "Gunsmith CH-11NG", "1,465", "36"]]);
assert.equal(NEW_IVAARSEN_COMMAND_COMPLICATIONS.rows.length, 12, "both force-specific complication tables are complete");
assert.equal(NEW_IVAARSEN_COMMAND_COMPLICATIONS.separateBySide, true);
assert.deepEqual(NEW_IVAARSEN_COMMAND_COMPLICATIONS.groups.map(group => [group.sideId, group.title]), [["stephensons", "Stephensons · Liaison Command (+1)"], ["isf", "ISF · House Command (+2)"]]);
assert.match(NEW_IVAARSEN_COMMAND_COMPLICATIONS.rows.find(row => row.name === "Falling Damage").text, /random BattleMech.*falling damage.*Add 2/s);
assert.match(NEW_IVAARSEN_COMMAND_COMPLICATIONS.rows.find(row => row.name === "Long Tom Support").text, /two Long Tom Artillery Support Attacks per Scale/);
assert.match(NEW_IVAARSEN_COMMAND_COMPLICATIONS.rows.find(row => row.name === "Mechanized Infantry Support").text, /two BSP Mechanized Infantry Platoons per Scale/);
assert.match(NEW_IVAARSEN_COMMAND_COMPLICATIONS.rows.find(row => row.name === "Striker Support").text, /one BSP Striker Light Tank per Scale/);
assert.match(newIvaarsen.contractReference.summary.join(" "), /100 percent \(13\)/, "the Guerrilla Suppression salvage erratum is incorporated");
for (const sequence of newIvaarsen.tracks) {
  const standard = TRACKS.find(track => track.id === sequence.trackId);
  for (const role of ["attacker", "defender"]) {
    const maximum = standard.objectives.filter(objective => objective.side === role || objective.side === "both").reduce((sum, objective) => sum + objective.vp * (objective.maxCount || 1), 0);
    assert.equal(maximum, 350, "New Ivaarsen " + standard.name + " preserves the 350 VP " + role + " maximum");
  }
}
const app = fs.readFileSync(new URL("../dist/hot-spots/app.mjs", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../dist/hot-spots/index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../dist/hot-spots/styles.css", import.meta.url), "utf8");
const data = fs.readFileSync(new URL("../dist/hot-spots/data.mjs", import.meta.url), "utf8");
const coreHtml = fs.readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const coreCss = fs.readFileSync(new URL("../dist/styles.css", import.meta.url), "utf8");
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
for (const term of ["referenceTrack", "scaleNotesFor", "scaleNotesByScale", "sourceReferenceText", "displayObjective", "renderCommandComplications", "commandComplications", "objectiveOverrides", "Gem Convoy Raid", "Modified Objective Raid", "one component per functioning hand actuator per turn", "removed from play and cannot return", "Special tactical victory"]) {
  assert.ok((app + data).includes(term), term + " Pascagoula variant behavior is present");
}
for (const term of ["pascagoulaExtractionKey", "pascagoulaObjectiveSuppressed", "data-pascagoula-ryu-extracted", "Defender scoring prerequisite", "selectedWinner(1) || \"unresolved\""]) assert.ok(app.includes(term), term + " Pascagoula branch scoring behavior is present");
assert.match(app, /row\.effectScope === "shared-battlefield"/, "shared battlefield complications use explicit scope metadata rather than display text");
assert.match(app, /data-complication-effect=.*effect\.effectId/, "shared complication cards retain the stable effect identity");
assert.match(app, /Shared battlefield condition/, "shared Pascagoula cards are identified as battlefield conditions");
assert.match(app, /displayedCount = groupComplicationEffectEntries\(activeCount\)\.length/, "collapsed complication summaries count grouped effects rather than raw selections");
assert.match(app, /objective\.id !== "orders-defender"/, "Pascagoula extraction suppresses only non-Orders Defender objectives");
assert.match(app, /pascagoulaObjectiveSuppressed\(objective, side\).*return 0/s, "effective Defender VP is zero before extraction");
assert.match(app, /state\.tacticalInputs\[pascagoulaExtractionKey\(\)\] = input\.checked/, "the Ryu extraction checkbox updates scoring immediately");
assert.match(app, /trackOne && selectedSideId === "ranger-raiders"/, "playing Ranger Raiders uses the mandatory Fifth Ghost roster only in Track 1");
for (const term of ["renderNewIvaarsenSetupInputs", "newIvaarsenCharacterAvailability", "renderNewIvaarsenTacticalReference", "stephensons-building-total", "isf-building-total", "Ryuken-ni Support BattleMechs", "BUILDING-DIFFERENCE SUPPORT"]) assert.ok(app.includes(term), term + " New Ivaarsen tactical behavior is present");
for (const term of ["Long Tom Support Attacks: ", "2 * state.scale", "BSP Mechanized Infantry Platoons: ", "BSP Striker Light Tanks: ", "Math.max(0, Number(isf) - Number(steph))"]) assert.ok(app.includes(term), term + " computed New Ivaarsen support behavior is present");
assert.doesNotMatch(JSON.stringify(newIvaarsen), /campaignState|reputation calculator|purchase history/i, "New Ivaarsen remains tactical-reference only");
assert.ok(css.includes("command-complications-table") && css.includes("complication-roll"), "Command Complications table has focused responsive styling");
for (const term of ["data-complication-choice", "data-apply-complications", "data-edit-complications", "active-complications", "Apply Complications", "Reference only"]) {
  assert.ok((app + css).includes(term), "resolved-complication workflow includes " + term);
}
assert.ok(app.includes("selection.applied") && app.includes("selection.draft") && app.includes("selection.appliedOnce"), "draft and applied complication states are distinct");
assert.ok(app.includes('hotSpot.id === "alta-vista" && state.trackId === "retreat"'), "Alta Vista Retreat excludes Command Complications");
assert.ok(app.includes('hotSpot.id === "lucerne" && state.trackId === "bio-gen-raid"'), "Bio-Gen Raid excludes random Command Complications");
assert.ok(app.includes('hotSpot.id === "alta-vista"') && app.includes('side.id === "escobar"'), "Alta Vista complications are Escobar-only");
assert.ok(css.includes("campaign-state-card") && css.includes("campaign-fields"), "cross-track campaign state has focused responsive styling");
for (const term of ["previousOutcomeOptions", "temporaryHires", "renderTemporaryHires", "renderContractReference", "data-opfor-force-type"]) {
  assert.ok((app + data).includes(term), "Le Blanc tactical implementation includes " + term);
}
assert.ok(app.includes('"Mercenary": "mercenary-pirate"'), "Le Blanc mercenary participants resolve to the Mercenary/Pirate OpFor table");
assert.ok(css.includes("hire-reference-card") && css.includes("hire-card-grid") && css.includes("hire-card-divider"), "Temporary Hire cards use the focused nutrition-label-inspired layout");
assert.match(css, /@media[\s\S]*hire-card-grid \{ grid-template-columns: 1fr;/, "Temporary Hire cards stack at the mobile breakpoint");
assert.ok(html.includes("master errata") && html.includes("topic,90893.0.html"), "current Draconis Reach master errata is identified in the source verification panel");
assert.match(html, /RULES SOURCES[\s\S]*First Printing[\s\S]*11 November 2026[\s\S]*26 November 2026[\s\S]*Amber text indicates a provisional rules interpretation pending official clarification/);
assert.ok(css.includes(".provisional-rule") && css.includes(".sr-only"), "provisional rules have visible and assistive semantics");
assert.ok(css.includes("@media") && css.includes("flex-wrap: wrap"), "responsive layout rules remain present");
assert.ok(HOT_SPOTS.length >= 10, "the location selector includes the Draconis Reach mission briefs currently mapped");
const achernar = HOT_SPOTS.find(item => item.id === "achernar");
assert.deepEqual(achernar.sides.map(side => [side.id, side.faction]), [["tybalt", "Mercenary"], ["home-guard", "Mercenary"]], "both Achernar participants are player-controlled mercenary forces");
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
  assert.match(outcome.variant.commandComplications.note, /resolve each force independently.*Tybalt.*no modifier.*Home Guard.*adds 1/i);
  assert.deepEqual(outcome.variant.commandComplications.rows.map(row => row.roll), ["1", "2–3", "4", "5", "6", "7+"]);
  assert.match(outcome.variant.sourceRefs.join(" "), /Draconis Reach pp\. 74–77/);
  assert.match(outcome.variant.sourceRefs.join(" "), /Shared rules pp\. 167–168/);
  assert.doesNotMatch(outcome.variant.sourceRefs.join(" "), /master errata/i);
  assert.match(outcome.variant.special.join(" "), /at least one defector vehicle survives all tracks/i);
  assert.match(outcome.variant.special.join(" "), /five or more Battlefield Support units granted to Tybalt/i);
  assert.doesNotMatch(outcome.variant.special.join(" "), /project ruling|pending official clarification/i);
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
assert.equal(achernar.campaignState, undefined, "Achernar no longer exposes a historical campaign record");
assert.ok(achernar.contractReference, "Achernar contract conditions remain available as reference");
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
const incompleteAchernarVictory = calculateAchernarVictory({}, { scale: 2, strikePlayed: true });
assert.deepEqual([incompleteAchernarVictory.tybalt, incompleteAchernarVictory.homeGuard, incompleteAchernarVictory.outcome], ["pending", "pending", "pending"], "incomplete Achernar state is not treated as defeat or zero survivors");
const tybaltSurvivorVictory = calculateAchernarVictory({ survivorsAfterTrack3: 4, survivorsAfterTrack4: 2, finalSurvivors: 1, qualifyingSupportDestroyed: 4 }, { scale: 2, strikePlayed: true });
assert.deepEqual([tybaltSurvivorVictory.tybalt, tybaltSurvivorVictory.homeGuard, tybaltSurvivorVictory.outcome], ["victory", "not-qualified", "tybalt-contract-successful"], "one final defector survivor with only four qualifying losses gives Tybalt-only victory");
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
  outcome: "tybalt-contract-successful"
}, "Tybalt can use the recorded Strike-and-Retreat alternative when Strike was played");
const homeGuardOnlyVictory = calculateAchernarVictory({ survivorsAfterTrack3: 2, survivorsAfterTrack4: 0, finalSurvivors: 0, strikeWinner: "home-guard", retreatWinner: "tybalt", qualifyingSupportDestroyed: 4 }, { scale: 1, strikePlayed: true });
assert.deepEqual([homeGuardOnlyVictory.tybalt, homeGuardOnlyVictory.homeGuard, homeGuardOnlyVictory.outcome], ["not-qualified", "victory", "home-guard-contract-successful"], "Home Guard alone succeeds when Tybalt fails the played Strike-and-Retreat alternative");
const dualAchernarVictory = calculateAchernarVictory({ survivorsAfterTrack3: 2, survivorsAfterTrack4: 1, finalSurvivors: 1, qualifyingSupportDestroyed: 5 }, { scale: 1, strikePlayed: true });
assert.deepEqual([dualAchernarVictory.tybalt, dualAchernarVictory.homeGuard, dualAchernarVictory.outcome], ["victory", "victory", "both-contracts-successful"], "five qualifying losses alongside Tybalt success produces simultaneous contract success");
const nonStrikeAchernarVictory = calculateAchernarVictory({ survivorsAfterTrack3: 2, survivorsAfterTrack4: 0, finalSurvivors: 0, retreatWinner: "tybalt" }, { scale: 1, strikePlayed: false });
assert.deepEqual([nonStrikeAchernarVictory.tybalt, nonStrikeAchernarVictory.homeGuard, nonStrikeAchernarVictory.outcome], ["not-qualified", "victory", "home-guard-contract-successful"], "a non-Strike Track 3 branch with no surviving defectors makes Tybalt fail and Home Guard succeed");
assert.equal(calculateAchernarVictory({ survivorsAfterTrack3: 2, survivorsAfterTrack4: 1, finalSurvivors: 1, qualifyingSupportDestroyed: 4 }, { scale: 1, strikePlayed: false }).supportVictory, false, "four qualifying support losses do not satisfy Home Guard’s independent condition");
assert.equal(calculateAchernarVictory({ survivorsAfterTrack3: 2, survivorsAfterTrack4: 1, finalSurvivors: 1, qualifyingSupportDestroyed: 5 }, { scale: 1, strikePlayed: false }).supportVictory, true, "five qualifying support losses satisfy Home Guard’s independent condition");
assert.equal(calculateAchernarVictory({ survivorsAfterTrack3: 2, survivorsAfterTrack4: 1, finalSurvivors: 1, qualifyingSupportDestroyed: 7 }, { scale: 1, strikePlayed: false }).supportVictory, true, "more than five qualifying support losses satisfy Home Guard’s independent condition");
const incompleteWithSupportVictory = calculateAchernarVictory({ qualifyingSupportDestroyed: 5 }, { scale: 1, strikePlayed: true });
assert.deepEqual([incompleteWithSupportVictory.tybalt, incompleteWithSupportVictory.homeGuard, incompleteWithSupportVictory.outcome], ["pending", "victory", "pending"], "an independently satisfied Home Guard condition does not turn incomplete Tybalt state into a defeat");
for (const term of ["renderAchernarCampaignState", "survivorsAfterTrack3", "survivorsAfterTrack4", "finalSurvivors", "qualifyingSupportDestroyed", "strikeWinner", "retreatWinner", "data-achernar-field", "Both contracts successful", "campaign-ruling", "Defector J. Edgar vehicles do not count"]) {
  assert.ok(app.includes(term), term + " Achernar campaign behavior is wired into the browser");
}
assert.match(html, /Source-specific cross-track records are included only where a tactical force or contract-victory rule requires them/);
const protection = HOT_SPOTS.find(item => item.id === "protection");
assert.equal(protection.tracks[2].outcomes["platinum-sands|kanagawa-group"].roleChoice, true, "Protection mixed results expose the source roll-off choice");
assert.equal(protection.terrain, "Wetlands", "Protection uses its printed Wetlands primary terrain");
assert.deepEqual(protection.sides.map(side => side.faction), ["Mercenary", "Mercenary"], "both Protection participating forces are Mercenary");
assert.deepEqual(protection.sides.map(side => side.contract), ["138910A", "138910B"]);
assert.match(protection.contractReference.summary.join(" "), /Platinum Sands Supplemental Security Agreement.*Protection Garrison/);
assert.match(protection.contractReference.summary.join(" "), /Base Pay 110 percent.*Base Pay 100 percent/);
assert.match(protection.contractReference.progression.join(" "), /Month 1 has no track.*Month 6 has no track/);
assert.match(protection.contractReference.progression.join(" "), /Sea Fox Purchase Options Table/);
assert.match(protection.contractReference.victory.join(" "), /most track victories.*tie ends in a draw/i);
assert.equal(PROTECTION_PROVISIONAL_RULES.length, 4);
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
assert.match(app, /Remaining Deny points are awarded at the end of ['"] \+ denyDeadline/, "shared Recon Deny distinguishes projected scoring from the applicable final Turn 8 deadline");
assert.match(protectionTrack1.setupDetails.join(" "), /second month.*Platinum Sands player as Attacker/);
assert.deepEqual(PROTECTION_STANDARD_MAPSHEETS.rows.map(row => row[1]), ["Hilltops #1 (CI)", "Desert #3 (AGOAC)", "Rolling Hills #1 (MP: Grasslands)", "Rolling Hills #2 (MP: Grasslands, CI)", "Rolling Hills #3 (MP: Grasslands)", "Sand Drifts #1 (MP: Deserts)"]);
assert.deepEqual(PROTECTION_ATLANTIS_MAPSHEETS.rows.map(row => row[1]), ["Corporate Campus (MP: City)", "Family Quarters (MP: City)", "HPG Heliport (MP: City)", "Business District (MP: City)", "Shopping District (MP: City)", "HPG Offices (MP: City)"]);
assert.match(protectionTrack1.battlefieldRules.map(rule => rule.text).join(" "), /Level 0 ground as Level 0 water/);
assert.match(protectionTrack1.battlefieldRules.map(rule => rule.text).join(" "), /six Depth 1 water tokens/);
assert.match(protectionTrack1.battlefieldRules.map(rule => rule.text).join(" "), /Do not apply Protection’s BattleTech-only Level 0 flooding/);
assert.deepEqual(protectionTrack1.selectionControls[0].options.map(option => option.value), ["standard", "atlantis"]);
assert.equal(protectionTrack1.selectionControls[1].visibleWhen.value, "atlantis");
assert.deepEqual(protectionTrack1.referenceTables, [PROTECTION_STANDARD_MAPSHEETS, PROTECTION_ATLANTIS_MAPSHEETS]);
assert.equal(PROTECTION_TEMPORARY_HIRES[0].name, "Surf Rock");
assert.deepEqual([PROTECTION_TEMPORARY_HIRES[0].unit, PROTECTION_TEMPORARY_HIRES[0].bv, PROTECTION_TEMPORARY_HIRES[0].pv], ["Thunderbolt TDR-12R", "1,975", "41"]);
assert.match(PROTECTION_TEMPORARY_HIRES[0].restriction, /50 Support Points per participating track.*50 Support Points for each unit/);
assert.doesNotMatch(JSON.stringify(PROTECTION_TEMPORARY_HIRES), /Warchest Points/);
assert.equal(protectionTrack1.commandComplications.rows.length, 6, "Protection exposes all command complication results");
assert.deepEqual(protectionTrack1.commandComplications.rows.map(row => row.roll), ["1–3", "4", "5", "6", "7", "8+"]);
assert.deepEqual(protectionTrack1.commandComplications.rows.map(row => row.name), ["No Complication", "R&R", "Less Support", "Local Partisans", "Monsoon", "Roll Twice"]);
assert.match(protectionTrack1.commandComplications.rows[2].text, /10 BSP/);
assert.match(protectionTrack1.commandComplications.rows[3].text, /two additional Vedette Medium Tank/);
assert.match(protectionTrack1.commandComplications.rows[4].text, /reduce all hex levels by 1/);
assert.match(protectionTrack1.commandComplications.rows[5].text, /Roll twice and apply both effects/);
assert.equal(protectionTrack1.commandComplications.rows[5].name, "Roll Twice");
assert.equal(PROTECTION_COMMAND_COMPLICATIONS.rows[3].supportOnly, true);
assert.deepEqual([PROTECTION_COMMAND_COMPLICATIONS.rows[4].effectScope, PROTECTION_COMMAND_COMPLICATIONS.rows[4].effectId], ["shared-battlefield", "protection-monsoon"]);
assert.match(protectionTrack1.commandComplications.note, /House Command \(\+2\).*Liaison Command \(\+1\)/);
assert.deepEqual(protectionPartisanSupport("standard", true, false), { quantity: 2, naval: true });
assert.deepEqual(protectionPartisanSupport("standard", true, true), { quantity: 2, naval: true });
assert.deepEqual(protectionPartisanSupport("atlantis", true, false), { quantity: 2, naval: false });
assert.deepEqual(protectionPartisanSupport("atlantis", true, true), { quantity: 2, naval: true });
assert.equal(protectionPartisanSupport("atlantis", false, true), null);
const protectionTrack2 = protection.tracks[1].outcomes["platinum-sands"].variant;
assert.match(protectionTrack2.setupDetails.join(" "), /winner of Track 1 is the Attacker/);
assert.equal(protection.tracks[1].outcomes["kanagawa-group"].attacker, "kanagawa-group");
assert.equal(protection.tracks[2].outcomes["platinum-sands|platinum-sands"].trackId, "assault");
assert.equal(protection.tracks[2].outcomes["kanagawa-group|kanagawa-group"].trackId, "pushback");
const protectionTrack3Mixed = protection.tracks[2].outcomes["platinum-sands|kanagawa-group"];
const protectionTrack3MixedReverse = protection.tracks[2].outcomes["kanagawa-group|platinum-sands"];
assert.match(protectionTrack3Mixed.variant.setupDetails.join(" "), /2D6 roll-off/);
assert.match(protectionTrack3Mixed.variant.setupDetails.join(" "), /higher result may choose Attacker or Defender/);
assert.equal(protectionTrack3Mixed.variant.roleChoiceLabel, "Choose the side assigned to the Attacker role after the 2D6 roll-off");
assert.equal(protectionTrack3Mixed.variant.roleChoicePendingInstruction, "Select the Attacker to display objectives.");
for (const mixedOutcome of [protectionTrack3Mixed, protectionTrack3MixedReverse]) {
  assert.equal(mixedOutcome.trackId, "flank", "both mixed-winner sequences identify Flank");
  assert.equal(mixedOutcome.roleChoiceRequired, true, "mixed-winner Flank requires an explicit Attacker choice");
  assert.equal(mixedOutcome.roleChoicePlainLabels, true, "Protection role options use the two player-facing force names");
}
assert.match(app, /roleChoiceRequired && !selectedInitiator[\s\S]*rolePending: true/, "unanswered required role choices remain pending");
assert.match(app, /<option value="">Select Attacker…<\/option>/, "Protection Flank exposes an unanswered Attacker option");
assert.match(app, /resolved\?\.rolePending \? pendingRoleRow/, "pending role choices suppress objective rows");
assert.match(app, /displayedObjectives = resolved\?\.rolePending \? \[\] : objectives/, "pending role choices do not expose Flank scoring controls");
assert.match(app, /step\.requires\.map\(selectedWinner\)\.join\("\|"\)/, "conditional role choices are isolated by the resolved winner branch");
assert.doesNotMatch(app, /state\.roleSelections\[roleKey\(step\.sequence\)\] \|\| currentHotSpot\(\)\.sides\[0\]\.id/, "required role choice does not silently default to the first force");
const protectionTrack4 = protection.tracks[3].variant;
assert.deepEqual([protection.tracks[3].attacker, protection.tracks[3].defender], ["platinum-sands", "kanagawa-group"]);
assert.match(protectionTrack4.setupDetails.join(" "), /Mobile HQ/);
assert.match(protectionTrack4.special.join(" "), /successful capture causes no damage/);
assert.match(protectionTrack4.special.join(" "), /maximum combat bonus pay/);
assert.deepEqual(evaluateProtectionPursuit({ captureHeld: true, attackerVp: 0, defenderVp: 0 }), { attackerVp: 450, defenderVp: 0, attackerSuccessful: true, defenderSuccessful: false });
assert.deepEqual(evaluateProtectionPursuit({ captureHeld: true, attackerVp: 150, defenderVp: 250 }), { attackerVp: 450, defenderVp: 250, attackerSuccessful: true, defenderSuccessful: false });
assert.deepEqual(evaluateProtectionPursuit({ captureHeld: true, attackerVp: 450, defenderVp: 450 }), { attackerVp: 450, defenderVp: 450, attackerSuccessful: true, defenderSuccessful: false });
assert.deepEqual(evaluateProtectionPursuit({ captureHeld: false, attackerVp: 150, defenderVp: 100, attackerObjectives: 2, defenderObjectives: 1 }), { attackerVp: 150, defenderVp: 100, attackerSuccessful: true, defenderSuccessful: false });
assert.deepEqual(evaluateProtectionPursuit({ captureHeld: false, attackerVp: 450, defenderVp: 450, attackerObjectives: 3, defenderObjectives: 3 }), { attackerVp: 450, defenderVp: 450, attackerSuccessful: false, defenderSuccessful: false });
assert.match(protectionTrack4.sourceRefs.join(" "), /Draconis Reach pp\. 108–112.*General rules pp\. 29–31/);
for (const term of ["protectionCaptureOverride", "data-protection-mobile-hq-captured", "Automatically credited by final-turn Mobile HQ capture", "Platinum Sands successfully completes the track", "protectionPartisanSupport", "Same-player Local Partisans \+ Monsoon interaction", '"protection"']) {
  assert.ok(app.includes(term), term + " Protection interaction is wired into the browser");
}
assert.ok(app.includes('interactiveComplicationContracts = new Set(["achernar", "alta-vista", "dahar-iv", "le-blanc", "lucerne", "melcher", "new-ivaarsen", "pascagoula", "protection", "sun-prairie", "tigress"])'));
assert.ok(app.includes('simplifiedContracts = new Set(["achernar", "alta-vista", "dahar-iv", "le-blanc", "lucerne", "melcher", "new-ivaarsen", "pascagoula", "protection", "sun-prairie", "tigress"])'));
assert.doesNotMatch(TRACKS.find(track => track.id === "recon").special.join(" "), /Level 0 ground as Level 0 water/);
assert.doesNotMatch(TRACKS.find(track => track.id === "pursuit").special.join(" "), /Mobile HQ/);
const sunPrairie = HOT_SPOTS.find(item => item.id === "sun-prairie");
assert.equal(sunPrairie.source, "Draconis Reach pp. 113–115");
assert.match(sunPrairie.note, /Select the current tactical track directly/);
assert.equal(sunPrairie.tracks.length, 5);
assert.deepEqual(sunPrairie.tracks.map(track => [track.label, track.trackId, track.attacker, track.defender]), [["Breakthrough", "breakthrough", "raid", "garrison"], ["Objective Raid", "objective-raid", "raid", "garrison"], ["Strike", "strike", "raid", "garrison"], ["Recon", "recon", "garrison", "raid"], ["Meeting Engagement", "meeting-engagement", "garrison", "raid"]], "Sun Prairie exposes exactly five direct playable tracks with fixed roles");
assert.equal(sunPrairie.tracks.every(track => !track.results), true, "Sun Prairie has no artificial numbered slots or nested result selectors");
assert.deepEqual(sunPrairie.sides.map(side => [side.id, side.faction, side.employerAlignment]), [["garrison", "Mercenary", "Federated Suns"], ["raid", "Mercenary", "Draconis Combine"]], "employer alignment remains separate from both Mercenary force classifications");
assert.match(sunPrairie.contractReference.summary.join(" "), /105070A.*Baron Elias Navarro.*three months.*100 percent \(7\).*Battle Support \/ 30 percent \(11\).*Liaison Command \(8\)/);
assert.match(sunPrairie.contractReference.summary.join(" "), /105070B.*Tai-sa Roland Samuels.*Independent Command \(11\).*combat pay is doubled/i);
assert.match(sunPrairie.contractReference.progression.join(" "), /two independent 1D6.*duplicate produces no track.*result of 6 produces no track/i);
assert.deepEqual(sunPrairie.contractReference.tables[0].rows.map(row => row[1]), ["Breakthrough", "Objective Raid", "Strike", "Recon", "Meeting Engagement", "No Track"]);
assert.match(sunPrairie.contractReference.victory.join(" "), /two played tracks in a row.*final totals are tied.*both are victorious.*neither is victorious/i);
assert.match(sunPrairie.contractReference.purchaseOptions.join(" "), /7\+.*11\+.*Federated Suns Purchase Options Table.*two vehicles and two battle armor/i);
assert.match(sunPrairie.contractReference.provisional.join(" "), /same or different months.*Duplicate and No Track rolls do not interrupt.*without successful completion interrupts/i);
for (const sunPrairieTrack of sunPrairie.tracks) {
  assert.equal(sunPrairieTrack.variant.commandComplications, SUN_PRAIRIE_COMMAND_COMPLICATIONS);
  assert.equal(sunPrairieTrack.variant.referenceTables[0], SUN_PRAIRIE_MAPSHEET_TABLE);
  assert.equal(sunPrairieTrack.variant.temporaryHires, SUN_PRAIRIE_TEMPORARY_HIRES);
  assert.equal(sunPrairieTrack.variant.tacticalSupport, SUN_PRAIRIE_TACTICAL_SUPPORT);
  assert.match(sunPrairieTrack.variant.sourceRefs.join(" "), new RegExp(TRACKS.find(track => track.id === sunPrairieTrack.trackId).name + " (?:p\\.|pp\\.)"));
  assert.match(sunPrairieTrack.variant.setupDetails.join(" "), /Scale 1 normally uses one mapsheet.*Scales 2–3 normally use two.*specific selected-track battlefield footprint takes precedence/i);
  assert.match(sunPrairieTrack.variant.setupDetails.join(" "), /Alpha Strike terrain.*48 inches across.*36 inches at Scale 1.*48 inches at Scales 2–3.*allowance to four/i);
}
assert.deepEqual(SUN_PRAIRIE_MAPSHEET_TABLE.rows.map(row => row[1]), ["Open Terrain #2", "Open Terrain #3", "Rolling Hills #3", "Rolling Hills #3", "Lakes", "Forward Base"]);
assert.deepEqual(SUN_PRAIRIE_COMMAND_COMPLICATIONS.rows.map(row => row.name), ["Lostech Cache", "No Complication", "Battlefield Confusion", "Rubble", "Fire and Smoke", "Roll Twice"]);
assert.match(SUN_PRAIRIE_COMMAND_COMPLICATIONS.rows[0].text, /successfully completes.*additional 100 SP/i);
assert.match(SUN_PRAIRIE_COMMAND_COMPLICATIONS.rows[2].text, /−2 Initiative.*first two turns/i);
assert.deepEqual([SUN_PRAIRIE_COMMAND_COMPLICATIONS.rows[3].effectScope, SUN_PRAIRIE_COMMAND_COMPLICATIONS.rows[3].supportOnly], ["opposing-placement", true]);
assert.deepEqual([SUN_PRAIRIE_COMMAND_COMPLICATIONS.rows[4].effectScope, SUN_PRAIRIE_COMMAND_COMPLICATIONS.rows[4].effectId], ["shared-battlefield", "sun-prairie-fire-smoke"]);
assert.match(SUN_PRAIRIE_COMMAND_COMPLICATIONS.rows[4].text, /light smoke.*5 heat.*2 heat.*1 heat.*\+1 target number/is);
assert.match(SUN_PRAIRIE_COMMAND_COMPLICATIONS.provisional.join(" "), /exactly two secondary.*ignore secondary Roll Twice.*without rerolling or recursing/i);
assert.deepEqual(SUN_PRAIRIE_TEMPORARY_HIRES.map(hire => [hire.name, hire.unit, hire.bv, hire.pv, hire.gunnery, hire.piloting, hire.alphaStrikeSkill, hire.edge]), [["Phillips Watson", "Dragon Fire DGR-6FC", "1,858", "43", "3", "3", "3", "4"]]);
assert.match(SUN_PRAIRIE_TEMPORARY_HIRES[0].restriction, /Raid only.*100 SP.*50 SP.*more than one location.*more than 1 structure damage/i);
assert.match(SUN_PRAIRIE_TACTICAL_SUPPORT[0].details.join(" "), /four Veteran motorized platoons.*496 BV \/ 48 PV.*four Veteran motorized conventional Infantry.*50 SP per participating track/i);
assert.doesNotMatch(JSON.stringify(sunPrairie), /Philips Wilson|Steve requests/);
for (const term of ["places rubble", "places fire", "Shared fire and smoke rules are displayed once above", "renderTacticalSupport(referenceTrack.tacticalSupport)"]) assert.ok(app.includes(term), term + " is wired into Sun Prairie gameplay reference");
assert.match(app, /profile\.hotSpot\.id === "sun-prairie"[\s\S]*firePlacements[\s\S]*displayedCount \+= firePlacements/, "Sun Prairie collapsed complication summaries count the shared fire condition and independent placement entitlements");
const tigress = HOT_SPOTS.find(item => item.id === "tigress");
assert.equal(tigress.source, "Draconis Reach pp. 116–119");
assert.deepEqual(tigress.sides.map(side => [side.id, side.faction, side.contract]), [["legion-trainers", "Mercenary", "312332A"], ["roughriders", "Mercenary", "312332B"]]);
assert.match(tigress.contractReference.summary.join(" "), /Straight Support \/ 80 percent.*House Command \(7\).*Battle Support \/ 10 percent.*Liaison Command \(8\)/i);
assert.match(tigress.contractReference.progression.join(" "), /50 percent.*Blade BLD-XR.*Rook NH-2.*Rook NH-3X.*lost when.*leaves the system/i);
assert.match(tigress.contractReference.victory.join(" "), /independently.*Either or both.*at least one/i);
assert.equal(tigress.contractReference.tables[0].rows.length, 6);
assert.match(tigress.contractReference.purchaseOptions.join(" "), /Sea Fox Random Purchase Table.*one roll per month.*two vehicles and two battle armor/i);
assert.deepEqual(tigress.contractReference.provisional, TIGRESS_PROVISIONAL_RULES);
assert.equal(TIGRESS_PROVISIONAL_RULES.length, 8, "the final Tigress decision register contains all eight approved interpretations");
assert.equal(tigress.tracks.length, 2);
assert.deepEqual(Object.keys(tigress.tracks[0].phases), ["training", "recon"]);
assert.equal(tigress.tracks[0].phases.training.trackId, "meeting-engagement");
assert.equal(tigress.tracks[0].phases.recon.trackId, "recon");
assert.deepEqual([tigress.tracks[0].phases.recon.attacker, tigress.tracks[0].phases.recon.defender], ["roughriders", "legion-trainers"]);
assert.equal(tigress.tracks[0].phases.training.roleChoiceRequired, true);
assert.equal(tigress.tracks[1].roleChoiceRequired, true);
const tigressTraining = tigress.tracks[0].phases.training.variant;
const tigressRecon = tigress.tracks[0].phases.recon.variant;
assert.match(tigressTraining.setup.join(" "), /trainees participate from the start.*actual Roughriders.*not yet entered/i);
assert.match(tigressTraining.setup.join(" "), /equal in BV\/PV.*Energy weapons.*paint rounds/i);
assert.match(tigressTraining.setupDetails.join(" "), /combined BV\/PV.*1D6 − 2.*minimum of two turns/i);
assert.match(tigressTraining.setupDetails.join(" "), /trainees’ original home edge.*remain in position.*no redeployment/i);
assert.equal(tigressTraining.tacticalSupport, TIGRESS_TRAINEE_SUPPORT);
assert.doesNotMatch(tigressTraining.special.join(" "), /Track End: after the end of any turn when at least one side has no units in play/i);
assert.match(tigressTraining.special.join(" "), /scheduled arrival.*normal ending conditions do not end overall Track 1.*not.*separate contract track/i);
assert.match(tigressTraining.special.join(" "), /Training-phase salvage remains unavailable/i);
assert.deepEqual(Object.keys(TIGRESS_TRAINEE_SUPPORT[0].detailsByScale), ["1", "2", "3"]);
assert.match(Object.values(TIGRESS_TRAINEE_SUPPORT[0].detailsByScale).flat().join(" "), /Vindicator VND-7L.*Cicada CDA-4A.*Gunnery 4 \/ Piloting 5.*Alpha Strike Skill 4/i);
assert.match(app, /entry\.detailsByScale\?\.\[String\(state\.scale\)\]/, "Tigress tactical support displays only the roster for the selected Scale");
assert.match(tigressRecon.special.join(" "), /erase simulated damage.*transfer trainee control.*following turn/i);
assert.match(tigressRecon.special.join(" "), /ammunition-based weapons are unusable.*does not explode.*Gauss.*newly arrived Roughriders/i);
assert.match(tigressRecon.special.join(" "), /new Recon turn counter at Recon Turn 1.*Training turns do not consume.*Recon Turn 8/i);
assert.match(tigressRecon.special.join(" "), /retain.*training-phase VP.*Trainee-earned VP.*does not carry forward/i);
assert.match(tigressRecon.special.join(" "), /completed Legion Trainers training objective.*Track 1 objective-completion prerequisite.*Roughriders must complete a Recon objective.*tie means neither/i);
assert.match(tigressRecon.objectiveOverrides["orders-defender"].text, /first two Recon turns/i);
assert.match(tigressRecon.objectiveOverrides["observe-report"].text, /after four Recon turns/i);
assert.match(tigressRecon.objectiveOverrides.deny.text, /Recon Turn 8.*before Recon Turn 8/i);
assert.equal(tigressTraining.referenceTables[0], TIGRESS_WOODED_MAPSHEETS);
assert.equal(tigressRecon.referenceTables[0], TIGRESS_WOODED_MAPSHEETS);
assert.deepEqual(TIGRESS_WOODED_MAPSHEETS.rows.map(row => row[1]), ["Woodland", "Scattered Woods", "Grassland #3", "Rolling Hills #2", "Desert #3", "Rolling Hills #1"]);
assert.deepEqual(TIGRESS_COMMAND_COMPLICATIONS.rows.map(row => row.roll), ["1–2", "3", "4", "5+"]);
assert.deepEqual(TIGRESS_COMMAND_COMPLICATIONS.rows.slice(1, 3).map(row => row.fixedRecipientId), ["legion-trainers", "roughriders"]);
assert.deepEqual([TIGRESS_COMMAND_COMPLICATIONS.rows[3].effectScope, TIGRESS_COMMAND_COMPLICATIONS.rows[3].effectId], ["shared-battlefield", "tigress-fatigue"]);
assert.match(TIGRESS_COMMAND_COMPLICATIONS.note, /House Command \(\+2\).*Liaison Command \(\+1\)/i);
assert.match(TIGRESS_COMMAND_COMPLICATIONS.provisional.join(" "), /printed 5–6.*5\+.*modified results above 6/i);
assert.doesNotMatch(TIGRESS_COMMAND_COMPLICATIONS.note + " " + TIGRESS_COMMAND_COMPLICATIONS.provisional.join(" "), /outside the browser|cap|reroll/i);
assert.equal(TIGRESS_COMMAND_COMPLICATIONS.rows.some(row => /roll twice/i.test(row.name)), false, "Tigress does not invent a Roll Twice result");
assert.match(TIGRESS_COMMAND_COMPLICATIONS.rows[1].text, /4\/8\/12 BSP.*Defensive Aerospace Support or Artillery Support/i);
assert.match(TIGRESS_COMMAND_COMPLICATIONS.rows[2].text, /4\/8\/12 BSP.*Offensive Aerospace Support/i);
assert.match(TIGRESS_COMMAND_COMPLICATIONS.rows[3].text, /To-Hit roll of 12.*near miss.*no damage/i);
assert.deepEqual(TIGRESS_TEMPORARY_HIRES.map(hire => [hire.name, hire.unit, hire.bv, hire.pv, hire.gunnery, hire.piloting, hire.alphaStrikeSkill, hire.edge, hire.abilities]), [["Joachim Vierziger", "Avatar AV1-OG", "1,775", "34", "1", "3", "2", "4", "Marksman"]]);
assert.match(TIGRESS_TEMPORARY_HIRES[0].restriction, /300 Support Points.*below 2,000 BV or 80 PV per Scale/i);
const tigressTrack2 = tigress.tracks[1].variant;
assert.equal(tigressTrack2.displayName, "Tigress Meeting Engagement");
assert.match(tigressTrack2.setupDetails.join(" "), /remaining Legion Trainers and surviving trainees/);
assert.equal(tigressTrack2.referenceTables[0], TIGRESS_HILLS_MAPSHEETS);
assert.deepEqual(TIGRESS_HILLS_MAPSHEETS.rows.map(row => row[1]), ["Hilltops #1", "Foothills #2", "Rolling Hills #1", "Rolling Hills #2", "Rolling Hills #3", "Rolling Hills #4"]);
assert.equal(tigressTrack2.tacticalSupport, TIGRESS_SUTERA_SUPPORT);
assert.match(TIGRESS_SUTERA_SUPPORT[0].details.join(" "), /Caesar CES-5D.*Gunnery 3 \/ Piloting 3.*Alpha Strike Skill 3.*Five Edge.*Bulwark.*Protector.*handicap 41/i);
assert.equal(tigressTrack2.tacticalSupport.some(entry => /Philomena Kang/.test(entry.title)), false);
assert.match(tigressTrack2.special.join(" "), /live ammunition/);
assert.match(tigressTrack2.special.join(" "), /repair armor damage and replenish ammunition/);
assert.match(tigressTrack2.special.join(" "), /internal structure damage and critical hits remain/);
assert.match(tigressTrack2.special.join(" "), /No Track 1 VP carries into Track 2/i);
assert.match(app, /tigressPhase: "training"/);
assert.match(app, /step\.phases\[state\.tigressPhase\]/);
assert.match(app, /function tigressRetainedTrainingVp\(\)/);
assert.match(app, /function tigressCompletedTrainingObjectiveCount\(\)/);
assert.match(app, /retainedTrainingCount.*state\.tigressPhase === "recon".*side === "defender"/s);
assert.match(app, /state\.tigressPhase === "recon" && side === "defender"/);
assert.match(app, /data-tigress-phase/);
assert.match(app, /Actual Roughriders arrived — Recon Turn 1/);
assert.match(app, /completed Legion Trainers training objective satisfies their Track 1 objective-completion prerequisite/i);
assert.match(app, /denyDeadline.*tigress.*Recon Turn 8.*Turn 8/s);
const tigressMeetingTrack = TRACKS.find(track => track.id === "meeting-engagement");
const tigressReconTrack = TRACKS.find(track => track.id === "recon");
assert.equal(tigressMeetingTrack.objectives.reduce((sum, objective) => sum + objective.vp, 0), 350, "maximum Tigress training VP per side remains 350");
assert.equal(tigressReconTrack.objectives.filter(objective => objective.side === "attacker").reduce((sum, objective) => sum + objective.vp, 0), 350, "maximum Roughriders Recon VP remains 350");
assert.equal(50 + Math.max(...tigressReconTrack.objectives.find(objective => objective.id === "deny").vpOptions), 350, "maximum Recon Defender VP remains 350");
assert.equal(350 + 350, 700, "maximum combined Legion Trainers Track 1 VP remains 700");
assert.match(app, /hybrid-track/);
assert.match(app, /meeting-engagement::", base \+ "recon::"/);
assert.match(app, /row\.fixedRecipientId/);
assert.match(MISSION_OPFOR_OVERRIDES.tigress["legion-trainers"].scales["3"].primary, /Vindicator VND-7L.*×2 Cicada CDA-4A/i);
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
  sunPrairie.tracks.find(track => track.trackId === "recon").trackId,
  tigress.tracks[0].phases.recon.trackId,
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
assert.ok(app.includes('hotSpot.trackSelectorLabel || "Track"'), "the shared selector uses player-facing Track terminology while preserving location-specific labels");
assert.ok(app.includes("if (hotSpot.fixedScale) state.scale = hotSpot.fixedScale"), "Mallory’s World applies its fixed Scale before each render");
assert.match(app, /const unavailable = Boolean\(fixedScale\).*button\.disabled = unavailable/s, "fixed-Scale Hot Spots disable only unavailable Scale choices");
assert.match(css, /scale-button\.unavailable::before.*background: #b3131b/s, "unavailable Scale choices receive the large red X treatment");
assert.ok(html.includes('id="scale-restriction-note"'), "the fixed-Scale explanation has a dedicated display target");
assert.ok(app.includes("outcome.reverseRoles") && app.includes("attacker: opposingSide, defender: selectedInitiator"), "City Pursuit role reversal assigns objective and VP columns to the correct tactical sides");
assert.ok(app.includes("variant?.nonPlayable") && app.includes("This strategic hex cannot be entered and has no tactical objectives"), "the restricted research facility renders without a tactical tracker");
for (const standardTrack of TRACKS) {
  assert.doesNotMatch([...standardTrack.setup, ...(standardTrack.setupDetails || []), ...standardTrack.special].join(" "), /Loneliness Island|Strategic hex type|RSIS\/FABL/, standardTrack.name + " remains free of Mallory-specific rules");
}
const altaVista = HOT_SPOTS.find(item => item.id === "alta-vista");
assert.ok(altaVista, "Alta Vista is available as a Hot Spot");
assert.equal(altaVista.source, "Draconis Reach pp. 78–81");
assert.deepEqual(altaVista.sides.map(side => [side.id, side.faction]), [["escobar", "Mercenary"], ["ravens", "Mercenary"]]);
assert.equal(FACTION_COLORS["Raven Alliance"], FACTION_COLORS["Clan Sea Fox"], "Raven Alliance has an explicit UI palette without reclassifying the participating force");
assert.deepEqual(altaVista.tracks.map(track => [track.sequence, track.trackId, track.attacker, track.defender]), [
  [1, "meeting-engagement", "ravens", "escobar"],
  [2, "meeting-engagement", "ravens", "escobar"],
  [3, "meeting-engagement", "ravens", "escobar"],
  [4, "retreat", "ravens", "escobar"]
]);
for (const warehouse of altaVista.tracks.slice(0, 3)) {
  assert.match(warehouse.variant.setupDetails.join(" "), /Light Urban.*warehouse complex/i);
  assert.match(warehouse.variant.setupDetails.join(" "), /CF 30.*two levels.*CF 4.*2 inches/i);
  assert.match(warehouse.variant.setupDetails.join(" "), /100 Support Points to each side.*separate from tactical Victory Points/i);
  assert.match(warehouse.variant.setupDetails.join(" "), /War Crow Prime.*2,835 BV.*56 PV.*2 Edge.*Piloting 3.*Gunnery 3.*Skill 3.*200 SP/i);
  assert.match(warehouse.variant.setupDetails.join(" "), /Kintaro KTO-19b.*1,265 BV.*39 PV.*1 Edge.*Marksman.*Piloting 5.*Gunnery 3.*Skill 4.*50 SP/i);
  assert.match(warehouse.variant.setupDetails.join(" "), /other may hire only the other pilot.*2D6.*high roll chooses first.*ties are rerolled/i);
  assert.deepEqual(warehouse.variant.objectives || TRACKS.find(track => track.id === "meeting-engagement").objectives, TRACKS.find(track => track.id === "meeting-engagement").objectives);
  assert.deepEqual(warehouse.variant.sourceRefs, ["Draconis Reach pp. 78–81", "Meeting Engagement pp. 170–171", "Shared rules pp. 167–168"]);
}
assert.deepEqual(ALTA_VISTA_COMMAND_COMPLICATIONS.rows.map(row => row.roll), ["1–2", "3", "4", "5", "6"]);
assert.match(ALTA_VISTA_COMMAND_COMPLICATIONS.note, /Escobar only.*once.*twice.*three times.*reroll duplicate results of 4, 5, or 6/i);
assert.match(ALTA_VISTA_COMMAND_COMPLICATIONS.rows[1].text, /20 BSP.*per Scale.*visible.*within or adjacent to a building.*automatically damages/i);
assert.match(ALTA_VISTA_COMMAND_COMPLICATIONS.rows[2].text, /Half.*rounded up.*home edge.*Turn 2/i);
assert.match(ALTA_VISTA_COMMAND_COMPLICATIONS.rows[3].text, /\+1 Target Number.*1 hex.*2 inches/i);
assert.match(ALTA_VISTA_COMMAND_COMPLICATIONS.rows[4].text, /BattleTech Turn 3.*Alpha Strike Turn 2.*2D6.*4 or less.*increasing.*Retreat is prohibited/i);
assert.equal(ALTA_VISTA_PROVISIONAL_RULES.length, 4);
assert.match(ALTA_VISTA_MUTUAL_WITHDRAWAL_CLARIFICATION, /both players leave.*continues normally.*next Meeting Engagement/i);

const altaRetreat = altaVista.tracks[3].variant;
assert.match(altaRetreat.setup.join(" "), /Retain.*mapsheets.*Light Urban terrain.*battlefield alignment.*carryover/i);
assert.match(altaRetreat.setup.join(" "), /Only the Raven force surviving.*Turn 2/i);
assert.match(altaRetreat.setup.join(" "), /Escobar.*surviving.*center.*add other available units.*Scale limit.*Turn 1/i);
assert.match(altaRetreat.setupDetails.join(" "), /Only a temporary hire that survived.*No fresh temporary hire/i);
assert.equal(altaRetreat.commandComplications, null);
assert.deepEqual(altaRetreat.objectives, TRACKS.find(track => track.id === "retreat").objectives);
assert.match(altaRetreat.special.join(" "), /No Alta Vista Command Complications.*contract ends/i);

const altaTrial = overrides => ({ played: true, tacticalWinner: "escobar", escobarCompletion: "successful", ravensCompletion: "unsuccessful", ...overrides });
assert.deepEqual(evaluateAltaVistaCampaign({}).availableSequences, [1], "only Trial 1 is initially available");
assert.deepEqual(evaluateAltaVistaCampaign({ trials: [altaTrial()] }).availableSequences, [1, 2], "a non-Raven Trial 1 result opens Trial 2");
assert.deepEqual(evaluateAltaVistaCampaign({ trials: [altaTrial(), altaTrial()] }).availableSequences, [1, 2, 3], "a non-Raven Trial 2 result opens Trial 3");
const completedThree = evaluateAltaVistaCampaign({ trials: [altaTrial(), altaTrial(), altaTrial()] });
assert.equal(completedThree.contractComplete, true);
assert.equal(completedThree.escobarRequiredTracks, 2);
assert.equal(completedThree.outcome, "escobar-wins");

for (const triggerTrial of [1, 2, 3]) {
  const trials = Array.from({ length: triggerTrial }, (_, index) => index === triggerTrial - 1
    ? altaTrial({ tacticalWinner: "ravens", ravensDecision: "revenge" })
    : altaTrial());
  const result = evaluateAltaVistaCampaign({ trials });
  assert.deepEqual(result.availableSequences, [...Array.from({ length: triggerTrial }, (_, index) => index + 1), 4], "Retreat is immediately available after Raven revenge on Trial " + triggerTrial);
  assert.equal(result.retreatTriggerTrial, triggerTrial);
  assert.equal(result.retreatStatus, "pending");
}

const cargoDeparture = evaluateAltaVistaCampaign({ trials: [altaTrial({ tacticalWinner: "ravens", ravensDecision: "cargo-departure" })] });
assert.equal(cargoDeparture.contractComplete, true);
assert.equal(cargoDeparture.retreatStatus, "declined");
assert.equal(cargoDeparture.outcome, "no-victor", "cargo departure is not Raven contract victory and Raven majority activates no-victor");
const stopDecision = evaluateAltaVistaCampaign({ trials: [altaTrial({ tacticalWinner: "ravens", ravensDecision: "stop" })] });
assert.equal(stopDecision.outcome, "no-victor");

const mutualWithdrawal = evaluateAltaVistaCampaign({ trials: [{ complicationSix: "both-comply" }] });
assert.deepEqual(mutualWithdrawal.availableSequences, [1, 2]);
assert.equal(mutualWithdrawal.trials[0].tacticalWinner, "ravens");
assert.equal(mutualWithdrawal.trials[0].escobarCompletion, "successful");
assert.equal(mutualWithdrawal.trials[0].ravensCompletion, "successful");
assert.equal(mutualWithdrawal.retreatStatus, "prohibited");
assert.equal(mutualWithdrawal.contractComplete, false);
const finalMutualWithdrawal = evaluateAltaVistaCampaign({ trials: [{ complicationSix: "both-comply" }, { complicationSix: "both-comply" }, { complicationSix: "both-comply" }] });
assert.equal(finalMutualWithdrawal.contractComplete, true);
assert.equal(finalMutualWithdrawal.escobarRequiredTracks, 2);
assert.equal(finalMutualWithdrawal.outcome, "escobar-wins", "prohibited Retreat is not treated as declined Retreat");

const ravensRefuse = evaluateAltaVistaCampaign({ trials: [{ complicationSix: "escobar-complies-ravens-refuse" }] });
assert.equal(ravensRefuse.ravensDetained, true);
assert.equal(ravensRefuse.explicitNoVictor, true);
assert.equal(ravensRefuse.outcome, "no-victor");
const escobarRefuses = evaluateAltaVistaCampaign({ trials: [{ complicationSix: "escobar-refuses-ravens-comply" }] });
assert.equal(escobarRefuses.escobarDetained, true);
assert.equal(escobarRefuses.escobarBrokeContract, true);
assert.equal(escobarRefuses.outcome, "no-victor");
const bothRefuse = evaluateAltaVistaCampaign({ trials: [{ complicationSix: "both-refuse" }] });
assert.equal(bothRefuse.ravensDetained, true);
assert.equal(bothRefuse.escobarDetained, true);
assert.equal(bothRefuse.escobarBrokeContract, true);
assert.equal(bothRefuse.outcome, "no-victor");

const bothWin = evaluateAltaVistaCampaign({ trials: [altaTrial({ tacticalWinner: "ravens", ravensDecision: "revenge" })], retreatResult: "ravens" });
assert.equal(bothWin.outcome, "both-contracts-successful");
const ravensOnly = evaluateAltaVistaCampaign({ trials: [altaTrial({ tacticalWinner: "ravens", escobarCompletion: "unsuccessful", ravensDecision: "revenge" })], retreatResult: "ravens" });
assert.equal(ravensOnly.outcome, "ravens-win");
const escobarOnly = evaluateAltaVistaCampaign({ trials: [altaTrial(), altaTrial({ tacticalWinner: "ravens", ravensDecision: "cargo-departure" })] });
assert.equal(escobarOnly.outcome, "escobar-wins", "a tied Meeting Engagement record does not activate the Raven-majority no-victor exception");
const failedRetreat = evaluateAltaVistaCampaign({ trials: [altaTrial({ tacticalWinner: "ravens", ravensDecision: "revenge" })], retreatResult: "no-raven-victory" });
assert.equal(failedRetreat.outcome, "no-victor");
assert.equal(evaluateAltaVistaCampaign({ trials: [altaTrial({ tacticalWinner: "ravens", ravensDecision: "revenge" })] }).outcome, "pending");
assert.equal(evaluateAltaVistaCampaign({ trials: [altaTrial()] }).escobarRequiredTracks, 1);
assert.equal(evaluateAltaVistaCampaign({ trials: [altaTrial(), altaTrial()] }).escobarRequiredTracks, 1);
assert.equal(evaluateAltaVistaCampaign({ trials: [altaTrial(), altaTrial(), altaTrial()] }).escobarRequiredTracks, 2);
assert.equal(normalizeAltaVistaCampaignState({ ravenFaction: "raven-alliance" }).ravenFaction, "raven-alliance");
assert.ok(app.includes('"Raven Alliance": "raven-alliance"'), "Raven Alliance faction choice maps to the Raven Alliance OpFor table");
assert.ok(app.includes("availableHotSpotTracks") && !app.includes("availableAltaVistaTracks"), "all Alta Vista tactical tracks are directly selectable");
assert.ok(app.includes("data-alta-withdrawal-response"), "Alta Vista exposes only the current Withdrawal Order response when applicable");
assert.ok(app.includes("state.mode") && app.includes("renderContractReference"), "Alta Vista references remain independent of Attacker/Defender/Both display mode");
assert.ok(css.includes("contract-reference"), "Alta Vista contract references use shared responsive styling");
assert.match(html, /new-ivaarsen/, "the current implementation uses the New Ivaarsen asset cache key");

const dahar = HOT_SPOTS.find(item => item.id === "dahar-iv");
assert.ok(dahar, "Dahar IV is available as a Hot Spot");
assert.equal(dahar.source, "Draconis Reach pp. 82–85");
assert.equal(dahar.campaignState, undefined, "Dahar does not expose campaign-management state");
assert.deepEqual(dahar.sides.map(side => [side.id, side.faction, side.contract, side.employerAlignment]), [
  ["garrison", "Mercenary", "105112A", "Federated Suns"],
  ["raid", "Mercenary", "105112B", "Draconis Combine"]
]);
assert.deepEqual(DAHAR_TRACK_RESULTS.map(result => [result.roll, result.trackId, result.attacker, result.defender]), [
  [1, "recon", "raid", "garrison"],
  [2, "flank", "raid", "garrison"],
  [3, "strike", "raid", "garrison"],
  [4, "meeting-engagement", "garrison", "raid"],
  [5, "assault", "garrison", "raid"],
  [6, "retreat", "garrison", "raid"]
]);
assert.deepEqual(dahar.tracks.map(track => track.label), ["Recon", "Flank", "Strike", "Meeting Engagement", "Assault", "Retreat"], "Dahar directly lists its six tactical tracks");
for (const result of dahar.tracks) {
  assert.equal(result.variant.commandComplications, DAHAR_COMMAND_COMPLICATIONS);
  assert.equal(result.variant.referenceTables.length, 2);
  assert.match(result.variant.setupDetails.join(" "), /Dahar mapsheets.*specific standard-track battlefield dimension.*Repurposed Equipment.*two-thirds.*three per Scale/i);
  assert.match(result.variant.special.join(" "), /Successful track completion/i);
  assert.match(result.variant.sourceRefs.join(" "), /pp\. 82–85.*pp\. 26, 29/i);
}
assert.deepEqual(DAHAR_MAPSHEET_TABLE.map(row => row[1]), ["Mine #1", "Mine #2", "Badlands #1", "Badlands #2", "Washout #1", "Sand Drift #2"]);
assert.deepEqual(DAHAR_INDUSTRIALMECH_TABLE, [
  ["2", "HMX-3M Exo HaulerMech MOD", "108", "5"],
  ["3", "SC XI-M-B Powerman HaulerMech MOD", "277", "11"],
  ["4", "CON-7M Carbine ConstructionMech MOD", "306", "8"],
  ["5", "RCL-Z1M Deep Lord MilitiaMech", "715", "21"],
  ["6", "SC CV-M StrongArm ConstructionMech MOD", "315", "9"],
  ["7", "DTM-1M Burrower MiningMech MOD", "556", "18"],
  ["8", "DVM-2M Ground Pounder MiningMech MOD", "548", "18"],
  ["9", "RCL-4M-B Dig Lord MiningMech MOD", "699", "22"],
  ["10", "CON-9M Carbine ConstructionMech MOD", "289", "10"],
  ["11", "HCL-1MM Heavy Lifter MilitiaMech", "915", "23"],
  ["12", "FLN-366-M St. Florian FireMech MOD", "1,266", "30"]
]);
assert.equal(DAHAR_COMMAND_COMPLICATIONS.rows.length, 6);
assert.equal(DAHAR_PROVISIONAL_RULES.length, 3);

for (const [rights, modifier] of [["independent", 0], ["liaison", 1], ["house", 2], ["integrated", 2]]) {
  assert.equal(resolveDaharComplications({ initial: 4 }, rights).initial, 4 + modifier, rights + " uses the correct Dahar modifier");
}
assert.deepEqual([4, 5, 6].map(initial => resolveDaharComplications({ initial }, "independent").effects), [[4], [5], [6]], "direct Sandstorm, Heatwave, and Abandoned Mine results resolve independently");
assert.deepEqual(resolveDaharComplications({ initial: 6 }, "liaison").effects, [7], "Liaison 6 resolves Orders Are Gibberish");
assert.deepEqual(resolveDaharComplications({ initial: 6, secondaryOne: 2, secondaryTwo: 3 }, "house"), { modifier: 2, initial: 8, secondary: [4, 5], effects: [4, 5], pendingSecondary: false });
assert.deepEqual(resolveDaharComplications({ initial: 6, secondaryOne: 5, secondaryTwo: 6 }, "house").effects, [7], "secondary 8 is ignored and does not recurse");
assert.deepEqual(resolveDaharComplications({ initial: 6, secondaryOne: 2, secondaryTwo: 2 }, "house").effects, [4], "duplicate secondary effects apply once");
assert.equal(resolveDaharComplications({ initial: 6, secondaryOne: 6, secondaryTwo: 6 }, "house").effects.length, 0);
assert.equal(adjustDaharEarnedVp(0, true), 0);
assert.equal(adjustDaharEarnedVp(50, true), 30);
assert.equal(adjustDaharEarnedVp(100, true), 80);
assert.equal(adjustDaharEarnedVp(300, true), 280);
assert.equal(adjustDaharEarnedVp(300, false), 300);

for (const term of ["data-dahar-unit-side", "Select resolved IndustrialMech", "adjustDaharEarnedVp", "completedObjectiveCount", "clearDaharObjectiveState", "TACTICAL SUPPORT · REPURPOSED EQUIPMENT"]) {
  assert.ok(app.includes(term), "Dahar browser implementation includes " + term);
}
for (const excluded of ["data-dahar-roll-sequence", "evaluateDaharCampaign", "normalizeDaharCampaignState", "Current streaks", "Resolved earlier months"]) {
  assert.ok(!app.includes(excluded), "Dahar browser excludes campaign manager behavior: " + excluded);
}
assert.match(dahar.note, /Select the current tactical track directly/i);
assert.ok(dahar.contractReference, "Dahar progression and victory rules are retained as a collapsed reference");
assert.ok(app.includes('"Mercenary": "mercenary-pirate"'), "both Dahar mercenary sides resolve to the Mercenary/Pirate OpFor table");
assert.ok(css.includes("current-track-inputs") && css.includes("adjusted-vp"), "Dahar tactical support and adjusted scoring have focused responsive styles");

const lucerne = HOT_SPOTS.find(item => item.id === "lucerne");
assert.ok(lucerne, "Lucerne is available as a Hot Spot");
assert.equal(lucerne.source, "Draconis Reach pp. 90–93", "Lucerne uses the complete contract source range");
assert.equal(lucerne.campaignState, undefined, "Lucerne has no player-facing campaign record");
assert.deepEqual(lucerne.tracks.map(track => track.label), ["Recon", "Breakthrough", "Objective Raid", "Pushback", "Pursuit", "Assault", "Bio-Gen Raid · mandatory sixth played track"], "Lucerne directly lists all seven tactical tracks and identifies the mandatory sixth battle");
assert.deepEqual(LUCERNE_TRACK_RESULTS.map(result => [result.trackId, result.attacker, result.defender]), [
  ["recon", "eclipse", "bio-gen"],
  ["breakthrough", "eclipse", "bio-gen"],
  ["objective-raid", "eclipse", "bio-gen"],
  ["pushback", "bio-gen", "eclipse"],
  ["pursuit", "bio-gen", "eclipse"],
  ["assault", "eclipse", "bio-gen"],
  ["bio-gen-raid", "eclipse", "bio-gen"]
], "all seven Lucerne tactical outcomes use the corrected roles");
assert.deepEqual(lucerne.sides.map(side => [side.id, side.faction]), [["bio-gen", "Mercenary"], ["eclipse", "Mercenary"]], "both participating Lucerne forces are Mercenary");
assert.match(lucerne.note, /mandatory sixth played track if reached/i);
assert.match(lucerne.contractReference.progression.join(" "), /Track Table.*unique standard tracks.*mandatory sixth played track/i);

assert.deepEqual(LUCERNE_MAPSHEET_TABLE, [
  ["1", "Grassland #1", "Beginner Box"],
  ["2", "Grassland #2", "A Game of Armored Combat"],
  ["3", "Grassland #3", "A Game of Armored Combat"],
  ["4", "Woodland", "MapPack: Grasslands"],
  ["5", "Open Terrain #2", "MapPack: Grasslands"],
  ["6", "Open Terrain #3", "MapPack: Grasslands"]
], "Lucerne uses corrected 1D6 Grasslands Table 1");
for (const result of LUCERNE_TRACK_RESULTS) {
  assert.equal(result.variant.referenceTables[0].rows, LUCERNE_MAPSHEET_TABLE, result.label + " exposes the corrected mapsheet table");
  assert.match(result.variant.setupDetails.join(" "), /beginning with the Attacker.*1D6.*ignore duplicate.*Scale 1.*one mapsheet.*Scales 2–3.*two/i);
  assert.match(result.variant.setupDetails.join(" "), /Alpha Strike terrain.*p\. 154.*Wooded planetary terrain.*Grasslands mapsheet table/i);
  assert.equal(result.variant.temporaryHires, LUCERNE_TEMPORARY_HIRES);
  assert.match(result.variant.temporaryHireNote, /pp\. 29 and 92–93.*eligibility.*costs.*repairs.*replacement/i);
  assert.match(result.variant.sourceRefs.join(" "), /pp\. 90–93.*p\. 150.*p\. 154/i);
}
for (const result of LUCERNE_TRACK_RESULTS.slice(0, 6)) assert.equal(result.variant.commandComplications, LUCERNE_COMMAND_COMPLICATIONS, result.label + " uses Lucerne complications");
assert.equal(LUCERNE_TRACK_RESULTS[6].variant.commandComplications, null, "Bio-Gen Raid excludes random Command Complications");

assert.deepEqual(LUCERNE_TEMPORARY_HIRES.map(hire => [hire.name, hire.unit, hire.bv, hire.pv, hire.gunnery, hire.piloting, hire.alphaStrikeSkill, hire.edge, hire.abilities]), [
  ["Saki", "Venom SDR-9KB", "769", "28", "3", "2", "3", "3", "Jumping Jack Edge Ability"],
  ["Steve Kendricks", "Firefly FFL-5A", "996", "26", "3", "3", "3", "3", "Cautious Edge Ability"]
], "Lucerne Temporary Hire cards use source and errata-corrected values");
assert.equal(LUCERNE_TEMPORARY_HIRES[0].source, "Draconis Reach p. 93");

const bioGenRaid = SPECIAL_TRACKS.find(track => track.id === "bio-gen-raid");
assert.ok(bioGenRaid, "Bio-Gen Raid is a standalone custom track");
assert.equal(bioGenRaid.pageRef, "pp. 91–92");
assert.match(bioGenRaid.setup.join(" "), /Defender.*short edge.*opposite short.*six Medium Level 2 buildings.*4 hexes.*8 inches/i);
assert.match(bioGenRaid.setup.join(" "), /immobile.*−4 target number.*30 damage.*4 damage/i);
assert.match(bioGenRaid.setup.join(" "), /half of the force.*home edge.*start of the track.*remaining force.*perpendicular.*Turn 2/i);
assert.match(bioGenRaid.setup.join(" "), /entire force before Initiative.*Defender’s half.*At least 50 percent.*3 hexes.*6 inches/i);
assert.deepEqual(bioGenRaid.objectives.map(({ id, side, vp, text }) => [id, side, vp, text]), [
  ["damage-collateral", "attacker", 200, "Destroy all the buildings."],
  ["rough-up-place", "both", 100, "Destroy/Cripple at least 50 percent of the opponent’s force."],
  ["seek-destroy", "defender", 200, "Destroy/Cripple the Commander."]
], "Bio-Gen Raid objectives remain manual and preserve the printed wording and VP");
const bioGenRules = bioGenRaid.special.join(" ");
assert.match(bioGenRules, /Each destroyed building spawns one enhanced swarm/i);
assert.match(bioGenRules, /one hex large and 2 levels high.*moves 3 hexes.*nearest unit.*Weapon Attack Phase.*2D6.*2-point clusters.*Anti-Infantry.*Front Table.*Rear Table/i);
assert.match(bioGenRules, /Alpha Strike.*2-inch AOE.*1 damage.*physical attack.*no separate Alpha Strike movement conversion/i);
assert.match(bioGenRules, /Enough Chaos.*do not roll random Command Complications/i);
assert.match(bioGenRules, /Turn 12.*Turn 10 in Alpha Strike/i);
assert.match(bioGenRules, /general salvage rules on p\. 31.*No Strike or Objective Raid salvage exception/i);

assert.deepEqual(LUCERNE_COMMAND_COMPLICATIONS.rows.map(row => row.roll), ["1–3", "4", "5–6", "7", "8+"]);
assert.match(LUCERNE_COMMAND_COMPLICATIONS.note, /standard tracks.*independently.*Independent \+0.*Liaison \+1.*House \+2.*Integrated \+3.*Bio-Gen Raid.*Enough Chaos/i);
assert.match(LUCERNE_COMMAND_COMPLICATIONS.rows[1].text, /−2 Initiative.*first two turns/i);
assert.match(LUCERNE_COMMAND_COMPLICATIONS.rows[2].text, /1D3 neutral swarms per mapsheet.*central hex.*adjacent hex.*1 level high.*6-inch AOE.*may not share.*2 hexes.*4 inches.*level 3\+ hills.*depth 2\+ water.*non-energy.*energy.*Asset.*1D6.*0\* damage.*immune.*Anti-Infantry/i);
assert.match(LUCERNE_COMMAND_COMPLICATIONS.rows[3].text, /Round 3.*weapon attacks.*Piloting Skill.*bog down/i);
assert.match(LUCERNE_COMMAND_COMPLICATIONS.rows[4].text, /exactly two secondary.*same Command Rights modifier.*secondary 8\+.*duplicate actual.*duplicate No Complication.*5 and 6.*do not recurse/i);

for (const [rights, modifier] of [["independent", 0], ["liaison", 1], ["house", 2], ["integrated", 3]]) {
  assert.equal(resolveLucerneComplications({ initial: 4 }, rights).initial, 4 + modifier, rights + " uses the correct Lucerne modifier");
}
assert.deepEqual(resolveLucerneComplications({ initial: 4 }, "independent").effects, [4], "modified 4 resolves Conflicting Orders");
assert.deepEqual(resolveLucerneComplications({ initial: 5 }, "independent").effects, [5], "modified 5 resolves reptile swarms");
assert.deepEqual(resolveLucerneComplications({ initial: 6 }, "independent").effects, [5], "modified 6 resolves the same reptile swarm effect");
assert.deepEqual(resolveLucerneComplications({ initial: 6 }, "liaison").effects, [7], "modified 7 resolves Heavy Rainfall");
assert.deepEqual(resolveLucerneComplications({ initial: 5, secondaryOne: 1, secondaryTwo: 2 }, "integrated").effects, [4, 5], "Roll Twice resolves exactly two independently modified secondary effects");
assert.deepEqual(resolveLucerneComplications({ initial: 5, secondaryOne: 2, secondaryTwo: 3, replacementTwo: [4] }, "integrated").effects, [5, 7], "duplicate swarm results 5 and 6 require a differently modified replacement");
assert.deepEqual(resolveLucerneComplications({ initial: 5, secondaryOne: 5, replacementOne: [1], secondaryTwo: 6, replacementTwo: [1, 2] }, "integrated").effects, [4, 5], "secondary 8+ and duplicate actual effects use non-recursive replacement rolls");
const duplicateNoComplication = resolveLucerneComplications({ initial: 6, secondaryOne: 1, secondaryTwo: 1 }, "house");
assert.deepEqual(duplicateNoComplication.effects, [], "duplicate No Complication results are accepted");
assert.equal(duplicateNoComplication.pendingSecondary, false);
const pendingReplacement = resolveLucerneComplications({ initial: 5, secondaryOne: 5, secondaryTwo: 1 }, "integrated");
assert.deepEqual(pendingReplacement.replacementNeeds, [true, false], "secondary 8+ prompts for a replacement without recursion");
assert.equal(pendingReplacement.pendingSecondary, true);

assert.equal(LUCERNE_PROVISIONAL_RULES.length, 3, "only genuine Lucerne interpretations are presented as provisional");
assert.doesNotMatch(LUCERNE_PROVISIONAL_RULES.join(" "), /LUCERNE-.*-AMB-001/);
for (const term of ["renderContractReference", "Enough Chaos", "Recon Deny remains projected until Turn 8", "bio-gen-raid"]) {
  assert.ok(app.includes(term), "Lucerne browser behavior includes " + term);
}
assert.match(app, /Bio-Gen Retainer.*CEO Marie Valentina.*Garrison\/Retainer\/Defense.*Integrated Command/);
assert.match(app, /Eclipse Expeditions Special Operations.*Guildmaster Phil Newsted.*Expedition\/Raid.*Independent Command/);
assert.match(app, /both participating forces are Mercenary.*Mercenary\/Pirate OpFor table/i);
assert.match(app, /same completed-objective|Current score: Attacker|currently successfully completes the track/);
assert.match(app, /renderTemporaryHires\(referenceTrack\.temporaryHires, referenceTrack\.temporaryHireNote\)/, "Temporary Hire cards accept contract-aware hiring guidance");
assert.match(html, /app\.mjs\?v=sun-prairie/, "Hot Spots uses the Sun Prairie asset cache key");
assert.ok(css.includes("campaign-field input") && css.includes("hire-card-grid") && css.includes("@media"), "Lucerne controls and reused Temporary Hire cards retain responsive styling");

assert.match(html, /<details[^>]+id="hotspot-setup"[^>]+open>/, "Hot Spot Setup starts expanded");
assert.match(html, /id="hotspot-setup-summary"/, "collapsed Hot Spot Setup has a persistent summary target");
assert.match(html, /id="battlefield-configuration"/, "Hot Spot Setup contains the shared battlefield configuration region");
assert.match(html, /id="complication-configuration"/, "Hot Spot Setup contains the shared complication configuration region");
assert.match(html, /<h2 id="derived-track-title" class="derived-track-title">/, "the resolved track has one prominent gameplay heading");
assert.doesNotMatch(html, />Tracking view</i, "the redundant visible Tracking View label is removed");
assert.doesNotMatch(html, /class="source-strip"|PRIMARY SOURCE|ERRATA INCORPORATED/, "the redundant top source banner is removed");
assert.match(html, /RULES SOURCES[\s\S]*First Printing[\s\S]*11 November 2026[\s\S]*26 November 2026[\s\S]*topic,90893\.0\.html/, "the centralized Rules Sources section retains the complete source and errata record");
assert.match(html, /aria-label="Score display"/, "the score-side controls retain an accessible group name");
assert.match(app, /mission-card-head.*<h2>Mission Brief<\/h2>/, "Mission Brief replaces the duplicate track heading in the reference card");
assert.doesNotMatch(app, /mission-card-head.*<h2>Track pending<\/h2>/, "unresolved conditional tracks also use Mission Brief instead of a duplicate status heading");
assert.match(css, /\.panel \{[^}]*color: var\(--ink\)/, "light panels explicitly reset inherited dark-theme text to a dark foreground");
assert.match(css, /\.contract-reference > summary \{[^}]*color: var\(--ink\)/, "Contract Reference uses dark text on its light panel");
assert.match(css, /\.support-force-group \{[^}]*color: var\(--ink\)/, "Dahar support headings use dark text on light cards");
assert.match(css, /\.reference-citation \{[^}]*color: #53616c/, "source citations use an AA-safe muted foreground on light panels");
assert.match(css, /\.complication-reference-only \{[^}]*color: #53616c/, "complication reference-only labels use an AA-safe muted foreground");
assert.match(app, /aria-describedby/, "Dahar selectors describe their complete selected IndustrialMech identity");
assert.match(app, /selected-unit-identity/, "Dahar displays each complete selected IndustrialMech identity outside the native selector");
assert.match(app, /<span>Sequence<\/span><strong>'.*step\?\.label.*<\/strong><\/div>/, "Sequence displays only the source sequence label");
assert.match(app, /currentHotSpot\(\)\.name.*resolved\?\.displayName.*selected\?\.name.*"Scale " \+ state\.scale/s, "the setup summary includes location, track, military side, and Scale");
const renderOpForBody = app.match(/function renderOpFor\(\) \{([\s\S]*?)\n\}\n\nfunction renderHotSpotSetup/)?.[1] || "";
assert.match(renderOpForBody, /const configuration = generatedOpForConfiguration\(\);\s+const selected = configuration\.side;/, "generated OpFor rendering uses the resolved opposing side and faction configuration");
assert.match(css, /hotspot-setup-disclosure:not\(\[open\]\).*Expand setup/s, "collapsed setup exposes a visible expand control");
assert.match(css, /setup-disclosure-label::before \{ content: "Collapse setup"/, "expanded setup exposes a visible collapse control");
const resetTrackBody = app.match(/function resetTrack\(\) \{([\s\S]*?)\n\}/)?.[1] || "";
assert.match(resetTrackBody, /state\.trackSequence\[state\.hotSpotId\].*state\.trackId/s, "Reset Objectives is scoped to the current Hot Spot sequence and resolved track");
assert.match(resetTrackBody, /state\.progress/, "Reset Objectives clears objective progress");
assert.match(resetTrackBody, /state\.vpSelections/, "Reset Objectives clears objective VP selections");
assert.match(resetTrackBody, /pascagoulaExtractionRequired\(\).*delete state\.tacticalInputs\[pascagoulaExtractionKey\(\)\]/s, "Reset Objectives clears only the current Pascagoula extraction prerequisite");
for (const preservedState of ["clearComplicationSelections", "opforForceTypes", "daharMission", "lucerneMission", "sourceRollSelections", "selectionValues"]) {
  assert.ok(!resetTrackBody.includes(preservedState), "Reset Objectives preserves " + preservedState);
}
assert.match(app, /function renderSetupConfiguration\(referenceTrack\)/, "battlefield and complication configuration share the Hot Spot Setup renderer");
assert.match(app, /battlefieldConfigurationParts\(referenceTrack\)/, "mapsheet and Alpha Strike terrain material is partitioned from gameplay rules");
assert.match(app, /filter\(table => !isBattlefieldConfigurationTable\(table\)\)/, "mapsheet tables are not duplicated in the gameplay reference");
assert.match(app, /renderCommandComplicationsSetup\(referenceTrack\.commandComplications\)/, "Command Complications selection renders in Hot Spot Setup");
assert.match(app, /renderAppliedComplications\(referenceTrack\.commandComplications\)/, "the gameplay reference renders only applied complication effects");
assert.match(app, /if \(!effectCards\.length && !extras\) return "";/, "the gameplay area omits an empty active-effects panel");
assert.match(app, /\$\("#hotspot-setup"\)\.addEventListener\("change"/, "complication selection is handled from Hot Spot Setup");
assert.doesNotMatch(renderOpForBody, /data-complication-choice/, "generated OpFor rendering remains separate from complication selection");
assert.ok(css.includes("setup-configuration-card") && css.includes("complication-selection-status"), "battlefield and complication setup remain responsive and visibly grouped");

assert.deepEqual(PLAYER_VISIBLE_HOT_SPOT_IDS, ["achernar", "alta-vista", "dahar-iv", "le-blanc", "lucerne", "melcher", "new-ivaarsen", "pascagoula", "protection", "sun-prairie", "tigress"], "only completed and verified contracts are player-visible in source order");
assert.equal(PLAYER_VISIBLE_HOT_SPOT_IDS.every(id => HOT_SPOTS.some(hotSpot => hotSpot.id === id)), true, "every visible contract retains its source data");
assert.equal(HOT_SPOTS.some(hotSpot => hotSpot.id === "new-ivaarsen"), true, "New Ivaarsen contract data is available to the verified-location filter");
assert.match(app, /const VISIBLE_HOT_SPOTS = HOT_SPOTS\.filter/, "the browser uses one centralized approved-location filter");
assert.match(app, /state\.hotSpotId !== hotSpot\.id.*state\.hotSpotId = hotSpot\.id/, "saved hidden selections fall back to an approved location");

const melcher = HOT_SPOTS.find(hotSpot => hotSpot.id === "melcher");
assert.equal(melcher.fixedScale, 1, "each Melcher tactical track is locked to Scale 1");
assert.deepEqual(melcher.sides.map(side => side.faction), ["Mercenary", "Mercenary"], "both Melcher participating factions are Mercenary");
assert.deepEqual(melcher.tracks.map(track => track.trackId), ["oxen-intercept", "objective-raid"], "Melcher exposes the custom Oxen Intercept and modified Objective Raid tracks");
const oxen = SPECIAL_TRACKS.find(track => track.id === "oxen-intercept");
assert.equal(oxen.objectives.find(objective => objective.id === "deliver-justice").maxCount, 2, "Deliver Justice is capped at two 200 VP awards");
assert.match(oxen.objectives.find(objective => objective.id === "deliver-justice").text, /Cripple or destroy/, "Deliver Justice uses the source-defined qualifying unit condition");
assert.equal(oxen.objectives.filter(objective => objective.side === "attacker").reduce((sum, objective) => sum + objective.vp, 0), 750, "Oxen Intercept Attacker maximum is 750 VP");
assert.equal(oxen.objectives.filter(objective => objective.side === "defender").reduce((sum, objective) => sum + objective.vp * (objective.maxCount || 1), 0), 850, "Oxen Intercept Defender maximum is 850 VP");
assert.match(melcher.tracks[1].variant.setupDetails.join(" "), /Galleon Light Tank GAL-100.*no attacks/, "the official Melcher APC erratum is incorporated");
assert.equal(MELCHER_GRASSLANDS_MAPSHEETS.length, 6, "Melcher includes the complete Grasslands mapsheet table");
assert.deepEqual(MELCHER_GRASSLANDS_MAPSHEETS.map(row => row[2]), ["BB", "AGOAC", "AGOAC", "Map Pack: Grasslands", "Map Pack: Grasslands", "Map Pack: Grasslands"], "Melcher preserves the printed mapsheet source abbreviations");
assert.equal(MELCHER_BLACK_MARKET.length, 11, "Melcher includes all Black Market AgroMech results");
assert.equal(MELCHER_COMMAND_COMPLICATIONS.rows.length, 5, "Melcher includes the full resolved Command Complications bracket");
assert.equal(MELCHER_TEMPORARY_HIRES.length, 2, "Melcher includes both named temporary hires");
assert.match(app, /"melcher", "new-ivaarsen", "pascagoula", "protection", "sun-prairie", "tigress"\]\);/, "Melcher through Tigress use the shared interactive complication and simplified OpFor workflows");
assert.match(app, /Math\.min\(objective\.maxCount \?\? Infinity/, "repeatable objectives honor source-defined maximum counts");
const hotSpotsHeader = html.match(/<header class="topbar">[\s\S]*?<\/header>/)?.[0] || "";
const coreHeader = coreHtml.match(/<header class="topbar">[\s\S]*?<\/header>/)?.[0] || "";
assert.match(hotSpotsHeader, /HOT SPOTS MISSION FOUNDRY[\s\S]*Mission tracker[\s\S]*v0\.1[\s\S]*href="\.\.\/">Core Mission Foundry →<\/a>/, "Hot Spots uses the approved branding and same-tab reciprocal link");
assert.match(coreHeader, /CORE MISSION FOUNDRY[\s\S]*Mission generator[\s\S]*v0\.1[\s\S]*href="hot-spots\/">Hot Spots Mission Foundry →<\/a>/, "Core uses the approved branding and same-tab reciprocal link");
assert.doesNotMatch(hotSpotsHeader + coreHeader, /status-dot/, "neither application header contains a colored status dot");
assert.match(css + coreCss, /\.app-nav-link\{?[^}]*font-weight:\s*400[^}]*text-decoration:\s*underline/s, "both navigation links use the shared muted regular underlined treatment");
assert.match(melcher.contractReference.summary.join(" "), /Melcher Food Corporation.*Surinami Processing.*Intensity 2/, "Melcher Contract Reference preserves the employers and contract intensity");
assert.equal(melcher.tracks[0].variant.sourceRolls, undefined, "Melcher mapsheet tables are reference-only and hold no selection state");
assert.doesNotMatch(melcher.tracks[0].variant.setupDetails.join(" "), /duplicate result|independently rolled/i, "Melcher battlefield rules omit redundant duplicate-result guidance");
assert.match(app, /function renderBattlefieldTable\(table\) \{\s+return renderGeneratorTable\("", table\);/s, "battlefield configuration renders reference-only tables");
assert.doesNotMatch(app, /selectable-battlefield-row|Selected mapsheet|No mapsheet selected/, "battlefield tables expose no selected row or selected summary");
assert.doesNotMatch(data, /presentation: "battlefield-table"/, "contract data stores no battlefield-table selection configuration");

for (const hotSpot of HOT_SPOTS) {
  assert.ok(hotSpot.sides.length >= 2, hotSpot.name + " has opposing sides");
  for (const side of hotSpot.sides) assert.ok(Object.values(FACTION_COLORS).includes(side.color), hotSpot.name + " side has a faction UI color");
  for (const sequence of hotSpot.tracks) assert.ok(sequence.sequence >= 1, hotSpot.name + " track sequence is numbered");
}
console.log("Hot Spots mission browser data and interaction smoke tests passed");

