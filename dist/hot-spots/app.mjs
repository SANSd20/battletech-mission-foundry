import { adjustDaharEarnedVp, ALTA_VISTA_MUTUAL_WITHDRAWAL_CLARIFICATION, ALTA_VISTA_PROVISIONAL_RULES, calculateAchernarVictory, calculateReconDenyVp, DAHAR_COMMAND_COMPLICATIONS, DAHAR_INDUSTRIALMECH_TABLE, DAHAR_PROVISIONAL_RULES, evaluateAltaVistaCampaign, FACTION_COLORS, GENERAL_RULES, HOT_SPOTS, MISSION_OPFOR_OVERRIDES, normalizeAchernarCampaignState, normalizeAltaVistaCampaignState, OPPOSING_FORCE_TABLES, RECON_DENY_ATTACKER_OBJECTIVE_IDS, resolveDaharComplications, SOURCES, SPECIAL_TRACKS, TRACKS } from "./data.mjs?v=dahar-tactical-scope";

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const sideNames = { attacker: "Attacker", defender: "Defender" };
const opforTableByFaction = {
  "Mercenary": "mercenary-pirate",
  "Capellan Confederation": "capellan",
  "Draconis Combine": "draconis-combine",
  "Federated Suns": "federated-suns",
  "Raven Alliance": "raven-alliance",
  "Clan Sea Fox": "raven-alliance"
};

const state = {
  hotSpotId: "achernar",
  trackSequence: { achernar: 1 },
  selectedSide: { achernar: "tybalt" },
  winnerSelections: {},
  resultSelections: {},
  sourceRollSelections: {},
  selectionValues: {},
  roleSelections: {},
  trackId: "meeting-engagement",
  scale: 1,
  mode: "both",
  takingOneForTeam: false,
  opforRoll: 1,
  progress: {},
  vpSelections: {},
  campaignState: {},
  daharMission: null
};

function emptyDaharSideState() {
  return {
    complication: { initial: null, secondaryOne: null, secondaryTwo: null },
    repurposedRolls: [null, null, null],
    temporaryEligibility: "not-recorded",
    temporaryCount: 0,
    temporaryRolls: Array(9).fill(null)
  };
}

function newDaharMissionState() {
  return {
    commandRights: { garrison: "liaison", raid: "liaison" },
    garrison: emptyDaharSideState(),
    raid: emptyDaharSideState(),
    finalized: false,
    scale: null,
    attackerVp: null,
    defenderVp: null,
    successfulSide: "neither"
  };
}

function daharMissionState() {
  if (!state.daharMission) state.daharMission = newDaharMissionState();
  return state.daharMission;
}

function currentTrack() {
  return [...TRACKS, ...SPECIAL_TRACKS].find(track => track.id === state.trackId) || null;
}

function currentHotSpot() {
  return HOT_SPOTS.find(hotSpot => hotSpot.id === state.hotSpotId) || HOT_SPOTS[0];
}

function currentHotSpotStep() {
  const hotSpot = currentHotSpot();
  const tracks = availableHotSpotTracks(hotSpot);
  const sequence = Number(state.trackSequence[hotSpot.id] || tracks[0]?.sequence || 1);
  return tracks.find(track => track.sequence === sequence) || tracks[0] || null;
}

function availableHotSpotTracks(hotSpot = currentHotSpot()) {
  if (hotSpot.campaignState?.kind === "alta-vista") {
    const evaluation = evaluateAltaVistaCampaign(state.campaignState[hotSpot.id]?.record || {});
    return hotSpot.tracks.filter(track => evaluation.availableSequences.includes(track.sequence));
  }
  return hotSpot.tracks;
}

function selectionKey(sequence) {
  return state.hotSpotId + "::" + sequence;
}

function sideById(sideId) {
  const hotSpot = currentHotSpot();
  const side = hotSpot.sides.find(item => item.id === sideId) || null;
  if (!side || hotSpot.id !== "alta-vista" || side.id !== "ravens") return side;
  const selected = normalizeAltaVistaCampaignState(state.campaignState[hotSpot.id]?.record || {}).ravenFaction;
  const faction = selected === "raven-alliance" ? "Raven Alliance" : selected === "mercenary" ? "Mercenary" : "Faction not selected";
  return { ...side, faction, color: FACTION_COLORS[faction] || FACTION_COLORS.Local };
}

function currentOpForTable() {
  const selected = sideById(state.selectedSide[currentHotSpot().id]);
  const tableId = opforTableByFaction[selected?.faction];
  return tableId ? OPPOSING_FORCE_TABLES[tableId] : null;
}

function currentMissionOpForOverride() {
  const hotSpot = currentHotSpot();
  const selectedSideId = state.selectedSide[hotSpot.id];
  return MISSION_OPFOR_OVERRIDES[hotSpot.id]?.[selectedSideId] || null;
}

function currentOpForScale() {
  const override = currentMissionOpForOverride();
  const source = override || currentOpForTable();
  return source?.scales[String(Math.min(3, Math.max(1, state.scale)))] || null;
}

function currentOpForRow() {
  const scale = currentOpForScale();
  if (!scale) return null;
  const rollKey = state.opforRoll <= 1 ? "1−" : state.opforRoll >= 6 ? "6+" : String(state.opforRoll);
  return scale.rows.find(row => row.roll === rollKey) || scale.rows[0];
}

function forceList(value) {
  if (!value) return "<li>None listed</li>";
  return value.split(" | ").map(item => "<li>" + esc(item) + "</li>").join("");
}

function opforRollOptions() {
  return [1, 2, 3, 4, 5, 6].map(value => {
    const label = value === 1 ? "1−" : value === 6 ? "6+" : String(value);
    return '<option value="' + value + '"' + (state.opforRoll === value ? " selected" : "") + ">" + label + "</option>";
  }).join("");
}

function winnerKey(sequence) {
  return state.hotSpotId + "::winner::" + sequence;
}

function resultKey(sequence) {
  return state.hotSpotId + "::result::" + sequence;
}

function sourceRollKey(sequence, rollId) {
  return state.hotSpotId + "::source-roll::" + sequence + "::" + rollId;
}

function selectedSourceRoll(sequence, roll) {
  return state.sourceRollSelections[sourceRollKey(sequence, roll.id)] || "";
}

function sourceRollLabel(sequence, roll) {
  const selected = selectedSourceRoll(sequence, roll);
  return roll.options.find(option => option.value === selected)?.label || "Not selected";
}

function variantSelectionKey(sequence, selection) {
  return state.hotSpotId + "::selection::" + sequence + "::" + selection.id;
}

function selectedVariantSelection(sequence, selection) {
  const value = state.selectionValues[variantSelectionKey(sequence, selection)] || "";
  return selection.options.some(option => option.value === value) ? value : "";
}

function variantSelectionLabel(sequence, selection) {
  const selected = selectedVariantSelection(sequence, selection);
  return selection.options.find(option => option.value === selected)?.label || "Not selected";
}

function roleKey(sequence) {
  return state.hotSpotId + "::role::" + sequence;
}

function campaignDefinition(hotSpot = currentHotSpot()) {
  return hotSpot.campaignState || null;
}

function campaignValues(hotSpot = currentHotSpot()) {
  const definition = campaignDefinition(hotSpot);
  if (!definition) return null;
  if (!state.campaignState[hotSpot.id]) state.campaignState[hotSpot.id] = { tracks: {} };
  if (!state.campaignState[hotSpot.id].tracks) state.campaignState[hotSpot.id].tracks = {};
  return state.campaignState[hotSpot.id];
}

function campaignTrackValues(sequence, hotSpot = currentHotSpot()) {
  const definition = campaignDefinition(hotSpot);
  if (!definition) return null;
  const campaign = campaignValues(hotSpot);
  const key = String(sequence);
  if (!campaign.tracks[key]) campaign.tracks[key] = {};
  for (const field of definition.fields) {
    if (campaign.tracks[key][field.id] === undefined) campaign.tracks[key][field.id] = field.default;
  }
  return campaign.tracks[key];
}

function campaignBuildingTotals(sequence, hotSpot = currentHotSpot()) {
  const definition = campaignDefinition(hotSpot);
  if (!definition) return { stephensons: 0, isf: 0 };
  const totals = { stephensons: 0, isf: 0 };
  for (let current = 1; current <= Number(sequence); current += 1) {
    const values = campaignTrackValues(current, hotSpot);
    totals.stephensons += Number(values?.stephensonsBuildingDamage) || 0;
    totals.isf += Number(values?.isfBuildingDamage) || 0;
  }
  return totals;
}

function campaignStatusOptions(selected) {
  return [
    ["not-recorded", "Not recorded"],
    ["operational", "Operational"],
    ["destroyed", "Destroyed"]
  ].map(([value, label]) => '<option value="' + value + '"' + (selected === value ? " selected" : "") + ">" + label + "</option>").join("");
}

function achernarCampaignRecord() {
  const campaign = campaignValues();
  if (!campaign.record) campaign.record = {};
  return campaign.record;
}

function achernarStrikeBranchStatus() {
  const trackOneWinner = selectedWinner(1);
  const trackTwoWinner = selectedWinner(2);
  if (!trackOneWinner || !trackTwoWinner) return null;
  return trackOneWinner === "tybalt" && trackTwoWinner === "tybalt";
}

function achernarWinnerOptions(selected) {
  return [
    ["not-recorded", "Not recorded"],
    ["tybalt", "Tybalt"],
    ["home-guard", "Home Guard"]
  ].map(([value, label]) => '<option value="' + value + '"' + (selected === value ? " selected" : "") + ">" + label + "</option>").join("");
}

function achernarVictoryStatus(label, status) {
  const statusText = {
    victory: "Victory condition satisfied",
    "not-qualified": "Victory condition not satisfied",
    pending: "Pending campaign inputs"
  }[status] || "Pending campaign inputs";
  return "<span><strong>" + esc(label) + ":</strong> " + esc(statusText) + "</span>";
}

function achernarOutcomeText(outcome) {
  return {
    "both-contracts-successful": "Both contracts successful",
    "tybalt-contract-successful": "Tybalt contract successful",
    "home-guard-contract-successful": "Home Guard contract successful",
    pending: "Pending campaign inputs"
  }[outcome] || "Pending campaign inputs";
}

