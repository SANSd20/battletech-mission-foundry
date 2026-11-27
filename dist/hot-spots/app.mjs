import { ACT_OF_PIRACY_SYSTEMS, adjustDaharEarnedVp, ALTA_VISTA_MUTUAL_WITHDRAWAL_CLARIFICATION, ALTA_VISTA_PROVISIONAL_RULES, calculateAchernarVictory, calculateReconDenyVp, DAHAR_COMMAND_COMPLICATIONS, DAHAR_INDUSTRIALMECH_TABLE, DAHAR_PROVISIONAL_RULES, evaluateAltaVistaCampaign, evaluateProtectionPursuit, evaluateXhosaTruckOutcome, FACTION_COLORS, GENERAL_RULES, groupComplicationEffectEntries, HOT_SPOTS, LE_BLANC_COMMAND_COMPLICATIONS, LE_BLANC_PARTISAN_PACKAGES, LE_BLANC_PROVISIONAL_RULES, LUCERNE_COMMAND_COMPLICATIONS, LUCERNE_PROVISIONAL_RULES, MISSION_OPFOR_OVERRIDES, NEW_IVAARSEN_CHARACTERS, NEW_IVAARSEN_RYUKEN_SUPPORT, normalizeAchernarCampaignState, normalizeAltaVistaCampaignState, OPPOSING_FORCE_TABLES, PASCAGOULA_PROVISIONAL_RULES, PLAYER_VISIBLE_HOT_SPOT_IDS, protectionPartisanSupport, RECON_DENY_ATTACKER_OBJECTIVE_IDS, resolveActOfPiracyScenario, resolveDaharComplications, resolveLeBlancComplications, resolveLucerneComplications, SOURCES, SPECIAL_TRACKS, TRACKS } from "./data.mjs?v=acts-of-piracy-supplemental";

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
  opforForceTypes: {},
  progress: {},
  vpSelections: {},
  campaignState: {},
  complicationSelections: {},
  tacticalInputs: {},
  tigressPhase: "training",
  daharMission: null,
  leBlancMission: null,
  lucerneMission: null
};

function emptyLucerneComplication() {
  return { initial: null, secondaryOne: null, secondaryTwo: null, replacementOne: [], replacementTwo: [] };
}

function newLucerneMissionState() {
  return {
    commandRights: { "bio-gen": "integrated", eclipse: "independent" },
    complications: { "bio-gen": emptyLucerneComplication(), eclipse: emptyLucerneComplication() },
    missionKey: null
  };
}

function lucerneMissionState() {
  if (!state.lucerneMission) state.lucerneMission = newLucerneMissionState();
  return state.lucerneMission;
}

function clearLucerneComplications() {
  if (!state.lucerneMission) return;
  state.lucerneMission.complications = { "bio-gen": emptyLucerneComplication(), eclipse: emptyLucerneComplication() };
}

function newLeBlancMissionState() {
  return {
    participatingFactions: { "draconis-combine": "Draconis Combine", "federated-suns": "Federated Suns" },
    commandRights: { "draconis-combine": "liaison", "federated-suns": "integrated" },
    complications: {
      "draconis-combine": { initial: null, secondaryOne: null, secondaryTwo: null },
      "federated-suns": { initial: null, secondaryOne: null, secondaryTwo: null }
    },
    missionKey: null
  };
}

function leBlancMissionState() {
  if (!state.leBlancMission) state.leBlancMission = newLeBlancMissionState();
  return state.leBlancMission;
}

function clearLeBlancComplications() {
  if (!state.leBlancMission) return;
  state.leBlancMission.complications = {
    "draconis-combine": { initial: null, secondaryOne: null, secondaryTwo: null },
    "federated-suns": { initial: null, secondaryOne: null, secondaryTwo: null }
  };
}

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
  return VISIBLE_HOT_SPOTS.find(hotSpot => hotSpot.id === state.hotSpotId) || VISIBLE_HOT_SPOTS[0];
}

const approvedHotSpotIds = new Set(PLAYER_VISIBLE_HOT_SPOT_IDS);
const VISIBLE_HOT_SPOTS = HOT_SPOTS.filter(hotSpot => approvedHotSpotIds.has(hotSpot.id));
const interactiveComplicationContracts = new Set(["achernar", "alta-vista", "dahar-iv", "le-blanc", "lucerne", "melcher", "new-ivaarsen", "pascagoula", "protection", "sun-prairie", "tigress", "xhosa-vii", "act-of-piracy"]);

function complicationRowKey(row, index) {
  return "effect-" + index + "-" + row.roll;
}

function isNoComplicationRow(row) {
  return /no complication/i.test(row.name);
}

function isRollTwiceRow(row) {
  return /roll twice/i.test(row.name);
}

function complicationRowAppliesToSide(row, sideId) {
  return !row.sides?.length || row.sides.includes(sideId);
}

function currentComplicationTable() {
  return resolvedHotSpotStep()?.variant?.commandComplications || null;
}

function currentComplicationProfile(table = currentComplicationTable()) {
  const hotSpot = currentHotSpot();
  if (!table?.rows?.length || !interactiveComplicationContracts.has(hotSpot.id)) return null;
  if (hotSpot.id === "alta-vista" && state.trackId === "retreat") return null;
  if (hotSpot.id === "lucerne" && state.trackId === "bio-gen-raid") return null;
  const participants = table.sharedSingle
    ? [{ id: "shared", name: "Shared track", faction: "Local", color: FACTION_COLORS.Local }]
    : hotSpot.id === "alta-vista"
    ? hotSpot.sides.filter(side => side.id === "escobar")
    : hotSpot.sides;
  return { hotSpot, table, participants };
}

function complicationSelectionKey() {
  const step = currentHotSpotStep();
  const branch = state.hotSpotId === "pascagoula" && Number(step?.sequence) === 2 ? selectedWinner(1) || "unresolved" : null;
  const trackKey = state.hotSpotId === "tigress" && Number(step?.sequence) === 1 ? "hybrid-track" : state.trackId || "pending";
  return [state.hotSpotId, step?.sequence || 1, trackKey, branch].filter(value => value !== null).join("::");
}

function complicationSelectionState(table = currentComplicationTable()) {
  const profile = currentComplicationProfile(table);
  if (!profile) return null;
  const key = complicationSelectionKey();
  if (!state.complicationSelections[key]) {
    const draft = Object.fromEntries(profile.participants.map(side => {
      const noComplicationIndex = profile.table.rows.findIndex(row => isNoComplicationRow(row) && complicationRowAppliesToSide(row, side.id));
      const defaultKey = noComplicationIndex >= 0 ? complicationRowKey(profile.table.rows[noComplicationIndex], noComplicationIndex) : null;
      return [side.id, defaultKey ? [defaultKey] : []];
    }));
    state.complicationSelections[key] = { expanded: true, appliedOnce: false, draft, applied: Object.fromEntries(profile.participants.map(side => [side.id, []])) };
  }
  return state.complicationSelections[key];
}

function clearComplicationSelections(hotSpotId) {
  for (const key of Object.keys(state.complicationSelections)) {
    if (key.startsWith(hotSpotId + "::")) delete state.complicationSelections[key];
  }
}

function appliedComplicationRows(forceId, table = currentComplicationTable()) {
  const selection = complicationSelectionState(table);
  if (!selection?.appliedOnce) return [];
  const keys = new Set(selection.applied[forceId] || []);
  return table.rows.filter((row, index) => keys.has(complicationRowKey(row, index)));
}

function appliedComplicationNamed(forceId, name, table = currentComplicationTable()) {
  return appliedComplicationRows(forceId, table).some(row => row.name === name);
}

function renderProvisionalRules(rules) {
  return rules.map(rule => '<span class="provisional-rule" role="note"><span class="sr-only">Provisional interpretation: </span>' + esc(rule) + '</span>').join("");
}

function currentHotSpotStep() {
  const hotSpot = currentHotSpot();
  const tracks = availableHotSpotTracks(hotSpot);
  const sequence = Number(state.trackSequence[hotSpot.id] || tracks[0]?.sequence || 1);
  return tracks.find(track => track.sequence === sequence) || tracks[0] || null;
}

function availableHotSpotTracks(hotSpot = currentHotSpot()) {
  return hotSpot.tracks;
}

function selectionKey(sequence) {
  return state.hotSpotId + "::" + sequence;
}

function sideById(sideId) {
  const hotSpot = currentHotSpot();
  const side = hotSpot.sides.find(item => item.id === sideId) || null;
  return side;
}

const simplifiedContracts = new Set(["achernar", "alta-vista", "dahar-iv", "le-blanc", "lucerne", "melcher", "new-ivaarsen", "pascagoula", "protection", "sun-prairie", "tigress", "xhosa-vii", "act-of-piracy"]);

function generatedOpForConfiguration() {
  const hotSpot = currentHotSpot();
  const selected = sideById(state.selectedSide[hotSpot.id]);
  if (hotSpot.id === "act-of-piracy") {
    const scenario = actOfPiracyScenario();
    return {
      side: scenario.militiaRequired ? { id: "law-militia", name: "Law-controlled local militia", faction: scenario.militiaFaction } : null,
      faction: scenario.militiaFaction,
      choices: []
    };
  }
  if (!simplifiedContracts.has(hotSpot.id)) return { side: selected, faction: selected?.faction, choices: [] };
  const opposing = hotSpot.sides.find(side => side.id !== selected?.id) || null;
  let choices = [];
  let faction = opposing?.faction;
  if (["le-blanc", "xhosa-vii"].includes(hotSpot.id)) {
    choices = [{ value: "house", label: "House Military" }, { value: "mercenary", label: "Mercenary" }];
    const type = state.opforForceTypes[hotSpot.id + "::" + opposing?.id] || "house";
    faction = type === "mercenary" ? "Mercenary" : opposing?.faction;
  } else if (hotSpot.id === "alta-vista" && opposing?.id === "ravens") {
    choices = [{ value: "clan", label: "Raven Alliance" }, { value: "mercenary", label: "Mercenary" }];
    const type = state.opforForceTypes[hotSpot.id + "::" + opposing.id] || "clan";
    faction = type === "mercenary" ? "Mercenary" : "Raven Alliance";
  } else {
    faction = "Mercenary";
  }
  return { side: opposing, faction, choices };
}

function currentOpForTable() {
  const configuration = generatedOpForConfiguration();
  const tableId = opforTableByFaction[configuration.faction];
  return tableId ? OPPOSING_FORCE_TABLES[tableId] : null;
}

