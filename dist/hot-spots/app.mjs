import { FACTION_COLORS, GENERAL_RULES, HOT_SPOTS, MISSION_OPFOR_OVERRIDES, OPPOSING_FORCE_TABLES, SOURCES, TRACKS } from "./data.mjs?v=opfor-4";

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const sideNames = { attacker: "Attacker", defender: "Defender" };
const opforTableByFaction = {
  "Mercenary": "mercenary-pirate",
  "Capellan Confederation": "capellan",
  "Draconis Combine": "draconis-combine",
  "Federated Suns": "federated-suns",
  "Clan Sea Fox": "raven-alliance"
};

const state = {
  hotSpotId: "achernar",
  trackSequence: { achernar: 1 },
  selectedSide: { achernar: "tybalt" },
  winnerSelections: {},
  resultSelections: {},
  roleSelections: {},
  trackId: "meeting-engagement",
  scale: 1,
  mode: "both",
  takingOneForTeam: false,
  opforRoll: 1,
  progress: {},
  vpSelections: {}
};

function currentTrack() {
  return TRACKS.find(track => track.id === state.trackId) || null;
}

function currentHotSpot() {
  return HOT_SPOTS.find(hotSpot => hotSpot.id === state.hotSpotId) || HOT_SPOTS[0];
}

function currentHotSpotStep() {
  const hotSpot = currentHotSpot();
  const sequence = Number(state.trackSequence[hotSpot.id] || hotSpot.tracks[0]?.sequence || 1);
  return hotSpot.tracks.find(track => track.sequence === sequence) || hotSpot.tracks[0] || null;
}

function selectionKey(sequence) {
  return state.hotSpotId + "::" + sequence;
}

function sideById(sideId) {
  return currentHotSpot().sides.find(side => side.id === sideId) || null;
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

function roleKey(sequence) {
  return state.hotSpotId + "::role::" + sequence;
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
    const selectedAttacker = state.roleSelections[roleKey(step.sequence)] || currentHotSpot().sides[0].id;
    const selectedDefender = currentHotSpot().sides.find(side => side.id !== selectedAttacker)?.id || null;
    outcome = { ...outcome, attacker: selectedAttacker, defender: selectedDefender };
  }
  return { ...step, ...outcome, unresolved: false };
}