function renderAchernarCampaignState(container, definition) {
  const record = achernarCampaignRecord();
  const normalized = normalizeAchernarCampaignState(record, state.scale);
  Object.assign(record, {
    survivorsAfterTrack3: normalized.survivorsAfterTrack3,
    survivorsAfterTrack4: normalized.survivorsAfterTrack4,
    finalSurvivors: normalized.finalSurvivors,
    strikeWinner: normalized.strikeWinner,
    retreatWinner: normalized.retreatWinner,
    qualifyingSupportDestroyed: normalized.qualifyingSupportDestroyed
  });
  const strikePlayed = achernarStrikeBranchStatus();
  const victory = calculateAchernarVictory(record, { scale: state.scale, strikePlayed });
  const numberField = (field, label, value, maximum, disabled = false) =>
    '<label class="campaign-field"><span>' + esc(label) + '</span><input type="number" min="0" max="' + esc(String(maximum)) + '" value="' + esc(value === null ? "" : String(value)) + '" data-achernar-field="' + esc(field) + '"' + (disabled ? " disabled" : "") + '></label>';
  const strikeField = strikePlayed === true
    ? '<label class="campaign-field"><span>Strike winner</span><select data-achernar-field="strikeWinner">' + achernarWinnerOptions(normalized.strikeWinner) + '</select></label>'
    : '<div class="campaign-field campaign-static-field"><span>Strike winner</span><strong>' + (strikePlayed === false ? "Not played — Track 3 resolved to another mission" : "Resolve the Track 1 and Track 2 winners") + '</strong></div>';

  container.innerHTML = '<section class="campaign-state-card"><div class="campaign-state-head"><div><div class="panel-kicker">CROSS-TRACK PRESERVATION</div><h3>' + esc(definition.title) + '</h3></div><button type="button" class="campaign-reset-button" data-reset-campaign="achernar">Reset campaign state</button></div>' +
    '<p class="campaign-state-note">' + esc(definition.note) + '</p>' +
    '<div class="campaign-state-summary"><strong>Initial Track 3 allocation at Scale ' + esc(String(state.scale)) + '</strong><span>' + normalized.initialDefectors + ' J. Edgar Hover Tanks · Gunnery 4 / Piloting 5 · Alpha Strike Skill 4</span></div>' +
    '<div class="campaign-fields"><div class="campaign-track-label">Persistent defector force</div>' +
      numberField("survivorsAfterTrack3", "Survivors after Track 3", normalized.survivorsAfterTrack3, normalized.initialDefectors) +
      numberField("survivorsAfterTrack4", "Survivors after Track 4", normalized.survivorsAfterTrack4, normalized.survivorsAfterTrack3 ?? normalized.initialDefectors, normalized.survivorsAfterTrack3 === null) +
      numberField("finalSurvivors", "Final survivors after Track 5", normalized.finalSurvivors, normalized.survivorsAfterTrack4 ?? normalized.initialDefectors, normalized.survivorsAfterTrack4 === null) +
      '<label class="campaign-field"><span>Qualifying Tybalt BSP units destroyed by Home Guard</span><input type="number" min="0" value="' + normalized.qualifyingSupportDestroyed + '" data-achernar-field="qualifyingSupportDestroyed"></label>' +
      strikeField +
      '<label class="campaign-field"><span>Retreat winner</span><select data-achernar-field="retreatWinner">' + achernarWinnerOptions(normalized.retreatWinner) + '</select></label>' +
    '</div><div class="campaign-state-summary"><strong>Contract victory check</strong><span class="campaign-contract-outcome">' + esc(achernarOutcomeText(victory.outcome)) + '</span>' + achernarVictoryStatus("Tybalt", victory.tybalt) + achernarVictoryStatus("Home Guard", victory.homeGuard) + '<span>Home Guard’s five-unit condition counts only Battlefield Support units granted to Tybalt by the Achernar Command Complications table. Defector J. Edgar vehicles do not count toward this total.</span><span class="campaign-ruling">Provisional project ruling approved by the user pending official forum clarification; not official errata or a developer ruling.</span></div>' +
    '<div class="reference-citation">Source: ' + esc(definition.sourceRefs.join(" · ")) + '</div></section>';
}

function altaVistaCampaignRecord() {
  const campaign = campaignValues();
  if (!campaign.record) campaign.record = {};
  const normalized = normalizeAltaVistaCampaignState(campaign.record);
  campaign.record = normalized;
  return campaign.record;
}

function altaOptions(options, selected, disabledValue = null) {
  return options.map(([value, label]) => '<option value="' + esc(value) + '"' + (selected === value ? " selected" : "") + (disabledValue === value && selected !== value ? " disabled" : "") + '>' + esc(label) + '</option>').join("");
}

function altaOutcomeText(outcome) {
  return {
    "both-contracts-successful": "Both contracts successful",
    "escobar-wins": "Escobar wins",
    "ravens-win": "Ravens win",
    "no-victor": "No victor",
    pending: "Pending"
  }[outcome] || "Pending";
}

function renderAltaVistaCampaignState(container, definition) {
  const record = altaVistaCampaignRecord();
  const evaluation = evaluateAltaVistaCampaign(record);
  const selectedSequence = Number(currentHotSpotStep()?.sequence || 1);
  const trialIndex = Math.min(2, Math.max(0, selectedSequence - 1));
  const trial = evaluation.trials[trialIndex];
  const isMeeting = selectedSequence <= 3;
  const winnerOptions = [["not-recorded", "Not recorded"], ["ravens", "Ravens"], ["escobar", "Escobar"], ["neither", "Neither side"]];
  const completionOptions = [["not-recorded", "Not recorded"], ["successful", "Successfully completed"], ["unsuccessful", "Not successfully completed"]];
  const withdrawalOptions = [["not-triggered", "Not triggered"], ["both-comply", "Both comply"], ["escobar-complies-ravens-refuse", "Escobar complies; Ravens refuse"], ["escobar-refuses-ravens-comply", "Escobar refuses; Ravens comply"], ["both-refuse", "Both refuse"]];
  const decisionOptions = [["pending", "Pending"], ["cargo-departure", "Depart with cargo"], ["stop", "Choose no further tracks"], ["revenge", "Seek revenge — trigger Retreat"]];
  const hireOptions = [["none", "No hire"], ["raven", "Raven — War Crow Prime (200 SP)"], ["roland", "Roland D’Isque — Kintaro KTO-19b (50 SP)"]];
  const buildingOptions = [["not-recorded", "Not recorded"], ["preserved", "No buildings destroyed — 100 SP each"], ["destroyed", "One or more buildings destroyed"]];
  const trialFields = isMeeting ? '<div class="campaign-fields"><div class="campaign-track-label">Warehouse Trial ' + selectedSequence + ' record</div>' +
    '<label class="campaign-field"><span>Trial played</span><select data-alta-trial-field="played" data-alta-trial-index="' + trialIndex + '">' + altaOptions([["false", "Not yet"], ["true", "Played"]], String(trial.played)) + '</select></label>' +
    '<label class="campaign-field"><span>Tactical winner</span><select data-alta-trial-field="tacticalWinner" data-alta-trial-index="' + trialIndex + '">' + altaOptions(winnerOptions, trial.tacticalWinner) + '</select></label>' +
    '<label class="campaign-field"><span>Escobar completion</span><select data-alta-trial-field="escobarCompletion" data-alta-trial-index="' + trialIndex + '">' + altaOptions(completionOptions, trial.escobarCompletion) + '</select></label>' +
    '<label class="campaign-field"><span>Ravens completion</span><select data-alta-trial-field="ravensCompletion" data-alta-trial-index="' + trialIndex + '">' + altaOptions(completionOptions, trial.ravensCompletion) + '</select></label>' +
    '<label class="campaign-field"><span>Withdrawal order</span><select data-alta-trial-field="complicationSix" data-alta-trial-index="' + trialIndex + '">' + altaOptions(withdrawalOptions, trial.complicationSix) + '</select></label>' +
    '<label class="campaign-field"><span>Raven decision after normal win</span><select data-alta-trial-field="ravensDecision" data-alta-trial-index="' + trialIndex + '"' + (trial.complicationSix !== "not-triggered" ? " disabled" : "") + '>' + altaOptions(decisionOptions, trial.ravensDecision) + '</select></label>' +
    '<label class="campaign-field"><span>Escobar temporary hire</span><select data-alta-trial-field="escobarHire" data-alta-trial-index="' + trialIndex + '">' + altaOptions(hireOptions, trial.escobarHire, trial.ravensHire) + '</select></label>' +
    '<label class="campaign-field"><span>Ravens temporary hire</span><select data-alta-trial-field="ravensHire" data-alta-trial-index="' + trialIndex + '">' + altaOptions(hireOptions, trial.ravensHire, trial.escobarHire) + '</select></label>' +
    '<label class="campaign-field"><span>Building result</span><select data-alta-trial-field="buildingResult" data-alta-trial-index="' + trialIndex + '">' + altaOptions(buildingOptions, trial.buildingResult) + '</select></label>' +
    '<label class="campaign-field campaign-wide-field"><span>Raven survivors / surviving hire</span><textarea rows="2" data-alta-trial-field="ravenSurvivors" data-alta-trial-index="' + trialIndex + '">' + esc(trial.ravenSurvivors) + '</textarea></label>' +
    '<label class="campaign-field campaign-wide-field"><span>Escobar survivors / added-force allowance</span><textarea rows="2" data-alta-trial-field="escobarSurvivors" data-alta-trial-index="' + trialIndex + '">' + esc(trial.escobarSurvivors) + '</textarea></label>' +
    '<label class="campaign-field campaign-wide-field"><span>Mapsheets, alignment, terrain, and battlefield carryover</span><textarea rows="2" data-alta-trial-field="battlefieldCarryover" data-alta-trial-index="' + trialIndex + '">' + esc(trial.battlefieldCarryover) + '</textarea></label></div>' : "";
  const retreatField = evaluation.availableSequences.includes(4) ? '<div class="campaign-fields"><div class="campaign-track-label">Conditional Retreat result</div><label class="campaign-field"><span>Retreat result</span><select data-alta-root-field="retreatResult">' + altaOptions([["not-recorded", "Not played / result pending"], ["ravens", "Ravens won Retreat"], ["no-raven-victory", "Played without Raven victory"]], evaluation.retreatResult) + '</select></label><div class="campaign-field campaign-static-field"><span>Triggered after</span><strong>Warehouse Trial ' + esc(String(evaluation.retreatTriggerTrial || "—")) + '</strong></div></div>' : "";
  const trialSummaries = evaluation.trials.map((item, index) => '<span><strong>Trial ' + (index + 1) + ':</strong> ' + (item.played ? esc(item.tacticalWinner) + ' tactical result · Escobar ' + esc(item.escobarCompletion) : "not played") + '</span>').join("");

  container.innerHTML = '<section class="campaign-state-card"><div class="campaign-state-head"><div><div class="panel-kicker">CONDITIONAL CONTRACT PROGRESSION</div><h3>' + esc(definition.title) + '</h3></div><button type="button" class="campaign-reset-button" data-reset-campaign="alta-vista">Reset campaign state</button></div>' +
    '<p class="campaign-state-note">' + esc(definition.note) + '</p>' +
    '<div class="campaign-fields"><div class="campaign-track-label">Contract setup</div><label class="campaign-field"><span>Ravens participating faction</span><select data-alta-root-field="ravenFaction">' + altaOptions([["not-recorded", "Choose faction"], ["mercenary", "Mercenary"], ["raven-alliance", "Raven Alliance"]], evaluation.ravenFaction) + '</select></label><label class="campaign-field"><span>Escobar Command Rights</span><select data-alta-root-field="escobarCommandRights">' + altaOptions([["liaison", "Liaison — roll once"], ["house", "House — roll twice"], ["integrated", "Integrated — roll three times"]], evaluation.escobarCommandRights) + '</select></label></div>' +
    trialFields + retreatField +
    '<div class="campaign-state-summary"><strong>Progression</strong><span>' + esc(evaluation.terminationReason) + '</span><span>Available scenarios: ' + esc(evaluation.availableSequences.map(value => value === 4 ? "Retreat" : "Trial " + value).join(" · ")) + '</span><span>Retreat status: ' + esc(evaluation.retreatStatus) + '</span>' + trialSummaries + '</div>' +
    '<div class="campaign-state-summary"><strong>Contract victory check</strong><span class="campaign-contract-outcome">' + esc(altaOutcomeText(evaluation.outcome)) + '</span><span>Meeting Engagements played: ' + evaluation.playedMeetingEngagements + ' · Escobar successful completions: ' + evaluation.escobarSuccessfulTracks + ' / ' + evaluation.escobarRequiredTracks + ' required</span><span>Detained — Ravens: ' + (evaluation.ravensDetained ? "yes" : "no") + ' · Escobar: ' + (evaluation.escobarDetained ? "yes" : "no") + ' · Escobar contract broken: ' + (evaluation.escobarBrokeContract ? "yes" : "no") + '</span></div>' +
    '<div class="campaign-state-summary"><strong>Project rulings</strong>' + ALTA_VISTA_PROVISIONAL_RULES.map(rule => '<span class="campaign-ruling">' + esc(rule) + '</span>').join("") + '<span>' + esc(ALTA_VISTA_MUTUAL_WITHDRAWAL_CLARIFICATION) + '</span></div>' +
    '<div class="reference-citation">Source: ' + esc(definition.sourceRefs.join(" · ")) + '</div></section>';
}