function currentMissionOpForOverride() {
  const hotSpot = currentHotSpot();
  const selectedSideId = state.selectedSide[hotSpot.id];
  if (hotSpot.id === "pascagoula") {
    const trackOne = Number(currentHotSpotStep()?.sequence) === 1;
    return trackOne && selectedSideId === "ranger-raiders" ? MISSION_OPFOR_OVERRIDES.pascagoula?.["jewel-thieves"] || null : null;
  }
  if (hotSpot.id === "tigress") {
    const trainingPhase = Number(currentHotSpotStep()?.sequence) === 1 && state.tigressPhase === "training";
    return trainingPhase && selectedSideId === "legion-trainers" ? MISSION_OPFOR_OVERRIDES.tigress?.["legion-trainers"] || null : null;
  }
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

function actOfPiracyScenario() {
  if (state.hotSpotId !== "act-of-piracy") return resolveActOfPiracyScenario(null, null);
  const sequence = Number(currentHotSpotStep()?.sequence || 1);
  const variant = resolvedHotSpotStep()?.variant;
  const protectedRoll = variant?.sourceRolls?.find(roll => roll.id === "law-protected-system");
  const attackedRoll = variant?.sourceRolls?.find(roll => roll.id === "pirates-attacked-system");
  const johnsondale = variant?.selectionControls?.find(selection => selection.id === "johnsondale-loot");
  return resolveActOfPiracyScenario(
    protectedRoll ? selectedSourceRoll(sequence, protectedRoll) : null,
    attackedRoll ? selectedSourceRoll(sequence, attackedRoll) : null,
    johnsondale ? selectedVariantSelection(sequence, johnsondale) : "",
    state.scale
  );
}

function sourceRollLabel(sequence, roll) {
  const selected = selectedSourceRoll(sequence, roll);
  return roll.options.find(option => option.value === selected)?.label || "Not selected";
}

function variantSelectionKey(sequence, selection) {
  return state.hotSpotId + "::selection::" + sequence + "::" + selection.id;
}

function selectedVariantSelection(sequence, selection) {
  const value = state.selectionValues[variantSelectionKey(sequence, selection)] || selection.default || "";
  return selection.options.some(option => option.value === value) ? value : "";
}

function variantConditionMatches(sequence, condition) {
  if (!condition) return true;
  const variant = resolvedHotSpotStep()?.variant;
  if (condition.sourceRollId) {
    const roll = variant?.sourceRolls?.find(item => item.id === condition.sourceRollId);
    const selected = roll ? selectedSourceRoll(sequence, roll) : "";
    return condition.values?.length ? condition.values.includes(selected) : selected === condition.value;
  }
  const selection = variant?.selectionControls?.find(item => item.id === condition.id);
  if (!selection) return false;
  const selected = selectedVariantSelection(sequence, selection);
  return condition.values?.length ? condition.values.includes(selected) : selected === condition.value;
}

function variantSelectionLabel(sequence, selection) {
  const selected = selectedVariantSelection(sequence, selection);
  return selection.options.find(option => option.value === selected)?.label || "Not selected";
}

function roleKey(sequence) {
  const step = currentHotSpotStep();
  const branch = Number(step?.sequence) === Number(sequence) && step?.requires?.length
    ? step.requires.map(selectedWinner).join("|")
    : "";
  return state.hotSpotId + "::role::" + sequence + (branch ? "::" + branch : "");
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
    '</div><div class="campaign-state-summary"><strong>Contract victory check</strong><span class="campaign-contract-outcome">' + esc(achernarOutcomeText(victory.outcome)) + '</span>' + achernarVictoryStatus("Tybalt", victory.tybalt) + achernarVictoryStatus("Home Guard", victory.homeGuard) + '<span>Home Guard’s five-unit condition counts only Battlefield Support units granted to Tybalt by the Achernar Command Complications table. Defector J. Edgar vehicles do not count toward this total.</span>' + renderProvisionalRules(["Evaluate the two contracts independently. If both sides meet their conditions, both contracts succeed. Tybalt’s Strike-and-Retreat alternative is available only when Track 3 was Strike."]) + '</div>' +
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
  const withdrawalActive = appliedComplicationNamed("escobar", "Withdrawal Order");
  const withdrawalField = withdrawalActive ? '<label class="campaign-field"><span>Withdrawal order</span><select data-alta-trial-field="complicationSix" data-alta-trial-index="' + trialIndex + '">' + altaOptions(withdrawalOptions, trial.complicationSix) + '</select></label>' : "";
  const trialFields = isMeeting ? '<div class="campaign-fields"><div class="campaign-track-label">Warehouse Trial ' + selectedSequence + ' record</div>' +
    '<label class="campaign-field"><span>Trial played</span><select data-alta-trial-field="played" data-alta-trial-index="' + trialIndex + '">' + altaOptions([["false", "Not yet"], ["true", "Played"]], String(trial.played)) + '</select></label>' +
    '<label class="campaign-field"><span>Tactical winner</span><select data-alta-trial-field="tacticalWinner" data-alta-trial-index="' + trialIndex + '">' + altaOptions(winnerOptions, trial.tacticalWinner) + '</select></label>' +
    '<label class="campaign-field"><span>Escobar completion</span><select data-alta-trial-field="escobarCompletion" data-alta-trial-index="' + trialIndex + '">' + altaOptions(completionOptions, trial.escobarCompletion) + '</select></label>' +
    '<label class="campaign-field"><span>Ravens completion</span><select data-alta-trial-field="ravensCompletion" data-alta-trial-index="' + trialIndex + '">' + altaOptions(completionOptions, trial.ravensCompletion) + '</select></label>' +
    withdrawalField +
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
    '<div class="campaign-fields"><div class="campaign-track-label">Contract setup</div><label class="campaign-field"><span>Ravens participating faction</span><select data-alta-root-field="ravenFaction">' + altaOptions([["not-recorded", "Choose faction"], ["mercenary", "Mercenary"], ["raven-alliance", "Raven Alliance"]], evaluation.ravenFaction) + '</select></label><div class="campaign-field campaign-static-field"><span>Escobar complications</span><strong>Resolve for Escobar only; Command Rights modifiers remain a tabletop reference.</strong></div></div>' +
    trialFields + retreatField +
    '<div class="campaign-state-summary"><strong>Progression</strong><span>' + esc(evaluation.terminationReason) + '</span><span>Available scenarios: ' + esc(evaluation.availableSequences.map(value => value === 4 ? "Retreat" : "Trial " + value).join(" · ")) + '</span><span>Retreat status: ' + esc(evaluation.retreatStatus) + '</span>' + trialSummaries + '</div>' +
    '<div class="campaign-state-summary"><strong>Contract victory check</strong><span class="campaign-contract-outcome">' + esc(altaOutcomeText(evaluation.outcome)) + '</span><span>Meeting Engagements played: ' + evaluation.playedMeetingEngagements + ' · Escobar successful completions: ' + evaluation.escobarSuccessfulTracks + ' / ' + evaluation.escobarRequiredTracks + ' required</span><span>Detained — Ravens: ' + (evaluation.ravensDetained ? "yes" : "no") + ' · Escobar: ' + (evaluation.escobarDetained ? "yes" : "no") + ' · Escobar contract broken: ' + (evaluation.escobarBrokeContract ? "yes" : "no") + '</span></div>' +
    '<div class="campaign-state-summary"><strong>Rules notes</strong>' + renderProvisionalRules(ALTA_VISTA_PROVISIONAL_RULES) + '<span>' + esc(ALTA_VISTA_MUTUAL_WITHDRAWAL_CLARIFICATION) + '</span></div>' +
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
  const finalized = entry.finalized
    ? '<div class="campaign-state-summary"><strong>Current tactical result</strong><span>Scale ' + entry.scale + ' · Attacker ' + entry.attackerVp + ' VP · Defender ' + entry.defenderVp + ' VP</span><span>' + (entry.successfulSide === "neither" ? "Neither side successfully completed this track." : esc(sideById(entry.successfulSide)?.name || entry.successfulSide) + " successfully completed this track.") + '</span><span>This result is not added to campaign history and does not evaluate overall contract victory.</span></div>'
    : "";

  container.innerHTML = '<section class="campaign-state-card dahar-tactical"><div class="campaign-state-head"><div><div class="panel-kicker">CURRENT MISSION TACTICAL SETUP</div><h3>' + esc(selectedTrack) + '</h3></div></div>' +
    '<p class="campaign-state-note">Configure only the currently selected tactical mission. Changing the selected track resets these mission-specific controls; no monthly history or campaign progression is stored.</p>' +
    '<div class="campaign-state-summary"><strong>Contract identifiers and participating forces</strong><span>105112A · Dahar Garrison · employer Duke Romy Sandoval-Dobson (Federated Suns) · participating faction Mercenary</span><span>105112B · Dahar Raid · employer Felix Kurita (Draconis Combine) · participating faction Mercenary</span>' + renderProvisionalRules(["Use the individual contract sidebar identifiers 105112A–B; Mission Brief p. 84 prints 105070A–B."]) + '</div>' +
    '<div class="campaign-fields"><div class="campaign-track-label">Current mission support</div>' +
    daharEquipmentControls("garrison", entry, 1) +
    daharEquipmentControls("raid", entry, 1) +
    '<div class="campaign-field campaign-wide-field campaign-finalize"><span>Current-track successful completion</span><strong>Current adjusted score: Attacker ' + trackScore("attacker") + ' · Defender ' + trackScore("defender") + '</strong><small>A side succeeds only if it completed at least one objective and has more adjusted VP. Equal adjusted VP means neither side succeeds. Finalize only when this tactical track is complete.</small><button type="button" data-dahar-finalize="current">Finalize current tactical score</button></div></div>' + finalized +
    '<div class="campaign-state-summary"><strong>Campaign procedure and victory — reference only</strong><span>The contract lasts three months. At the beginning of each month, roll 1D6 twice: the first roll determines the first track and the second roll determines the second track. Play valid tracks in the order rolled.</span><span class="campaign-ruling"><strong>Each track type may only be played once during the entire contract.</strong> A duplicate produces no track and is not rerolled. The contract therefore contains one to six played tracks, subject to early victory.</span><span>Two consecutive successfully completed played tracks win the contract immediately and cause the opposing player to concede. If neither player achieves early victory, the player with more successfully completed tracks after the third month wins.</span><span>The browser does not roll, store, gate, validate, total, or evaluate this campaign history. Previously played tracks and duplicate results are maintained externally.</span></div>' +
    '<div class="campaign-state-summary"><strong>Rules notes</strong>' + renderProvisionalRules(DAHAR_PROVISIONAL_RULES) + '<span>Scale 4+ support, Regular Military Command eligibility administration, and strategic compensation, repairs, transportation, purchase, and salvage administration are outside the current tactical browser scope.</span></div>' +
    '<div class="reference-citation">Source: Draconis Reach pp. 82–85 · Successful tracks pp. 26, 29 · Command Rights p. 28 · Battlefield setup p. 30</div></section>';
}

function leBlancOptions(options, selected, placeholder = null) {
  const leading = placeholder === null ? "" : '<option value="">' + esc(placeholder) + "</option>";
  return leading + options.map(([value, label]) => '<option value="' + esc(value) + '"' + (selected === value ? " selected" : "") + '>' + esc(label) + "</option>").join("");
}

function leBlancScaledSupport(text) {
  return text.replace(/(\d+) × Scale/g, (_, quantity) => String(Number(quantity) * state.scale));
}

function leBlancComplicationControls(sideId, mission) {
  const side = currentHotSpot().sides.find(item => item.id === sideId);
  const selection = mission.complications[sideId];
  const rights = mission.commandRights[sideId];
  const result = resolveLeBlancComplications(selection, rights);
  const secondary = result.initial >= 8
    ? '<label class="campaign-field"><span>' + esc(side.name) + ' secondary roll 1</span><select data-leblanc-complication="secondaryOne" data-leblanc-side="' + esc(sideId) + '">' + leBlancOptions([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"]], selection.secondaryOne === null ? "" : String(selection.secondaryOne), "Enter 1D6") + '</select></label><label class="campaign-field"><span>' + esc(side.name) + ' secondary roll 2</span><select data-leblanc-complication="secondaryTwo" data-leblanc-side="' + esc(sideId) + '">' + leBlancOptions([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"]], selection.secondaryTwo === null ? "" : String(selection.secondaryTwo), "Enter 1D6") + '</select></label>'
    : "";
  const effectNames = result.effects.map(value => LE_BLANC_COMMAND_COMPLICATIONS.rows.find(row => row.roll === String(value))?.name || String(value));
  const resolved = resolvedHotSpotStep();
  const opponentId = resolved?.attacker === sideId ? resolved?.defender : resolved?.attacker;
  const recipientRole = resolved?.attacker === opponentId ? "attacker" : "defender";
  const support = result.effects.includes(6) && opponentId
    ? '<div class="campaign-field campaign-static-field campaign-wide-field"><span>' + esc(side.name) + ' rolled 6 · opposing ' + esc(recipientRole) + ' support at Scale ' + state.scale + '</span><strong>' + LE_BLANC_PARTISAN_PACKAGES[recipientRole].map(leBlancScaledSupport).map(esc).join(" · ") + '</strong><small>Free support for the current track only. The package follows the recipient’s tactical role.</small></div>'
    : "";
  return '<label class="campaign-field"><span>' + esc(side.name) + ' initial complication roll</span><select data-leblanc-complication="initial" data-leblanc-side="' + esc(sideId) + '">' + leBlancOptions([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"]], selection.initial === null ? "" : String(selection.initial), "Enter 1D6") + '</select></label>' + secondary + '<div class="campaign-field campaign-static-field"><span>' + esc(side.name) + ' effective complication</span><strong>Modifier +' + result.modifier + ' · ' + esc(result.initial === null || result.pendingSecondary ? "Pending" : effectNames.length ? effectNames.join(" + ") : "No complication") + '</strong></div>' + support;
}

function leBlancCurrentResultText() {
  const resolved = resolvedHotSpotStep();
  if (!currentTrack() || resolved?.unresolved) return "Select the previous Track 1 outcome to resolve the current tactical track.";
  const attackerVp = trackScore("attacker");
  const defenderVp = trackScore("defender");
  const attackerSucceeded = completedObjectiveCount("attacker") > 0 && attackerVp > defenderVp;
  const defenderSucceeded = completedObjectiveCount("defender") > 0 && defenderVp > attackerVp;
  const successful = attackerSucceeded ? sideById(resolved.attacker)?.name : defenderSucceeded ? sideById(resolved.defender)?.name : "Neither side";
  return "Current score: Attacker " + attackerVp + " VP · Defender " + defenderVp + " VP. " + successful + " currently successfully completes the track.";
}

function renderLeBlancMissionState(container) {
  const mission = leBlancMissionState();
  const factionFields = ["draconis-combine", "federated-suns"].map(sideId => {
    const side = currentHotSpot().sides.find(item => item.id === sideId);
    const house = sideId === "draconis-combine" ? "Draconis Combine" : "Federated Suns";
    return '<label class="campaign-field"><span>' + esc(side.name) + ' participating faction</span><select data-leblanc-faction="' + esc(sideId) + '">' + leBlancOptions([[house, house], ["Mercenary", "Mercenary"]], mission.participatingFactions[sideId]) + '</select><small>Contract alignment and employer do not change.</small></label>';
  }).join("");
  container.innerHTML = '<section class="campaign-state-card leblanc-tactical"><div class="campaign-state-head"><div><div class="panel-kicker">CURRENT MISSION TACTICAL SETUP</div><h3>' + esc(currentTrack()?.name || "Track pending") + '</h3></div><button type="button" class="campaign-reset-button" data-reset-leblanc="true">Reset Le Blanc setup</button></div>' +
    '<p class="campaign-state-note">Configure only the selected tactical mission. Participating faction and resolved complications are independent for each contract side; objective scoring remains track-specific.</p>' +
    '<div class="campaign-state-summary"><strong>Contract references</strong><span>124704A · Operation Sundown · Draconis Combine Mustered Soldiery—Professional Soldiery Liaison · Tai-i Rebecca Anderson · Raid · three months · default Liaison Command</span><span>124704B · Le Blanc Garrison · Armed Forces of the Federated Suns—Department of Mercenary Relations · Leftenant Giles Durand · Garrison · three months · default Integrated Command</span><span>Le Blanc, Federated Suns · primary planetary terrain Desert · Intensity 2. Months 1–2 are preparation, travel, garrison duty, infiltration, and intelligence gathering; both tactical tracks occur in Month 3.</span></div>' +
    '<div class="campaign-fields"><div class="campaign-track-label">Participating forces</div>' + factionFields + '</div>' +
    '<div class="campaign-state-summary"><strong>Current-track successful completion</strong><span>' + esc(leBlancCurrentResultText()) + '</span><span>A player succeeds only after completing at least one objective and earning more VP than the opponent. Equal VP means neither succeeds.</span></div>' +
    '<div class="campaign-state-summary"><strong>Contract victory — reference only</strong><span>Successful completion of the final track wins the contract. Track 1 only selects Strike or Retreat. If neither player successfully completes the final track, neither meets the printed condition.</span><span>No campaign history, Temporary Hire eligibility, hiring, payment, repair, replacement, or Support Point accounting is performed.</span></div>' +
    '<div class="campaign-state-summary"><strong>Rules notes</strong>' + renderProvisionalRules(LE_BLANC_PROVISIONAL_RULES) + '<span>Command Complications are resolved before both tracks under the general procedure on p. 30.</span></div>' +
    '<div class="reference-citation">Source: Draconis Reach pp. 86–89 · successful tracks pp. 26, 29 · Command Rights p. 28 · complications pp. 30, 89</div></section>';
}

function lucerneEffectName(effect) {
  return effect === 4 ? "Conflicting Orders" : effect === 5 ? "Voracious Reptile Swarms" : effect === 7 ? "Heavy Rainfall" : "No Complication";
}

function lucerneMapCount() {
  if (currentTrack()?.id === "pursuit") return state.scale >= 3 ? 4 : 2;
  return state.scale === 1 ? 1 : 2;
}

function lucerneComplicationControls(sideId, mission) {
  const side = currentHotSpot().sides.find(item => item.id === sideId);
  const selection = mission.complications[sideId];
  const rights = mission.commandRights[sideId];
  const result = resolveLucerneComplications(selection, rights);
  const secondary = result.initial >= 8
    ? '<label class="campaign-field"><span>' + esc(side.name) + ' secondary roll 1</span><select data-lucerne-complication="secondaryOne" data-lucerne-side="' + esc(sideId) + '">' + leBlancOptions([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"]], selection.secondaryOne === null ? "" : String(selection.secondaryOne), "Enter 1D6") + '</select></label><label class="campaign-field"><span>' + esc(side.name) + ' secondary roll 2</span><select data-lucerne-complication="secondaryTwo" data-lucerne-side="' + esc(sideId) + '">' + leBlancOptions([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"]], selection.secondaryTwo === null ? "" : String(selection.secondaryTwo), "Enter 1D6") + '</select></label>' +
      '<label class="campaign-field"><span>' + esc(side.name) + ' replacement rolls for result 1</span><input type="text" data-lucerne-replacements="replacementOne" data-lucerne-side="' + esc(sideId) + '" value="' + esc(selection.replacementOne.join(", ")) + '" placeholder="Only when prompted, e.g. 2, 5"><small>Enter comma-separated unmodified 1D6 rolls. Used in order for secondary 8+ results.</small></label>' +
      '<label class="campaign-field"><span>' + esc(side.name) + ' replacement rolls for result 2</span><input type="text" data-lucerne-replacements="replacementTwo" data-lucerne-side="' + esc(sideId) + '" value="' + esc(selection.replacementTwo.join(", ")) + '" placeholder="Only when prompted, e.g. 2, 5"><small>Used for secondary 8+ or duplicate actual effects; the same modifier applies.</small></label>'
    : "";
  const effectNames = result.effects.map(lucerneEffectName);
  const replacementPrompt = result.replacementNeeds.some(Boolean) ? " · replacement roll required" : "";
  const status = result.initial === null || result.pendingSecondary
    ? "Pending" + replacementPrompt
    : effectNames.length ? effectNames.join(" + ") : "No Complication";
  return '<label class="campaign-field"><span>' + esc(side.name) + ' initial complication roll</span><select data-lucerne-complication="initial" data-lucerne-side="' + esc(sideId) + '">' + leBlancOptions([["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"]], selection.initial === null ? "" : String(selection.initial), "Enter 1D6") + '</select></label>' + secondary + '<div class="campaign-field campaign-static-field"><span>' + esc(side.name) + ' effective complication</span><strong>Modifier +' + result.modifier + ' · ' + esc(status) + '</strong></div>';
}

function lucerneCurrentResultText() {
  const resolved = resolvedHotSpotStep();
  const attackerVp = trackScore("attacker");
  const defenderVp = trackScore("defender");
  if (state.trackId === "recon") {
    return "Current projected score: Attacker " + attackerVp + " VP · Defender " + defenderVp + " VP. Recon Deny remains projected until Turn 8; determine successful completion after the final objective states are adjudicated.";
  }
  const attackerSucceeded = completedObjectiveCount("attacker") > 0 && attackerVp > defenderVp;
  const defenderSucceeded = completedObjectiveCount("defender") > 0 && defenderVp > attackerVp;
  const successful = attackerSucceeded ? sideById(resolved?.attacker)?.name : defenderSucceeded ? sideById(resolved?.defender)?.name : "Neither side";
  return "Current score: Attacker " + attackerVp + " VP · Defender " + defenderVp + " VP. " + successful + " currently successfully completes the track.";
}

function renderLucerneMissionState(container) {
  const bioGenRaid = currentTrack()?.id === "bio-gen-raid";
  const complicationFields = bioGenRaid
    ? '<div class="campaign-state-summary"><strong>Enough Chaos</strong><span>Bio-Gen Raid does not roll random Command Complications. Any standard-track complication state was cleared when this track was selected. Building-spawned enhanced swarms still apply.</span></div>'
    : "";
  container.innerHTML = '<section class="campaign-state-card lucerne-tactical"><div class="campaign-state-head"><div><div class="panel-kicker">CURRENT MISSION TACTICAL SETUP</div><h3>' + esc(currentTrack()?.name || "Track pending") + '</h3></div><button type="button" class="campaign-reset-button" data-reset-lucerne="true">Reset Lucerne setup</button></div>' +
    '<p class="campaign-state-note">Configure only the selected tactical track. Both participating forces are Mercenary and use the Mercenary/Pirate OpFor table. Resolved complications are independent for each contract side.</p>' +
    '<div class="campaign-state-summary"><strong>Contract references</strong><span>906245A · Bio-Gen Retainer · Bio-Gen Industries · CEO Marie Valentina · Garrison/Retainer/Defense · default Integrated Command</span><span>906245B · Eclipse Expeditions Special Operations · Eclipse Expeditions LLC · Guildmaster Phil Newsted · Expedition/Raid · default Independent Command</span><span>PZH2, Lucerne · primary planetary terrain Wooded · six months · Intensity 2–6 tracks</span></div>' +
    complicationFields +
    '<div class="campaign-state-summary"><strong>Current-track successful completion</strong><span>' + esc(lucerneCurrentResultText()) + '</span><span>A player succeeds only after completing at least one objective and earning more VP than the opponent. Equal VP means neither succeeds.</span></div>' +
    '<div class="campaign-state-summary"><strong>Campaign progression and contract victory — reference only</strong><span>Use the corrected monthly procedure and unique-track rule. Bio-Gen Raid is the mandatory sixth played track if reached, not a seventh battle. The provisional maximum duration is six months; six played tracks end the contract early.</span><span>The side with more successfully completed tracks wins; equal totals produce no victor. The browser does not track months, duplicates, history, success totals, or overall victory.</span></div>' +
    '<div class="campaign-state-summary"><strong>Rules notes</strong>' + renderProvisionalRules(LUCERNE_PROVISIONAL_RULES) + '<span>Printed deployment, objective, and enhanced-swarm details remain tabletop adjudications where the source does not specify a conversion or tie-break.</span></div>' +
    '<div class="reference-citation">Source: Draconis Reach pp. 90–93 · successful tracks pp. 26, 29 · Command Rights p. 28 · complications pp. 30, 92–93</div></section>';
}

function selectedWinner(sequence) {
  return state.winnerSelections[winnerKey(sequence)] || "";
}

function resolvedHotSpotStep() {
  const step = currentHotSpotStep();
  if (!step) return null;
  let outcome = step;
  if (step.phases && currentHotSpot().id === "tigress") {
    outcome = step.phases[state.tigressPhase] || step.phases.training;
  }
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
    let selectedInitiator = state.roleSelections[roleKey(step.sequence)] || "";
    if (outcome.roleChoiceRequired && !selectedInitiator) {
      return { ...step, ...outcome, attacker: null, defender: null, rolePending: true, unresolved: false };
    }
    selectedInitiator ||= currentHotSpot().sides[0].id;
    const opposingSide = currentHotSpot().sides.find(side => side.id !== selectedInitiator)?.id || null;
    outcome = outcome.reverseRoles
      ? { ...outcome, attacker: opposingSide, defender: selectedInitiator }
      : { ...outcome, attacker: selectedInitiator, defender: opposingSide };
  }
  return { ...step, ...outcome, unresolved: false };
}