function syncHotSpotState() {
  const hotSpot = currentHotSpot();
  if (!state.trackSequence[hotSpot.id]) state.trackSequence[hotSpot.id] = hotSpot.tracks[0]?.sequence || 1;
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

function trackScore(side) {
  const track = currentTrack();
  if (!track) return 0;
  return track.objectives.reduce((total, objective) => {
    if (!applies(objective, side)) return total;
    const completed = getProgress(objective, side);
    if (objective.repeatable) return total + Number(completed) * getVp(objective, side);
    return total + (completed ? getVp(objective, side) : 0);
  }, 0);
}

function modeLabel() {
  return state.mode === "both" ? "Both sides" : sideNames[state.mode] + " only";
}

function renderScaleButtons() {
  Array.from(document.querySelectorAll(".scale-button")).forEach(button => {
    const active = Number(button.dataset.scale) === state.scale;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderOpFor() {
  const container = $("#opfor-display");
  if (!container) return;
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
      '<div class="opfor-result"><div class="opfor-result-label">MISSION FORCE</div><output>Scale ' + esc(String(state.scale)) + '</output><span>No 1D6 table roll is used for this Pascagoula roster.</span></div>' +
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
  const step = currentHotSpotStep();
  const resolved = resolvedHotSpotStep();
  const selected = sideById(state.selectedSide[hotSpot.id]);
  $("#hot-spot-select").innerHTML = HOT_SPOTS.map(item => '<option value="' + esc(item.id) + '">' + esc(item.name) + " · " + esc(item.region) + "</option>").join("");
  $("#hot-spot-select").value = hotSpot.id;
  $("#hot-spot-track-select").innerHTML = hotSpot.tracks.map(item => '<option value="' + item.sequence + '">' + esc(item.label) + "</option>").join("");
  $("#hot-spot-track-select").value = String(step?.sequence || "");
  $("#hot-spot-side-select").innerHTML = hotSpot.sides.map(side => '<option value="' + esc(side.id) + '">' + esc(side.name) + " · " + esc(side.faction) + "</option>").join("");
  $("#hot-spot-side-select").value = selected?.id || "";

  const winnerControls = [];
  for (const sequence of step?.requires || []) {
    const previousStep = hotSpot.tracks.find(item => item.sequence === sequence);
    winnerControls.push('<div class="control-group"><label for="winner-' + sequence + '">Winner of Track ' + sequence + '</label><select id="winner-' + sequence + '" data-winner-sequence="' + sequence + '"><option value="">Choose the previous winner</option>' + hotSpot.sides.map(side => '<option value="' + esc(side.id) + '"' + (selectedWinner(sequence) === side.id ? " selected" : "") + '>' + esc(side.name) + "</option>").join("") + '</select><span class="control-hint">' + esc(previousStep?.label || "Previous track") + " determines this mission." + "</span></div>");
  }
  if (resolved?.roleChoice) {
    const selectedRole = state.roleSelections[roleKey(step.sequence)] || hotSpot.sides[0]?.id;
    winnerControls.push('<div class="control-group"><label for="role-choice">' + esc(step.roleChoiceLabel || "Choose the Attacker") + '</label><select id="role-choice" data-role-sequence="' + step.sequence + '">' + hotSpot.sides.map(side => '<option value="' + esc(side.id) + '"' + (selectedRole === side.id ? " selected" : "") + '>' + esc(side.name) + " as Attacker</option>").join("") + '</select><span class="control-hint">The other side is assigned Defender.</span></div>');
  }
  if (step?.results?.length) {
    const result = state.resultSelections[resultKey(step.sequence)] || step.results[0].id;
    winnerControls.push('<div class="control-group"><label for="source-result">' + esc(step.resultLabel || "Source result") + '</label><select id="source-result" data-result-sequence="' + step.sequence + '">' + step.results.map(option => '<option value="' + esc(option.id) + '"' + (result === option.id ? " selected" : "") + '>' + esc(option.label) + "</option>").join("") + '</select><span class="control-hint">This choice records the source table result for this track.</span></div>');
  }
  $("#winner-controls").innerHTML = winnerControls.length ? '<div class="winner-controls-grid">' + winnerControls.join("") + "</div>" : "";

  $("#hotspot-summary").innerHTML = '<div class="hotspot-summary-copy"><strong>' + esc(hotSpot.name) + '</strong><span>' + esc(hotSpot.region) + " · " + esc(hotSpot.terrain) + '</span><span>' + esc(step?.label || "Track") + " · " + esc(resolved?.displayName || (resolved?.trackId ? TRACKS.find(track => track.id === resolved.trackId)?.name : "Pending" ) || "Pending") + '</span></div>';
  if (hotSpot.note) $("#hotspot-summary").insertAdjacentHTML("beforeend", '<div class="hotspot-summary-note">' + esc(hotSpot.note) + "</div>");
  $("#taking-one-for-team").checked = state.takingOneForTeam;
  renderOpFor();
}

function renderReference() {
  const track = currentTrack();
  const hotSpot = currentHotSpot();
  const step = currentHotSpotStep();
  const resolved = resolvedHotSpotStep();
  if (!track) {
    $("#mission-reference").innerHTML = '<article class="panel mission-card"><div class="mission-card-head"><div class="eyebrow">HOT SPOT LOCATION · ' + esc(hotSpot.name) + '</div><h2>Track pending</h2><p>' + esc(resolved?.unresolved ? "Choose the previous track winner to resolve this mission." : "The selected source result does not produce a standard track this month.") + '</p></div><div class="reference-section"><div class="panel-kicker">LOCATION & SEQUENCE</div><ul class="rule-list"><li>' + esc(hotSpot.name + " · " + hotSpot.region + " · " + hotSpot.terrain) + '</li><li>' + esc(step?.label || "Track") + " · " + esc(hotSpot.source) + '</li></ul></div><div class="reference-section"><div class="panel-kicker">SOURCE NOTE</div><p class="reference-copy">' + esc(hotSpot.note || "Resolve the Hot Spot setup controls above before opening the standard mission reference.") + '</p></div></article>';
    return;
  }
  const scaleLabel = state.scale === 3 ? "Scale 3+" : "Scale " + state.scale;
  const scaleNotes = track.scaleNotes?.length
    ? track.scaleNotes.map(note => "<li>" + esc(note) + "</li>").join("")
    : "<li>No additional Scale-dependent exception is recorded for this track.</li>";
  const setup = track.setup.map(item => "<li>" + esc(item) + "</li>").join("");
  const setupDetails = (track.setupDetails || []).map(item => "<li>" + esc(item) + "</li>").join("");
  const objectives = track.objectives.map(objective => {
    const side = objective.side === "both" ? "Attacker / Defender" : sideNames[objective.side];
    const vp = objective.vpOptions ? objective.vpOptions.join(" / ") : objective.vp;
    return '<li><div class="reference-objective-head"><strong>' + esc(objective.name) + '</strong><span class="vp-badge">' + esc(side) + " · " + vp + " VP" + (objective.repeatable ? " each" : "") + '</span></div><p>' + esc(objective.text) + "</p></li>";
  }).join("");
  const special = track.special.map(item => "<li>" + esc(item) + "</li>").join("");
  const errata = track.errataNote
    ? '<div class="errata-note"><strong>Errata boundary</strong><p>' + esc(track.errataNote) + "</p></div>"
    : '<div class="errata-note"><strong>Errata boundary</strong><p>' + esc(SOURCES.supersession) + "</p></div>";

  const attackerSide = sideById(resolved?.attacker);
  const defenderSide = sideById(resolved?.defender);
  const hotSpotBrief = '<div class="reference-section hot-spot-reference"><div class="panel-kicker">HOT SPOT MISSION BRIEF</div><div class="brief-grid"><div><span>Location</span><strong>' + esc(hotSpot.name) + '</strong><small>' + esc(hotSpot.region + " · " + hotSpot.terrain) + '</small></div><div><span>Sequence</span><strong>' + esc(step?.label || "Track") + '</strong><small>' + esc(resolved?.displayName || track.name) + '</small></div><div style="--side-color:' + esc(attackerSide?.color || FACTION_COLORS.Local) + '"><span>Attacker</span><strong>' + esc(attackerSide?.name || "Attacker") + '</strong><small>' + esc(attackerSide?.faction || "Source-defined role") + '</small></div><div style="--side-color:' + esc(defenderSide?.color || FACTION_COLORS.Local) + '"><span>Defender</span><strong>' + esc(defenderSide?.name || "Defender") + '</strong><small>' + esc(defenderSide?.faction || "Source-defined role") + '</small></div></div>' + (hotSpot.note ? '<p class="reference-note">' + esc(hotSpot.note) + '</p>' : '') + '</div>';

  $("#mission-reference").innerHTML =
    '<article class="panel mission-card">' +
      '<div class="mission-card-head"><div class="eyebrow">SELECTED TRACK · p. ' + track.page + '</div><h2>' + esc(resolved?.displayName || track.name) + '</h2><p>' + esc(track.summary) + '</p></div>' +
      hotSpotBrief +
      '<div class="reference-section"><div class="panel-kicker">BATTLEFIELD & SETUP</div><ul class="rule-list">' + setup + "</ul></div>" +
      (setupDetails ? '<div class="reference-section"><div class="panel-kicker">DEPLOYMENT DETAILS</div><ul class="rule-list">' + setupDetails + "</ul></div>" : "") +
      '<div class="reference-section scale-section"><div class="panel-kicker">SCALE ' + esc(String(state.scale)) + ' VIEW</div><ul class="rule-list">' + scaleNotes + "</ul></div>" +
      '<div class="reference-section"><div class="panel-kicker">OBJECTIVES & VICTORY POINTS</div><ul class="objective-reference-list">' + objectives + "</ul></div>" +
      '<div class="reference-section"><div class="panel-kicker">SPECIAL RULES, TRACK END & SALVAGE</div><ul class="rule-list">' + special + "</ul></div>" +
      errata +
      '<div class="reference-citation">Source: ' + esc(SOURCES.primary) + " · selected track p. " + track.page + "</div>" +
    "</article>" +
    '<article class="panel general-card"><div class="panel-heading"><div><span class="panel-kicker">SHARED RULES</span><h3>Track reference p. 167</h3></div></div>' +
      GENERAL_RULES.map(rule => '<details><summary>' + esc(rule.title) + '<span>' + esc(rule.ref) + '</span></summary><p>' + esc(rule.text) + "</p></details>").join("") +
    "</article>";
}

function objectiveControl(objective, side) {
  if (!applies(objective, side)) return '<span class="not-applicable" aria-label="Not applicable">—</span>';
  const progress = getProgress(objective, side);
  const vpControl = objective.vpOptions
    ? '<select class="vp-select" aria-label="Victory Point value" data-vp-objective="' + esc(objective.id) + '" data-vp-side="' + side + '">' +
      objective.vpOptions.map(value => '<option value="' + value + '"' + (getVp(objective, side) === value ? " selected" : "") + ">" + value + " VP</option>").join("") +
      "</select>"
    : '<span class="vp-badge">' + objective.vp + " VP" + (objective.repeatable ? " each" : "") + "</span>";
  if (objective.repeatable) {
    return '<div class="counter-control"><button type="button" class="counter-button" data-action="decrement" data-objective="' + esc(objective.id) + '" data-side="' + side + '" aria-label="Decrease ' + esc(objective.name) + '">−</button>' +
      '<output>' + progress + '</output><button type="button" class="counter-button" data-action="increment" data-objective="' + esc(objective.id) + '" data-side="' + side + '" aria-label="Increase ' + esc(objective.name) + '">+</button>' +
      '<span class="counter-label">completed</span></div>' + vpControl;
  }
  return '<label class="check-control"><input type="checkbox" data-action="toggle" data-objective="' + esc(objective.id) + '" data-side="' + side + '"' + (progress ? " checked" : "") + '><span class="checkmark"></span><span class="control-copy">' + (progress ? "Complete" : "Open") + "</span></label>" + vpControl;
}

function renderTracker() {
  const track = currentTrack();
  const resolved = resolvedHotSpotStep();
  const attackerSide = sideById(resolved?.attacker);
  const defenderSide = sideById(resolved?.defender);
  $("#tracker-source").textContent = track ? "Draconis Reach p. " + track.page : currentHotSpot().source;
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
  $("#objective-body").innerHTML = track ? track.objectives.map(objective =>
    '<tr><th scope="row"><div class="objective-title">' + esc(objective.name) + '</div><div class="objective-rule">' + esc(objective.text) + '</div><div class="objective-vp">' + (objective.vpOptions ? objective.vpOptions.join(" / ") + " VP (select value)" : objective.vp + " VP" + (objective.repeatable ? " each" : "")) + "</div></th>" +
      '<td class="attacker-col">' + objectiveControl(objective, "attacker") + "</td>" +
      '<td class="defender-col">' + objectiveControl(objective, "defender") + "</td></tr>"
  ).join("") : '<tr><th scope="row" colspan="3" class="pending-track">Resolve the Hot Spot controls above to load the standard mission objectives.</th></tr>';
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
  renderScaleButtons();
  renderReference();
  renderTracker();
}

function resetTrack() {
  const prefix = state.hotSpotId + "::";
  Object.keys(state.progress).filter(key => key.startsWith(prefix)).forEach(key => delete state.progress[key]);
  Object.keys(state.vpSelections).filter(key => key.startsWith(prefix)).forEach(key => delete state.vpSelections[key]);
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
  if (event.target.dataset.resultSequence) state.resultSelections[resultKey(event.target.dataset.resultSequence)] = event.target.value;
  if (event.target.dataset.roleSequence) state.roleSelections[roleKey(event.target.dataset.roleSequence)] = event.target.value;
  renderAll();
});

$("#scale-select").addEventListener("click", event => {
  const button = event.target.closest(".scale-button");
  if (!button) return;
  state.scale = Number(button.dataset.scale);
  renderScaleButtons();
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
  renderTracker();
});

$("#objective-body").addEventListener("change", event => {
  const input = event.target;
  const objective = currentTrack()?.objectives.find(item => item.id === input.dataset.objective);
  if (!objective) return;
  const side = input.dataset.side || input.dataset.vpSide;
  if (input.dataset.action === "toggle") setProgress(objective, side, input.checked);
  if (input.dataset.vpObjective) setVp(objective, input.dataset.vpSide, input.value);
  renderTracker();
});

renderAll();