function daharOptions(options, selected, placeholder = null) {
  const leading = placeholder === null ? "" : '<option value="">' + esc(placeholder) + "</option>";
  return leading + options.map(([value, label]) => '<option value="' + esc(String(value)) + '"' + (String(selected ?? "") === String(value) ? " selected" : "") + '>' + esc(label) + "</option>").join("");
}

function daharIndustrialOptions(selected) {
  return daharOptions(DAHAR_INDUSTRIALMECH_TABLE.map(row => [row[0], row[0] + " · " + row[1] + " · " + row[2] + " BV / " + row[3] + " PV"]), selected, "Enter 2D6 result");
}

function daharComplicationControls(side, entry, rights, sequence) {
  const label = side === "garrison" ? "Garrison" : "Raid";
  const resolved = resolveDaharComplications(entry[side].complication, rights);
  const effects = resolved.effects.length ? resolved.effects.map(value => DAHAR_COMMAND_COMPLICATIONS.rows.find(row => row.roll === String(value))?.name || value).join(" + ") : resolved.initial === null || resolved.pendingSecondary ? "Pending" : "No complication";
  const secondary = resolved.initial === 8
    ? '<label class="campaign-field"><span>' + label + ' secondary roll 1</span><select data-dahar-field="secondaryOne" data-dahar-side="' + side + '" data-dahar-sequence="' + sequence + '">' + daharOptions([[1, "1"], [2, "2"], [3, "3"], [4, "4"], [5, "5"], [6, "6"]], entry[side].complication.secondaryOne, "Enter 1D6") + '</select></label><label class="campaign-field"><span>' + label + ' secondary roll 2</span><select data-dahar-field="secondaryTwo" data-dahar-side="' + side + '" data-dahar-sequence="' + sequence + '">' + daharOptions([[1, "1"], [2, "2"], [3, "3"], [4, "4"], [5, "5"], [6, "6"]], entry[side].complication.secondaryTwo, "Enter 1D6") + '</select></label>'
    : "";
  return '<label class="campaign-field"><span>' + label + ' initial complication roll</span><select data-dahar-field="initial" data-dahar-side="' + side + '" data-dahar-sequence="' + sequence + '">' + daharOptions([[1, "1"], [2, "2"], [3, "3"], [4, "4"], [5, "5"], [6, "6"]], entry[side].complication.initial, "Enter 1D6") + '</select></label>' + secondary + '<div class="campaign-field campaign-static-field"><span>' + label + ' effective complication</span><strong>Modifier +' + resolved.modifier + ' · ' + esc(effects) + '</strong></div>';
}

function daharEquipmentControls(side, entry, sequence) {
  const label = side === "garrison" ? "Garrison" : "Raid";
  const sideState = entry[side];
  const repurposed = Array.from({ length: state.scale }, (_, index) => '<label class="campaign-field"><span>' + label + ' Repurposed unit ' + (index + 1) + '</span><select data-dahar-field="repurposed-' + index + '" data-dahar-side="' + side + '" data-dahar-sequence="' + sequence + '">' + daharIndustrialOptions(sideState.repurposedRolls[index]) + '</select></label>').join("");
  const maximum = state.scale * 3;
  const count = sideState.temporaryEligibility === "eligible" ? Math.min(maximum, sideState.temporaryCount) : 0;
  const countOptions = Array.from({ length: maximum + 1 }, (_, value) => [value, String(value)]);
  const temporary = Array.from({ length: count }, (_, index) => '<label class="campaign-field"><span>' + label + ' temporary hire ' + (index + 1) + '</span><select data-dahar-field="temporary-' + index + '" data-dahar-side="' + side + '" data-dahar-sequence="' + sequence + '">' + daharIndustrialOptions(sideState.temporaryRolls[index]) + '</select></label>').join("");
  return repurposed + '<label class="campaign-field"><span>' + label + ' Temporary Hire eligibility</span><select data-dahar-field="temporaryEligibility" data-dahar-side="' + side + '" data-dahar-sequence="' + sequence + '">' + daharOptions([["not-recorded", "Not recorded"], ["eligible", "Eligible — below two-thirds maximum BV/PV"], ["not-eligible", "Not eligible"]], sideState.temporaryEligibility) + '</select></label><label class="campaign-field"><span>' + label + ' temporary hire count</span><select data-dahar-field="temporaryCount" data-dahar-side="' + side + '" data-dahar-sequence="' + sequence + '"' + (sideState.temporaryEligibility !== "eligible" ? " disabled" : "") + '>' + daharOptions(countOptions, count) + '</select></label>' + temporary;
}

function renderDaharMissionState(container) {
  const entry = daharMissionState();
  const resolved = resolvedHotSpotStep();
  const selectedTrack = resolved?.displayName || currentTrack()?.name || "Selected track";
  const rightsFields = ["garrison", "raid"].map(side => '<label class="campaign-field"><span>' + (side === "garrison" ? "Garrison" : "Raid") + ' Command Rights</span><select data-dahar-rights="' + side + '">' + daharOptions([["independent", "Independent +0"], ["liaison", "Liaison +1"], ["house", "House +2"], ["integrated", "Integrated +2"]], entry.commandRights[side]) + '</select></label>').join("");
  const finalized = entry.finalized
    ? '<div class="campaign-state-summary"><strong>Current tactical result</strong><span>Scale ' + entry.scale + ' · Attacker ' + entry.attackerVp + ' VP · Defender ' + entry.defenderVp + ' VP</span><span>' + (entry.successfulSide === "neither" ? "Neither side successfully completed this track." : esc(sideById(entry.successfulSide)?.name || entry.successfulSide) + " successfully completed this track.") + '</span><span>This result is not added to campaign history and does not evaluate overall contract victory.</span></div>'
    : "";

  container.innerHTML = '<section class="campaign-state-card dahar-tactical"><div class="campaign-state-head"><div><div class="panel-kicker">CURRENT MISSION TACTICAL SETUP</div><h3>Dahar IV · ' + esc(selectedTrack) + '</h3></div></div>' +
    '<p class="campaign-state-note">Configure only the currently selected tactical mission. Changing the selected track resets these mission-specific controls; no monthly history or campaign progression is stored.</p>' +
    '<div class="campaign-state-summary"><strong>Contract identifiers and participating forces</strong><span>105112A · Dahar Garrison · employer Duke Romy Sandoval-Dobson (Federated Suns) · participating faction Mercenary</span><span>105112B · Dahar Raid · employer Felix Kurita (Draconis Combine) · participating faction Mercenary</span><span class="campaign-ruling">Mission Brief p. 84 prints 105070A–B. The approved provisional project interpretation uses the individual sidebar identifiers 105112A–B; this is not official errata.</span></div>' +
    '<div class="campaign-fields"><div class="campaign-track-label">Current mission support and complications</div>' + rightsFields +
    daharComplicationControls("garrison", entry, entry.commandRights.garrison, 1) +
    daharComplicationControls("raid", entry, entry.commandRights.raid, 1) +
    daharEquipmentControls("garrison", entry, 1) +
    daharEquipmentControls("raid", entry, 1) +
    '<div class="campaign-field campaign-wide-field campaign-finalize"><span>Current-track successful completion</span><strong>Current adjusted score: Attacker ' + trackScore("attacker") + ' · Defender ' + trackScore("defender") + '</strong><small>A side succeeds only if it completed at least one objective and has more adjusted VP. Equal adjusted VP means neither side succeeds. Finalize only when this tactical track is complete.</small><button type="button" data-dahar-finalize="current">Finalize current tactical score</button></div></div>' + finalized +
    '<div class="campaign-state-summary"><strong>Campaign procedure and victory — reference only</strong><span>The contract lasts three months. At the beginning of each month, roll 1D6 twice: the first roll determines the first track and the second roll determines the second track. Play valid tracks in the order rolled.</span><span class="campaign-ruling"><strong>Each track type may only be played once during the entire contract.</strong> A duplicate produces no track and is not rerolled. The contract therefore contains one to six played tracks, subject to early victory.</span><span>Two consecutive successfully completed played tracks win the contract immediately and cause the opposing player to concede. If neither player achieves early victory, the player with more successfully completed tracks after the third month wins.</span><span>The browser does not roll, store, gate, validate, total, or evaluate this campaign history. Previously played tracks and duplicate results are maintained externally.</span></div>' +
    '<div class="campaign-state-summary"><strong>Approved provisional rules and scope</strong>' + DAHAR_PROVISIONAL_RULES.map(rule => '<span class="campaign-ruling">' + esc(rule) + '</span>').join("") + '<span>Scale 4+ support, Regular Military Command eligibility administration, and strategic compensation, repairs, transportation, purchase, and salvage administration are outside the current tactical browser scope.</span></div>' +
    '<div class="reference-citation">Source: Draconis Reach pp. 82–85 · Successful tracks pp. 26, 29 · Command Rights p. 28 · Battlefield setup p. 30 · Current Draconis Reach master errata</div></section>';
}