function syncHotSpotState() {
  const hotSpot = currentHotSpot();
  if (state.hotSpotId !== hotSpot.id) state.hotSpotId = hotSpot.id;
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
  if (hotSpot.id === "le-blanc") {
    const mission = leBlancMissionState();
    const missionKey = String(step?.sequence || "") + "::" + String(resolved?.trackId || "pending");
    if (mission.missionKey !== null && mission.missionKey !== missionKey) clearLeBlancComplications();
    mission.missionKey = missionKey;
  }
  if (hotSpot.id === "lucerne") {
    const mission = lucerneMissionState();
    const missionKey = String(resolved?.trackId || "pending");
    if (mission.missionKey !== null && mission.missionKey !== missionKey) clearLucerneComplications();
    mission.missionKey = missionKey;
  }
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
  const branch = state.hotSpotId === "pascagoula" && Number(state.trackSequence[state.hotSpotId]) === 2
    ? "::" + (selectedWinner(1) || "unresolved")
    : "";
  return state.hotSpotId + "::" + (state.trackSequence[state.hotSpotId] || "") + "::" + trackId + branch + "::" + objectiveId + "::" + side;
}

function pascagoulaExtractionKey() {
  return progressKey(state.trackId || "pursuit", "ryu-extracted", "defender");
}

function pascagoulaExtractionRequired() {
  return currentHotSpot().id === "pascagoula" && Number(currentHotSpotStep()?.sequence) === 2 && Boolean(state.trackId);
}

function pascagoulaRyuExtracted() {
  return !pascagoulaExtractionRequired() || Boolean(state.tacticalInputs[pascagoulaExtractionKey()]);
}

function pascagoulaObjectiveSuppressed(objective, side) {
  return pascagoulaExtractionRequired() && side === "defender" && objective.id !== "orders-defender" && !pascagoulaRyuExtracted();
}

function protectionTrackFourActive() {
  return currentHotSpot().id === "protection" && Number(currentHotSpotStep()?.sequence) === 4 && state.trackId === "pursuit";
}

function protectionCaptureKey() {
  return progressKey("pursuit", "mobile-hq-captured-final-turn", "attacker");
}

function protectionCaptureOverride() {
  return protectionTrackFourActive() && Boolean(state.tacticalInputs[protectionCaptureKey()]);
}

function getProgress(objective, side) {
  const key = progressKey(state.trackId, objective.id, side);
  if (state.progress[key] === undefined) state.progress[key] = objective.repeatable ? 0 : false;
  return state.progress[key];
}

function currentObjectives() {
  const track = currentTrack();
  const variant = resolvedHotSpotStep()?.variant;
  return variant?.objectives || track?.objectives || [];
}

function combinedObjectiveProgress(objective) {
  if (!objective.combinedGroup) return 0;
  return currentObjectives()
    .filter(item => item.combinedGroup === objective.combinedGroup)
    .reduce((total, item) => total + Number(getProgress(item, item.side)), 0);
}

function setProgress(objective, side, value) {
  if (!objective.repeatable) {
    state.progress[progressKey(state.trackId, objective.id, side)] = Boolean(value);
    return;
  }
  let maximum = objective.maxCount ?? Infinity;
  if (objective.combinedGroup && Number.isFinite(objective.combinedMax)) {
    const current = Number(getProgress(objective, side));
    const otherTotal = combinedObjectiveProgress(objective) - current;
    maximum = Math.min(maximum, Math.max(0, objective.combinedMax - otherTotal));
  }
  state.progress[progressKey(state.trackId, objective.id, side)] = Math.min(maximum, Math.max(0, Number(value) || 0));
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
  const contractSide = daharContractSideForTacticalSide(side);
  return contractSide ? appliedComplicationNamed(contractSide, "Orders Are Gibberish") : false;
}

function objectiveEarnedVp(objective, side, display = objective) {
  if (!applies(objective, side)) return 0;
  if (pascagoulaObjectiveSuppressed(objective, side)) return 0;
  if (protectionCaptureOverride() && side === "attacker") return getVp(display, side);
  const affected = daharGibberishApplies(side);
  if (isReconDeny(objective, side)) return adjustDaharEarnedVp(reconDenyVp(), affected);
  const completed = getProgress(objective, side);
  const earned = objective.repeatable ? Number(completed) * getVp(display, side) : completed ? getVp(display, side) : 0;
  return adjustDaharEarnedVp(earned, affected);
}

function tigressRetainedTrainingVp() {
  if (currentHotSpot().id !== "tigress" || Number(currentHotSpotStep()?.sequence) !== 1) return 0;
  const trainingAttacker = state.roleSelections[roleKey(1)] || "";
  if (!trainingAttacker) return 0;
  const legionTacticalSide = trainingAttacker === "legion-trainers" ? "attacker" : "defender";
  const meeting = TRACKS.find(track => track.id === "meeting-engagement");
  return meeting.objectives.reduce((total, objective) => {
    const value = state.progress[progressKey("meeting-engagement", objective.id, legionTacticalSide)];
    if (!value) return total;
    const vp = Number(state.vpSelections[progressKey("meeting-engagement", objective.id, legionTacticalSide)] ?? objective.vp);
    return total + (objective.repeatable ? Number(value) * vp : vp);
  }, 0);
}

function tigressCompletedTrainingObjectiveCount() {
  if (currentHotSpot().id !== "tigress" || Number(currentHotSpotStep()?.sequence) !== 1) return 0;
  const trainingAttacker = state.roleSelections[roleKey(1)] || "";
  if (!trainingAttacker) return 0;
  const legionTacticalSide = trainingAttacker === "legion-trainers" ? "attacker" : "defender";
  const meeting = TRACKS.find(track => track.id === "meeting-engagement");
  return meeting.objectives.filter(objective => Boolean(state.progress[progressKey("meeting-engagement", objective.id, legionTacticalSide)])).length;
}

function completedObjectiveCount(side) {
  const track = currentTrack();
  if (!track) return 0;
  const variant = resolvedHotSpotStep()?.variant;
  const objectives = variant?.objectives || track.objectives;
  if (protectionCaptureOverride() && side === "attacker") return objectives.filter(objective => applies(objective, side)).length;
  const phaseCount = objectives.filter(objective => {
    if (!applies(objective, side)) return false;
    if (pascagoulaObjectiveSuppressed(objective, side)) return false;
    if (isReconDeny(objective, side)) return reconDenyVp() > 0;
    return objective.repeatable ? Number(getProgress(objective, side)) > 0 : Boolean(getProgress(objective, side));
  }).length;
  const retainedTrainingCount = currentHotSpot().id === "tigress" && Number(currentHotSpotStep()?.sequence) === 1 && state.tigressPhase === "recon" && side === "defender"
    ? tigressCompletedTrainingObjectiveCount()
    : 0;
  return phaseCount + retainedTrainingCount;
}

function trackScore(side) {
  const track = currentTrack();
  if (!track) return 0;
  const variant = resolvedHotSpotStep()?.variant;
  const objectives = variant?.objectives || track.objectives;
  const phaseScore = objectives.reduce((total, objective) => {
    const display = displayObjective(objective, variant);
    return total + objectiveEarnedVp(objective, side, display);
  }, 0);
  const retained = currentHotSpot().id === "tigress" && Number(currentHotSpotStep()?.sequence) === 1 && state.tigressPhase === "recon" && side === "defender"
    ? tigressRetainedTrainingVp()
    : 0;
  return phaseScore + retained;
}

function modeLabel() {
  return state.mode === "both" ? "Both sides" : sideNames[state.mode] + " only";
}

