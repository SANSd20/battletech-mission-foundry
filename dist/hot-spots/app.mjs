import { GENERAL_RULES, SOURCES, TRACKS } from "./data.mjs";

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const sideNames = { attacker: "Attacker", defender: "Defender" };

const state = {
  trackId: "objective-raid",
  scale: 3,
  mode: "both",
  progress: {},
  vpSelections: {}
};

function currentTrack() {
  return TRACKS.find(track => track.id === state.trackId) || TRACKS[0];
}

function applies(objective, side) {
  return objective.side === "both" || objective.side === side;
}

function progressKey(trackId, objectiveId, side) {
  return trackId + "::" + objectiveId + "::" + side;
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
  return currentTrack().objectives.reduce((total, objective) => {
    if (!applies(objective, side)) return total;
    const completed = getProgress(objective, side);
    if (objective.repeatable) return total + Number(completed) * getVp(objective, side);
    return total + (completed ? getVp(objective, side) : 0);
  }, 0);
}

function modeLabel() {
  return state.mode === "both" ? "Both sides" : sideNames[state.mode] + " only";
}

function renderTrackOptions() {
  $("#track-select").innerHTML = TRACKS.map(track =>
    '<option value="' + esc(track.id) + '">' + esc(track.name) + " · p. " + track.page + "</option>"
  ).join("");
  $("#track-select").value = state.trackId;
  $("#scale-select").value = String(state.scale);
}

function renderReference() {
  const track = currentTrack();
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

  $("#mission-reference").innerHTML =
    '<article class="panel mission-card">' +
      '<div class="mission-card-head"><div class="eyebrow">SELECTED TRACK · p. ' + track.page + '</div><h2>' + esc(track.name) + '</h2><p>' + esc(track.summary) + '</p></div>' +
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
  $("#tracker-title").textContent = track.name;
  $("#tracker-source").textContent = "Draconis Reach p. " + track.page;
  document.body.dataset.mode = state.mode;
  $$(".mode-button").forEach(button => button.classList.toggle("active", button.dataset.mode === state.mode));
  $("#objective-body").innerHTML = track.objectives.map(objective =>
    '<tr><th scope="row"><div class="objective-title">' + esc(objective.name) + '</div><div class="objective-rule">' + esc(objective.text) + '</div><div class="objective-vp">' + (objective.vpOptions ? objective.vpOptions.join(" / ") + " VP (select value)" : objective.vp + " VP" + (objective.repeatable ? " each" : "")) + "</div></th>" +
      '<td class="attacker-col">' + objectiveControl(objective, "attacker") + "</td>" +
      '<td class="defender-col">' + objectiveControl(objective, "defender") + "</td></tr>"
  ).join("");
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
  renderTrackOptions();
  renderReference();
  renderTracker();
}

function resetTrack() {
  const prefix = state.trackId + "::";
  Object.keys(state.progress).filter(key => key.startsWith(prefix)).forEach(key => delete state.progress[key]);
  Object.keys(state.vpSelections).filter(key => key.startsWith(prefix)).forEach(key => delete state.vpSelections[key]);
  renderAll();
}

$("#track-select").addEventListener("change", event => {
  state.trackId = event.target.value;
  renderAll();
});

$("#scale-select").addEventListener("change", event => {
  state.scale = Number(event.target.value);
  renderReference();
});

$$(".mode-button").forEach(button => button.addEventListener("click", () => {
  state.mode = button.dataset.mode;
  renderTracker();
}));

$("#reset-button").addEventListener("click", () => {
  if (window.confirm("Reset all objective progress for " + currentTrack().name + "?")) resetTrack();
});

$("#objective-body").addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button || button.dataset.action === "toggle") return;
  const objective = currentTrack().objectives.find(item => item.id === button.dataset.objective);
  if (!objective) return;
  const side = button.dataset.side;
  const current = Number(getProgress(objective, side));
  setProgress(objective, side, current + (button.dataset.action === "increment" ? 1 : -1));
  renderTracker();
});

$("#objective-body").addEventListener("change", event => {
  const input = event.target;
  const objective = currentTrack().objectives.find(item => item.id === input.dataset.objective);
  if (!objective) return;
  const side = input.dataset.side || input.dataset.vpSide;
  if (input.dataset.action === "toggle") setProgress(objective, side, input.checked);
  if (input.dataset.vpObjective) setVp(objective, input.dataset.vpSide, input.value);
  renderTracker();
});

renderAll();