function selectedWinner(sequence) {
  return state.winnerSelections[winnerKey(sequence)] || "";
}

function resolvedHotSpotStep() {
  const step = currentHotSpotStep();
  if (!step) return null;
  let outcome = step;
  if (step.requires?.length) {
    const winners = step.requires.map(sequence => selectedWinner(sequence));
    if (winners.some(winner => !winner)) return { step, unresolved: true, winners };
    outcome = step.outcomes[winners.join("|")] || step;
  }
  if (step.results?.length) {
    const selectedResult = state.resultSelections[resultKey(step.sequence)] || step.results[0].id;
    outcome = step.results.find(result => result.id === selectedResult) || step.results[0];
  }
  if (outcome.roleChoice) {
    const selectedInitiator = state.roleSelections[roleKey(step.sequence)] || currentHotSpot().sides[0].id;
    const opposingSide = currentHotSpot().sides.find(side => side.id !== selectedInitiator)?.id || null;
    outcome = outcome.reverseRoles
      ? { ...outcome, attacker: opposingSide, defender: selectedInitiator }
      : { ...outcome, attacker: selectedInitiator, defender: opposingSide };
  }
  return { ...step, ...outcome, unresolved: false };
}

function syncHotSpotState() {
  const hotSpot = currentHotSpot();
  if (hotSpot.fixedScale) state.scale = hotSpot.fixedScale;
  const availableTracks = availableHotSpotTracks(hotSpot);
  if (!availableTracks.some(track => track.sequence === Number(state.trackSequence[hotSpot.id]))) state.trackSequence[hotSpot.id] = availableTracks[0]?.sequence || 1;
  const step = currentHotSpotStep();
  if (!state.selectedSide[hotSpot.id] || !hotSpot.sides.some(side => side.id === state.selectedSide[hotSpot.id])) {
    state.selectedSide[hotSpot.id] = hotSpot.sides[0]?.id || "";
  }
  if (step?.results?.length && !state.resultSelections[resultKey(step.sequence)]) {
    state.resultSelections[resultKey(step.sequence)] = step.results[0].id;
  }
  const resolved = resolvedHotSpotStep();
  state.trackId = resolved?.unresolved ? null : (resolved?.trackId || null);
}

function applyFactionTheme() {
  const selected = sideById(state.selectedSide[currentHotSpot().id]);
  const color = selected?.color || FACTION_COLORS.Local;
  document.documentElement.style.setProperty("--faction-color", color);
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute("content", color);
}

function applies(objective, side) {
  return objective.side === "both" || objective.side === side;
}

function progressKey(trackId, objectiveId, side) {
  return state.hotSpotId + "::" + (state.trackSequence[state.hotSpotId] || "") + "::" + trackId + "::" + objectiveId + "::" + side;
}

function getProgress(objective, side) {
  const key = progressKey(state.trackId, objective.id, side);
  if (state.progress[key] === undefined) state.progress[key] = objective.repeatable ? 0 : false;
  return state.progress[key];
}

function setProgress(objective, side, value) {
  state.progress[progressKey(state.trackId, objective.id, side)] = objective.repeatable ? Math.max(0, Number(value) || 0) : Boolean(value);
}

function getVp(objective, side) {
  const key = progressKey(state.trackId, objective.id, side);
  if (state.vpSelections[key] === undefined) state.vpSelections[key] = objective.vpOptions?.[0] || objective.vp;
  return Number(state.vpSelections[key]);
}

function setVp(objective, side, value) {
  state.vpSelections[progressKey(state.trackId, objective.id, side)] = Number(value);
}

function isReconDeny(objective, side = "defender") {
  return state.trackId === "recon" &&
    objective.id === "deny" &&
    side === "defender";
}

function reconDenyVp() {
  const track = currentTrack();
  if (!track) return 300;
  const variant = resolvedHotSpotStep()?.variant;
  const objectives = variant?.objectives || track.objectives;
  const completedObjectiveIds = RECON_DENY_ATTACKER_OBJECTIVE_IDS.filter(id => {
    const objective = objectives.find(item => item.id === id);
    return objective ? Boolean(getProgress(objective, "attacker")) : false;
  });
  return calculateReconDenyVp(completedObjectiveIds);
}

function daharContractSideForTacticalSide(side) {
  const resolved = resolvedHotSpotStep();
  return side === "attacker" ? resolved?.attacker : resolved?.defender;
}

function daharGibberishApplies(side) {
  if (currentHotSpot().id !== "dahar-iv") return false;
  const entry = daharMissionState();
  const contractSide = daharContractSideForTacticalSide(side);
  if (!contractSide) return false;
  return resolveDaharComplications(entry[contractSide]?.complication, entry.commandRights[contractSide]).effects.includes(7);
}

function objectiveEarnedVp(objective, side, display = objective) {
  if (!applies(objective, side)) return 0;
  const affected = daharGibberishApplies(side);
  if (isReconDeny(objective, side)) return adjustDaharEarnedVp(reconDenyVp(), affected);
  const completed = getProgress(objective, side);
  const earned = objective.repeatable ? Number(completed) * getVp(display, side) : completed ? getVp(display, side) : 0;
  return adjustDaharEarnedVp(earned, affected);
}

function completedObjectiveCount(side) {
  const track = currentTrack();
  if (!track) return 0;
  const variant = resolvedHotSpotStep()?.variant;
  const objectives = variant?.objectives || track.objectives;
  return objectives.filter(objective => {
    if (!applies(objective, side)) return false;
    if (isReconDeny(objective, side)) return reconDenyVp() > 0;
    return objective.repeatable ? Number(getProgress(objective, side)) > 0 : Boolean(getProgress(objective, side));
  }).length;
}

function trackScore(side) {
  const track = currentTrack();
  if (!track) return 0;
  const variant = resolvedHotSpotStep()?.variant;
  const objectives = variant?.objectives || track.objectives;
  return objectives.reduce((total, objective) => {
    const display = displayObjective(objective, variant);
    return total + objectiveEarnedVp(objective, side, display);
  }, 0);
}

function modeLabel() {
  return state.mode === "both" ? "Both sides" : sideNames[state.mode] + " only";
}

function renderControlState() {
  const track = currentTrack();
  const resolved = resolvedHotSpotStep();
  const fixedScale = currentHotSpot().fixedScale;
  $("#derived-track-title").textContent = track ? (resolved?.displayName || track.name) : (resolved?.variant?.displayName || "Track pending");
  Array.from(document.querySelectorAll(".scale-button")).forEach(button => {
    const active = Number(button.dataset.scale) === state.scale;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
    button.disabled = Boolean(fixedScale);
  });
}

function renderGeneratorTable(title, table) {
  if (!table) return "";
  return '<div><span class="panel-kicker">' + esc(title) + '</span><div class="shared-rule-table-wrap"><table class="shared-rule-table"><thead><tr>' + table.headers.map(header => '<th scope="col">' + esc(header) + '</th>').join("") + '</tr></thead><tbody>' + table.rows.map(row => '<tr>' + row.map(cell => '<td>' + esc(cell) + '</td>').join("") + '</tr>').join("") + '</tbody></table></div></div>';
}

function renderGladiatorGenerator(generator) {
  if (!generator) return "";
  const adjustments = generator.classAdjustments.map(row => '<li><strong>' + esc(row[0]) + ':</strong> ' + esc(row[1]) + '</li>').join("");
  const experience = generator.experienceLevels.map(row => '<tr><td>' + esc(row[0]) + '</td><td>' + esc(row[1]) + '</td></tr>').join("");
  return '<article class="opfor-card gladiator-generator"><div class="opfor-card-head"><div><span class="panel-kicker">TAKING ONE FOR THE TEAM</span><h3>Gladiator Generator</h3><p>Use this procedure when a non-player duelist is needed.</p></div></div>' +
    '<p class="campaign-state-note">' + esc(generator.note) + '</p>' +
    '<div class="opfor-force-grid"><div><span>Class adjustments</span><ul>' + adjustments + '</ul></div><div><span>Experience Rating</span><div class="shared-rule-table-wrap"><table class="shared-rule-table"><thead><tr><th scope="col">Adjusted 2D6</th><th scope="col">Experience</th></tr></thead><tbody>' + experience + '</tbody></table></div></div></div>' +
    '<div class="gladiator-tables">' +
      renderGeneratorTable("Gladiator Skills", generator.skillLevels) +
      renderGeneratorTable("Number of Edge Abilities", generator.edgeCounts) +
      renderGeneratorTable("Gladiator Faction", generator.factions) +
      renderGeneratorTable("Gladiator Edge Ability", generator.edgeAbilities) +
    '</div><p class="opfor-rule">After determining the faction, use the matching era/faction Random Assignment Table to determine the ’Mech. Reroll Edge results that are not appropriate for the unit.</p><div class="reference-citation">Source: Draconis Reach p. 131</div></article>';
}