function renderControlState() {
  const track = currentTrack();
  const resolved = resolvedHotSpotStep();
  const fixedScale = currentHotSpot().fixedScale;
  $("#derived-track-title").textContent = track ? (resolved?.displayName || track.name) : (resolved?.variant?.displayName || "Track pending");
  const setupSummary = $("#hotspot-setup-summary");
  const selected = sideById(state.selectedSide[currentHotSpot().id]);
  if (setupSummary) setupSummary.textContent = [currentHotSpot().name, resolved?.displayName || track?.name || currentHotSpotStep()?.label || "Track pending", selected?.name || "Military side", "Scale " + state.scale].join(" · ");
  Array.from(document.querySelectorAll(".scale-button")).forEach(button => {
    const active = Number(button.dataset.scale) === state.scale;
    const unavailable = Boolean(fixedScale) && Number(button.dataset.scale) !== fixedScale;
    button.classList.toggle("active", active);
    button.classList.toggle("unavailable", unavailable);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-disabled", String(unavailable));
    button.disabled = unavailable;
    button.title = unavailable ? "Scale " + button.dataset.scale + " is unavailable for " + currentHotSpot().name : "";
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
  const piracyScenario = hotSpot.id === "act-of-piracy" ? actOfPiracyScenario() : null;
  if (hotSpot.opforMode === "source-table" && hotSpot.id !== "act-of-piracy") {
    container.innerHTML = "";
    return;
  }
  if (hotSpot.id === "act-of-piracy" && !piracyScenario?.militiaRequired) {
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
  const configuration = generatedOpForConfiguration();
  const selected = configuration.side;
  const table = currentOpForTable();
  const override = currentMissionOpForOverride();
  if (!selected || (!table && !override)) {
    container.innerHTML = '<article class="opfor-card opfor-unavailable"><div class="panel-kicker">TAKING ONE FOR THE TEAM</div><h3>No matching OpFor table</h3><p>The generated opposing force maps to <strong>' + esc(configuration.faction || "unresolved") + '</strong>. Draconis Reach provides OpFor tables for Mercenary/Pirate, Capellan Confederation, Draconis Combine, Federated Suns, and Raven Alliance forces.</p></article>';
    return;
  }
  const scale = currentOpForScale();
  if (override) {
    const forceBody = '<div class="opfor-force-grid"><div><span>Mission force</span><ul>' + forceList(scale?.primary) + '</ul></div><div><span>Mission assets</span><ul>' + forceList(scale?.support) + '</ul></div><div><span>Special notes</span><ul>' + forceList(scale?.note) + '</ul></div></div>';
    container.innerHTML =
      '<article class="opfor-card"><div class="opfor-card-head"><div><span class="panel-kicker">TAKING ONE FOR THE TEAM</span><h3>Mission-specific opposing force</h3><p>' + esc(override.label) + ' · Scale ' + esc(String(state.scale)) + '</p></div><div class="opfor-roll-control"><span>Mission roster</span><strong>Fixed by Force Scale</strong></div></div>' +
      '<div class="opfor-card-meta"><span>Military side: <strong>' + esc(selected.name) + '</strong></span><span>Mission roster: <strong>' + esc(override.label) + '</strong></span><span>Source p. ' + esc(String(scale?.sourcePage || override.sourcePage || "—")) + '</span></div>' +
      '<div class="opfor-result"><div class="opfor-result-label">MISSION FORCE</div><output class="mission-scale-output">Scale ' + esc(String(state.scale)) + '</output><span>No generic 1D6 OpFor table roll is used for this mission roster.</span></div>' +
      forceBody +
      '<p class="opfor-rule">Use the mission-specific force listed for the selected Force Scale. The generic faction OpFor roll table is not used for this exception.</p>' +
      '<div class="reference-citation">Source: ' + esc(SOURCES.primary) + ' · ' + esc(hotSpot.name) + ' mission brief p. ' + esc(String(override.sourcePage || "—")) + '</div></article>';
    return;
  }
  const row = currentOpForRow();
  const clanNote = configuration.faction === "Raven Alliance" ? '<p class="opfor-note">Use the Raven Alliance opposing-force table for the generated Raven force.</p>' : "";
  const forceTypeControl = configuration.choices.length ? '<label class="opfor-type-control"><span>Generated opposing force type</span><select data-opfor-force-type="' + esc(selected.id) + '">' + configuration.choices.map(choice => '<option value="' + esc(choice.value) + '"' + ((state.opforForceTypes[hotSpot.id + "::" + selected.id] || configuration.choices[0].value) === choice.value ? " selected" : "") + '>' + esc(choice.label) + '</option>').join("") + '</select></label>' : "";
  const forceBody = row?.note
    ? '<div class="opfor-instruction"><span>Source instruction for result ' + esc(row.roll) + '</span><strong>' + esc(row.note) + '</strong><small>Follow that source instruction to build the full force.</small></div>'
    : '<div class="opfor-force-grid"><div><span>Primary force</span><ul>' + forceList(row?.primary) + '</ul></div><div><span>Support force</span><ul>' + forceList(row?.support) + '</ul></div><div><span>Alternate force</span><ul>' + forceList(row?.alternate) + '</ul></div></div>';
  const piracyNote = hotSpot.id === "act-of-piracy"
    ? '<p class="opfor-note"><strong>Scenario force:</strong> Militia Garrison with a +0 force-type modifier. The Law player controls this generated force instead of risking their permanent Mercenary command.' + (piracyScenario?.attackedSystem?.id === "johnsondale" && piracyScenario.johnsondaleChoice === "completed-vehicles" ? ' Add the mandatory ' + piracyScenario.strikerSupportCount + ' free Law Striker Light Tanks shown in Tactical Support.' : '') + '</p>'
    : "";
  const generatedTitle = hotSpot.id === "act-of-piracy" ? "Generated scenario force" : "Generated opposing force";
  const generatedLabel = hotSpot.id === "act-of-piracy" ? "Law-controlled force" : "Generated opponent";
  container.innerHTML =
    '<article class="opfor-card"><div class="opfor-card-head"><div><span class="panel-kicker">TAKING ONE FOR THE TEAM</span><h3>' + generatedTitle + '</h3><p>' + esc(selected.name) + ' · ' + esc(table.label) + ' · Scale ' + esc(String(state.scale)) + ' · Result ' + esc(row?.roll || "—") + '</p></div><label class="opfor-roll-control" for="opfor-roll"><span>Your 1D6 roll</span><select id="opfor-roll" aria-label="Your 1D6 roll">' + opforRollOptions() + '</select></label></div>' +
    forceTypeControl + '<div class="opfor-card-meta"><span>' + generatedLabel + ': <strong>' + esc(selected.name) + '</strong></span><span>Faction table: <strong>' + esc(table.label) + '</strong></span><span>Source p. ' + esc(String(scale?.sourcePage || "—")) + '</span></div>' +
    '<div class="opfor-result"><div class="opfor-result-label">1D6 result</div><output>' + esc(String(state.opforRoll)) + '</output><span>Choose the result you rolled at the table.</span></div>' +
    piracyNote + clanNote + forceBody +
    '<p class="opfor-rule">Use the Primary Force. Add the Support Force when the required Battlefield Support rules are available; otherwise use the Alternate Force for an all-’Mech force.</p>' +
    '<div class="reference-citation">Source: ' + esc(SOURCES.opposingForces) + '</div></article>';
}

function renderHotSpotSetup() {
  const hotSpot = currentHotSpot();
  const availableTracks = availableHotSpotTracks(hotSpot);
  const step = currentHotSpotStep();
  const resolved = resolvedHotSpotStep();
  const selected = sideById(state.selectedSide[hotSpot.id]);
  $("#hot-spot-select").innerHTML = VISIBLE_HOT_SPOTS.map(item => '<option value="' + esc(item.id) + '">' + esc(item.name) + " · " + esc(item.region) + "</option>").join("");
  $("#hot-spot-select").value = hotSpot.id;
  $("#hot-spot-track-label").textContent = hotSpot.trackSelectorLabel || "Track";
  $("#hot-spot-track-select").innerHTML = availableTracks.map(item => '<option value="' + item.sequence + '">' + esc(item.label) + "</option>").join("");
  $("#hot-spot-track-select").value = String(step?.sequence || "");
  $("#hot-spot-side-select").innerHTML = hotSpot.sides.map(side => {
    const displaySide = sideById(side.id) || side;
    return '<option value="' + esc(side.id) + '">' + esc(displaySide.name) + " · " + esc(displaySide.faction) + "</option>";
  }).join("");
  $("#hot-spot-side-select").value = selected?.id || "";
  const setupSummary = $("#hotspot-setup-summary");
  if (setupSummary) setupSummary.textContent = [hotSpot.name, resolved?.displayName || currentTrack()?.name || step?.label || "Track pending", selected?.name || "Military side", "Scale " + state.scale].join(" · ");

  const winnerControls = [];
  for (const sequence of step?.requires || []) {
    const previousStep = hotSpot.tracks.find(item => item.sequence === sequence);
    const options = step.previousOutcomeOptions || hotSpot.sides.map(side => ({ value: side.id, label: side.name }));
    const label = step.previousOutcomeLabel || "Winner of Track " + sequence;
    const placeholder = step.previousOutcomePlaceholder || (step.previousOutcomeOptions ? "Choose the resolved result" : "Choose the previous winner");
    const hint = step.previousOutcomeHint || (previousStep?.label || "Previous track") + " determines this mission.";
    winnerControls.push('<div class="control-group"><label for="winner-' + sequence + '">' + esc(label) + '</label><select id="winner-' + sequence + '" data-winner-sequence="' + sequence + '"><option value="">' + esc(placeholder) + '</option>' + options.map(option => '<option value="' + esc(option.value) + '"' + (selectedWinner(sequence) === option.value ? " selected" : "") + '>' + esc(option.label) + "</option>").join("") + '</select><span class="control-hint">' + esc(hint) + "</span></div>");
  }
  if (resolved?.roleChoice) {
    const selectedRole = state.roleSelections[roleKey(step.sequence)] || (resolved.roleChoiceRequired ? "" : hotSpot.sides[0]?.id);
    const roleSuffix = step.reverseRoles ? " as strategic attacker (Pursuit Defender)" : " as strategic attacker (tactical Attacker)";
    const placeholder = resolved.roleChoiceRequired ? '<option value="">Select Attacker…</option>' : "";
    const options = hotSpot.sides.map(side => '<option value="' + esc(side.id) + '"' + (selectedRole === side.id ? " selected" : "") + '>' + esc(side.name) + (resolved.roleChoicePlainLabels ? "" : roleSuffix) + "</option>").join("");
    const hint = resolved.rolePending ? (resolved.variant?.roleChoicePendingInstruction || "Select the Attacker to display objectives.") : (step.roleChoiceHint || "The other side is assigned Defender.");
    winnerControls.push('<div class="control-group"><label for="role-choice">' + esc(step.roleChoiceLabel || "Choose the Attacker") + '</label><select id="role-choice" data-role-sequence="' + step.sequence + '">' + placeholder + options + '</select><span class="control-hint">' + esc(hint) + '</span></div>');
  }
  if (step?.results?.length) {
    const result = state.resultSelections[resultKey(step.sequence)] || step.results[0].id;
    winnerControls.push('<div class="control-group"><label for="source-result">' + esc(step.resultLabel || "Source result") + '</label><select id="source-result" data-result-sequence="' + step.sequence + '">' + step.results.map(option => '<option value="' + esc(option.id) + '"' + (result === option.id ? " selected" : "") + '>' + esc(option.label) + "</option>").join("") + '</select><span class="control-hint">This choice records the source table result for this track.</span></div>');
  }
  for (const roll of resolved?.variant?.sourceRolls || []) {
    if (roll.presentation === "battlefield-table") continue;
    const selectedRoll = selectedSourceRoll(step.sequence, roll);
    winnerControls.push('<div class="control-group"><label for="source-roll-' + esc(roll.id) + '">' + esc(roll.label) + '</label><select id="source-roll-' + esc(roll.id) + '" data-source-roll-id="' + esc(roll.id) + '" data-source-roll-sequence="' + esc(String(step.sequence)) + '"><option value="">' + esc(roll.placeholder || "Choose the 1D6 result") + '</option>' + roll.options.map(option => '<option value="' + esc(option.value) + '"' + (selectedRoll === option.value ? " selected" : "") + '>' + esc(option.label) + "</option>").join("") + '</select><span class="control-hint">' + esc(roll.note) + '</span></div>');
  }
  for (const selection of resolved?.variant?.selectionControls || []) {
    if (!variantConditionMatches(step.sequence, selection.visibleWhen)) continue;
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
  if (hotSpot.id === "act-of-piracy") {
    const scenario = actOfPiracyScenario();
    const branchText = scenario.branch === "same-system"
      ? "Same system: Pirates fight the Law player’s permanent Mercenary command."
      : scenario.branch === "different-system"
        ? "Different systems: Law controls a generated " + scenario.militiaFaction + " Militia Garrison at " + scenario.attackedSystem.name + "."
        : "Select both resolved systems before determining the opposition branch.";
    $("#hotspot-summary").insertAdjacentHTML("beforeend", '<div class="hotspot-summary-note"><strong>Resolved opposition:</strong> ' + esc(branchText) + '</div>');
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
  const piracyScenario = hotSpot.id === "act-of-piracy" ? actOfPiracyScenario() : null;
  takingToggle.style.display = sourceTableMode && !piracyScenario?.militiaRequired ? "none" : "";
  if (hotSpot.opforMode === "gladiator") {
    takingToggle.querySelector("strong").textContent = "Use the Gladiator Generator";
    takingToggle.querySelector("small").textContent = "Show the source procedure for creating a non-player duelist.";
  } else if (hotSpot.id === "act-of-piracy") {
    takingToggle.querySelector("strong").textContent = "Generate the local Militia Garrison";
    takingToggle.querySelector("small").textContent = "Show the attacked system’s required Militia Garrison configuration from the source tables.";
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
  if (simplifiedContracts.has(hotSpot.id)) {
    container.innerHTML = "";
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

function isBattlefieldConfigurationText(text) {
  return /^(?:At Scale .*mapsheets|Battlefield size:|Dahar mapsheets:|BattleTech mapsheets:|Alpha Strike(?: terrain)?:|Standard Protection mapsheet table:|Atlantis City option|Atlantis City mapsheet table:|Official mapsheet table|Result \d)/i.test(String(text || ""));
}

function isBattlefieldConfigurationTable(table) {
  return /mapsheet|terrain/i.test(table?.title || "");
}

function battlefieldConfigurationParts(referenceTrack) {
  const groups = [referenceTrack.setup || [], referenceTrack.setupDetails || [], referenceTrack.scaleNotes || [], referenceTrack.scaleNotesByScale?.[String(state.scale)] || [], referenceTrack.special || []];
  const sequence = Number(currentHotSpotStep()?.sequence || 1);
  const structuredRules = (referenceTrack.battlefieldRules || [])
    .filter(rule => variantConditionMatches(sequence, rule.whenSelection))
    .filter(rule => !rule.scales?.length || rule.scales.includes(state.scale))
    .map(rule => rule.text);
  const items = [...new Set([...groups.flat().filter(isBattlefieldConfigurationText), ...structuredRules])];
  const tables = (referenceTrack.referenceTables || [])
    .filter(isBattlefieldConfigurationTable)
    .filter(table => variantConditionMatches(sequence, table.whenSelection));
  return { items, tables };
}

function battlefieldSelectionSummary(referenceTrack) {
  if (currentHotSpot().id === "act-of-piracy") {
    const scenario = actOfPiracyScenario();
    return scenario.attackedSystem ? scenario.attackedSystem.name + " · " + scenario.attackedSystem.terrain : "Attacked system unresolved";
  }
  const { tables } = battlefieldConfigurationParts(referenceTrack);
  let summary = tables[0]?.title || currentHotSpot().terrain + " battlefield";
  if (currentHotSpot().id === "protection") {
    const sequence = Number(currentHotSpotStep()?.sequence || 1);
    const response = referenceTrack.selectionControls?.find(item => item.id === "atlantis-response");
    const responseValue = response ? selectedVariantSelection(sequence, response) : "";
    const responseLabel = response?.options.find(option => option.value === responseValue)?.label;
    if (responseLabel && variantConditionMatches(sequence, { id: "battlefield-type", value: "atlantis" })) summary += " · " + responseLabel;
  }
  return summary;
}

function appliedComplicationSummary() {
  const profile = currentComplicationProfile();
  const selection = profile ? complicationSelectionState(profile.table) : null;
  if (!selection?.appliedOnce) return "Complication not applied";
  const names = profile.table.rows.filter((row, index) => profile.participants.some(side => (selection.applied[side.id] || []).includes(complicationRowKey(row, index)))).map(row => row.name);
  return names.join(" + ") || "No Complication";
}

function hotSpotSetupSummaryParts(referenceTrack) {
  const selected = sideById(state.selectedSide[currentHotSpot().id]);
  const resolved = resolvedHotSpotStep();
  const parts = [currentHotSpot().name, resolved?.displayName || currentTrack()?.name || currentHotSpotStep()?.label || "Track pending", selected?.name || "Military side", "Scale " + state.scale];
  if (currentHotSpot().id === "act-of-piracy") {
    const scenario = actOfPiracyScenario();
    parts.push("Protected: " + (scenario.protectedSystem?.name || "unresolved"));
    parts.push("Attacked: " + (scenario.attackedSystem ? scenario.attackedSystem.name + " (" + scenario.attackedSystem.terrain + ")" : "unresolved"));
    parts.push(scenario.branchLabel);
    if (scenario.attackedSystem?.id === "johnsondale") parts.push("Raid objective: " + (scenario.johnsondaleChoice === "completed-vehicles" ? "Completed vehicles" : scenario.johnsondaleChoice === "components" ? "Components" : "unresolved"));
    parts.push(appliedComplicationSummary());
  } else {
    parts.push(battlefieldSelectionSummary(referenceTrack));
  }
  return parts;
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

function renderStaticCommandComplications(table) {
  const rows = table.rows.map(row =>
    '<tr><th scope="row"><span class="complication-roll">' + esc(row.roll) + '</span><strong>' + esc(row.name) + '</strong></th><td>' + esc(row.text) + '</td></tr>'
  ).join("");
  return '<div class="shared-rule-table-wrap"><table class="shared-rule-table command-complications-table"><thead><tr><th scope="col">1D6</th><th scope="col">Complication and effect</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

function activeComplicationExtras(profile) {
  const hotSpotId = profile.hotSpot.id;
  if (hotSpotId === "sun-prairie") {
    return profile.participants.map(selectingSide => {
      const recipient = profile.participants.find(item => item.id !== selectingSide.id);
      const extras = [];
      if (appliedComplicationNamed(selectingSide.id, "Rubble", profile.table)) {
        extras.push('<div class="active-complication-extra"><strong>' + esc(recipient?.name || "Opposing force") + ' places rubble</strong><span>Six rubble hexes · Alpha Strike: six 2-inch AOE terrain templates · not multiplied by Scale.</span><span>Independent opponent-directed entitlement caused by ' + esc(selectingSide.name) + ' resolving Rubble.</span></div>');
      }
      if (appliedComplicationNamed(selectingSide.id, "Fire and Smoke", profile.table)) {
        extras.push('<div class="active-complication-extra"><strong>' + esc(recipient?.name || "Opposing force") + ' places fire</strong><span>Six markers, each marking its selected hex and adjacent hexes on fire · Alpha Strike: six 6-inch AOE fire templates.</span><span>Independent opponent-directed entitlement caused by ' + esc(selectingSide.name) + ' resolving Fire and Smoke. Shared fire and smoke rules are displayed once above.</span></div>');
      }
      return extras.join("");
    }).join("");
  }
  if (hotSpotId === "protection") {
    const variant = resolvedHotSpotStep()?.variant;
    const sequence = Number(currentHotSpotStep()?.sequence || 1);
    const battlefield = variant?.selectionControls?.find(item => item.id === "battlefield-type");
    const atlantis = battlefield ? selectedVariantSelection(sequence, battlefield) === "atlantis" : false;
    return profile.participants.map(selectingSide => {
      if (!appliedComplicationNamed(selectingSide.id, "Local Partisans", profile.table)) return "";
      const recipient = profile.participants.find(item => item.id !== selectingSide.id);
      const samePlayerMonsoon = appliedComplicationNamed(selectingSide.id, "Monsoon", profile.table);
      const support = protectionPartisanSupport(atlantis ? "atlantis" : "standard", true, samePlayerMonsoon);
      const configuration = support.naval
        ? "Naval patrol boats · may enter Depth 0 and deeper water · treated as Level 0 (surface) for shooting"
        : "Tracked Vedette Medium Tanks · Atlantis City maps as printed";
      const interaction = atlantis && samePlayerMonsoon
        ? "Same-player Local Partisans + Monsoon interaction: this support award uses naval patrol boats."
        : atlantis
          ? "Another player’s Monsoon does not convert this independent support award."
          : "Standard Protection battlefields always use the printed naval patrol-boat conversion.";
      return '<div class="active-complication-extra"><strong>' + esc(recipient?.name || "Opposing force") + ' receives Local Partisan support</strong><span>' + support.quantity + ' Vedette Medium Tank battlefield assets · ' + esc(configuration) + '</span><span>Selected for ' + esc(selectingSide.name) + '. ' + esc(interaction) + '</span></div>';
    }).join("");
  }
  if (hotSpotId === "lucerne") {
    const swarmPlayers = profile.participants.filter(side => appliedComplicationNamed(side.id, "Voracious Reptile Swarms", profile.table)).length;
    if (!swarmPlayers) return "";
    const rolls = swarmPlayers * lucerneMapCount();
    return '<div class="active-complication-extra"><strong>Ordinary reptile swarms</strong><span>' + swarmPlayers + 'D3 neutral swarms per mapsheet · ' + rolls + ' independent 1D3 quantity roll' + (rolls === 1 ? "" : "s") + ' across ' + lucerneMapCount() + ' mapsheet' + (lucerneMapCount() === 1 ? "" : "s") + ' at Scale ' + state.scale + '.</span><span>No two swarms may share a center hex. Resolve placement, movement, attacks, and damage at the table.</span></div>';
  }
  if (hotSpotId === "le-blanc") {
    const resolved = resolvedHotSpotStep();
    return profile.participants.map(side => {
      if (!appliedComplicationNamed(side.id, "Local Partisan Support", profile.table)) return "";
      const recipientId = resolved?.attacker === side.id ? resolved?.defender : resolved?.attacker;
      const recipient = profile.participants.find(item => item.id === recipientId);
      const recipientRole = resolved?.attacker === recipientId ? "attacker" : "defender";
      const units = LE_BLANC_PARTISAN_PACKAGES[recipientRole].map(leBlancScaledSupport).map(esc).join(" · ");
      return '<div class="active-complication-extra"><strong>' + esc(recipient?.name || "Opposing force") + ' receives partisan support</strong><span>' + units + '</span><span>Free support for this track only; the package follows the receiving force’s tactical role.</span></div>';
    }).join("");
  }
  if (hotSpotId === "melcher") {
    return profile.participants.map(side => {
      if (!appliedComplicationNamed(side.id, "Fighting on Stephens", profile.table)) return "";
      const recipient = profile.participants.find(item => item.id !== side.id);
      const key = tacticalInputKey("melcher-support-" + recipient.id);
      const selected = state.tacticalInputs[key] || "lct-3v";
      return '<div class="active-complication-extra"><strong>' + esc(recipient.name) + ' receives support</strong><label><span>Receiving player’s unit choice</span><select data-melcher-support-recipient="' + esc(recipient.id) + '"><option value="lct-3v"' + (selected === "lct-3v" ? " selected" : "") + '>LCT-3V Locust</option><option value="um-r80"' + (selected === "um-r80" ? " selected" : "") + '>UM-R80 UrbanMech</option></select></label><span>One selected unit per Scale; current Melcher tactical Scale is 1. Gunnery 5 · Piloting 6 · Alpha Strike Skill 5.</span></div>';
    }).join("");
  }
  if (hotSpotId === "new-ivaarsen") {
    const support = [];
    if (appliedComplicationNamed("isf", "Long Tom Support", profile.table)) support.push("Long Tom Support Attacks: " + (2 * state.scale));
    if (appliedComplicationNamed("isf", "Mechanized Infantry Support", profile.table)) support.push("BSP Mechanized Infantry Platoons: " + (2 * state.scale) + " · place after initial deployment atop building hexes");
    if (appliedComplicationNamed("isf", "Striker Support", profile.table)) support.push("BSP Striker Light Tanks: " + state.scale);
    if (!support.length) return "";
    return '<div class="active-complication-extra"><strong>Stephensons receive complication support</strong><span>' + support.map(esc).join(" · ") + '</span><span>These quantities use current Scale ' + state.scale + ' and remain separate from Track 3 building-difference support.</span></div>';
  }
  return "";
}

function complicationEffectRows(row) {
  return row.effects?.length ? row.effects.map(effect => ({ ...row, ...effect, effects: undefined })) : [row];
}

function renderActiveComplications(profile, selection) {
  const sharedNames = new Set(["Sandstorm", "Heatwave", "Unexpected Sandstorm", "Heavy Rainfall"]);
  const effectEntries = [];
  for (const [index, row] of profile.table.rows.entries()) {
    if (isRollTwiceRow(row)) continue;
    if (row.supportOnly) continue;
    const key = complicationRowKey(row, index);
    const selectors = profile.participants.filter(side => (selection.applied[side.id] || []).includes(key));
    if (!selectors.length) continue;
    if (isNoComplicationRow(row)) continue;
    for (const selector of selectors) {
      const side = row.fixedRecipientId ? profile.participants.find(item => item.id === row.fixedRecipientId) || selector : selector;
      for (const effectRow of complicationEffectRows(row)) {
        const sharedEffectId = effectRow.effectScope === "shared-battlefield"
          ? effectRow.effectId
          : sharedNames.has(effectRow.name) || (profile.hotSpot.id === "achernar" && effectRow.name === "Republic Spider" && selectors.length > 1)
            ? profile.hotSpot.id + "::" + effectRow.name
            : null;
        effectEntries.push({ row: effectRow, side, sharedEffectId });
      }
    }
  }
  const effects = groupComplicationEffectEntries(effectEntries);
  const effectCards = effects.map(effect => {
    if (effect.shared) {
      const ownerLabel = effect.row.effectScope === "shared-battlefield" ? "Shared battlefield condition" : "Battlefield-wide";
      return '<article class="active-complication-card shared-effect" data-complication-effect="' + esc(effect.effectId) + '"><strong>' + esc(effect.row.name) + '</strong><span class="effect-owner">' + ownerLabel + ' · selected for ' + esc(effect.sides.map(side => side.name).join(" and ")) + '</span><p>' + esc(effect.row.text) + '</p></article>';
    }
    const side = effect.sides[0];
    const duncanAbsent = profile.hotSpot.id === "new-ivaarsen" && effect.row.duncanOnly && newIvaarsenCharacterAvailability().duncan === false;
    return '<article class="active-complication-card"><strong>' + esc(effect.row.name) + '</strong><span class="effect-owner">Affected force: ' + esc(side.name) + '</span><p>' + esc(duncanAbsent ? effect.row.absentText : effect.row.text) + '</p></article>';
  });
  const extras = activeComplicationExtras(profile);
  if (!effectCards.length && !extras) return "";
  return '<div class="reference-section active-complications" aria-live="polite"><div class="active-complications-head"><div><div class="panel-kicker">ACTIVE COMPLICATIONS</div><p>Applied tactical effects for the current track.</p></div></div><div class="active-complication-grid">' + effectCards.join("") + '</div>' + extras + '</div>';
}

function renderInteractiveComplications(profile) {
  const selection = complicationSelectionState(profile.table);
  if (!selection.expanded && selection.appliedOnce) {
    const activeCount = profile.table.rows.reduce((entries, row, index) => {
      if (isNoComplicationRow(row) || isRollTwiceRow(row)) return entries;
      const key = complicationRowKey(row, index);
      const selectors = profile.participants.filter(item => (selection.applied[item.id] || []).includes(key));
      const legacyShared = new Set(["Sandstorm", "Heatwave", "Unexpected Sandstorm", "Heavy Rainfall"]);
      const sharedEffectId = row.effectScope === "shared-battlefield"
        ? row.effectId
        : legacyShared.has(row.name) || (profile.hotSpot.id === "achernar" && row.name === "Republic Spider" && selectors.length > 1)
          ? profile.hotSpot.id + "::" + row.name
          : null;
      for (const selector of selectors) {
        const side = row.fixedRecipientId ? profile.participants.find(item => item.id === row.fixedRecipientId) || selector : selector;
        for (const effectRow of complicationEffectRows(row)) {
          entries.push({
            row: effectRow,
            side,
            sharedEffectId: effectRow.effectScope === "shared-battlefield" ? effectRow.effectId : sharedEffectId
          });
        }
      }
      return entries;
    }, []);
    let displayedCount = groupComplicationEffectEntries(activeCount).length;
    if (profile.hotSpot.id === "sun-prairie") {
      const firePlacements = profile.participants.filter(side => appliedComplicationNamed(side.id, "Fire and Smoke", profile.table)).length;
      displayedCount += firePlacements;
    }
    return '<div class="complication-selection-status"><div><strong>' + (displayedCount ? displayedCount + ' applied complication' + (displayedCount === 1 ? '' : 's') : 'No active complications') + '</strong><span>Selections are applied to the current track. Reopen the table to revise them.</span></div><button type="button" class="complication-edit-button" data-edit-complications="true">Edit</button></div>';
  }
  if (profile.table.separateBySide) {
    const tables = profile.table.groups.map(group => {
      const side = profile.participants.find(item => item.id === group.sideId);
      const rows = profile.table.rows.map((row, index) => ({ row, index })).filter(({ row }) => complicationRowAppliesToSide(row, group.sideId)).map(({ row, index }) => {
        const key = complicationRowKey(row, index);
        const control = isRollTwiceRow(row)
          ? '<span class="complication-reference-only">Reference only</span>'
          : '<label class="complication-choice"><input type="checkbox" data-complication-choice="' + esc(key) + '" data-complication-force="' + esc(group.sideId) + '"' + ((selection.draft[group.sideId] || []).includes(key) ? " checked" : "") + '><span>' + ((selection.draft[group.sideId] || []).includes(key) ? "Selected" : "Select") + '</span></label>';
        return '<tr><th scope="row"><span class="complication-roll">' + esc(row.roll) + '</span><strong>' + esc(row.name) + '</strong><small>' + esc(row.text) + '</small></th><td>' + control + '</td></tr>';
      }).join("");
      return '<div class="separate-complication-table"><strong>' + esc(group.title || side?.name || "Force") + '</strong><div class="shared-rule-table-wrap"><table class="shared-rule-table command-complications-table interactive-complications"><thead><tr><th scope="col">Resolved effect</th><th scope="col">' + esc(side?.name || "Force") + '</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
    }).join("");
    const provisional = profile.table.provisional?.length ? '<div class="complication-provisional">' + renderProvisionalRules(profile.table.provisional) + '</div>' : "";
    return '<div class="complication-selector"><div class="complication-selector-head"><p>Select the complications already resolved at the table. Roll Twice is a reference instruction; no dice are rolled automatically.</p></div>' + tables + provisional + '<div class="complication-actions"><button type="button" data-apply-complications="true">Apply Complications</button></div></div>';
  }
  const headerCells = profile.participants.map(side => '<th scope="col">' + esc(side.name) + '</th>').join("");
  const rows = profile.table.rows.map((row, index) => {
    const key = complicationRowKey(row, index);
    const cells = profile.participants.map(side => {
      if (isRollTwiceRow(row)) return '<td class="complication-reference-only">Reference only</td>';
      const checked = (selection.draft[side.id] || []).includes(key);
      const type = profile.table.singleResult ? "radio" : "checkbox";
      const name = profile.table.singleResult ? ' name="complication-' + esc(complicationSelectionKey()) + '"' : "";
      return '<td><label class="complication-choice"><input type="' + type + '"' + name + ' data-complication-choice="' + esc(key) + '" data-complication-force="' + esc(side.id) + '"' + (checked ? " checked" : "") + '><span>' + (checked ? "Selected" : "Select") + '</span></label></td>';
    }).join("");
    return '<tr><th scope="row"><span class="complication-roll">' + esc(row.roll) + '</span><strong>' + esc(row.name) + '</strong><small>' + esc(row.text) + '</small></th>' + cells + '</tr>';
  }).join("");
  const provisional = profile.table.provisional?.length ? '<div class="complication-provisional">' + renderProvisionalRules(profile.table.provisional) + '</div>' : "";
  const instruction = profile.table.singleResult
    ? "Select the one shared result already resolved for this track. No dice are rolled automatically."
    : "Select the complications already resolved at the table. Roll Twice is an instruction to resolve additional outcomes outside the browser.";
  return '<div class="complication-selector"><div class="complication-selector-head"><p>' + instruction + '</p></div><div class="shared-rule-table-wrap"><table class="shared-rule-table command-complications-table interactive-complications"><thead><tr><th scope="col">Resolved effect</th>' + headerCells + '</tr></thead><tbody>' + rows + '</tbody></table></div>' + provisional + '<div class="complication-actions"><button type="button" data-apply-complications="true">Apply Complications</button></div></div>';
}

function renderCommandComplicationsSetup(table) {
  if (!table?.rows?.length) return "";
  const profile = currentComplicationProfile(table);
  const body = profile ? renderInteractiveComplications(profile) : renderStaticCommandComplications(table);
  return '<section class="setup-configuration-card command-complications-section"><div class="panel-kicker">COMMAND COMPLICATIONS</div><p class="reference-copy">' + esc(table.note) + '</p>' + body + '<div class="reference-citation">Source: ' + esc(table.ref) + '</div></section>';
}

function renderAppliedComplications(table) {
  if (!table?.rows?.length) return "";
  const profile = currentComplicationProfile(table);
  const selection = profile ? complicationSelectionState(profile.table) : null;
  return profile && selection?.appliedOnce ? renderActiveComplications(profile, selection) : "";
}

function renderBattlefieldTable(table) {
  return renderGeneratorTable("", table);
}

function renderSetupConfiguration(referenceTrack) {
  const battlefieldContainer = $("#battlefield-configuration");
  const complicationContainer = $("#complication-configuration");
  if (!referenceTrack) {
    battlefieldContainer.innerHTML = "";
    complicationContainer.innerHTML = "";
    return;
  }
  const { items, tables } = battlefieldConfigurationParts(referenceTrack);
  const procedure = items.length
    ? '<ul class="rule-list">' + items.map(item => '<li>' + esc(item) + '</li>').join("") + '</ul>'
    : '<p class="reference-copy">No contract-specific mapsheet table or Alpha Strike terrain override applies. Use the selected track’s battlefield rules.</p>';
  const tableMarkup = tables.map(table => '<div class="setup-battlefield-table"><div class="label">' + esc(table.title) + '</div>' + renderBattlefieldTable(table) + '</div>').join("");
  const sequence = currentHotSpotStep()?.sequence || 1;
  const provisionalRules = (referenceTrack.battlefieldProvisional || [])
    .filter(rule => typeof rule === "string" || variantConditionMatches(sequence, rule.whenSelection))
    .map(rule => typeof rule === "string" ? rule : rule.text);
  const provisional = provisionalRules.length ? '<div class="complication-provisional">' + renderProvisionalRules(provisionalRules) + '</div>' : "";
  battlefieldContainer.innerHTML = '<section class="setup-configuration-card battlefield-configuration-card"><div class="panel-kicker">BATTLEFIELD CONFIGURATION</div><p class="setup-configuration-summary">' + esc(battlefieldSelectionSummary(referenceTrack)) + ' · Scale ' + esc(String(state.scale)) + '</p>' + procedure + tableMarkup + provisional + '</section>';
  complicationContainer.innerHTML = renderNewIvaarsenSetupInputs() + renderCommandComplicationsSetup(referenceTrack.commandComplications);

  const setupSummary = $("#hotspot-setup-summary");
  const selected = sideById(state.selectedSide[currentHotSpot().id]);
  const resolved = resolvedHotSpotStep();
  if (setupSummary) setupSummary.textContent = hotSpotSetupSummaryParts(referenceTrack).join(" · ");
}

function renderTemporaryHires(hires, note = "Use these cards after the players resolve hiring under Draconis Reach pp. 29 and 89. Availability, force limits, Support Point costs, repairs, and replacement follow those rules.") {
  if (!hires?.length) return "";
  const cards = hires.map(hire => '<article class="hire-reference-card"><div class="hire-card-head"><span>NAMED TEMPORARY HIRE</span><h4>' + esc(hire.name) + '</h4><p>' + esc(hire.identity) + '</p></div><div class="hire-card-unit">' + esc(hire.unit) + '</div><div class="hire-card-divider"></div><dl><div><dt>Battle Value</dt><dd>' + esc(hire.bv) + '</dd></div><div><dt>Point Value</dt><dd>' + esc(hire.pv) + '</dd></div></dl><div class="hire-card-divider"></div><dl><div><dt>Gunnery</dt><dd>' + esc(hire.gunnery) + '</dd></div><div><dt>Piloting</dt><dd>' + esc(hire.piloting) + '</dd></div><div><dt>Alpha Strike Skill</dt><dd>' + esc(hire.alphaStrikeSkill) + '</dd></div><div><dt>Edge tokens</dt><dd>' + esc(hire.edge) + '</dd></div></dl><div class="hire-card-divider"></div><div class="hire-card-note"><strong>Special abilities</strong><span>' + esc(hire.abilities) + '</span></div><div class="hire-card-note"><strong>Tactical restriction</strong><span>' + esc(hire.restriction) + '</span></div><div class="hire-card-source">' + esc(hire.source) + '</div></article>').join("");
  return '<div class="reference-section temporary-hire-section"><div class="panel-kicker">NAMED TEMPORARY HIRES · TACTICAL REFERENCE ONLY</div><p class="reference-copy">' + esc(note) + '</p><div class="hire-card-grid">' + cards + '</div></div>';
}

function renderTacticalSupport(entries) {
  if (!entries?.length) return "";
  const cards = entries.map(entry => {
    const details = [...(entry.details || []), ...(entry.detailsByScale?.[String(state.scale)] || [])];
    return '<article class="active-complication-extra"><strong>' + esc(entry.title) + '</strong><span>' + esc(entry.association) + '</span><ul class="rule-list">' + details.map(detail => '<li>' + esc(detail) + '</li>').join("") + '</ul><span class="reference-citation">Source: ' + esc(entry.source) + '</span></article>';
  }).join("");
  return '<div class="reference-section tactical-support-section"><div class="panel-kicker">TACTICAL SUPPORT · REFERENCE ONLY</div><div class="active-complication-grid">' + cards + '</div></div>';
}

function tacticalInputKey(name) {
  return [state.hotSpotId, currentHotSpotStep()?.sequence || 1, state.trackId || "pending", name].join("::");
}

function newIvaarsenInput(name, fallback = "") {
  return state.tacticalInputs[tacticalInputKey(name)] ?? fallback;
}

function newIvaarsenCharacterAvailability() {
  const sequence = Number(currentHotSpotStep()?.sequence || 1);
  if (currentHotSpot().id !== "new-ivaarsen") return { duncan: false, siona: false, unresolved: false };
  if (sequence === 1) return { duncan: true, siona: false, unresolved: false };
  if (sequence === 2) {
    const destroyed = newIvaarsenInput("duncan-mech-destroyed-track-1", "unknown");
    return { duncan: destroyed === "no" ? true : destroyed === "yes" ? false : null, siona: false, unresolved: destroyed === "unknown" };
  }
  const destroyed = newIvaarsenInput("duncan-mech-destroyed-prior", "unknown");
  const survived = newIvaarsenInput("duncan-survived-prior", "unknown");
  return {
    duncan: destroyed === "no" ? true : destroyed === "yes" ? false : null,
    siona: survived === "yes" ? true : survived === "no" ? false : null,
    unresolved: destroyed === "unknown" || survived === "unknown"
  };
}

function newIvaarsenSelect(name, label, selected) {
  const options = [["unknown", "Not answered"], ["no", "No"], ["yes", "Yes"]].map(([value, text]) => '<option value="' + value + '"' + (selected === value ? " selected" : "") + '>' + text + '</option>').join("");
  return '<label><span>' + esc(label) + '</span><select data-new-ivaarsen-input="' + esc(name) + '">' + options + '</select></label>';
}

function renderNewIvaarsenSetupInputs() {
  if (currentHotSpot().id !== "new-ivaarsen") return "";
  const sequence = Number(currentHotSpotStep()?.sequence || 1);
  let controls = '<p class="reference-copy">Sir Duncan Atterton participates automatically in Track 1.</p>';
  if (sequence === 2) controls = newIvaarsenSelect("duncan-mech-destroyed-track-1", "Was Duncan’s Sentry destroyed in Track 1?", newIvaarsenInput("duncan-mech-destroyed-track-1", "unknown"));
  if (sequence === 3) {
    controls = newIvaarsenSelect("duncan-mech-destroyed-prior", "Was Duncan’s Sentry destroyed in either prior track?", newIvaarsenInput("duncan-mech-destroyed-prior", "unknown")) +
      newIvaarsenSelect("duncan-survived-prior", "Did Duncan survive both prior tracks?", newIvaarsenInput("duncan-survived-prior", "unknown"));
    const steph = newIvaarsenInput("stephensons-building-total", "");
    const isf = newIvaarsenInput("isf-building-total", "");
    controls += '<label><span>Stephensons destroyed building hexes · Tracks 1–2</span><input type="number" min="0" step="1" value="' + esc(steph) + '" data-new-ivaarsen-input="stephensons-building-total"></label>' +
      '<label><span>ISF destroyed building hexes · Tracks 1–2</span><input type="number" min="0" step="1" value="' + esc(isf) + '" data-new-ivaarsen-input="isf-building-total"></label>' +
      '<p class="control-hint">Include resolved complication adjustments. Exclude the four Defender-designated Strike objective buildings.</p>';
  }
  return '<section class="setup-configuration-card new-ivaarsen-setup-card"><div class="panel-kicker">CURRENT-TRACK AVAILABILITY</div><div class="setup-input-grid">' + controls + '</div></section>';
}

function renderNewIvaarsenCharacterCard(character) {
  return '<article class="hire-reference-card"><div class="hire-card-head"><span>SPECIAL CHARACTER</span><h4>' + esc(character.name) + '</h4><p>' + esc(character.identity) + '</p></div><div class="hire-card-unit">' + esc(character.unit) + '</div><div class="hire-card-divider"></div><dl><div><dt>Battle Value</dt><dd>' + esc(character.bv) + '</dd></div><div><dt>Point Value</dt><dd>' + esc(character.pv) + '</dd></div><div><dt>Gunnery / Piloting</dt><dd>' + esc(character.gunnery + " / " + character.piloting) + '</dd></div><div><dt>Alpha Strike Skill</dt><dd>' + esc(character.alphaStrikeSkill) + '</dd></div></dl><div class="hire-card-source">' + esc(character.source) + '</div></article>';
}

function renderNewIvaarsenTacticalReference() {
  if (currentHotSpot().id !== "new-ivaarsen") return "";
  const availability = newIvaarsenCharacterAvailability();
  const characters = NEW_IVAARSEN_CHARACTERS.filter(character => availability[character.id] === true);
  const characterCards = characters.map(renderNewIvaarsenCharacterCard).join("");
  const pending = availability.unresolved ? '<p class="reference-copy">Complete the availability questions in Hot Spot Setup before treating unresolved special characters as participants.</p>' : "";
  const characterSection = '<div class="reference-section temporary-hire-section"><div class="panel-kicker">STEPHENSONS SPECIAL CHARACTERS</div>' + pending + (characterCards ? '<div class="hire-card-grid">' + characterCards + '</div>' : '<p class="reference-copy">No special character is currently confirmed to participate.</p>') + '</div>';
  const ryukenSection = characters.length ? '<div class="reference-section"><div class="panel-kicker">ISF TACTICAL SUPPORT · RYUKEN-NI</div><p class="reference-copy">Receive ' + characters.length + ' Ryuken-ni support BattleMech' + (characters.length === 1 ? "" : "s") + '—one per participating Stephensons special character, independent of Scale. All pilots are Gunnery 3 / Piloting 4 / Alpha Strike Skill 3. Resolve the unit result at the table.</p>' + renderGeneratorTable("Ryuken-ni Support BattleMechs (1D6)", { headers: ["Roll", "Unit", "BV", "PV"], rows: NEW_IVAARSEN_RYUKEN_SUPPORT }) + '</div>' : "";
  let buildingSection = "";
  if (Number(currentHotSpotStep()?.sequence) === 3) {
    const steph = newIvaarsenInput("stephensons-building-total", "");
    const isf = newIvaarsenInput("isf-building-total", "");
    const complete = steph !== "" && isf !== "";
    const support = complete ? Math.max(0, Number(isf) - Number(steph)) : null;
    buildingSection = '<div class="reference-section"><div class="panel-kicker">TRACK 3 · BUILDING-DIFFERENCE SUPPORT</div><p class="reference-copy">' + (complete ? 'Stephensons receive ' + support + ' additional BSP Mechanized Infantry Platoon' + (support === 1 ? "" : "s") + '. This difference is not multiplied by Scale.' : 'Enter both cumulative building totals in Hot Spot Setup to calculate the additional Stephensons support.') + '</p></div>';
  }
  return characterSection + ryukenSection + buildingSection;
}

function renderCurrentTrackInputs() {
  const hotSpot = currentHotSpot();
  const step = currentHotSpotStep();
  if (hotSpot.id === "act-of-piracy") {
    const scenario = actOfPiracyScenario();
    if (!scenario.attackedSystem) {
      return '<div class="reference-section current-track-inputs"><div class="panel-kicker">SYSTEM RESOLUTION REQUIRED</div><p class="reference-copy">Select the Pirates’ attacked system in Hot Spot Setup before applying battlefield terrain or system-specific tactical effects.</p></div>';
    }
    const system = scenario.attackedSystem;
    if (system.id === "de-berry") {
      return '<div class="reference-section current-track-inputs"><div class="panel-kicker">DE BERRY · APPLIED TACTICAL CONDITION</div><p class="reference-copy"><strong>Ice:</strong> all water and Level 1+ hexes are covered in ice. Piloting or driving Skill checks made while on an ice hex receive a +4 target number modifier. For Alpha Strike, all terrain features cost an additional +1 MP per inch from ice.</p></div>';
    }
    if (system.id === "tancredi-iv") {
      return '<div class="reference-section current-track-inputs"><div class="panel-kicker">TANCREDI IV · PAYMENT REFERENCE</div><p class="reference-copy">The raiding player may designate some or all applicable Piracy Payment as repair-only funds. Double those designated Support Points and keep them in a separate repair-only pool. Add 1 to the Piracy Component Table roll. Resolve payment and repairs outside the browser.</p></div>';
    }
    if (system.id === "mirach") {
      return '<div class="reference-section current-track-inputs"><div class="panel-kicker">MIRACH · APPLIED TACTICAL CONDITION</div><p class="reference-copy"><strong>Low gravity:</strong> BattleTech units receive +1 Walking/Cruising MP; Alpha Strike units receive +2 inches MV. Add 1 to the Piracy Component Table roll outside the browser.</p></div>';
    }
    if (system.id === "hazelhurst") {
      return '<div class="reference-section current-track-inputs"><div class="panel-kicker">HAZELHURST · APPLIED TACTICAL CONDITION</div><p class="reference-copy"><strong>Casks of wine:</strong> units carrying the raid objective may not move more than half their MV or 8 inches, whichever is slower, without destroying the cargo.</p></div>';
    }
    if (system.id === "johnsondale") {
      if (!scenario.johnsondaleChoice) {
        return '<div class="reference-section current-track-inputs"><div class="panel-kicker">JOHNSONDALE · RAID OBJECTIVE REQUIRED</div><p class="reference-copy">Choose Components or Completed vehicles in Hot Spot Setup before applying Johnsondale’s tactical support.</p></div>';
      }
      if (scenario.johnsondaleChoice === "components") {
        return '<div class="reference-section current-track-inputs"><div class="panel-kicker">JOHNSONDALE · COMPONENTS</div><p class="reference-copy">Use standard Objective Raid components. No Johnsondale-specific Striker support or captured-vehicle replacement applies.</p></div>';
      }
      return '<div class="reference-section tactical-support-section"><div class="panel-kicker">TACTICAL SUPPORT · JOHNSONDALE COMPLETED VEHICLES</div><div class="active-complication-grid"><article class="active-complication-extra"><strong>Shutdown objective Strikers</strong><span>Each objective component is represented by a shutdown Striker Light Tank.</span></article><article class="active-complication-extra"><strong>Law support · ' + scenario.strikerSupportCount + ' Striker Light Tanks</strong><span>Two free scenario-provided Striker Light Tanks per Scale; current Scale ' + state.scale + '.</span></article><article class="active-complication-extra"><strong>Captured vehicles and BSP substitution</strong><span>Captured component Strikers join the capturing force after the contract instead of being sold as ordinary components. If using BSP, each retrieved component provides one free Striker for one track, maximum one per Scale per track. Resolve future roster and support use outside the browser.</span></article></div></div>';
    }
    return "";
  }
  if (hotSpot.id === "xhosa-vii" && Number(step?.sequence) === 2) {
    const deliveredObjective = currentObjectives().find(item => item.id === "supply-trucks-exit");
    const stoppedObjective = currentObjectives().find(item => item.id === "stop-supply-trucks");
    const outcome = evaluateXhosaTruckOutcome(getProgress(deliveredObjective, "attacker"), getProgress(stoppedObjective, "defender"));
    const status = outcome.unresolved
      ? outcome.unresolved + " truck outcome" + (outcome.unresolved === 1 ? " remains" : "s remain") + " unresolved. Current counts are provisional during play."
      : (outcome.tacticalWinner === "federated-suns" ? "Federated Suns" : "Draconis Combine") + " is the special Track 2 tactical winner; Track 3 resolves to " + (outcome.trackThreeBranch === "assault" ? "Assault" : "Strike") + ".";
    return '<div class="reference-section current-track-inputs"><div class="panel-kicker">LOGISTICS TRUCK OUTCOME · CURRENT TRACK</div><p class="reference-copy"><strong>Delivered: ' + outcome.delivered + ' · Prevented: ' + outcome.stopped + ' · Unresolved: ' + outcome.unresolved + '</strong></p><p class="reference-copy">' + esc(status) + ' Ordinary objective VP remains unchanged and separately governs general successful-track completion and combat-pay adjudication.</p>' + renderProvisionalRules([resolvedHotSpotStep()?.variant?.provisionalRules?.[0]].filter(Boolean)) + '</div>';
  }
  if (hotSpot.id === "tigress" && Number(step?.sequence) === 1) {
    const training = state.tigressPhase === "training";
    return '<div class="reference-section current-track-inputs tigress-phase-control"><div class="panel-kicker">TRACK 1 · CURRENT PHASE</div><label><span>Tabletop phase</span><select data-tigress-phase="true"><option value="training"' + (training ? ' selected' : '') + '>Training — Meeting Engagement</option><option value="recon"' + (!training ? ' selected' : '') + '>Actual Roughriders arrived — Recon Turn 1</option></select></label><p class="reference-copy">' + esc(training ? "Record the transition only when the actual Roughriders arrive. Training objective progress is preserved and Meeting Engagement’s normal ending conditions do not end Track 1 before the scheduled arrival." : "Start a new Recon clock at Recon Turn 1. Legion Trainers’ retained training VP and completed training objectives are preserved separately; the phase can be corrected without duplicating score.") + '</p>' + renderProvisionalRules(hotSpot.contractReference.provisional.slice(1)) + '</div>';
  }
  if (hotSpot.id === "protection") {
    const variant = resolvedHotSpotStep()?.variant;
    const battlefield = variant?.selectionControls?.find(item => item.id === "battlefield-type");
    const response = variant?.selectionControls?.find(item => item.id === "atlantis-response");
    const battlefieldValue = battlefield ? selectedVariantSelection(step.sequence, battlefield) : "standard";
    const responseValue = response ? selectedVariantSelection(step.sequence, response) : "";
    const battlefieldEffect = battlefieldValue === "atlantis"
      ? responseValue === "check-fire"
        ? '<div class="reference-section current-track-inputs"><div class="panel-kicker">ATLANTIS CITY · APPLIED TACTICAL MODIFIER</div><p class="reference-copy"><strong>Check fire:</strong> apply a +1 target number modifier to all Gunnery rolls for this track. The Defender gains +1 Reputation regardless of outcome; record Reputation outside the browser.</p></div>'
        : responseValue === "engage"
          ? '<div class="reference-section current-track-inputs"><div class="panel-kicker">ATLANTIS CITY · DEFENDER RESPONSE</div><p class="reference-copy">Engage without restriction: no Gunnery modifier applies. The Defender takes the printed −1 Reputation consequence outside the browser.</p></div>'
          : '<div class="reference-section current-track-inputs"><div class="panel-kicker">ATLANTIS CITY · DEFENDER RESPONSE REQUIRED</div><p class="reference-copy">Choose the Defender’s response in Hot Spot Setup before applying tactical modifiers.</p></div>'
      : "";
    const capture = protectionTrackFourActive()
      ? '<div class="reference-section current-track-inputs"><div class="panel-kicker">MOBILE HQ · CURRENT TRACK</div><p class="reference-copy">Kanagawa Group receives one additional Mobile HQ asset with Gunnery 4, Piloting 5, Alpha Strike Skill 4, and hover movement. If Platinum Sands holds it captured at the end of the final turn, the objective tracker credits all three Platinum Sands objectives and Platinum Sands alone successfully completes the track.</p><p class="reference-copy">Maximum combat bonus entitlement: 150 percent, or 750 Support Points per Scale. Combat-pay administration remains outside the browser.</p>' + renderProvisionalRules([hotSpot.contractReference.provisional[3]]) + '</div>'
      : "";
    return battlefieldEffect + capture;
  }
  if (hotSpot.id === "pascagoula" && Number(step?.sequence) === 1) {
    return '<div class="reference-section current-track-inputs"><div class="panel-kicker">SPECIAL TACTICAL VICTORY</div><p class="reference-copy">Use Pascagoula’s special tactical victory condition to determine the Track 1 winner manually. The Objective Raid VP tracker remains available for objective scoring and does not select the tactical winner.</p>' + renderProvisionalRules(PASCAGOULA_PROVISIONAL_RULES) + '</div>';
  }
  if (hotSpot.id === "achernar" && [4, 5].includes(Number(step?.sequence))) {
    const maximum = state.scale * 2;
    const key = tacticalInputKey("defector-survivors");
    const selected = Math.min(maximum, Math.max(0, Number(state.tacticalInputs[key] ?? maximum)));
    const options = Array.from({ length: maximum + 1 }, (_, value) => '<option value="' + value + '"' + (value === selected ? " selected" : "") + '>' + value + '</option>').join("");
    return '<div class="reference-section current-track-inputs"><div class="panel-kicker">CURRENT-TRACK DEFECTOR FORCE</div><label><span>Surviving J. Edgar Hover Tanks entering this track</span><select data-achernar-current-survivors="true">' + options + '</select></label><p class="reference-copy">Maximum ' + maximum + ' at Scale ' + state.scale + '. Use only vehicles that survived the preceding track. Gunnery 4 · Piloting 5 · Alpha Strike Skill 4.</p></div>';
  }
  if (hotSpot.id === "dahar-iv") {
    const mission = daharMissionState();
    const controls = ["garrison", "raid"].map(sideId => {
      const side = hotSpot.sides.find(item => item.id === sideId);
      const selections = mission[sideId].repurposedRolls;
      return '<div class="support-force-group"><strong>' + esc(side.name) + '</strong>' + Array.from({ length: state.scale }, (_, index) => {
        const options = DAHAR_INDUSTRIALMECH_TABLE.map(row => '<option value="' + esc(row[0]) + '"' + (String(selections[index] ?? "") === row[0] ? " selected" : "") + '>' + esc(row[1] + " · " + row[2] + " BV / " + row[3] + " PV") + '</option>').join("");
        const selectedRow = DAHAR_INDUSTRIALMECH_TABLE.find(row => String(row[0]) === String(selections[index] ?? ""));
        const selectedIdentity = selectedRow ? selectedRow[1] + " · " + selectedRow[2] + " BV / " + selectedRow[3] + " PV" : "No IndustrialMech selected.";
        const identityId = "dahar-unit-identity-" + sideId + "-" + index;
        return '<label><span>Repurposed unit ' + (index + 1) + '</span><select data-dahar-unit-side="' + sideId + '" data-dahar-unit-index="' + index + '" aria-describedby="' + identityId + '" title="' + esc(selectedIdentity) + '"><option value="">Select resolved IndustrialMech</option>' + options + '</select><span class="selected-unit-identity" id="' + identityId + '">' + esc(selectedIdentity) + '</span></label>';
      }).join("") + '</div>';
    }).join("");
    return '<div class="reference-section current-track-inputs"><div class="panel-kicker">TACTICAL SUPPORT · REPURPOSED EQUIPMENT</div><p class="reference-copy">Each side receives one resolved IndustrialMech MOD per Scale for this mission. Crews use Gunnery 4, Piloting 5, or Alpha Strike Skill 4. These units do not count toward normal Scale limits and deploy with their track force.</p><div class="support-force-grid">' + controls + '</div></div>';
  }
  if (hotSpot.id === "alta-vista" && appliedComplicationNamed("escobar", "Withdrawal Order")) {
    const key = tacticalInputKey("withdrawal-response");
    const selected = state.tacticalInputs[key] || "not-recorded";
    const outcomes = {
      "not-recorded": "Choose the current response when the order triggers.",
      "both-comply": "Both sides successfully complete the track; the Ravens take the tactical victory. Retreat is prohibited.",
      "escobar-complies-ravens-refuse": "The Ravens are detained and there is no contract victor. Retreat is prohibited.",
      "escobar-refuses-ravens-comply": "Escobar breaks contract; there is no contract victor. Retreat is prohibited.",
      "both-refuse": "Both sides are detained; Escobar breaks contract and there is no contract victor. Retreat is prohibited."
    };
    const options = [["not-recorded", "Choose response"], ["both-comply", "Both comply"], ["escobar-complies-ravens-refuse", "Escobar complies; Ravens refuse"], ["escobar-refuses-ravens-comply", "Escobar refuses; Ravens comply"], ["both-refuse", "Both refuse"]].map(([value, label]) => '<option value="' + value + '"' + (selected === value ? " selected" : "") + '>' + label + '</option>').join("");
    return '<div class="reference-section current-track-inputs"><div class="panel-kicker">WITHDRAWAL ORDER · CURRENT TRACK</div><label><span>Players’ response</span><select data-alta-withdrawal-response="true">' + options + '</select></label><p class="reference-copy">' + esc(outcomes[selected]) + '</p></div>';
  }
  return "";
}

function renderContractReference() {
  const reference = currentHotSpot().contractReference;
  if (!reference) return "";
  const section = (title, items) => items?.length ? '<div><strong>' + esc(title) + '</strong><ul class="rule-list">' + items.map(item => '<li>' + esc(item) + '</li>').join("") + '</ul></div>' : "";
  const tables = (reference.tables || []).map(table => '<div><strong>' + esc(table.title) + '</strong>' + renderGeneratorTable("", table) + '</div>').join("");
  return '<details class="reference-section contract-reference"><summary>Contract Reference<span>Campaign progression and victory</span></summary>' + section("Contracts", reference.summary) + section("Progression", reference.progression) + tables + section("Victory", reference.victory) + section("Purchase Options", reference.purchaseOptions) + (reference.provisional?.length ? '<div><strong>Provisional interpretations</strong>' + renderProvisionalRules(reference.provisional) + '</div>' : "") + '</details>';
}

function renderReference() {
  const track = currentTrack();
  const hotSpot = currentHotSpot();
  const step = currentHotSpotStep();
  const resolved = resolvedHotSpotStep();
  if (!track) {
    renderSetupConfiguration(null);
    if (resolved?.variant?.nonPlayable) {
      const variant = resolved.variant;
      const restrictions = (variant.setupDetails || []).map(item => "<li>" + esc(item) + "</li>").join("");
      const notes = (variant.special || []).map(item => "<li>" + esc(item) + "</li>").join("");
      const sourceReferenceText = variant.sourceRefs?.join(" · ") || hotSpot.source;
      $("#mission-reference").innerHTML = '<article class="panel mission-card"><div class="mission-card-head"><div class="eyebrow">NON-PLAYABLE STRATEGIC HEX</div><h2>' + esc(variant.displayName) + '</h2><p>' + esc(variant.summary) + '</p></div><div class="reference-section hot-spot-reference"><div class="panel-kicker">LOCATION & RESTRICTION</div><div class="brief-grid"><div><span>Location</span><strong>' + esc(hotSpot.name) + '</strong><small>' + esc(hotSpot.region + " · " + hotSpot.terrain) + '</small></div><div><span>Strategic hex type</span><strong>' + esc(step?.label || variant.displayName) + '</strong><small>No tactical track is generated</small></div></div></div><div class="reference-section"><div class="panel-kicker">SOURCE RESTRICTION</div><ul class="rule-list">' + restrictions + '</ul></div><div class="reference-section"><div class="panel-kicker">REFERENCE NOTES</div><ul class="rule-list">' + notes + '</ul></div><div class="reference-citation">Sources: ' + esc(sourceReferenceText) + '</div></article>';
      return;
    }
    const pendingText = resolved?.unresolved ? "Choose the previous track winner to resolve this mission." : "The selected source result does not produce a standard tactical track.";
    $("#mission-reference").innerHTML = '<article class="panel mission-card"><div class="mission-card-head"><div class="eyebrow">HOT SPOT LOCATION · ' + esc(hotSpot.name) + '</div><h2>Mission Brief</h2><p>' + esc(pendingText) + '</p></div><div class="reference-section"><div class="panel-kicker">LOCATION & SEQUENCE</div><ul class="rule-list"><li>' + esc(hotSpot.name + " · " + hotSpot.region + " · " + hotSpot.terrain) + '</li><li>' + esc(step?.label || "Track") + " · " + esc(hotSpot.source) + '</li></ul></div><div class="reference-section"><div class="panel-kicker">SOURCE NOTE</div><p class="reference-copy">' + esc(hotSpot.note || "Resolve the Hot Spot setup controls above before opening the standard mission reference.") + '</p></div></article>';
    return;
  }
  const referenceTrack = resolved?.variant ? { ...track, ...resolved.variant } : track;
  const pageReference = referenceTrack.pageRef || "p. " + referenceTrack.page;
  const scaleNotes = scaleNotesFor(referenceTrack, state.scale).filter(note => !isBattlefieldConfigurationText(note));
  const scaleNotesMarkup = scaleNotes.length
    ? scaleNotes.map(note => "<li>" + esc(note) + "</li>").join("")
    : "<li>No additional Scale-dependent exception is recorded for this track.</li>";
  const setup = referenceTrack.setup.filter(item => !isBattlefieldConfigurationText(item)).map(item => "<li>" + esc(item) + "</li>").join("");
  const setupDetails = (referenceTrack.setupDetails || []).filter(item => !isBattlefieldConfigurationText(item)).map(item => "<li>" + esc(item) + "</li>").join("");
  const objectives = renderReferenceObjectives(referenceTrack.objectives, referenceTrack);
  const special = referenceTrack.special.filter(item => !isBattlefieldConfigurationText(item)).map(item => "<li>" + esc(item) + "</li>").join("");
  const commandComplications = renderAppliedComplications(referenceTrack.commandComplications);
  const currentTrackInputs = renderCurrentTrackInputs();
  const contractReference = renderContractReference();
  const tacticalSupport = renderTacticalSupport(referenceTrack.tacticalSupport);
  const temporaryHires = renderTemporaryHires(referenceTrack.temporaryHires, referenceTrack.temporaryHireNote);
  const trackProvisional = referenceTrack.provisionalRules?.length ? '<div class="reference-section"><div class="panel-kicker">PROVISIONAL INTERPRETATIONS</div>' + renderProvisionalRules(referenceTrack.provisionalRules) + '</div>' : "";
  const newIvaarsenTacticalReference = renderNewIvaarsenTacticalReference();
  const referenceTables = (referenceTrack.referenceTables || []).filter(table => !isBattlefieldConfigurationTable(table)).map(table => '<div class="reference-section"><div class="panel-kicker">' + esc(table.title) + '</div>' + renderGeneratorTable("", table) + '</div>').join("");
  const sourceReferenceText = referenceTrack.sourceRefs?.join(" · ") || SOURCES.primary + " · selected track " + pageReference;
  const scaleSection = hotSpot.hideScaleSelector ? "" : '<div class="reference-section scale-section"><div class="panel-kicker">SCALE ' + esc(String(state.scale)) + ' VIEW</div><ul class="rule-list">' + scaleNotesMarkup + "</ul></div>";

  const attackerSide = sideById(resolved?.attacker);
  const defenderSide = sideById(resolved?.defender);
  const hotSpotBrief = '<div class="reference-section hot-spot-reference"><div class="panel-kicker">HOT SPOT MISSION BRIEF</div><div class="brief-grid"><div><span>Location</span><strong>' + esc(hotSpot.name) + '</strong><small>' + esc(hotSpot.region + " · " + hotSpot.terrain) + '</small></div><div><span>Sequence</span><strong>' + esc(step?.label || "Track") + '</strong></div><div style="--side-color:' + esc(attackerSide?.color || FACTION_COLORS.Local) + '"><span>Attacker</span><strong>' + esc(attackerSide?.name || "Attacker") + '</strong><small>' + esc(attackerSide?.faction || "Source-defined role") + '</small></div><div style="--side-color:' + esc(defenderSide?.color || FACTION_COLORS.Local) + '"><span>Defender</span><strong>' + esc(defenderSide?.name || "Defender") + '</strong><small>' + esc(defenderSide?.faction || "Source-defined role") + '</small></div></div>' + (hotSpot.note ? '<p class="reference-note">' + esc(hotSpot.note) + '</p>' : '') + '</div>';

  renderSetupConfiguration(referenceTrack);

  $("#mission-reference").innerHTML =
    '<article class="panel mission-card">' +
      '<div class="mission-card-head"><div class="eyebrow">SELECTED TRACK · ' + pageReference + (referenceTrack.type ? " · " + esc(referenceTrack.type) : "") + '</div><h2>Mission Brief</h2><p>' + esc(referenceTrack.summary) + '</p></div>' +
      hotSpotBrief +
      contractReference +
      currentTrackInputs +
      trackProvisional +
      newIvaarsenTacticalReference +
      '<div class="reference-section"><div class="panel-kicker">BATTLEFIELD & SETUP</div><ul class="rule-list">' + setup + "</ul></div>" +
      (setupDetails ? '<div class="reference-section"><div class="panel-kicker">DEPLOYMENT DETAILS</div><ul class="rule-list">' + setupDetails + "</ul></div>" : "") +
      scaleSection +
      '<div class="reference-section"><div class="panel-kicker">OBJECTIVES & VICTORY POINTS</div><ul class="objective-reference-list">' + objectives + "</ul></div>" +
      '<div class="reference-section"><div class="panel-kicker">SPECIAL RULES, TRACK END & SALVAGE</div><ul class="rule-list">' + special + "</ul></div>" +
      referenceTables +
      commandComplications +
      tacticalSupport +
      temporaryHires +
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
  const adjusted = daharGibberishApplies(side)
    ? '<span class="adjusted-vp">Earned after Complication 7: ' + objectiveEarnedVp(objective, side, display) + ' VP</span>'
    : protectionCaptureOverride() && side === "attacker"
      ? '<span class="adjusted-vp">Automatically credited by final-turn Mobile HQ capture; manual progress remains recorded below.</span>'
      : "";
  if (objective.repeatable) {
    const atIndividualMaximum = Number(progress) >= (objective.maxCount ?? Infinity);
    const atCombinedMaximum = objective.combinedGroup && Number.isFinite(objective.combinedMax) && combinedObjectiveProgress(objective) >= objective.combinedMax;
    return '<div class="counter-control"><button type="button" class="counter-button" data-action="decrement" data-objective="' + esc(objective.id) + '" data-side="' + side + '" aria-label="Decrease ' + esc(display.name) + '"' + (Number(progress) <= 0 ? " disabled" : "") + '>−</button>' +
      '<output>' + progress + '</output><button type="button" class="counter-button" data-action="increment" data-objective="' + esc(objective.id) + '" data-side="' + side + '" aria-label="Increase ' + esc(display.name) + '"' + (atIndividualMaximum || atCombinedMaximum ? " disabled" : "") + '>+</button>' +
      '<span class="counter-label">completed</span></div>' + vpControl + adjusted;
  }
  return '<label class="check-control"><input type="checkbox" data-action="toggle" data-objective="' + esc(objective.id) + '" data-side="' + side + '"' + (progress ? " checked" : "") + '><span class="checkmark"></span><span class="control-copy">' + (progress ? "Complete" : "Open") + "</span></label>" + vpControl + adjusted;
}

function renderTracker() {
  const track = currentTrack();
  const resolved = resolvedHotSpotStep();
  const variant = resolved?.variant;
  const objectives = variant?.objectives || track?.objectives || [];
  const displayedObjectives = resolved?.rolePending ? [] : objectives;
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
  const extractionRow = track && pascagoulaExtractionRequired()
    ? '<tr class="prerequisite-row"><th scope="row"><div class="objective-title">Defender scoring prerequisite</div><div class="objective-rule">' + esc(variant?.defenderExtractionText || "At least one Ryu successfully extracted.") + '</div><div class="objective-vp">Orders remains available. Other Defender objectives score 0 VP until this is complete; recorded progress is preserved.</div></th><td class="attacker-col"><span class="not-applicable" aria-label="Not applicable">—</span></td><td class="defender-col"><label class="check-control"><input type="checkbox" data-pascagoula-ryu-extracted="true"' + (pascagoulaRyuExtracted() ? " checked" : "") + '><span class="checkmark"></span><span class="control-copy">' + (pascagoulaRyuExtracted() ? "Extracted" : "Not extracted") + '</span></label></td></tr>'
    : "";
  const protectionCaptureRow = track && protectionTrackFourActive()
    ? '<tr class="prerequisite-row protection-capture-row"><th scope="row"><div class="objective-title">Mobile HQ final-turn capture</div><div class="objective-rule">Platinum Sands holds the Mobile HQ captured at the end of the final turn.</div><div class="objective-vp">When checked, all three Platinum Sands objectives are credited for 450 effective VP and Platinum Sands alone successfully completes the track. Kanagawa Group progress is preserved.</div></th><td class="attacker-col"><label class="check-control"><input type="checkbox" data-protection-mobile-hq-captured="true"' + (protectionCaptureOverride() ? " checked" : "") + '><span class="checkmark"></span><span class="control-copy">' + (protectionCaptureOverride() ? "Captured" : "Not captured") + '</span></label></td><td class="defender-col"><span class="not-applicable" aria-label="Not applicable">—</span></td></tr>'
    : "";
  const tigressRetainedRow = track && currentHotSpot().id === "tigress" && Number(currentHotSpotStep()?.sequence) === 1 && state.tigressPhase === "recon"
    ? '<tr class="prerequisite-row tigress-retained-row"><th scope="row"><div class="objective-title">Retained training result</div><div class="objective-rule">Legion Trainers retain VP earned during the training phase. A completed Legion Trainers training objective satisfies their Track 1 objective-completion prerequisite; they do not also need a Recon objective. Trainee-earned VP controlled by the Roughriders player does not carry forward.</div><div class="objective-vp">Separate contribution derived from the preserved Meeting Engagement objective record.</div></th><td class="attacker-col"><span class="not-applicable" aria-label="Not applicable">—</span></td><td class="defender-col"><div class="calculated-vp"><strong>' + tigressRetainedTrainingVp() + ' VP</strong><span>' + tigressCompletedTrainingObjectiveCount() + ' completed training objective' + (tigressCompletedTrainingObjectiveCount() === 1 ? '' : 's') + '</span></div></td></tr>'
    : "";
  const pendingRoleRow = '<tr><th scope="row" colspan="3" class="pending-track">' + esc(resolved?.variant?.roleChoicePendingInstruction || "Select the Attacker to display objectives.") + '</th></tr>';
  $("#objective-body").innerHTML = track ? (resolved?.rolePending ? pendingRoleRow : extractionRow + protectionCaptureRow + tigressRetainedRow + displayedObjectives.map(objective => {
    const display = displayObjective(objective, variant);
    const calculatedDeny = isReconDeny(objective);
    const objectiveText = display.text;
    const denyVp = calculatedDeny ? objectiveEarnedVp(objective, "defender", display) : 0;
    const vpLabel = calculatedDeny ? "Projected: " + denyVp + " VP" : (display.vpOptions ? display.vpOptions.join(" / ") + " VP (select value)" : display.vp + " VP" + (display.repeatable ? " each" : ""));
    const extractionNote = pascagoulaObjectiveSuppressed(objective, "defender") ? '<div class="calculated-vp-note">Defender VP is currently suppressed until at least one Ryu is extracted.</div>' : "";
    const denyDeadline = currentHotSpot().id === "tigress" && Number(currentHotSpotStep()?.sequence) === 1 ? "Recon Turn 8" : "Turn 8";
    const projectionNote = (calculatedDeny ? '<div class="calculated-vp-note">Projected Deny VP follows the printed Deny schedule as the Attacker completes objectives. Remaining Deny points are awarded at the end of ' + denyDeadline + '.' + (daharGibberishApplies("defender") ? " Dahar Complication 7 deducts 20 VP once from the earned Deny objective." : "") + '</div>' : "") + extractionNote;
    return '<tr><th scope="row"><div class="objective-title">' + esc(display.name) + '</div><div class="objective-rule">' + esc(objectiveText) + '</div><div class="objective-vp">' + vpLabel + "</div>" + projectionNote + "</th>" +
      '<td class="attacker-col">' + objectiveControl(objective, "attacker", display) + "</td>" +
      '<td class="defender-col">' + objectiveControl(objective, "defender", display) + "</td></tr>";
  }).join("")) :
    '<tr><th scope="row" colspan="3" class="pending-track">' + esc(resolved?.variant?.nonPlayable ? "This strategic hex cannot be entered and has no tactical objectives." : "Resolve the Hot Spot controls above to load the standard mission objectives.") + '</th></tr>';
  renderScore();
}

function renderScore() {
  const attacker = trackScore("attacker");
  const defender = trackScore("defender");
  const protectionOutcome = evaluateProtectionPursuit({
    captureHeld: protectionCaptureOverride(),
    attackerVp: attacker,
    defenderVp: defender,
    attackerObjectives: completedObjectiveCount("attacker"),
    defenderObjectives: completedObjectiveCount("defender")
  });
  const max = Math.max(attacker, defender, 1);
  $("#attacker-score").textContent = attacker.toLocaleString("en-US");
  $("#defender-score").textContent = defender.toLocaleString("en-US");
  $("#attacker-bar").style.width = (attacker / max * 100) + "%";
  $("#defender-bar").style.width = (defender / max * 100) + "%";
  $("#score-difference").textContent = protectionOutcome.attackerSuccessful && protectionCaptureOverride()
    ? "Platinum Sands successfully completes the track · Kanagawa Group does not"
    : attacker === defender ? (currentHotSpot().id === "act-of-piracy" ? "Tie · neither side successfully completes the track" : "Tie") : (attacker > defender ? "Attacker leads by " + (attacker - defender) : "Defender leads by " + (defender - attacker));
  $("#score-difference").className = "difference " + (protectionCaptureOverride() ? "attacker-lead" : attacker === defender ? "tie" : attacker > defender ? "attacker-lead" : "defender-lead");
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
  const branch = state.hotSpotId === "pascagoula" && Number(state.trackSequence[state.hotSpotId]) === 2 ? "::" + (selectedWinner(1) || "unresolved") : "";
  const base = state.hotSpotId + "::" + (state.trackSequence[state.hotSpotId] || "") + "::";
  const prefixes = state.hotSpotId === "tigress" && Number(state.trackSequence[state.hotSpotId]) === 1
    ? [base + "meeting-engagement::", base + "recon::"]
    : [base + (state.trackId || "") + branch + "::"];
  Object.keys(state.progress).filter(key => prefixes.some(prefix => key.startsWith(prefix))).forEach(key => delete state.progress[key]);
  Object.keys(state.vpSelections).filter(key => prefixes.some(prefix => key.startsWith(prefix))).forEach(key => delete state.vpSelections[key]);
  if (pascagoulaExtractionRequired()) delete state.tacticalInputs[pascagoulaExtractionKey()];
  if (protectionTrackFourActive()) delete state.tacticalInputs[protectionCaptureKey()];
  renderAll();
}

$("#hot-spot-select").addEventListener("change", event => {
  state.hotSpotId = event.target.value;
  state.trackId = null;
  renderAll();
});

$("#hot-spot-track-select").addEventListener("change", event => {
  if (interactiveComplicationContracts.has(state.hotSpotId) && state.hotSpotId !== "tigress") clearComplicationSelections(state.hotSpotId);
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

function updateLeBlancMissionField(target) {
  if (currentHotSpot().id !== "le-blanc") return false;
  const mission = leBlancMissionState();
  const factionSide = target.dataset.leblancFaction;
  if (factionSide) {
    mission.participatingFactions[factionSide] = target.value;
    return true;
  }
  const rightsSide = target.dataset.leblancRights;
  if (rightsSide) {
    mission.commandRights[rightsSide] = target.value;
    return true;
  }
  const complicationField = target.dataset.leblancComplication;
  const complicationSide = target.dataset.leblancSide;
  if (!complicationField || !complicationSide) return false;
  mission.complications[complicationSide][complicationField] = target.value === "" ? null : Number(target.value);
  if (complicationField === "initial") {
    mission.complications[complicationSide].secondaryOne = null;
    mission.complications[complicationSide].secondaryTwo = null;
  }
  return true;
}

function updateLucerneMissionField(target) {
  if (currentHotSpot().id !== "lucerne") return false;
  const mission = lucerneMissionState();
  const rightsSide = target.dataset.lucerneRights;
  if (rightsSide) {
    mission.commandRights[rightsSide] = target.value;
    return true;
  }
  const complicationField = target.dataset.lucerneComplication;
  const replacementField = target.dataset.lucerneReplacements;
  const side = target.dataset.lucerneSide;
  if (!side || (!complicationField && !replacementField)) return false;
  if (replacementField) {
    mission.complications[side][replacementField] = target.value.split(",").map(value => Number(value.trim())).filter(value => Number.isInteger(value) && value >= 1 && value <= 6);
    return true;
  }
  mission.complications[side][complicationField] = target.value === "" ? null : Number(target.value);
  if (complicationField === "initial") {
    mission.complications[side].secondaryOne = null;
    mission.complications[side].secondaryTwo = null;
    mission.complications[side].replacementOne = [];
    mission.complications[side].replacementTwo = [];
  }
  if (complicationField === "secondaryOne") mission.complications[side].replacementOne = [];
  if (complicationField === "secondaryTwo") mission.complications[side].replacementTwo = [];
  return true;
}

$("#hotspot-campaign-state").addEventListener("input", event => {
  if (updateAchernarCampaignField(event.target)) return;
  if (event.target.dataset.lucerneReplacements) {
    updateLucerneMissionField(event.target);
    return;
  }
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
  if (updateLeBlancMissionField(event.target)) {
    renderAll();
    return;
  }
  if (updateLucerneMissionField(event.target)) {
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
  const resetLeBlanc = event.target.closest("[data-reset-leblanc]");
  if (resetLeBlanc) {
    if (!window.confirm("Reset the current Le Blanc tactical setup?")) return;
    state.leBlancMission = newLeBlancMissionState();
    clearComplicationSelections("le-blanc");
    renderAll();
    return;
  }
  const resetLucerne = event.target.closest("[data-reset-lucerne]");
  if (resetLucerne) {
    if (!window.confirm("Reset the current Lucerne tactical setup?")) return;
    state.lucerneMission = newLucerneMissionState();
    clearComplicationSelections("lucerne");
    renderAll();
    return;
  }
  const finalize = event.target.closest("[data-dahar-finalize]");
  if (finalize) {
    const entry = daharMissionState();
    if (!complicationSelectionState()?.appliedOnce) {
      window.alert("Apply the resolved Command Complications before finalizing this track.");
      return;
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

$("#mission-reference").addEventListener("change", event => {
  if (event.target.dataset.tigressPhase) {
    state.tigressPhase = event.target.value === "recon" ? "recon" : "training";
    renderAll();
    return;
  }
  if (event.target.dataset.melcherSupportRecipient) {
    state.tacticalInputs[tacticalInputKey("melcher-support-" + event.target.dataset.melcherSupportRecipient)] = event.target.value;
    renderReference();
    return;
  }
  if (event.target.dataset.achernarCurrentSurvivors) {
    state.tacticalInputs[tacticalInputKey("defector-survivors")] = Number(event.target.value);
    renderReference();
    return;
  }
  if (event.target.dataset.daharUnitSide) {
    const mission = daharMissionState();
    mission[event.target.dataset.daharUnitSide].repurposedRolls[Number(event.target.dataset.daharUnitIndex)] = event.target.value || null;
    renderReference();
    return;
  }
  if (event.target.dataset.altaWithdrawalResponse) {
    state.tacticalInputs[tacticalInputKey("withdrawal-response")] = event.target.value;
    renderReference();
    return;
  }
});

$("#hotspot-setup").addEventListener("change", event => {
  const newIvaarsenInputControl = event.target.closest("[data-new-ivaarsen-input]");
  if (newIvaarsenInputControl) {
    const name = newIvaarsenInputControl.dataset.newIvaarsenInput;
    const value = newIvaarsenInputControl.type === "number" ? (newIvaarsenInputControl.value === "" ? "" : Math.max(0, Math.floor(Number(newIvaarsenInputControl.value)))) : newIvaarsenInputControl.value;
    state.tacticalInputs[tacticalInputKey(name)] = value;
    renderAll();
    return;
  }
  const sourceRoll = event.target.closest('[data-source-roll-id][type="radio"]');
  if (sourceRoll) {
    state.sourceRollSelections[sourceRollKey(sourceRoll.dataset.sourceRollSequence, sourceRoll.dataset.sourceRollId)] = sourceRoll.value;
    renderAll();
    return;
  }
  const input = event.target.closest("[data-complication-choice]");
  if (!input) return;
  const profile = currentComplicationProfile();
  const selection = complicationSelectionState(profile?.table);
  if (!profile || !selection) return;
  const forceId = input.dataset.complicationForce;
  const rowKey = input.dataset.complicationChoice;
  const noComplicationKey = profile.table.rows.map(complicationRowKey).find((key, index) => isNoComplicationRow(profile.table.rows[index]) && complicationRowAppliesToSide(profile.table.rows[index], forceId));
  const chosen = new Set(selection.draft[forceId] || []);
  if (input.checked) {
    if (profile.table.singleResult || rowKey === noComplicationKey) {
      chosen.clear();
      chosen.add(rowKey);
    } else {
      chosen.delete(noComplicationKey);
      chosen.add(rowKey);
    }
  } else {
    chosen.delete(rowKey);
    if (!chosen.size && noComplicationKey) chosen.add(noComplicationKey);
  }
  selection.draft[forceId] = [...chosen];
  const track = currentTrack();
  const resolved = resolvedHotSpotStep();
  renderSetupConfiguration(track ? (resolved?.variant ? { ...track, ...resolved.variant } : track) : null);
});

$("#hotspot-setup").addEventListener("click", event => {
  const apply = event.target.closest("[data-apply-complications]");
  const edit = event.target.closest("[data-edit-complications]");
  if (!apply && !edit) return;
  const profile = currentComplicationProfile();
  const selection = complicationSelectionState(profile?.table);
  if (!profile || !selection) return;
  if (edit) {
    selection.draft = Object.fromEntries(profile.participants.map(side => [side.id, [...(selection.applied[side.id] || [])]]));
    selection.expanded = true;
    const track = currentTrack();
    const resolved = resolvedHotSpotStep();
    renderSetupConfiguration(track ? (resolved?.variant ? { ...track, ...resolved.variant } : track) : null);
    return;
  }
  selection.applied = Object.fromEntries(profile.participants.map(side => [side.id, [...(selection.draft[side.id] || [])]]));
  selection.appliedOnce = true;
  selection.expanded = false;
  if (profile.hotSpot.id === "alta-vista" && !appliedComplicationNamed("escobar", "Withdrawal Order", profile.table)) {
    delete state.tacticalInputs[tacticalInputKey("withdrawal-response")];
  }
  if (profile.hotSpot.id === "dahar-iv") daharMissionState().finalized = false;
  renderAll();
});

$("#taking-one-for-team").addEventListener("change", event => {
  state.takingOneForTeam = event.target.checked;
  renderAll();
});

$("#opfor-display").addEventListener("change", event => {
  if (event.target.dataset.opforForceType) {
    state.opforForceTypes[currentHotSpot().id + "::" + event.target.dataset.opforForceType] = event.target.value;
    renderOpFor();
    return;
  }
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
    if (interactiveComplicationContracts.has(currentHotSpot().id)) clearComplicationSelections(currentHotSpot().id);
  }
  if (event.target.dataset.sourceRollId) state.sourceRollSelections[sourceRollKey(event.target.dataset.sourceRollSequence, event.target.dataset.sourceRollId)] = event.target.value;
  if (event.target.dataset.selectionId) state.selectionValues[variantSelectionKey(event.target.dataset.selectionSequence, { id: event.target.dataset.selectionId })] = event.target.value;
  if (event.target.dataset.roleSequence) state.roleSelections[roleKey(event.target.dataset.roleSequence)] = event.target.value;
  renderAll();
});

$("#scale-select").addEventListener("click", event => {
  const button = event.target.closest(".scale-button");
  if (!button || button.disabled) return;
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
  const objective = currentObjectives().find(item => item.id === button.dataset.objective);
  if (!objective) return;
  const side = button.dataset.side;
  const current = Number(getProgress(objective, side));
  setProgress(objective, side, current + (button.dataset.action === "increment" ? 1 : -1));
  if (currentHotSpot().id === "dahar-iv") daharMissionState().finalized = false;
  renderTracker();
  if (currentHotSpot().id === "xhosa-vii") renderReference();
  if (["dahar-iv", "le-blanc", "lucerne"].includes(currentHotSpot().id)) renderCampaignState();
});

$("#objective-body").addEventListener("change", event => {
  const input = event.target;
  if (input.dataset.protectionMobileHqCaptured) {
    state.tacticalInputs[protectionCaptureKey()] = input.checked;
    renderTracker();
    renderReference();
    return;
  }
  if (input.dataset.pascagoulaRyuExtracted) {
    state.tacticalInputs[pascagoulaExtractionKey()] = input.checked;
    renderTracker();
    return;
  }
  const objective = currentObjectives().find(item => item.id === input.dataset.objective);
  if (!objective) return;
  const side = input.dataset.side || input.dataset.vpSide;
  if (input.dataset.action === "toggle") setProgress(objective, side, input.checked);
  if (input.dataset.vpObjective) setVp(objective, input.dataset.vpSide, input.value);
  if (currentHotSpot().id === "dahar-iv") daharMissionState().finalized = false;
  renderTracker();
  if (["dahar-iv", "le-blanc", "lucerne"].includes(currentHotSpot().id)) renderCampaignState();
});

renderAll();