function renderOpFor() {
  const container = $("#opfor-display");
  if (!container) return;
  const hotSpot = currentHotSpot();
  if (hotSpot.opforMode === "source-table") {
    container.innerHTML = "";
    return;
  }
  if (hotSpot.opforMode === "gladiator") {
    if (!state.takingOneForTeam) {
      container.innerHTML = "";
      return;
    }
    container.innerHTML = renderGladiatorGenerator(resolvedHotSpotStep()?.variant?.gladiatorGenerator);
    return;
  }
  if (!state.takingOneForTeam) {
    container.innerHTML = "";
    return;
  }
  const selected = sideById(state.selectedSide[currentHotSpot().id]);
  const table = currentOpForTable();
  const override = currentMissionOpForOverride();
  if (!selected || (!table && !override)) {
    container.innerHTML = '<article class="opfor-card opfor-unavailable"><div class="panel-kicker">TAKING ONE FOR THE TEAM</div><h3>No matching OpFor table</h3><p>The selected side is <strong>' + esc(selected?.faction || "unresolved") + '</strong>. Draconis Reach provides OpFor tables for Mercenary/Pirate, Capellan Confederation, Draconis Combine, Federated Suns, and Raven Alliance forces.</p><p class="opfor-rule">Choose a supported military side if you want the generated opposing force shown here.</p></article>';
    return;
  }
  const scale = currentOpForScale();
  if (override) {
    const forceBody = '<div class="opfor-force-grid"><div><span>Mission force</span><ul>' + forceList(scale?.primary) + '</ul></div><div><span>Mission assets</span><ul>' + forceList(scale?.support) + '</ul></div><div><span>Special notes</span><ul>' + forceList(scale?.note) + '</ul></div></div>';
    container.innerHTML =
      '<article class="opfor-card"><div class="opfor-card-head"><div><span class="panel-kicker">TAKING ONE FOR THE TEAM</span><h3>Mission-specific opposing force</h3><p>' + esc(override.label) + ' · Scale ' + esc(String(state.scale)) + '</p></div><div class="opfor-roll-control"><span>Mission roster</span><strong>Fixed by Force Scale</strong></div></div>' +
      '<div class="opfor-card-meta"><span>Military side: <strong>' + esc(selected.name) + '</strong></span><span>Mission roster: <strong>' + esc(override.label) + '</strong></span><span>Source p. ' + esc(String(scale?.sourcePage || override.sourcePage || "—")) + '</span></div>' +
      '<div class="opfor-result"><div class="opfor-result-label">MISSION FORCE</div><output class="mission-scale-output">Scale ' + esc(String(state.scale)) + '</output><span>No 1D6 table roll is used for this Pascagoula roster.</span></div>' +
      forceBody +
      '<p class="opfor-rule">Use the mission-specific force listed for the selected Force Scale. The generic faction OpFor roll table is not used for this exception.</p>' +
      '<div class="reference-citation">Source: ' + esc(SOURCES.primary) + ' · Pascagoula mission brief p. ' + esc(String(override.sourcePage || "—")) + '</div></article>';
    return;
  }
  const row = currentOpForRow();
  const clanNote = selected.faction === "Clan Sea Fox" ? '<p class="opfor-note">The Draconis Reach OpFor chapter provides a Raven Alliance table for the Clan force at Clan Sea Fox locations.</p>' : "";
  const forceBody = row?.note
    ? '<div class="opfor-instruction"><span>Source instruction for result ' + esc(row.roll) + '</span><strong>' + esc(row.note) + '</strong><small>Follow that source instruction to build the full force.</small></div>'
    : '<div class="opfor-force-grid"><div><span>Primary force</span><ul>' + forceList(row?.primary) + '</ul></div><div><span>Support force</span><ul>' + forceList(row?.support) + '</ul></div><div><span>Alternate force</span><ul>' + forceList(row?.alternate) + '</ul></div></div>';
  container.innerHTML =
    '<article class="opfor-card"><div class="opfor-card-head"><div><span class="panel-kicker">TAKING ONE FOR THE TEAM</span><h3>Generated opposing force</h3><p>' + esc(table.label) + ' · Scale ' + esc(String(state.scale)) + ' · Result ' + esc(row?.roll || "—") + '</p></div><label class="opfor-roll-control" for="opfor-roll"><span>Your 1D6 roll</span><select id="opfor-roll" aria-label="Your 1D6 roll">' + opforRollOptions() + '</select></label></div>' +
    '<div class="opfor-card-meta"><span>Military side: <strong>' + esc(selected.name) + '</strong></span><span>Faction table: <strong>' + esc(table.label) + '</strong></span><span>Source p. ' + esc(String(scale?.sourcePage || "—")) + '</span></div>' +
    '<div class="opfor-result"><div class="opfor-result-label">1D6 result</div><output>' + esc(String(state.opforRoll)) + '</output><span>Choose the result you rolled at the table.</span></div>' +
    clanNote + forceBody +
    '<p class="opfor-rule">Use the Primary Force. Add the Support Force when the required Battlefield Support rules are available; otherwise use the Alternate Force for an all-’Mech force.</p>' +
    '<div class="reference-citation">Source: ' + esc(SOURCES.opposingForces) + '</div></article>';
}

function renderHotSpotSetup() {
  const hotSpot = currentHotSpot();
  const availableTracks = availableHotSpotTracks(hotSpot);
  const step = currentHotSpotStep();
  const resolved = resolvedHotSpotStep();
  const selected = sideById(state.selectedSide[hotSpot.id]);
  $("#hot-spot-select").innerHTML = HOT_SPOTS.map(item => '<option value="' + esc(item.id) + '">' + esc(item.name) + " · " + esc(item.region) + "</option>").join("");
  $("#hot-spot-select").value = hotSpot.id;
  $("#hot-spot-track-label").textContent = hotSpot.trackSelectorLabel || "Track sequence";
  $("#hot-spot-track-select").innerHTML = availableTracks.map(item => '<option value="' + item.sequence + '">' + esc(item.label) + "</option>").join("");
  $("#hot-spot-track-select").value = String(step?.sequence || "");
  $("#hot-spot-side-select").innerHTML = hotSpot.sides.map(side => {
    const displaySide = sideById(side.id) || side;
    return '<option value="' + esc(side.id) + '">' + esc(displaySide.name) + " · " + esc(displaySide.faction) + "</option>";
  }).join("");
  $("#hot-spot-side-select").value = selected?.id || "";

  const winnerControls = [];
  for (const sequence of step?.requires || []) {
    const previousStep = hotSpot.tracks.find(item => item.sequence === sequence);
    winnerControls.push('<div class="control-group"><label for="winner-' + sequence + '">Winner of Track ' + sequence + '</label><select id="winner-' + sequence + '" data-winner-sequence="' + sequence + '"><option value="">Choose the previous winner</option>' + hotSpot.sides.map(side => '<option value="' + esc(side.id) + '"' + (selectedWinner(sequence) === side.id ? " selected" : "") + '>' + esc(side.name) + "</option>").join("") + '</select><span class="control-hint">' + esc(previousStep?.label || "Previous track") + " determines this mission." + "</span></div>");
  }
  if (resolved?.roleChoice) {
    const selectedRole = state.roleSelections[roleKey(step.sequence)] || hotSpot.sides[0]?.id;
    const roleSuffix = step.reverseRoles ? " as strategic attacker (Pursuit Defender)" : " as strategic attacker (tactical Attacker)";
    winnerControls.push('<div class="control-group"><label for="role-choice">' + esc(step.roleChoiceLabel || "Choose the Attacker") + '</label><select id="role-choice" data-role-sequence="' + step.sequence + '">' + hotSpot.sides.map(side => '<option value="' + esc(side.id) + '"' + (selectedRole === side.id ? " selected" : "") + '>' + esc(side.name) + roleSuffix + "</option>").join("") + '</select><span class="control-hint">' + esc(step.roleChoiceHint || "The other side is assigned Defender.") + '</span></div>');
  }
  if (step?.results?.length) {
    const result = state.resultSelections[resultKey(step.sequence)] || step.results[0].id;
    winnerControls.push('<div class="control-group"><label for="source-result">' + esc(step.resultLabel || "Source result") + '</label><select id="source-result" data-result-sequence="' + step.sequence + '">' + step.results.map(option => '<option value="' + esc(option.id) + '"' + (result === option.id ? " selected" : "") + '>' + esc(option.label) + "</option>").join("") + '</select><span class="control-hint">This choice records the source table result for this track.</span></div>');
  }
  for (const roll of resolved?.variant?.sourceRolls || []) {
    const selectedRoll = selectedSourceRoll(step.sequence, roll);
    winnerControls.push('<div class="control-group"><label for="source-roll-' + esc(roll.id) + '">' + esc(roll.label) + '</label><select id="source-roll-' + esc(roll.id) + '" data-source-roll-id="' + esc(roll.id) + '" data-source-roll-sequence="' + esc(String(step.sequence)) + '"><option value="">' + esc(roll.placeholder || "Choose the 1D6 result") + '</option>' + roll.options.map(option => '<option value="' + esc(option.value) + '"' + (selectedRoll === option.value ? " selected" : "") + '>' + esc(option.label) + "</option>").join("") + '</select><span class="control-hint">' + esc(roll.note) + '</span></div>');
  }
  for (const selection of resolved?.variant?.selectionControls || []) {
    const selectedValue = selectedVariantSelection(step.sequence, selection);
    winnerControls.push('<div class="control-group"><label for="variant-selection-' + esc(selection.id) + '">' + esc(selection.label) + '</label><select id="variant-selection-' + esc(selection.id) + '" data-selection-id="' + esc(selection.id) + '" data-selection-sequence="' + esc(String(step.sequence)) + '"><option value="">' + esc(selection.placeholder || "Choose a result") + '</option>' + selection.options.map(option => '<option value="' + esc(option.value) + '"' + (selectedValue === option.value ? " selected" : "") + '>' + esc(option.label) + "</option>").join("") + '</select><span class="control-hint">' + esc(selection.note || "Record the source choice for this track.") + '</span></div>');
  }
  $("#winner-controls").innerHTML = winnerControls.length ? '<div class="winner-controls-grid">' + winnerControls.join("") + "</div>" : "";

  $("#hotspot-summary").innerHTML = '<div class="hotspot-summary-copy"><strong>' + esc(hotSpot.name) + '</strong><span>' + esc(hotSpot.region) + " · " + esc(hotSpot.terrain) + '</span><span>' + esc(step?.label || "Track") + " · " + esc(resolved?.displayName || (resolved?.trackId ? currentTrack()?.name : "Pending") || "Pending") + '</span></div>';
  if (hotSpot.note) $("#hotspot-summary").insertAdjacentHTML("beforeend", '<div class="hotspot-summary-note">' + esc(hotSpot.note) + "</div>");
  const selectedSourceRolls = (resolved?.variant?.sourceRolls || []).filter(roll => selectedSourceRoll(step.sequence, roll));
  if (selectedSourceRolls.length) {
    $("#hotspot-summary").insertAdjacentHTML("beforeend", '<div class="hotspot-summary-note"><strong>Selected source rolls:</strong> ' + esc(selectedSourceRolls.map(roll => roll.label + " — " + sourceRollLabel(step.sequence, roll)).join(" · ")) + "</div>");
  }
  const selectedVariantSelections = (resolved?.variant?.selectionControls || []).filter(selection => selectedVariantSelection(step.sequence, selection));
  if (selectedVariantSelections.length) {
    $("#hotspot-summary").insertAdjacentHTML("beforeend", '<div class="hotspot-summary-note"><strong>Selected setup choices:</strong> ' + esc(selectedVariantSelections.map(selection => selection.label + " — " + variantSelectionLabel(step.sequence, selection)).join(" · ")) + "</div>");
  }
  const sourceTableMode = hotSpot.opforMode === "source-table";
  const sideControl = $("#hot-spot-side-select").closest(".control-group");
  if (sideControl) sideControl.style.display = hotSpot.hideSideSelector ? "none" : "";
  const scaleChoice = $("#scale-choice");
  if (scaleChoice) {
    scaleChoice.style.display = hotSpot.hideScaleSelector ? "none" : "";
    const scaleNote = $("#scale-restriction-note");
    scaleNote.textContent = hotSpot.fixedScaleNote || "";
    scaleNote.hidden = !hotSpot.fixedScaleNote;
  }
  const takingToggle = $("#taking-one-for-team").closest("label");
  takingToggle.style.display = sourceTableMode ? "none" : "";
  if (hotSpot.opforMode === "gladiator") {
    takingToggle.querySelector("strong").textContent = "Use the Gladiator Generator";
    takingToggle.querySelector("small").textContent = "Show the source procedure for creating a non-player duelist.";
  } else {
    takingToggle.querySelector("strong").textContent = "Taking one for the team";
    takingToggle.querySelector("small").textContent = "Show a generated opposing force using the selected military side and Force Scale.";
  }
  $("#taking-one-for-team").checked = state.takingOneForTeam;
  renderOpFor();
}

function renderCampaignState() {
  const container = $("#hotspot-campaign-state");
  if (!container) return;
  const hotSpot = currentHotSpot();
  if (hotSpot.id === "dahar-iv") {
    renderDaharMissionState(container);
    return;
  }
  const definition = campaignDefinition(hotSpot);
  if (!definition) {
    container.innerHTML = "";
    return;
  }
  if (definition.kind === "achernar") {
    renderAchernarCampaignState(container, definition);
    return;
  }
  if (definition.kind === "alta-vista") {
    renderAltaVistaCampaignState(container, definition);
    return;
  }
  const sequence = Number(currentHotSpotStep()?.sequence || 1);
  const values = campaignTrackValues(sequence, hotSpot);
  const totals = campaignBuildingTotals(sequence, hotSpot);
  const priorTotals = campaignBuildingTotals(Math.max(0, sequence - 1), hotSpot);
  const fields = definition.fields.map(field => {
    const value = values[field.id];
    if (field.type === "status") {
      return '<label class="campaign-field"><span>' + esc(field.label) + '</span><select data-campaign-field="' + esc(field.id) + '" data-campaign-sequence="' + sequence + '">' + campaignStatusOptions(value) + '</select></label>';
    }
    return '<label class="campaign-field"><span>' + esc(field.label) + '</span><input type="number" min="' + esc(String(field.min ?? 0)) + '"' + (field.max !== undefined ? ' max="' + esc(String(field.max)) + '"' : '') + ' value="' + esc(String(value ?? field.default ?? 0)) + '" data-campaign-field="' + esc(field.id) + '" data-campaign-sequence="' + sequence + '"></label>';
  }).join("");
  const trackThreeDifference = Math.max(0, priorTotals.isf - priorTotals.stephensons);
  const reputationText = totals.stephensons === totals.isf
    ? "No side has the higher building-damage total."
    : (totals.stephensons > totals.isf ? "Stephensons" : "ISF") + " has the higher building-damage total and takes the source’s −1 Reputation result at contract end.";
  const trackThreeText = sequence >= 3
    ? "Track 3 support check from the totals before Track 3: Stephensons receive " + trackThreeDifference + " Battlefield Support Mechanized Infantry Platoon(s) if the ISF total is higher."
    : "At the beginning of Track 3, compare the running totals through Tracks 1–2; this browser records the values but does not auto-add support units.";
  container.innerHTML = '<section class="campaign-state-card"><div class="campaign-state-head"><div><div class="panel-kicker">CROSS-TRACK PRESERVATION</div><h3>' + esc(definition.title) + '</h3></div><button type="button" class="campaign-reset-button" data-reset-campaign="' + esc(hotSpot.id) + '">Reset campaign state</button></div>' +
    '<p class="campaign-state-note">' + esc(definition.note) + '</p>' +
    '<div class="campaign-fields"><div class="campaign-track-label">Track ' + sequence + ' record</div>' + fields + '</div>' +
    '<div class="campaign-state-summary"><strong>Running building-damage totals through Track ' + sequence + '</strong><span>Stephensons: ' + totals.stephensons + ' · ISF: ' + totals.isf + '</span><span>' + esc(trackThreeText) + '</span><span>' + esc(reputationText) + '</span><span>Campaign victory still requires the source’s Track 3 character-survival conditions; this record does not award victory automatically.</span></div>' +
    '<div class="reference-citation">Source: ' + esc(definition.sourceRefs.join(" · ")) + '</div></section>';
}

function renderSharedRule(rule) {
  const body = rule.table
    ? '<div class="shared-rule-table-wrap"><table class="shared-rule-table"><thead><tr>' +
      rule.table.headers.map(header => '<th scope="col">' + esc(header) + '</th>').join("") +
      '</tr></thead><tbody>' +
      rule.table.rows.map(row => '<tr>' + row.map(cell => '<td>' + esc(cell) + '</td>').join("") + '</tr>').join("") +
      '</tbody></table></div>' +
      (rule.text ? '<p class="shared-rule-note">' + esc(rule.text) + '</p>' : '')
    : '<p>' + esc(rule.text) + '</p>';
  return '<details><summary>' + esc(rule.title) + '<span>' + esc(rule.ref) + '</span></summary>' + body + '</details>';
}

function scaleNotesFor(track, scale) {
  const keyedNotes = track.scaleNotesByScale?.[String(scale)];
  if (keyedNotes?.length) return keyedNotes;
  const notes = track.scaleNotes || [];
  if (scale === 1) return notes.filter(note => !/^\s*At Scale [23]\+/i.test(note));
  return notes;
}

function displayObjective(objective, variant) {
  const override = variant?.objectiveOverrides?.[objective.id];
  return override ? { ...objective, ...override } : objective;
}

function objectiveVpText(display) {
  const vp = display.vpOptions ? display.vpOptions.join(" / ") : display.vp;
  return vp + " VP" + (display.repeatable ? " each" : "");
}

function renderReferenceObjective(objective, variant) {
  const display = displayObjective(objective, variant);
  const side = display.side === "both" ? "Attacker / Defender" : sideNames[display.side];
  return '<li><div class="reference-objective-head"><strong>' + esc(display.name) + '</strong><span class="vp-badge">' + esc(side) + " · " + esc(objectiveVpText(display)) + '</span></div><p>' + esc(display.text) + "</p></li>";
}

function renderReferenceObjectives(objectives, variant) {
  const orders = objectives.filter(objective => objective.name.toLowerCase() === "orders");
  const nonOrders = objectives.filter(objective => objective.name.toLowerCase() !== "orders");
  const orderMarkup = orders.length
    ? '<li class="objective-reference-group"><div class="reference-objective-group-head"><strong>Orders</strong></div><div class="objective-reference-subitems">' + orders.map(objective => {
      const display = displayObjective(objective, variant);
      const side = display.side === "both" ? "Attacker / Defender" : sideNames[display.side];
      return '<div class="reference-objective-subitem"><div class="reference-objective-subhead"><strong>' + esc(side) + '</strong><span class="vp-badge">' + esc(objectiveVpText(display)) + '</span></div><p>' + esc(display.text) + '</p></div>';
    }).join("") + "</div></li>"
    : "";
  return orderMarkup + nonOrders.map(objective => renderReferenceObjective(objective, variant)).join("");
}

function renderCommandComplications(table) {
  if (!table?.rows?.length) return "";
  const rows = table.rows.map(row =>
    '<tr><th scope="row"><span class="complication-roll">' + esc(row.roll) + '</span><strong>' + esc(row.name) + '</strong></th><td>' + esc(row.text) + '</td></tr>'
  ).join("");
  return '<div class="reference-section command-complications-section"><div class="panel-kicker">COMMAND COMPLICATIONS</div><p class="reference-copy">' + esc(table.note) + '</p><div class="shared-rule-table-wrap"><table class="shared-rule-table command-complications-table"><thead><tr><th scope="col">1D6</th><th scope="col">Complication and effect</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="reference-citation">Source: ' + esc(table.ref) + '</div></div>';
}

function renderReference() {
  const track = currentTrack();
  const hotSpot = currentHotSpot();
  const step = currentHotSpotStep();
  const resolved = resolvedHotSpotStep();
  if (!track) {
    if (resolved?.variant?.nonPlayable) {
      const variant = resolved.variant;
      const restrictions = (variant.setupDetails || []).map(item => "<li>" + esc(item) + "</li>").join("");
      const notes = (variant.special || []).map(item => "<li>" + esc(item) + "</li>").join("");
      const sourceReferenceText = variant.sourceRefs?.join(" · ") || hotSpot.source;
      $("#mission-reference").innerHTML = '<article class="panel mission-card"><div class="mission-card-head"><div class="eyebrow">NON-PLAYABLE STRATEGIC HEX</div><h2>' + esc(variant.displayName) + '</h2><p>' + esc(variant.summary) + '</p></div><div class="reference-section hot-spot-reference"><div class="panel-kicker">LOCATION & RESTRICTION</div><div class="brief-grid"><div><span>Location</span><strong>' + esc(hotSpot.name) + '</strong><small>' + esc(hotSpot.region + " · " + hotSpot.terrain) + '</small></div><div><span>Strategic hex type</span><strong>' + esc(step?.label || variant.displayName) + '</strong><small>No tactical track is generated</small></div></div></div><div class="reference-section"><div class="panel-kicker">SOURCE RESTRICTION</div><ul class="rule-list">' + restrictions + '</ul></div><div class="reference-section"><div class="panel-kicker">REFERENCE NOTES</div><ul class="rule-list">' + notes + '</ul></div><div class="reference-citation">Sources: ' + esc(sourceReferenceText) + '</div></article>';
      return;
    }
    const pendingText = resolved?.unresolved ? "Choose the previous track winner to resolve this mission." : "The selected source result does not produce a standard tactical track.";
    $("#mission-reference").innerHTML = '<article class="panel mission-card"><div class="mission-card-head"><div class="eyebrow">HOT SPOT LOCATION · ' + esc(hotSpot.name) + '</div><h2>Track pending</h2><p>' + esc(pendingText) + '</p></div><div class="reference-section"><div class="panel-kicker">LOCATION & SEQUENCE</div><ul class="rule-list"><li>' + esc(hotSpot.name + " · " + hotSpot.region + " · " + hotSpot.terrain) + '</li><li>' + esc(step?.label || "Track") + " · " + esc(hotSpot.source) + '</li></ul></div><div class="reference-section"><div class="panel-kicker">SOURCE NOTE</div><p class="reference-copy">' + esc(hotSpot.note || "Resolve the Hot Spot setup controls above before opening the standard mission reference.") + '</p></div></article>';
    return;
  }
  const referenceTrack = resolved?.variant ? { ...track, ...resolved.variant } : track;
  const pageReference = referenceTrack.pageRef || "p. " + referenceTrack.page;
  const scaleNotes = scaleNotesFor(referenceTrack, state.scale);
  const scaleNotesMarkup = scaleNotes.length
    ? scaleNotes.map(note => "<li>" + esc(note) + "</li>").join("")
    : "<li>No additional Scale-dependent exception is recorded for this track.</li>";
  const setup = referenceTrack.setup.map(item => "<li>" + esc(item) + "</li>").join("");
  const setupDetails = (referenceTrack.setupDetails || []).map(item => "<li>" + esc(item) + "</li>").join("");
  const objectives = renderReferenceObjectives(referenceTrack.objectives, referenceTrack);
  const special = referenceTrack.special.map(item => "<li>" + esc(item) + "</li>").join("");
  const commandComplications = renderCommandComplications(referenceTrack.commandComplications);
  const referenceTables = (referenceTrack.referenceTables || []).map(table => '<div class="reference-section"><div class="panel-kicker">' + esc(table.title) + '</div>' + renderGeneratorTable("", table) + '</div>').join("");
  const sourceReferenceText = referenceTrack.sourceRefs?.join(" · ") || SOURCES.primary + " · selected track " + pageReference;
  const scaleSection = hotSpot.hideScaleSelector ? "" : '<div class="reference-section scale-section"><div class="panel-kicker">SCALE ' + esc(String(state.scale)) + ' VIEW</div><ul class="rule-list">' + scaleNotesMarkup + "</ul></div>";

  const attackerSide = sideById(resolved?.attacker);
  const defenderSide = sideById(resolved?.defender);
  const hotSpotBrief = '<div class="reference-section hot-spot-reference"><div class="panel-kicker">HOT SPOT MISSION BRIEF</div><div class="brief-grid"><div><span>Location</span><strong>' + esc(hotSpot.name) + '</strong><small>' + esc(hotSpot.region + " · " + hotSpot.terrain) + '</small></div><div><span>Sequence</span><strong>' + esc(step?.label || "Track") + '</strong><small>' + esc(referenceTrack.displayName || resolved?.displayName || track.name) + (referenceTrack.type ? " · " + esc(referenceTrack.type) : "") + '</small></div><div style="--side-color:' + esc(attackerSide?.color || FACTION_COLORS.Local) + '"><span>Attacker</span><strong>' + esc(attackerSide?.name || "Attacker") + '</strong><small>' + esc(attackerSide?.faction || "Source-defined role") + '</small></div><div style="--side-color:' + esc(defenderSide?.color || FACTION_COLORS.Local) + '"><span>Defender</span><strong>' + esc(defenderSide?.name || "Defender") + '</strong><small>' + esc(defenderSide?.faction || "Source-defined role") + '</small></div></div>' + (hotSpot.note ? '<p class="reference-note">' + esc(hotSpot.note) + '</p>' : '') + '</div>';

  $("#mission-reference").innerHTML =
    '<article class="panel mission-card">' +
      '<div class="mission-card-head"><div class="eyebrow">SELECTED TRACK · ' + pageReference + (referenceTrack.type ? " · " + esc(referenceTrack.type) : "") + '</div><h2>' + esc(referenceTrack.displayName || resolved?.displayName || track.name) + '</h2><p>' + esc(referenceTrack.summary) + '</p></div>' +
      hotSpotBrief +
      '<div class="reference-section"><div class="panel-kicker">BATTLEFIELD & SETUP</div><ul class="rule-list">' + setup + "</ul></div>" +
      (setupDetails ? '<div class="reference-section"><div class="panel-kicker">DEPLOYMENT DETAILS</div><ul class="rule-list">' + setupDetails + "</ul></div>" : "") +
      scaleSection +
      '<div class="reference-section"><div class="panel-kicker">OBJECTIVES & VICTORY POINTS</div><ul class="objective-reference-list">' + objectives + "</ul></div>" +
      '<div class="reference-section"><div class="panel-kicker">SPECIAL RULES, TRACK END & SALVAGE</div><ul class="rule-list">' + special + "</ul></div>" +
      referenceTables +
      commandComplications +
      '<div class="reference-citation">Sources: ' + esc(sourceReferenceText) + '</div>' +
    "</article>" +
    '<article class="panel general-card"><div class="panel-heading"><div><span class="panel-kicker">SHARED RULES</span><h3>Track reference p. 167</h3></div></div>' +
      GENERAL_RULES.map(renderSharedRule).join("") +
    "</article>";
}

function objectiveControl(objective, side, display = objective) {
  if (!applies(objective, side)) return '<span class="not-applicable" aria-label="Not applicable">—</span>';
  if (isReconDeny(objective, side)) {
    return '<div class="calculated-vp" aria-label="Projected Deny Victory Points"><strong>Projected: ' + objectiveEarnedVp(objective, side, display) + ' VP</strong><span>' + (daharGibberishApplies(side) ? "Complication 7 adjusted" : "Read-only projection") + '</span></div>';
  }
  const progress = getProgress(objective, side);
  const vpControl = objective.vpOptions
    ? '<select class="vp-select" aria-label="Victory Point value" data-vp-objective="' + esc(objective.id) + '" data-vp-side="' + side + '">' +
      display.vpOptions.map(value => '<option value="' + value + '"' + (getVp(display, side) === value ? " selected" : "") + ">" + value + " VP</option>").join("") +
      "</select>"
    : '<span class="vp-badge">' + display.vp + " VP" + (display.repeatable ? " each" : "") + "</span>";
  const adjusted = daharGibberishApplies(side) ? '<span class="adjusted-vp">Earned after Complication 7: ' + objectiveEarnedVp(objective, side, display) + ' VP</span>' : "";
  if (objective.repeatable) {
    return '<div class="counter-control"><button type="button" class="counter-button" data-action="decrement" data-objective="' + esc(objective.id) + '" data-side="' + side + '" aria-label="Decrease ' + esc(display.name) + '">−</button>' +
      '<output>' + progress + '</output><button type="button" class="counter-button" data-action="increment" data-objective="' + esc(objective.id) + '" data-side="' + side + '" aria-label="Increase ' + esc(display.name) + '">+</button>' +
      '<span class="counter-label">completed</span></div>' + vpControl + adjusted;
  }
  return '<label class="check-control"><input type="checkbox" data-action="toggle" data-objective="' + esc(objective.id) + '" data-side="' + side + '"' + (progress ? " checked" : "") + '><span class="checkmark"></span><span class="control-copy">' + (progress ? "Complete" : "Open") + "</span></label>" + vpControl + adjusted;
}

function renderTracker() {
  const track = currentTrack();
  const resolved = resolvedHotSpotStep();
  const variant = resolved?.variant;
  const objectives = variant?.objectives || track?.objectives || [];
  const attackerSide = sideById(resolved?.attacker);
  const defenderSide = sideById(resolved?.defender);
  $("#tracker-source").textContent = track ? (variant?.sourceRefs?.join(" · ") || "Draconis Reach " + (track.pageRef || "p. " + track.page)) : currentHotSpot().source;
  $("#attacker-heading").innerHTML = '<span>Attacker</span><strong>' + esc(attackerSide?.name || "—") + '</strong>';
  $("#defender-heading").innerHTML = '<span>Defender</span><strong>' + esc(defenderSide?.name || "—") + '</strong>';
  $("#attacker-heading").style.setProperty("--side-color", attackerSide?.color || FACTION_COLORS.Local);
  $("#defender-heading").style.setProperty("--side-color", defenderSide?.color || FACTION_COLORS.Local);
  $("#attacker-side-label").textContent = (attackerSide?.name || "Attacker") + " VP";
  $("#defender-side-label").textContent = (defenderSide?.name || "Defender") + " VP";
  $("#attacker-side-label").style.color = attackerSide?.color || FACTION_COLORS.Local;
  $("#defender-side-label").style.color = defenderSide?.color || FACTION_COLORS.Local;
  $("#attacker-bar").style.background = attackerSide?.color || FACTION_COLORS.Local;
  $("#defender-bar").style.background = defenderSide?.color || FACTION_COLORS.Local;
  document.body.dataset.mode = state.mode;
  $$(".mode-button").forEach(button => button.classList.toggle("active", button.dataset.mode === state.mode));
  $("#objective-body").innerHTML = track ? objectives.map(objective => {
    const display = displayObjective(objective, variant);
    const calculatedDeny = isReconDeny(objective);
    const objectiveText = display.text;
    const denyVp = calculatedDeny ? objectiveEarnedVp(objective, "defender", display) : 0;
    const vpLabel = calculatedDeny ? "Projected: " + denyVp + " VP" : (display.vpOptions ? display.vpOptions.join(" / ") + " VP (select value)" : display.vp + " VP" + (display.repeatable ? " each" : ""));
    const projectionNote = calculatedDeny ? '<div class="calculated-vp-note">Projected Deny VP follows the printed Deny schedule as the Attacker completes objectives. Remaining Deny points are awarded at the end of Turn 8.' + (daharGibberishApplies("defender") ? " Dahar Complication 7 deducts 20 VP once from the earned Deny objective." : "") + '</div>' : "";
    return '<tr><th scope="row"><div class="objective-title">' + esc(display.name) + '</div><div class="objective-rule">' + esc(objectiveText) + '</div><div class="objective-vp">' + vpLabel + "</div>" + projectionNote + "</th>" +
      '<td class="attacker-col">' + objectiveControl(objective, "attacker", display) + "</td>" +
      '<td class="defender-col">' + objectiveControl(objective, "defender", display) + "</td></tr>";
  }).join("") :
    '<tr><th scope="row" colspan="3" class="pending-track">' + esc(resolved?.variant?.nonPlayable ? "This strategic hex cannot be entered and has no tactical objectives." : "Resolve the Hot Spot controls above to load the standard mission objectives.") + '</th></tr>';
  renderScore();
}

function renderScore() {
  const attacker = trackScore("attacker");
  const defender = trackScore("defender");
  const max = Math.max(attacker, defender, 1);
  $("#attacker-score").textContent = attacker.toLocaleString("en-US");
  $("#defender-score").textContent = defender.toLocaleString("en-US");
  $("#attacker-bar").style.width = (attacker / max * 100) + "%";
  $("#defender-bar").style.width = (defender / max * 100) + "%";
  $("#score-difference").textContent = attacker === defender ? "Tie" : (attacker > defender ? "Attacker leads by " + (attacker - defender) : "Defender leads by " + (defender - attacker));
  $("#score-difference").className = "difference " + (attacker === defender ? "tie" : attacker > defender ? "attacker-lead" : "defender-lead");
}

function renderAll() {
  syncHotSpotState();
  applyFactionTheme();
  renderHotSpotSetup();
  renderCampaignState();
  renderControlState();
  renderReference();
  renderTracker();
}

function resetTrack() {
  if (currentHotSpot().id === "dahar-iv") state.daharMission = newDaharMissionState();
  const prefix = state.hotSpotId + "::";
  Object.keys(state.progress).filter(key => key.startsWith(prefix)).forEach(key => delete state.progress[key]);
  Object.keys(state.vpSelections).filter(key => key.startsWith(prefix)).forEach(key => delete state.vpSelections[key]);
  Object.keys(state.sourceRollSelections).filter(key => key.startsWith(prefix)).forEach(key => delete state.sourceRollSelections[key]);
  Object.keys(state.selectionValues).filter(key => key.startsWith(prefix)).forEach(key => delete state.selectionValues[key]);
  renderAll();
}

$("#hot-spot-select").addEventListener("change", event => {
  state.hotSpotId = event.target.value;
  state.trackId = null;
  renderAll();
});

$("#hot-spot-track-select").addEventListener("change", event => {
  state.trackSequence[state.hotSpotId] = Number(event.target.value);
  state.trackId = null;
  renderAll();
});

$("#hot-spot-side-select").addEventListener("change", event => {
  state.selectedSide[state.hotSpotId] = event.target.value;
  renderAll();
});

function updateAchernarCampaignField(target) {
  const achernarField = target.dataset.achernarField;
  if (!achernarField) return false;
  const record = achernarCampaignRecord();
  record[achernarField] = target.type === "number"
    ? (target.value === "" ? null : Number(target.value))
    : target.value;
  const normalized = normalizeAchernarCampaignState(record, state.scale);
  Object.assign(record, {
    survivorsAfterTrack3: normalized.survivorsAfterTrack3,
    survivorsAfterTrack4: normalized.survivorsAfterTrack4,
    finalSurvivors: normalized.finalSurvivors,
    strikeWinner: normalized.strikeWinner,
    retreatWinner: normalized.retreatWinner,
    qualifyingSupportDestroyed: normalized.qualifyingSupportDestroyed
  });
  return true;
}

function updateAltaVistaCampaignField(target) {
  const rootField = target.dataset.altaRootField;
  const trialField = target.dataset.altaTrialField;
  if (!rootField && !trialField) return false;
  const record = altaVistaCampaignRecord();
  if (rootField) {
    record[rootField] = target.value;
  } else {
    const trialIndex = Number(target.dataset.altaTrialIndex);
    if (!record.trials[trialIndex]) return false;
    record.trials[trialIndex][trialField] = trialField === "played" ? target.value === "true" : target.value;
    if (trialField === "escobarHire" && target.value !== "none" && record.trials[trialIndex].ravensHire === target.value) record.trials[trialIndex].ravensHire = "none";
    if (trialField === "ravensHire" && target.value !== "none" && record.trials[trialIndex].escobarHire === target.value) record.trials[trialIndex].escobarHire = "none";
  }
  state.campaignState["alta-vista"].record = normalizeAltaVistaCampaignState(record);
  return true;
}

function clearDaharObjectiveState() {
  const prefix = "dahar-iv::";
  for (const collection of [state.progress, state.vpSelections, state.sourceRollSelections, state.selectionValues]) {
    for (const key of Object.keys(collection)) {
      if (key.startsWith(prefix)) delete collection[key];
    }
  }
}

function updateDaharMissionField(target) {
  if (currentHotSpot().id !== "dahar-iv") return false;
  const entry = daharMissionState();
  if (target.dataset.daharRights) {
    entry.commandRights[target.dataset.daharRights] = target.value;
    entry.finalized = false;
    return true;
  }
  const field = target.dataset.daharField;
  const side = target.dataset.daharSide;
  if (!field || !side) return false;
  const sideState = entry[side];
  if (["initial", "secondaryOne", "secondaryTwo"].includes(field)) sideState.complication[field] = target.value === "" ? null : Number(target.value);
  if (field === "temporaryEligibility") {
    sideState.temporaryEligibility = target.value;
    if (target.value !== "eligible") sideState.temporaryCount = 0;
  }
  if (field === "temporaryCount") sideState.temporaryCount = Math.min(state.scale * 3, Math.max(0, Number(target.value) || 0));
  if (field.startsWith("repurposed-")) sideState.repurposedRolls[Number(field.split("-")[1])] = target.value === "" ? null : Number(target.value);
  if (field.startsWith("temporary-")) sideState.temporaryRolls[Number(field.split("-")[1])] = target.value === "" ? null : Number(target.value);
  entry.finalized = false;
  return true;
}

$("#hotspot-campaign-state").addEventListener("input", event => {
  if (updateAchernarCampaignField(event.target)) return;
  updateAltaVistaCampaignField(event.target);
});

$("#hotspot-campaign-state").addEventListener("change", event => {
  if (updateAchernarCampaignField(event.target)) {
    renderCampaignState();
    return;
  }
  if (updateAltaVistaCampaignField(event.target)) {
    renderAll();
    return;
  }
  if (updateDaharMissionField(event.target)) {
    renderAll();
    return;
  }
  const field = event.target.dataset.campaignField;
  const sequence = event.target.dataset.campaignSequence;
  if (!field || !sequence) return;
  const values = campaignTrackValues(sequence);
  const definition = campaignDefinition();
  const fieldDefinition = definition?.fields.find(item => item.id === field);
  if (!fieldDefinition) return;
  values[field] = fieldDefinition.type === "number" ? Math.max(fieldDefinition.min ?? 0, Number(event.target.value) || 0) : event.target.value;
  renderCampaignState();
});

$("#hotspot-campaign-state").addEventListener("click", event => {
  const finalize = event.target.closest("[data-dahar-finalize]");
  if (finalize) {
    const entry = daharMissionState();
    for (const side of ["garrison", "raid"]) {
      const complication = resolveDaharComplications(entry[side].complication, entry.commandRights[side]);
      if (complication.initial === null || complication.pendingSecondary) {
        window.alert("Record complete Command Complication rolls for both players before finalizing this track.");
        return;
      }
    }
    const attackerVp = trackScore("attacker");
    const defenderVp = trackScore("defender");
    const attackerSucceeded = completedObjectiveCount("attacker") > 0 && attackerVp > defenderVp;
    const defenderSucceeded = completedObjectiveCount("defender") > 0 && defenderVp > attackerVp;
    entry.finalized = true;
    entry.scale = state.scale;
    entry.attackerVp = attackerVp;
    entry.defenderVp = defenderVp;
    const resolved = resolvedHotSpotStep();
    entry.successfulSide = attackerSucceeded ? resolved.attacker : defenderSucceeded ? resolved.defender : "neither";
    renderAll();
    return;
  }
  const button = event.target.closest("[data-reset-campaign]");
  if (!button) return;
  const hotSpot = currentHotSpot();
  if (!window.confirm("Reset all cross-track campaign state for " + hotSpot.name + "?")) return;
  delete state.campaignState[button.dataset.resetCampaign];
  renderAll();
});

$("#taking-one-for-team").addEventListener("change", event => {
  state.takingOneForTeam = event.target.checked;
  renderAll();
});

$("#opfor-display").addEventListener("change", event => {
  if (event.target.id !== "opfor-roll") return;
  state.opforRoll = Number(event.target.value);
  renderOpFor();
});

$("#winner-controls").addEventListener("change", event => {
  if (event.target.dataset.winnerSequence) state.winnerSelections[winnerKey(event.target.dataset.winnerSequence)] = event.target.value;
  if (event.target.dataset.resultSequence) {
    state.resultSelections[resultKey(event.target.dataset.resultSequence)] = event.target.value;
    if (currentHotSpot().id === "dahar-iv") {
      state.daharMission = newDaharMissionState();
      clearDaharObjectiveState();
    }
  }
  if (event.target.dataset.sourceRollId) state.sourceRollSelections[sourceRollKey(event.target.dataset.sourceRollSequence, event.target.dataset.sourceRollId)] = event.target.value;
  if (event.target.dataset.selectionId) state.selectionValues[variantSelectionKey(event.target.dataset.selectionSequence, { id: event.target.dataset.selectionId })] = event.target.value;
  if (event.target.dataset.roleSequence) state.roleSelections[roleKey(event.target.dataset.roleSequence)] = event.target.value;
  renderAll();
});

$("#scale-select").addEventListener("click", event => {
  const button = event.target.closest(".scale-button");
  if (!button || currentHotSpot().fixedScale) return;
  state.scale = Number(button.dataset.scale);
  if (currentHotSpot().id === "dahar-iv") {
    const mission = daharMissionState();
    mission.finalized = false;
    for (const side of ["garrison", "raid"]) mission[side].temporaryCount = Math.min(mission[side].temporaryCount, state.scale * 3);
  }
  renderCampaignState();
  renderControlState();
  renderReference();
  renderOpFor();
});

$$(".mode-button").forEach(button => button.addEventListener("click", () => {
  state.mode = button.dataset.mode;
  renderTracker();
}));

$("#reset-button").addEventListener("click", () => {
  if (window.confirm("Reset all objective progress for " + (currentTrack()?.name || "this Hot Spot sequence") + "?")) resetTrack();
});

$("#objective-body").addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button || button.dataset.action === "toggle") return;
  const objective = currentTrack()?.objectives.find(item => item.id === button.dataset.objective);
  if (!objective) return;
  const side = button.dataset.side;
  const current = Number(getProgress(objective, side));
  setProgress(objective, side, current + (button.dataset.action === "increment" ? 1 : -1));
  if (currentHotSpot().id === "dahar-iv") daharMissionState().finalized = false;
  renderTracker();
  if (currentHotSpot().id === "dahar-iv") renderCampaignState();
});

$("#objective-body").addEventListener("change", event => {
  const input = event.target;
  const objective = currentTrack()?.objectives.find(item => item.id === input.dataset.objective);
  if (!objective) return;
  const side = input.dataset.side || input.dataset.vpSide;
  if (input.dataset.action === "toggle") setProgress(objective, side, input.checked);
  if (input.dataset.vpObjective) setVp(objective, input.dataset.vpSide, input.value);
  if (currentHotSpot().id === "dahar-iv") daharMissionState().finalized = false;
  renderTracker();
  if (currentHotSpot().id === "dahar-iv") renderCampaignState();
});

renderAll();


