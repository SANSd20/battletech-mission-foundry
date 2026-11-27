export const SOURCES = {
  primary: "Hot Spots: Draconis Reach, First Printing, pp. 167–175",
  errata: "Hot Spots: Draconis Reach official master errata thread (revision reviewed 11 November 2026; forum rechecked 26 November 2026)",
  supersession: "Draconis Reach supersedes the supplied Hinterlands track text; Hinterlands track corrections are not applied to these records.",
  pascagoula: "Hot Spots: Draconis Reach, First Printing, pp. 103–107; Objective Raid p. 171; Pursuit p. 172; campaign withdrawal and exit rules p. 31; Mountains Terrain Table p. 150; Alpha Strike terrain p. 154; current Draconis Reach master errata",
  militaryPalette: "BattleTech Faction Colors, palettes/military-ui.yaml, verified main e3cd8c9c9899b04aebd314a2a921ad3edd4092f1",
  opposingForces: "Hot Spots: Draconis Reach, First Printing, Opposing Force Tables pp. 186–201"
};

export function groupComplicationEffectEntries(entries = []) {
  const effects = [];
  const sharedEffects = new Map();
  for (const entry of entries) {
    const sharedEffectId = entry.sharedEffectId || (entry.row?.effectScope === "shared-battlefield" ? entry.row.effectId : null);
    if (!sharedEffectId) {
      effects.push({ row: entry.row, sides: [entry.side], shared: false, effectId: null });
      continue;
    }
    if (!sharedEffects.has(sharedEffectId)) {
      const effect = { row: entry.row, sides: [], shared: true, effectId: sharedEffectId };
      sharedEffects.set(sharedEffectId, effect);
      effects.push(effect);
    }
    const effect = sharedEffects.get(sharedEffectId);
    if (!effect.sides.some(side => side.id === entry.side.id)) effect.sides.push(entry.side);
  }
  return effects;
}

export const RECON_DENY_ATTACKER_OBJECTIVE_IDS = Object.freeze([
  "orders-attacker",
  "identify-opposition",
  "preemptive-strike",
  "observe-report"
]);

export const RECON_DENY_VP_SCHEDULE = Object.freeze([300, 200, 100, 50, 0]);

export function calculateReconDenyVp(completedObjectiveIds = []) {
  const completed = new Set(completedObjectiveIds);
  const completedAttackerObjectives = RECON_DENY_ATTACKER_OBJECTIVE_IDS.filter(id => completed.has(id)).length;
  return RECON_DENY_VP_SCHEDULE[completedAttackerObjectives];
}

export const DAHAR_TRACK_RESULTS = Object.freeze([
  { roll: 1, id: "recon", label: "Recon", trackId: "recon", attacker: "raid", defender: "garrison" },
  { roll: 2, id: "flank", label: "Flank", trackId: "flank", attacker: "raid", defender: "garrison" },
  { roll: 3, id: "strike", label: "Strike", trackId: "strike", attacker: "raid", defender: "garrison" },
  { roll: 4, id: "meeting", label: "Meeting Engagement", trackId: "meeting-engagement", attacker: "garrison", defender: "raid" },
  { roll: 5, id: "assault", label: "Assault", trackId: "assault", attacker: "garrison", defender: "raid" },
  { roll: 6, id: "retreat", label: "Retreat", trackId: "retreat", attacker: "garrison", defender: "raid" }
]);

export const DAHAR_MAPSHEET_TABLE = Object.freeze([
  ["1", "Mine #1", "MapPack: Deserts"],
  ["2", "Mine #2", "MapPack: Deserts"],
  ["3", "Badlands #1", "MapPack: Deserts"],
  ["4", "Badlands #2", "MapPack: Deserts"],
  ["5", "Washout #1", "MapPack: Deserts"],
  ["6", "Sand Drift #2", "MapPack: Deserts"]
]);

export const DAHAR_INDUSTRIALMECH_TABLE = Object.freeze([
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

export const DAHAR_COMMAND_COMPLICATIONS = Object.freeze({
  ref: "Draconis Reach p. 84",
  note: "Resolve each force independently for every played track, then select every resulting effect below. Command Rights modifiers are Independent +0, Liaison +1, House +2, and Integrated +2.",
  rows: [
    { roll: "1–3", name: "No Complication", text: "No additional effect." },
    { roll: "4", name: "Sandstorm", text: "All attacks suffer an additional +1 to-hit modifier at medium range and +2 at long range." },
    { roll: "5", name: "Heatwave", text: "All BattleMechs generate 1 additional Heat per turn. All ground vehicles suffer −1 MP to Flank Speed; Battlefield Support assets suffer −1 movement. Infantry cannot be used in this track." },
    { roll: "6", name: "Abandoned Mine", text: "The opposing player may place 1D6 sinkhole tokens (Alpha Strike: 2-inch AOE markers). Each is depth 6 (Alpha Strike: 12 inches). A unit entering one falls to the bottom and, if it survives, is effectively crippled for objectives and repairs." },
    { roll: "7", name: "Orders Are Gibberish", text: "The affected player receives −20 VP once for each objective that earns VP. For repeatable objectives, deduct 20 once from the objective total, not from every instance." },
    { roll: "8", name: "Roll Twice", text: "Roll exactly twice more with the same Command Rights modifier. Ignore secondary 8s and duplicate effects; do not reroll and do not recurse." }
  ]
});

export const DAHAR_PROVISIONAL_RULES = Object.freeze([
  "Use sidebar contract identifiers 105112A and 105112B; treat Mission Brief identifier 105070A–B as a presumed printing error.",
  "Equal successful-track totals after Month 3 produce a contract draw. Duplicate rolls preserve success streaks; played tactical draws reset both streaks.",
  "A modified 8 generates exactly two secondary rolls with the same modifier. Secondary 8s and duplicate effects are ignored; no rerolls or recursion."
]);

export function daharCommandModifier(rights = "liaison") {
  return rights === "liaison" ? 1 : rights === "house" || rights === "integrated" ? 2 : 0;
}

function daharDie(value, maximum = 6) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Math.trunc(Number(value));
  return number >= 1 && number <= maximum ? number : null;
}

export function resolveDaharComplications(selection = {}, rights = "liaison") {
  const modifier = daharCommandModifier(rights);
  const initialRaw = daharDie(selection.initial);
  const initial = initialRaw === null ? null : initialRaw + modifier;
  if (initial === null) return { modifier, initial: null, secondary: [], effects: [], pendingSecondary: false };
  if (initial !== 8) return { modifier, initial, secondary: [], effects: initial >= 4 && initial <= 7 ? [initial] : [], pendingSecondary: false };
  const secondary = [daharDie(selection.secondaryOne), daharDie(selection.secondaryTwo)].map(value => value === null ? null : value + modifier);
  const effects = [...new Set(secondary.filter(value => value >= 4 && value <= 7))];
  return { modifier, initial, secondary, effects, pendingSecondary: secondary.some(value => value === null) };
}

export function adjustDaharEarnedVp(earnedVp, affected = false) {
  const earned = Math.max(0, Number(earnedVp) || 0);
  return affected && earned > 0 ? Math.max(0, earned - 20) : earned;
}

export const LE_BLANC_MAPSHEET_TABLE = Object.freeze([
  ["1–2", "Corporate Campus", "MapPack: City"],
  ["3–4", "Business District", "MapPack: City"],
  ["5", "Family Quarters", "MapPack: City"],
  ["6", "Shopping District", "MapPack: City"]
]);

export const LE_BLANC_TEMPORARY_HIRES = Object.freeze([
  {
    id: "weeper",
    name: "Weeper",
    identity: "Rowan Moore",
    unit: "Lament LMT-2R",
    bv: "1,999",
    pv: "43",
    gunnery: "4",
    piloting: "5",
    alphaStrikeSkill: "4",
    edge: "1",
    abilities: "—",
    restriction: "No tactical alignment restriction.",
    source: "Draconis Reach p. 89"
  },
  {
    id: "kyodai",
    name: "Kyodai",
    identity: "Local criminal-underground MechWarrior",
    unit: "Hitotsume Kozo HKZ-1F",
    bv: "1,998",
    pv: "42",
    gunnery: "4",
    piloting: "3",
    alphaStrikeSkill: "3",
    edge: "3",
    abilities: "Melee Specialist Edge Ability",
    restriction: "Draconis Combine-aligned players only. A Mercenary participating for Operation Sundown remains eligible by contract alignment.",
    source: "Draconis Reach p. 89"
  }
]);

export const LE_BLANC_COMMAND_COMPLICATIONS = Object.freeze({
  ref: "Draconis Reach pp. 30, 89",
  note: "Before either Le Blanc track, resolve each force independently and select every resulting effect below. Command Rights modifiers are Independent +0, Liaison +1, House +2, and Integrated +3.",
  rows: [
    { roll: "1–3", name: "No Complication", text: "No additional effect." },
    { roll: "4", name: "Unprepared for a Sandstorm", text: "The affected player pays 25 SP per unit deployed in this track, or each such unit reduces its Run/Flank speed by 1 MP (Alpha Strike: MV −2 inches). Battlefield Support assets lose 1 MP. The browser presents this tactical alternative but does not administer Support Points." },
    { roll: "5", name: "Undersupplied", text: "BattleTech: begin with half ammunition in every ammunition critical slot. Alpha Strike: after Turn 3, reduce the damage rating by 1 for each unit without the ENE special." },
    { roll: "6", name: "Local Partisan Support", text: "The opposing player receives free Battlefield Support per Scale for this track only. Use the recipient’s tactical role to select the Attacker Opponent or Defender Opponent package shown below." },
    { roll: "7", name: "Unexpected Sandstorm", text: "Battlefield-wide. BattleTech: all attacks receive +1 target number at medium range and +2 at long range. Alpha Strike: all weapon attacks receive +1 target number at medium or long range." },
    { roll: "8+", name: "Roll Twice", text: "Make exactly two secondary rolls with the same Command Rights modifier. Ignore secondary Roll Twice results, apply duplicate effects once, do not reroll duplicates, and do not recurse." }
  ]
});

export const LE_BLANC_PARTISAN_PACKAGES = Object.freeze({
  attacker: [
    "2 × Scale Motorized Conventional Infantry (Rifle; Gunnery 5; no anti-’Mech Skill; Alpha Strike Skill 5)",
    "2 × Scale Galleon GAL-100 (Gunnery 5; Piloting 6; Alpha Strike Skill 5)"
  ],
  defender: [
    "2 × Scale MG Nest emplacements (BattleTech: CF 10, Armor 5, five light machine guns in front, Gunnery 5; Alpha Strike: CF 3, Armor 1, damage 1/1/0, MV 0 inches, TMM +0, Skill 5)",
    "1 × Scale Foot Conventional Infantry (Rifle; Gunnery 5; no anti-’Mech Skill; Alpha Strike Skill 5)",
    "2 × Scale Galleon GAL-100 (Gunnery 5; Piloting 6; Alpha Strike Skill 5)"
  ]
});

export const LE_BLANC_PROVISIONAL_RULES = Object.freeze([
  "Temporary Hire eligibility remains unresolved. Consult pp. 29 and 89 for availability, eligibility, force limits, costs, repairs, and replacement.",
  "A modified 8+ produces exactly two secondary rolls with the same modifier. Ignore secondary 8+ results, apply duplicates once, do not reroll duplicates, and do not recurse."
]);

export function leBlancCommandModifier(rights = "liaison") {
  return rights === "liaison" ? 1 : rights === "house" ? 2 : rights === "integrated" ? 3 : 0;
}

export function resolveLeBlancComplications(selection = {}, rights = "liaison") {
  const modifier = leBlancCommandModifier(rights);
  const die = value => {
    if (value === "" || value === null || value === undefined) return null;
    const number = Math.trunc(Number(value));
    return number >= 1 && number <= 6 ? number : null;
  };
  const initialRaw = die(selection.initial);
  const initial = initialRaw === null ? null : initialRaw + modifier;
  if (initial === null) return { modifier, initial: null, secondary: [], effects: [], pendingSecondary: false };
  if (initial < 8) return { modifier, initial, secondary: [], effects: initial >= 4 && initial <= 7 ? [initial] : [], pendingSecondary: false };
  const secondary = [die(selection.secondaryOne), die(selection.secondaryTwo)].map(value => value === null ? null : value + modifier);
  const effects = [...new Set(secondary.filter(value => value >= 4 && value <= 7))];
  return { modifier, initial, secondary, effects, pendingSecondary: secondary.some(value => value === null) };
}

export const LUCERNE_MAPSHEET_TABLE = Object.freeze([
  ["1", "Grassland #1", "Beginner Box"],
  ["2", "Grassland #2", "A Game of Armored Combat"],
  ["3", "Grassland #3", "A Game of Armored Combat"],
  ["4", "Woodland", "MapPack: Grasslands"],
  ["5", "Open Terrain #2", "MapPack: Grasslands"],
  ["6", "Open Terrain #3", "MapPack: Grasslands"]
]);

export const LUCERNE_TEMPORARY_HIRES = Object.freeze([
  {
    id: "saki",
    name: "Saki",
    identity: "Eclipse Expeditions temporary hire",
    unit: "Venom SDR-9KB",
    bv: "769",
    pv: "28",
    gunnery: "3",
    piloting: "2",
    alphaStrikeSkill: "3",
    edge: "3",
    abilities: "Jumping Jack Edge Ability",
    restriction: "Associated with Eclipse Expeditions. Hiring eligibility and administration remain with the players.",
    source: "Draconis Reach p. 93"
  },
  {
    id: "steve-kendricks",
    name: "Steve Kendricks",
    identity: "Bio-Gen temporary hire",
    unit: "Firefly FFL-5A",
    bv: "996",
    pv: "26",
    gunnery: "3",
    piloting: "3",
    alphaStrikeSkill: "3",
    edge: "3",
    abilities: "Cautious Edge Ability",
    restriction: "Associated with Bio-Gen. Hiring eligibility and administration remain with the players.",
    source: "Draconis Reach p. 93"
  }
]);

export const LUCERNE_COMMAND_COMPLICATIONS = Object.freeze({
  ref: "Draconis Reach pp. 30, 92–93",
  note: "Apply only to Lucerne standard tracks. Resolve each force independently and select every resulting effect below. Command Rights modifiers are Independent +0, Liaison +1, House +2, and Integrated +3. Bio-Gen Raid uses Enough Chaos instead.",
  rows: [
    { roll: "1–3", name: "No Complication", text: "No complication applies." },
    { roll: "4", name: "Conflicting Orders", text: "The affected mercenaries suffer a −2 Initiative penalty for the first two turns of the battle." },
    { roll: "5–6", name: "Voracious Reptile Swarms", text: "For each affected player, randomly place 1D3 neutral swarms per mapsheet. Each BattleTech swarm covers one central hex and every adjacent hex and is 1 level high (Alpha Strike: 6-inch AOE and 1 inch high); swarms may not share a center hex. At the end of each Movement Phase each swarm moves 2 hexes in a random direction (Alpha Strike: 4 inches), stopping at level 3+ hills or depth 2+ water (Alpha Strike: more than 2 inches elevation change or water at least 2 inches deep). Non-energy ranged attacks into or through a swarm receive +1 target number regardless of the number of swarm hexes; energy attacks receive +2 (Alpha Strike: +1 to non-ENE attacks and +2 to ENE attacks). An Asset occupying a swarm hex during the Weapon Attack Phase takes 1D6 damage (Alpha Strike: 0* damage). Swarms are immune to damage, but an Anti-Infantry (AI) weapon hit on the occupied hex prevents that swarm’s damage for the turn." },
    { roll: "7", name: "Heavy Rainfall", text: "Battlefield-wide beginning on Round 3. BattleTech: all weapon attacks receive +1 target number and all units receive +1 target number to Piloting Skill checks. Alpha Strike: all weapon attacks and bog down checks receive +1 target number." },
    { roll: "8+", name: "Roll Twice", text: "Resolve exactly two secondary results using the same Command Rights modifier. Reroll secondary 8+ results and duplicate actual complication effects; accept duplicate No Complication results. Results 5 and 6 are the same swarm effect. Replacement rolls use the same modifier, do not recurse, and continue until a different effect or No Complication is obtained." }
  ]
});

export const LUCERNE_PROVISIONAL_RULES = Object.freeze([
  "Six months is the provisional maximum duration; six completed tracks end the contract early; Bio-Gen Raid occurs only if the sixth track is reached. The printed minimum-intensity discrepancy remains unresolved.",
  "Apply the same modifier to initial, secondary, and replacement rolls; resolve exactly two secondary effects; reroll secondary 8+ and duplicate actual effects; accept duplicate No Complication; results 5 and 6 are one effect; do not recurse.",
  "Each affected player independently generates 1D3 neutral swarms per mapsheet. If both players receive the effect, use 2D3 per mapsheet and keep every center hex unique."
]);

export function lucerneCommandModifier(rights = "independent") {
  return rights === "liaison" ? 1 : rights === "house" ? 2 : rights === "integrated" ? 3 : 0;
}

function lucerneDie(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Math.trunc(Number(value));
  return number >= 1 && number <= 6 ? number : null;
}

function lucerneEffect(value) {
  if (value === null) return null;
  if (value <= 3) return "none";
  if (value === 4) return 4;
  if (value === 5 || value === 6) return 5;
  if (value === 7) return 7;
  return 8;
}

function resolveLucerneSecondary(raw, replacements, modifier, duplicateEffect = null) {
  const candidates = [raw, ...(Array.isArray(replacements) ? replacements : [])];
  let replacementsUsed = 0;
  for (let index = 0; index < candidates.length; index += 1) {
    const die = lucerneDie(candidates[index]);
    if (die === null) return { effective: null, effect: null, replacementsUsed, needsReplacement: false, pending: true };
    const effective = die + modifier;
    const effect = lucerneEffect(effective);
    if (effect !== 8 && (effect === "none" || effect !== duplicateEffect)) {
      return { effective, effect, replacementsUsed, needsReplacement: false, pending: false };
    }
    if (index > 0 || candidates.length > 1) replacementsUsed += 1;
  }
  return { effective: null, effect: null, replacementsUsed, needsReplacement: true, pending: true };
}

export function resolveLucerneComplications(selection = {}, rights = "independent") {
  const modifier = lucerneCommandModifier(rights);
  const initialRaw = lucerneDie(selection.initial);
  const initial = initialRaw === null ? null : initialRaw + modifier;
  if (initial === null) return { modifier, initial: null, secondary: [], effects: [], pendingSecondary: false, replacementNeeds: [] };
  const initialEffect = lucerneEffect(initial);
  if (initialEffect !== 8) {
    return { modifier, initial, secondary: [], effects: initialEffect === "none" ? [] : [initialEffect], pendingSecondary: false, replacementNeeds: [] };
  }
  const first = resolveLucerneSecondary(selection.secondaryOne, selection.replacementOne, modifier);
  const duplicateEffect = first.pending || first.effect === "none" ? null : first.effect;
  const second = resolveLucerneSecondary(selection.secondaryTwo, selection.replacementTwo, modifier, duplicateEffect);
  const effects = [first.effect, second.effect].filter(effect => effect !== null && effect !== "none");
  return {
    modifier,
    initial,
    secondary: [first, second],
    effects,
    pendingSecondary: first.pending || second.pending,
    replacementNeeds: [first.needsReplacement, second.needsReplacement]
  };
}

export function achernarInitialDefectors(scale = 1) {
  return Math.min(3, Math.max(1, Number(scale) || 1)) * 2;
}

export function normalizeAchernarCampaignState(record = {}, scale = 1) {
  const initialDefectors = achernarInitialDefectors(scale);
  const bounded = (value, maximum) => {
    if (value === "" || value === null || value === undefined) return null;
    return Math.min(maximum, Math.max(0, Math.trunc(Number(value) || 0)));
  };
  const survivorsAfterTrack3 = bounded(record.survivorsAfterTrack3, initialDefectors);
  const survivorsAfterTrack4 = survivorsAfterTrack3 === null ? null : bounded(record.survivorsAfterTrack4, survivorsAfterTrack3);
  const finalSurvivors = survivorsAfterTrack4 === null ? null : bounded(record.finalSurvivors, survivorsAfterTrack4);
  return {
    initialDefectors,
    survivorsAfterTrack3,
    survivorsAfterTrack4,
    finalSurvivors,
    strikeWinner: ["tybalt", "home-guard"].includes(record.strikeWinner) ? record.strikeWinner : "not-recorded",
    retreatWinner: ["tybalt", "home-guard"].includes(record.retreatWinner) ? record.retreatWinner : "not-recorded",
    qualifyingSupportDestroyed: Math.max(0, Math.trunc(Number(record.qualifyingSupportDestroyed) || 0))
  };
}

export function calculateAchernarVictory(record = {}, { scale = 1, strikePlayed = null } = {}) {
  const normalized = normalizeAchernarCampaignState(record, scale);
  const supportVictory = normalized.qualifyingSupportDestroyed >= 5;
  let tybalt = "pending";
  let homeGuard = supportVictory ? "victory" : "pending";

  if (normalized.finalSurvivors !== null) {
    if (normalized.finalSurvivors > 0) {
      tybalt = "victory";
      homeGuard = supportVictory ? "victory" : "not-qualified";
    } else if (strikePlayed === false) {
      tybalt = "not-qualified";
      homeGuard = "victory";
    } else if (strikePlayed === true && normalized.strikeWinner !== "not-recorded" && normalized.retreatWinner !== "not-recorded") {
      const alternativeVictory = normalized.strikeWinner === "tybalt" && normalized.retreatWinner === "tybalt";
      tybalt = alternativeVictory ? "victory" : "not-qualified";
      homeGuard = supportVictory || !alternativeVictory ? "victory" : "not-qualified";
    }
  }

  const outcome = tybalt === "victory" && homeGuard === "victory"
    ? "both-contracts-successful"
    : tybalt === "victory" && homeGuard === "not-qualified"
      ? "tybalt-contract-successful"
      : tybalt === "not-qualified" && homeGuard === "victory"
        ? "home-guard-contract-successful"
        : "pending";
  return { ...normalized, tybalt, homeGuard, supportVictory, outcome };
}

const ALTA_WINNERS = ["not-recorded", "ravens", "escobar", "neither"];
const ALTA_COMPLETIONS = ["not-recorded", "successful", "unsuccessful"];
const ALTA_COMPLICATION_SIX = ["not-triggered", "both-comply", "escobar-complies-ravens-refuse", "escobar-refuses-ravens-comply", "both-refuse"];
const ALTA_RAVEN_DECISIONS = ["pending", "cargo-departure", "stop", "revenge"];
const ALTA_HIRES = ["none", "raven", "roland"];
const ALTA_BUILDING_RESULTS = ["not-recorded", "preserved", "destroyed"];

function altaChoice(value, choices, fallback) {
  return choices.includes(value) ? value : fallback;
}

function normalizeAltaVistaTrial(trial = {}) {
  const complicationSix = altaChoice(trial.complicationSix, ALTA_COMPLICATION_SIX, "not-triggered");
  const normalized = {
    played: Boolean(trial.played),
    tacticalWinner: altaChoice(trial.tacticalWinner, ALTA_WINNERS, "not-recorded"),
    escobarCompletion: altaChoice(trial.escobarCompletion, ALTA_COMPLETIONS, "not-recorded"),
    ravensCompletion: altaChoice(trial.ravensCompletion, ALTA_COMPLETIONS, "not-recorded"),
    complicationSix,
    ravensDecision: altaChoice(trial.ravensDecision, ALTA_RAVEN_DECISIONS, "pending"),
    escobarHire: altaChoice(trial.escobarHire, ALTA_HIRES, "none"),
    ravensHire: altaChoice(trial.ravensHire, ALTA_HIRES, "none"),
    buildingResult: altaChoice(trial.buildingResult, ALTA_BUILDING_RESULTS, "not-recorded"),
    ravenSurvivors: String(trial.ravenSurvivors || ""),
    escobarSurvivors: String(trial.escobarSurvivors || ""),
    battlefieldCarryover: String(trial.battlefieldCarryover || "")
  };
  if (complicationSix === "both-comply") {
    normalized.played = true;
    normalized.tacticalWinner = "ravens";
    normalized.escobarCompletion = "successful";
    normalized.ravensCompletion = "successful";
    normalized.ravensDecision = "pending";
  } else if (complicationSix === "escobar-complies-ravens-refuse") {
    normalized.played = true;
    normalized.escobarCompletion = "successful";
    normalized.ravensDecision = "pending";
  } else if (complicationSix === "escobar-refuses-ravens-comply") {
    normalized.played = true;
    normalized.escobarCompletion = "unsuccessful";
    normalized.ravensCompletion = "successful";
    normalized.ravensDecision = "pending";
  } else if (complicationSix === "both-refuse") {
    normalized.played = true;
    normalized.escobarCompletion = "unsuccessful";
    normalized.ravensCompletion = "unsuccessful";
    normalized.ravensDecision = "pending";
  }
  return normalized;
}

export function normalizeAltaVistaCampaignState(record = {}) {
  const inputTrials = Array.isArray(record.trials) ? record.trials : [];
  return {
    ravenFaction: altaChoice(record.ravenFaction, ["not-recorded", "mercenary", "raven-alliance"], "not-recorded"),
    escobarCommandRights: altaChoice(record.escobarCommandRights, ["liaison", "house", "integrated"], "liaison"),
    trials: [0, 1, 2].map(index => normalizeAltaVistaTrial(inputTrials[index])),
    retreatResult: altaChoice(record.retreatResult, ["not-recorded", "ravens", "no-raven-victory"], "not-recorded")
  };
}

export function evaluateAltaVistaCampaign(record = {}) {
  const normalized = normalizeAltaVistaCampaignState(record);
  const availableSequences = [];
  const playedTrials = [];
  let contractComplete = false;
  let terminationReason = "Awaiting Trial 1";
  let retreatStatus = "not-triggered";
  let retreatTriggerTrial = null;
  let ravensDetained = false;
  let escobarDetained = false;
  let escobarBrokeContract = false;

  for (let index = 0; index < normalized.trials.length; index += 1) {
    const sequence = index + 1;
    const trial = normalized.trials[index];
    availableSequences.push(sequence);
    if (!trial.played) {
      terminationReason = "Trial " + sequence + " is available and awaiting results.";
      break;
    }
    playedTrials.push(trial);

    if (trial.complicationSix === "both-comply") {
      retreatStatus = "prohibited";
      if (sequence < 3) {
        terminationReason = "Mutual withdrawal completed Trial " + sequence + "; continue to Trial " + (sequence + 1) + ".";
        continue;
      }
      contractComplete = true;
      terminationReason = "Mutual withdrawal completed the final warehouse trial; Retreat was prohibited.";
      break;
    }
    if (trial.complicationSix === "escobar-complies-ravens-refuse") {
      ravensDetained = true;
      retreatStatus = "prohibited";
      contractComplete = true;
      terminationReason = "Ravens refused Escobar’s withdrawal order, were detained, and ended the contract.";
      break;
    }
    if (trial.complicationSix === "escobar-refuses-ravens-comply") {
      escobarDetained = true;
      escobarBrokeContract = true;
      retreatStatus = "prohibited";
      contractComplete = true;
      terminationReason = "Escobar refused the withdrawal order, broke contract, and ended the contract.";
      break;
    }
    if (trial.complicationSix === "both-refuse") {
      ravensDetained = true;
      escobarDetained = true;
      escobarBrokeContract = true;
      retreatStatus = "prohibited";
      contractComplete = true;
      terminationReason = "Both sides refused the withdrawal order, were detained, and ended the contract.";
      break;
    }

    if (trial.tacticalWinner === "not-recorded") {
      terminationReason = "Trial " + sequence + " was played, but its tactical winner is not recorded.";
      break;
    }
    if (trial.tacticalWinner === "ravens") {
      if (trial.ravensDecision === "revenge") {
        retreatTriggerTrial = sequence;
        retreatStatus = normalized.retreatResult === "not-recorded"
          ? "pending"
          : normalized.retreatResult === "ravens" ? "played-ravens-won" : "played-no-raven-victory";
        availableSequences.push(4);
        if (normalized.retreatResult === "not-recorded") {
          terminationReason = "Ravens chose revenge after Trial " + sequence + "; Retreat is pending.";
        } else {
          contractComplete = true;
          terminationReason = "The Retreat triggered after Trial " + sequence + " has concluded.";
        }
        break;
      }
      if (trial.ravensDecision === "cargo-departure" || trial.ravensDecision === "stop") {
        retreatStatus = "declined";
        contractComplete = true;
        terminationReason = trial.ravensDecision === "cargo-departure"
          ? "Ravens departed with the cargo; the contract ended without Retreat."
          : "Ravens chose no further tracks; the contract ended without Retreat.";
        break;
      }
      terminationReason = "Ravens won Trial " + sequence + "; record whether they depart, stop, or seek revenge.";
      break;
    }

    if (sequence === 3) {
      contractComplete = true;
      terminationReason = "All three warehouse trials have concluded without a Raven Retreat trigger.";
      break;
    }
    terminationReason = "Trial " + sequence + " did not produce a Raven victory; continue to Trial " + (sequence + 1) + ".";
  }

  const ravensMeetingWins = playedTrials.filter(trial => trial.tacticalWinner === "ravens").length;
  const escobarMeetingWins = playedTrials.filter(trial => trial.tacticalWinner === "escobar").length;
  const completionValuesKnown = playedTrials.every(trial => trial.escobarCompletion !== "not-recorded");
  const escobarSuccessfulTracks = playedTrials.filter(trial => trial.escobarCompletion === "successful").length;
  const escobarRequiredTracks = Math.ceil(playedTrials.length / 2);
  const explicitNoVictor = ravensDetained || (
    ravensMeetingWins > escobarMeetingWins &&
    (retreatStatus === "declined" || retreatStatus === "played-no-raven-victory")
  );
  let escobarVictory = false;
  let ravensVictory = false;
  let outcome = "pending";
  if (contractComplete) {
    if (explicitNoVictor) {
      outcome = "no-victor";
    } else if (!completionValuesKnown || playedTrials.length === 0) {
      outcome = "pending";
    } else {
      escobarVictory = !escobarBrokeContract && escobarSuccessfulTracks >= escobarRequiredTracks;
      ravensVictory = normalized.retreatResult === "ravens";
      outcome = escobarVictory && ravensVictory
        ? "both-contracts-successful"
        : escobarVictory
          ? "escobar-wins"
          : ravensVictory
            ? "ravens-win"
            : "no-victor";
    }
  }

  return {
    ...normalized,
    availableSequences: [...new Set(availableSequences)],
    playedMeetingEngagements: playedTrials.length,
    ravensMeetingWins,
    escobarMeetingWins,
    escobarSuccessfulTracks,
    escobarRequiredTracks,
    retreatStatus,
    retreatTriggerTrial,
    contractComplete,
    terminationReason,
    ravensDetained,
    escobarDetained,
    escobarBrokeContract,
    explicitNoVictor,
    escobarVictory,
    ravensVictory,
    outcome
  };
}

export const GENERAL_RULES = [
  {
    title: "Commander",
    text: "Each force designates one unit as commander. If the commander is destroyed, that force takes a −2 penalty to Initiative rolls.",
    ref: "Draconis Reach p. 167"
  },
  {
    title: "Forced Withdrawal",
    text: "Under forced withdrawal, ’Mechs retreat toward their home map edge when rendered useless or in imminent danger of destruction. They need not spend Running MP and may retreat backward, but may still attack a unit that closes into weapon or physical-attack range.",
    ref: "Draconis Reach p. 167"
  },
  {
    title: "Crippling Damage",
    text: "BattleTech: four or more points of damage to the MechWarrior; all sensor critical slots destroyed; one gyro and one engine critical hit; two engine critical hits; a side torso destroyed; internal structure damage in either three or more limbs or two or more torso locations, except torso internal structure damage does not count while that location still has front armor; or loss through damage or ammunition depletion of all weapons with a range greater than five hexes and the inability to cause more than 5 points of combined weapons damage. The weapons condition does not apply if the ’Mech began unable to cause 5 or more damage or unable to cause damage beyond five hexes. A ’Mech with all weapons destroyed and no ability to move is considered destroyed. Alpha Strike: no armor remaining and reduced to half starting structure, rounded up; a unit that begins with only 1 structure starts withdrawing as soon as it loses all armor; reduced to a damage value of 0 for all medium- and long-range attacks, unless it began with 0 damage at both ranges; or immobilized through damage, critical, or motive hit effects.",
    ref: "Draconis Reach p. 167"
  },
  {
    title: "Scanning",
    text: "BattleTech: BattleMechs and vehicle assets may declare a scan of one target within 4 hexes and LOS during the Physical Attack Phase in place of making a physical attack. The scan completes during the End Phase of the following turn. The scanner may make physical attacks during that second turn, but may not make weapon attacks. The scan fails if the target is destroyed or out of range at the end of the following turn, and destroyed units cannot be scanned. A unit with a Sensor critical hit cannot scan without a functioning probe. A functioning probe within its Scanning Range Table range removes the LOS requirement and permits weapon and physical attacks during the second turn, but a probe cannot scan when blocked by enemy ECM. Alpha Strike: A unit may declare a scan of one target within 8 inches and LOS during the Combat Phase. The scanning unit may not make a physical attack during the initial turn. The scan completes during the End Phase of the following turn, when the scanner may make physical attacks. The scan fails if the target is destroyed or out of range at the end of that turn. A sprinting unit cannot scan, and a Fire Control critical hit prevents scanning unless the unit has a functioning probe. A functioning probe that is not blocked by enemy ECM removes the LOS requirement, uses the probe’s Scanning Range Table range, and permits weapon or physical attacks during the second turn.",
    ref: "Draconis Reach p. 167"
  },
  {
    title: "Scanning range",
    table: {
      headers: ["Scanning Equipment", "BT Range", "AS Range", "LOS Required", "Weapon Attacks on 2nd Turn"],
      rows: [
        ["Default Sensors", "4", "8″", "Yes", "No"],
        ["Light Active Probe (LPRB)", "3", "6″", "No", "Yes"],
        ["Watchdog (WAT)", "3", "6″", "No", "Yes"],
        ["Beagle Active Probe (PRB)", "4", "9″", "No", "Yes"],
        ["Asset with PRB", "4", "N/A", "No", "Yes"],
        ["Clan Active Probe", "5", "N/A", "No", "Yes"],
        ["Bloodhound (BH)", "8", "12″", "No", "Yes"]
      ]
    },
    text: "The ranges and restrictions above apply with the complete BattleTech and Alpha Strike procedures in the shared Scanning rule.",
    ref: "Draconis Reach p. 167"
  }
];

const BOTH = "both";
const A = "attacker";
const D = "defender";

export const TRACKS = [
  {
    id: "assault",
    name: "Assault",
    page: 168,
    summary: "A pitched battle where the Attacker tries to drive the Defender from the field entirely.",
    setup: [
      "The Defender selects a long edge as their home edge; the Attacker gets the opposite long edge.",
      "Defender (Garrison): deploy within 5 full hexes (AS: 10 inches) of the home edge before the first turn’s Initiative.",
      "Attacker (Garrison): enter from the home edge during the Movement Phase of Turn 1. The Attacker may not select Minefield or Immobile BSP assets."
    ],
    objectives: [
      { id: "orders-attacker", name: "Orders", side: A, vp: 50, text: "At least half of the Attacker’s units by number, excluding assets, either make an attack on an enemy unit for two consecutive turns or remain within LOS and medium range of an enemy weapon for two consecutive turns." },
      { id: "orders-defender", name: "Orders", side: D, vp: 50, text: "All of the Defender’s units stay on the field for the first three turns, or are crippled or destroyed." },
      { id: "conquer", name: "Conquer", side: BOTH, vp: 200, text: "Destroy or cripple at least half of the opponent’s starting force by BV or PV, excluding assets, before more than 50 percent of your own force is destroyed. If both sides finish in the same phase, neither scores this objective." },
      { id: "hold-field", name: "Hold the Field", side: BOTH, vp: 100, text: "If one side’s entire deployed force, including assets, is crippled or destroyed, the other side successfully holds the field." }
    ],
    special: [
      "Track End: after the end of any turn when at least one side has no units in play, or after the end of Turn 10 (Turn 8 in Alpha Strike).",
      "Salvage: the side that successfully completes the track earns all salvage."
    ]
  },
  {
    id: "breakthrough",
    name: "Breakthrough",
    page: 168,
    pageRef: "pp. 168–169",
    summary: "The Attacker attempts a pinpoint strike to break through the Defender’s lines.",
    setup: [
      "The Defender selects a long edge as their home edge; the Attacker gets the opposite long edge.",
      "Defender (Garrison): deploy within 6 full hexes (AS: 12 inches) of the home edge before the first turn’s Initiative.",
      "Attacker (Standard): enter from the home edge during the Movement Phase of Turn 1. The Attacker may not select Minefield or Immobile BSP assets."
    ],
    objectives: [
      { id: "orders-attacker", name: "Orders", side: A, vp: 50, text: "At least half of the Attacker’s starting units by BV or PV, excluding assets, cross the center line toward the Defender’s home edge." },
      { id: "orders-defender", name: "Orders", side: D, vp: 50, text: "At least half of the Defender’s surviving units by number, excluding assets, make an attack on an enemy unit for two consecutive turns." },
      { id: "push-through", name: "Push Through", side: A, vp: 300, text: "Move at least half of the Attacker’s starting force by BV or PV, including assets, off the Defender’s home edge." },
      { id: "suppressing-fire", name: "Suppressing Fire", side: BOTH, vp: 100, text: "Every non-BSP unit in the opponent’s force suffers at least 1 point of internal damage (AS: 1 point of damage)." },
      { id: "you-shall-not-pass", name: "You Shall Not Pass", side: D, vp: 300, text: "Cripple or destroy at least half of the Attacker’s starting force by BV or PV, including assets, before they can exit off the Defender’s home edge." }
    ],
    special: [
      "Track End: after the end of any turn when at least one side has no units in play, or after the end of Turn 10 (Turn 8 in Alpha Strike).",
      "Salvage: both sides may claim salvage from one shared pool. The player that successfully completed the track chooses first. If neither side completed it, or both completed all objectives, no opposing salvage is claimed and each side gets its own destroyed or crippled units returned."
    ],
    errataNote: "The supplied v2.41 errata changes the older Hinterlands Breakthrough page. The Draconis Reach wording above is the superseding source used here."
  },
  {
    id: "defend",
    name: "Defend",
    page: 169,
    summary: "The Defender attempts a defense-in-depth to hold back the onslaught of the Attacker’s force.",
    setup: [
      "The Defender selects a short edge as their home edge; the Attacker gets the opposite short edge.",
      "Defender (Garrison): hold up to 33 percent of the force, measured by number of units and rounding down, including assets, off the map at the start. Deploy the remainder within 6 full hexes (AS: 12 inches) of the home edge; at Scale 2+, use 12 hexes (AS: 18 inches). Place held units anywhere on full hexes within the Defender’s half after the Movement Phase of Turn 1 as if they moved 0 hexes or used standstill movement. Defenders may not select BSP Strikes (AS: Aerospace Support).",
      "Attacker (Raiders): enter from the home edge during the Movement Phase of Turn 1. The Attacker may not select Minefield or Immobile BSP assets."
    ],
    scaleNotes: ["At Scale 2+, the Defender deployment distance becomes 12 hexes / 18 inches and the timing thresholds below move from Turn 3 to Turn 4 and from Turn 6 to Turn 8."],
    objectives: [
      { id: "orders-both", name: "Orders", side: BOTH, vp: 50, text: "At least half of your surviving units by number, excluding assets, are within 4 hexes / 8 inches of the center line at the end of Turn 3; at Scale 2+, use 6 hexes / 12 inches at the end of Turn 4." },
      { id: "overpower", name: "Overpower", side: BOTH, vp: 250, text: "At the end of Turn 6, or Turn 8 at Scale 2+, have more non-crippled units than the opponent, measured by BV and excluding assets, within 4 hexes / 8 inches of the center line." },
      { id: "cut-off-head", name: "Cut Off The Head", side: BOTH, vp: 150, text: "Destroy or cripple the enemy commander’s unit." }
    ],
    special: [
      "Track End: after the End Phase of any turn when at least one side has no units in play, or Turn 6 (Turn 8 at Scale 2+).",
      "Salvage: the side that successfully completes the track earns all salvage."
    ]
  },
  {
    id: "flank",
    name: "Flank",
    page: 170,
    summary: "The Attacker attempts to maneuver past the fixed fortifications of the Defender to roll up the line.",
    setup: [
      "The Defender selects a long edge as their home edge; the Attacker gets the opposite long edge.",
      "The Defender receives two veteran Medium Emplacements per Scale, or the Defender’s choice of emplacements up to 20 BSP each, placed on the Attacker’s half. For Alpha Strike, the Defender gets two Gun Trailer (Ultra). Without BSP, use immobile 30 CF bunkers with an Inner Sphere Large Laser, fixed front arc, and Gunnery skill 4.",
      "Defender (Standard): deploy the entire force within hexes fully in the Defender’s half before Turn 1.",
      "Attacker (Raiders): at least one third of the force by number of units, rounding down and including assets, enters from the home edge during Turn 1. The remainder enters from a short edge during Turn 2. The Attacker may not select Minefield or Immobile BSP assets."
    ],
    scaleNotes: ["The number of Defender emplacements is two per Scale."],
    objectives: [
      { id: "orders-attacker", name: "Orders", side: A, vp: 50, text: "At least half of the Attacker’s surviving units by number, including assets, are in the Defender’s half during any End Phase." },
      { id: "orders-defender", name: "Orders", side: D, vp: 50, text: "At least half of the Defender’s units by number, excluding assets, make an attack on an enemy unit for two consecutive turns." },
      { id: "crush", name: "Crush", side: A, vp: 150, text: "Destroy or cripple at least 50 percent of the opponent’s force by BV or PV, including assets." },
      { id: "ramming-speed", name: "Ramming Speed", side: A, vp: 150, text: "Destroy all of the Defender’s emplacements." },
      { id: "cut-off-retreat", name: "Cut off Retreat", side: A, vp: 150, text: "Have at least one non-crippled ’Mech, or 2 BSP assets, per Scale within 3 hexes (AS: 6 inches) of the opponent’s home edge during the End Phase for at least 2 consecutive turns. The units need not be the same in consecutive turns." },
      { id: "turn-the-tide", name: "Turn the Tide", side: D, vp: 150, text: "Destroy or cripple at least 50 percent of the Attacker’s force by BV or PV, including assets." },
      { id: "fall-back-order", name: "Fall Back in Order", side: D, vp: 150, text: "After completing Turn the Tide, withdraw at least 50 percent of the Defender’s starting force by BV or PV, including assets, off the home edge." }
    ],
    special: [
      "Track End: after the end of any turn when at least one side has no units in play, or after the end of Turn 10 (Turn 8 in Alpha Strike).",
      "Salvage: the side that successfully completes the track earns all salvage."
    ]
  },
  {
    id: "meeting-engagement",
    name: "Meeting Engagement",
    page: 171,
    pageRef: "pp. 170–171",
    summary: "Two forces make contact and quickly fall back.",
    setup: [
      "The Defender selects a short edge as their home edge; the Attacker gets the opposite short edge. Neither side may select Minefield or Immobile BSP assets.",
      "Attacker (Standard): enter from the Attacker’s home edge during the Movement Phase of Turn 1.",
      "Defender (Standard): enter from the Defender’s home edge during the Movement Phase of Turn 1."
    ],
    objectives: [
      { id: "orders-both", name: "Orders", side: BOTH, vp: 50, text: "At least half of your units by number, excluding assets, either make an attack on an enemy unit for two consecutive turns or move within 12 hexes (AS: 24 inches) of an enemy unit for two consecutive turns." },
      { id: "make-acquaintance", name: "Make their Acquaintance", side: BOTH, vp: 200, text: "The first team to destroy or cripple one third or more of the opponent’s starting force by BV or PV, excluding assets. Units that withdraw from their home edge before being crippled count as crippled. If both finish in the same phase, neither scores this objective." },
      { id: "suppressing-fire", name: "Suppressing Fire", side: BOTH, vp: 100, text: "Every non-BSP unit in the opponent’s force suffers at least 1 point of structure damage." }
    ],
    special: [
      "Track End: after the end of any turn when at least one side has no units in play, or after the End Phase of Turn 8 (Turn 6 in Alpha Strike).",
      "Salvage: neither side may claim salvage."
    ]
  },
  {
    id: "objective-raid",
    name: "Objective Raid",
    page: 171,
    summary: "The Attacker attempts a smash and grab to steal vital assets from the Defender.",
    setup: [
      "The Defender selects a short edge as their home edge; the Attacker gets the opposite short edge.",
      "The Defender designates two Medium objective buildings, height 1–4 levels (AS: 2–6 inches), within 4 hexes of the battlefield center, or 6 hexes at Scale 2+, in clear, rough, or wooded terrain or depth-0 water. If the center falls on a hex border, include every bordered hex. The objective buildings are indestructible.",
      "Defender (Garrison): begin with all units in the play area; at least half of the force must be within 6 hexes of the objective buildings.",
      "Attacker (Raiders): enter from the home edge during the Movement Phase of Turn 1. The Attacker may not select Minefield or Immobile BSP assets."
    ],
    scaleNotes: ["At Scale 2+, objective buildings may be up to 6 hexes from the center. Orders—Attacker requires one unit per Scale."],
    objectives: [
      { id: "orders-attacker", name: "Orders", side: A, vp: 50, text: "At least one Attacker unit per Scale, excluding assets, crosses the center line toward the Defender’s home edge." },
      { id: "orders-defender", name: "Orders", side: D, vp: 50, text: "All Defender units stay within 3 hexes (AS: 6 inches) of one objective building, or closer to the Attacker’s home edge than one objective building, for the first two turns, or are crippled or destroyed." },
      { id: "grab-stuff", name: "Grab the stuff", side: A, vp: 100, repeatable: true, text: "Each objective component carried off the Attacker’s home edge." },
      { id: "pay-for-that", name: "You must pay for that", side: D, vp: 100, repeatable: true, text: "Each non-asset Attacker unit crippled or destroyed." }
    ],
    special: [
      "Leg it!: the Attacker may not claim salvage.",
      "Raid: an Attacker ’Mech with at least one hand or infantry that ends its turn next to an objective building may grab objective components.",
      "Capacity: a ’Mech or vehicle carries a maximum equal to its weight class / Alpha Strike SZ (Light 1, Medium 2, Heavy 3, Assault 4). Cargo space may increase this to cargo tonnage divided by 5 tons, rounded down (AS: CT divided by 3, rounded down).",
      "A standing ’Mech can grab and load one component per hand actuator onto itself or an adjacent ’Mech/vehicle per turn. A hand-actuator ’Mech can transfer one carried component to an adjacent unit at the end of a subsequent Movement Phase.",
      "Infantry can load one component onto an adjacent ’Mech or vehicle per turn; mechanized infantry must dismount and infantry cannot carry components. An asset vehicle can carry one component if assisted with loading and loses 1 MP while carrying it.",
      "Carrying reduces walking/cruising movement by 1 total (AS: MV by 2 inches). A ’Mech carrying a component and using jump movement makes a PSR to stay standing; failure does not drop components. Carrying does not affect attacks.",
      "Track End: after the end of any turn when at least one side has no units in play, or after the end of Turn 12 (Turn 10 in Alpha Strike).",
      "Salvage: the Attacker may not claim salvage. The Defender claims salvage if they successfully complete the track; otherwise all salvage returns to its owners.",
      "Source note: the printed track text does not state a component count per objective building; use the repeatable component counter for each component actually carried off."
    ]
  },
  {
    id: "pursuit",
    name: "Pursuit",
    page: 172,
    summary: "The Defenders run for their lives while the Attacker attempts to chase them down.",
    setup: [
      "At Scale 1–2, use two mapsheets with long edges touching, or one 36-inch Alpha Strike BattleMat. At Scale 3+, use four mapsheets or two 48-inch BattleMats with long edges touching.",
      "The Attacker selects a short edge as home edge; the Defender gets the opposite short edge.",
      "Both sides start from the Attacker’s home edge. The Defender is trying to reach the opposite home edge; the Attacker is trying to catch them."
    ],
    scaleNotes: ["The map footprint changes from two mapsheets / 36 inches at Scales 1–2 to four mapsheets / 48 inches at Scale 3+."],
    setupDetails: [
      "Defender (Raiders): enter from the Attacker’s home edge during the Movement Phase of Turn 1. At least half of the Defender’s units by BV/PV, excluding assets, must have maximum movement 8 or less (AS: maximum MV 16 inches or less). If none qualify, the player may temporarily apply critical hits or motive effects to lower maximum speed.",
      "Attacker (Raiders): enter from the Attacker’s home edge during the Movement Phase of Turn 2."
    ],
    objectives: [
      { id: "orders-attacker", name: "Orders", side: A, vp: 50, text: "Engage (make an attack on) at least half of the Defender’s units by number, including assets." },
      { id: "orders-defender", name: "Orders", side: D, vp: 50, text: "At least half of the Defender’s starting force by BV/PV, excluding assets, crosses the center line toward its home edge." },
      { id: "prevention", name: "Prevention", side: A, vp: 300, text: "Prevent at least 75 percent of the Defender’s starting force by BV/PV, excluding assets, from exiting through its home edge by the end of Turn 10." },
      { id: "no-quarter", name: "No Quarter", side: A, vp: 100, text: "Destroy or cripple 100 percent of the Defender’s starting force by BV/PV, including assets." },
      { id: "escape", name: "Escape", side: D, vp: 300, text: "At least half of the Defender’s starting force by BV/PV, excluding assets, has qualifying maximum movement and exits through its home edge by the end of Turn 10." },
      { id: "never-here", name: "We Were Never Here", side: D, vp: 100, text: "At least 75 percent of the Defender’s starting force by BV/PV, excluding assets, has qualifying maximum movement and exits through its home edge by the end of Turn 10." }
    ],
    special: [
      "Track End: after the end of any turn when at least one side has no non-crippled units in play, or after the End Phase of Turn 10.",
      "Salvage: the Defender may not claim salvage. The Attacker claims salvage if it successfully completes the track; otherwise all salvage returns to their owners."
    ],
    errataNote: "The supplied v2.41 errata changes the older Hinterlands Pursuit roles and turn limits. Those role assignments are not applied because Draconis Reach p. 172 provides the superseding track."
  },
  {
    id: "pushback",
    name: "Pushback",
    page: 173,
    summary: "The Attacker makes a two-pronged attack to try to push the Defender’s lines back.",
    setup: [
      "The Attacker selects a short edge as their home edge; the Defender gets the opposite short edge.",
      "Defender (Standard): the Defender sets up first anywhere at least 5 hexes (AS: 10 inches) from the home edge; at Scale 2+, use 10 hexes / 16 inches.",
      "Attacker (Standard): receive an additional 32 BSP in vehicle assets per Scale (AS: an additional Scale 1 force total) and split the force in two. At Scale 1, the Scale 1 force is the first force and added BSP assets are the second. At Scale 2+, additional units may be divided between the two. In Turn 1, the first force enters from the Attacker’s home edge and the second enters from the long edges at least halfway up the map from the Defender’s home edge. The Attacker may not select Minefield or Immobile BSP assets."
    ],
    scaleNotes: ["At Scale 2+, Defender setup is 10 hexes / 16 inches from the home edge."],
    objectives: [
      { id: "orders-attacker", name: "Orders", side: A, vp: 50, text: "At least half of the Attacker’s surviving units by number, including assets, cross the center line toward the Defender’s home edge." },
      { id: "orders-defender", name: "Orders", side: D, vp: 50, text: "At least half of the Defender’s surviving units by number, excluding assets, make an attack on an enemy unit for two consecutive turns." },
      { id: "push", name: "Push", side: A, vp: 200, text: "At the end of Turn 4, 75 percent of the Attacker’s remaining force by BV/PV, including assets, is in the half of the map closest to the Defender’s home edge." },
      { id: "crush", name: "Crush", side: A, vp: 400, text: "Destroy or cripple at least 33 percent of the opponent’s starting force by BV/PV, excluding assets." },
      { id: "gutted", name: "Gutted", side: A, vp: 150, text: "Destroy or cripple at least 75 percent of the opponent’s starting force by BV/PV, excluding assets." },
      { id: "advance-to-rear", name: "Advance To The Rear", side: D, vp: 200, text: "Between Turns 6 and 10, at least 50 percent of the Defender’s starting force by BV/PV, excluding assets, retreats off the home edge." },
      { id: "make-them-hurt", name: "Make Them Hurt", side: D, vp: 400, text: "Cripple or destroy at least 50 percent of the Attacker’s starting force by BV/PV, excluding assets." },
      { id: "lead-to-victory", name: "Lead Them To Victory", side: D, vp: 150, text: "Complete the other three Defender objectives and the commander survives." }
    ],
    special: [
      "Track End: after the end of any turn when at least one side has no units in play, or after the end of Turn 10 (Turn 8 in Alpha Strike).",
      "Salvage: both sides may claim salvage from one shared pool. Players take turns selecting one unit at a time from the salvage pool. The player that successfully completed the track chooses first. If neither side completed it, or both completed all objectives, no opposing salvage is claimed and each side gets its own destroyed or crippled units returned."
    ]
  },
  {
    id: "recon",
    name: "Recon",
    page: 174,
    summary: "The Attacker attempts to assess the composition of the Defender’s force before slipping away.",
    setup: [
      "The Attacker chooses any edge as their home edge first. The Defender may choose any other edge.",
      "Defender (Standard): set up anywhere; at least 50 percent of units by number, including assets, must occupy hexes fully within the half of the play area closest to the Attacker’s home edge.",
      "Attacker (Raiders): enter from the home edge during the Movement Phase of Turn 1. The Attacker may not select Minefield or Immobile BSP assets."
    ],
    objectives: [
      { id: "orders-attacker", name: "Orders", side: A, vp: 50, text: "Scan at least one Defender unit by number per Scale, including assets." },
      { id: "orders-defender", name: "Orders", side: D, vp: 50, text: "At least half of the Defender’s units by number, excluding assets, remain on the battlefield and survive (are not destroyed) the first two turns." },
      { id: "identify-opposition", name: "Identify The Opposition", side: A, vp: 100, text: "Successfully scan at least two thirds of the Defender’s starting force by number, including assets." },
      { id: "preemptive-strike", name: "Preemptive Strike", side: A, vp: 100, text: "Destroy or cripple at least 25 percent of the Defender’s starting force by BV/PV, excluding assets." },
      { id: "observe-report", name: "Observe And Report", side: A, vp: 100, text: "At least 50 percent of the Attacker’s starting force by BV/PV, including assets, survives and exits its home edge anytime after four turns." },
      { id: "deny", name: "Deny", side: D, vp: 50, vpOptions: [50, 100, 200, 300], text: "Any Attacker objectives not met by the end of Turn 8 are counted for the Defender instead. Defender units withdrawing from their home edge before Turn 8 count as Scanned and Destroyed for objective purposes. The printed Deny values are 50/100/200/300." }
    ],
    special: [
      "Scanning: refer to the Scanning rules on page 167.",
      "Salvage: neither side may claim salvage; all salvage returns to its owners.",
      "Track End: after the End Phase of Turn 8 or any turn when at least one side has no units in play."
    ],
    errataNote: "The supplied v2.41 errata changes the older Hinterlands Recon scan wording and timing. Draconis Reach p. 174 and its p. 167 scanning rules are used here."
  },
  {
    id: "retreat",
    name: "Retreat",
    page: 174,
    pageRef: "pp. 174–175",
    summary: "After a successful mission, the Defender attempts to slip away before the Attacker can ascertain their identities and retaliate.",
    setup: [
      "At Scale 1–2, use two mapsheets with long edges touching, or one 36-inch Alpha Strike BattleMat. At Scale 3+, use four mapsheets or two 48-inch BattleMats with long edges touching.",
      "The Defender selects a short edge as their home edge; the Attacker gets the opposite short edge.",
      "Both sides start from the Attacker’s edge. The Defender is trying to retreat to its home edge; the Attacker is trying to identify the fleeing Defenders."
    ],
    scaleNotes: ["The map footprint changes from two mapsheets / 36 inches at Scales 1–2 to four mapsheets / 48 inches at Scale 3+."],
    setupDetails: [
      "Defender (Standard): enter from the Attacker’s starting edge during the Movement Phase of Turn 1.",
      "Attacker (Standard): enter from the home edge during the Movement Phase of Turn 2."
    ],
    objectives: [
      { id: "orders-attacker", name: "Orders", side: A, vp: 50, text: "Successfully scan one Defender unit, or have at least half of the Attacker’s starting units by number, excluding assets, on the Defender’s half at the end of Turn 4." },
      { id: "orders-defender", name: "Orders", side: D, vp: 50, text: "Exit at least one unit from the Defender’s home edge." },
      { id: "identify-weaknesses", name: "Identify Weaknesses", side: A, vp: 200, text: "Successfully scan at least two thirds of the Defender’s starting force by number, rounding up, including assets." },
      { id: "hammer", name: "Hammer", side: BOTH, vp: 100, text: "Be the first to destroy or cripple at least 25 percent of the opponent’s starting force by BV/PV, excluding assets. If both finish in the same phase, both score this objective." },
      { id: "gauntlet", name: "Gauntlet", side: D, vp: 200, text: "Exit at least half of the Defender’s starting force by number, excluding assets, through the Defender’s home edge. Crippled units that escape count for this objective." }
    ],
    special: [
      "Scanning: refer to the Scanning rules on page 167.",
      "Track End: after the end of any turn when at least one side has no units in play, or after the end of Turn 10.",
      "Salvage: the Defender may not claim salvage. The Attacker claims salvage if it successfully completes the track; otherwise all salvage returns to their owners."
    ],
    errataNote: "The supplied v2.41 errata changes the older Hinterlands Retreat scan threshold. Draconis Reach p. 174 provides the superseding two-thirds threshold used here."
  },
  {
    id: "strike",
    name: "Strike",
    page: 175,
    summary: "The Attacker attempts to locate a vital target building and then destroy it.",
    setup: [
      "The Defender selects a long edge as their home edge; the Attacker gets the opposite long edge.",
      "The Defender designates or places four Medium Level 2+ buildings within 3 hexes (AS: 6 inches) of the battlefield center in clear, rough, or wooded terrain or depth-0 water. If the center falls on a hex border, include every bordered hex. Each building takes 30 damage (AS: 6 damage) before destruction and is immobile with a −4 target-number modifier.",
      "Defender (Garrison): deploy the entire force before Initiative anywhere on the Defender’s half. At least 50 percent must be within 3 hexes (AS: 6 inches) of the designated buildings. Secretly designate one building as headquarters before the track starts.",
      "Attacker (Raiders): at least half of the force by number, including assets, enters from the home edge during Turn 1. The remainder enters from a short edge during Turn 2. The Attacker may not select Minefield or Immobile BSP assets."
    ],
    objectives: [
      { id: "orders-attacker", name: "Orders", side: A, vp: 50, text: "Successfully scan two buildings, or locate the headquarters building." },
      { id: "orders-defender", name: "Orders", side: D, vp: 50, text: "At least half of the Defender’s surviving units by number, including assets, are within 6 hexes (AS: 12 inches) of designated buildings at the end of Turn 4." },
      { id: "identify-destroy", name: "Identify And Destroy", side: A, vp: 200, text: "Destroy the headquarters building after it is scanned." },
      { id: "rough-up-place", name: "Rough Up The Place", side: BOTH, vp: 100, text: "Destroy or cripple at least half of the opponent’s starting force by BV/PV, including assets." },
      { id: "seek-destroy", name: "Seek And Destroy", side: D, vp: 200, text: "Destroy or cripple the Attacker’s Commander." }
    ],
    special: [
      "Scanning: refer to the Scanning rules on page 167. Buildings may be scanned to determine whether they are the headquarters objective. When successfully scanned, the Defender reveals whether it is the headquarters. Battle armor and infantry may scan only when adjacent to or inside the building and may not have attacked that turn.",
      "Track End: after the end of any turn when at least one side has no units in play, or after the end of Turn 10 (Turn 8 in Alpha Strike).",
      "Salvage: both sides may claim salvage from one shared pool. Players take turns selecting one unit at a time from the salvage pool. The player that successfully completed the track chooses first. If neither side completed it, or both completed all objectives, no opposing salvage is claimed and each side gets its own destroyed or crippled units returned."
    ],
    errataNote: "The supplied v2.41 errata changes the older Hinterlands Strike scanning paragraph. The Draconis Reach p. 167 scanning rules plus the specific Strike restriction above are used here."
  }
];

export const MISSION_OPFOR_OVERRIDES = {
  "tigress": {
    "legion-trainers": {
      "label": "Laurel’s Legion trainee roster",
      "sourcePage": 118,
      "scales": {
        "1": { "primary": "Vindicator VND-7L (Gunnery 4 / Piloting 6 · AS Skill 5)", "support": "", "alternate": "", "note": "Scenario-provided trainees begin on the battlefield under the Roughriders player’s temporary control. Do not roll on a generic OpFor table." },
        "2": { "primary": "Vindicator VND-7L (Gunnery 4 / Piloting 6 · AS Skill 5) | Cicada CDA-4A (Gunnery 4 / Piloting 6 · AS Skill 5)", "support": "", "alternate": "", "note": "Scenario-provided trainees begin on the battlefield under the Roughriders player’s temporary control. Do not roll on a generic OpFor table." },
        "3": { "primary": "Officer-cadet Vindicator VND-7L (Gunnery 4 / Piloting 5 · AS Skill 4) | ×2 Cicada CDA-4A (Gunnery 4 / Piloting 6 · AS Skill 5)", "support": "", "alternate": "", "note": "Scenario-provided trainees begin on the battlefield under the Roughriders player’s temporary control. Do not roll on a generic OpFor table." }
      }
    }
  },
  "pascagoula": {
    "jewel-thieves": {
      "label": "Fifth Ghost Escorts",
      "sourcePage": 105,
      "scales": {
        "1": {
          "primary": "Chimera CHA-2K (3/4) | Jenner JR7-C2 (3/4)",
          "support": "×4 Ryu Heavy Transport WiGE (use Vedette Medium Tank asset cards)",
          "alternate": "",
          "note": "All Ghost MechWarriors have a Gunnery Skill of 3 and a Piloting Skill of 4."
        },
        "2": {
          "primary": "Chimera CHA-2K (3/4) | Jenner JR7-C2 (3/4) | Daimyo DMO-5K (3/4) | Dragon DRG-5Nr (3/4)",
          "support": "×4 Ryu Heavy Transport WiGE (use Vedette Medium Tank asset cards)",
          "alternate": "",
          "note": "At Scale 2, add a Daimyo DMO-5K and Dragon DRG-5Nr, with a C3 network. All Ghost MechWarriors have a Gunnery Skill of 3 and a Piloting Skill of 4."
        },
        "3": {
          "primary": "Chimera CHA-2K (3/4) | Jenner JR7-C2 (3/4) | Daimyo DMO-5K (3/4) | Dragon DRG-5Nr (3/4) | Nova Cat T (3/4)",
          "support": "×4 Ryu Heavy Transport WiGE (use Vedette Medium Tank asset cards)",
          "alternate": "",
          "note": "At Scale 3, add a Nova Cat T. The Scale 2 additions use a C3 network. All Ghost MechWarriors have a Gunnery Skill of 3 and a Piloting Skill of 4."
        }
      }
    }
  }
};

export const OPPOSING_FORCE_TABLES = {
  "mercenary-pirate": {
    "label": "Mercenary / Pirate",
    "scales": {
      "1": {
        "sourcePage": 187,
        "rows": [
          {
            "roll": "1−",
            "primary": "MON-96 Mongoose (3/4)",
            "support": "×2 J. Edgar X-Pulse Veteran | ×2 Hover APC | ×2 Foot Infantry Veteran | Light Bombing",
            "alternate": "SDR-9KA Venom (3/4) | SDR-8X Spider (3/4)"
          },
          {
            "roll": "2",
            "primary": "NX-100 Nyx (4/5)",
            "support": "×2 H-8 Warrior | Hawk Moth II | ×2 Marten | ×2 Jump Infantry | ×2 Light Bombing",
            "alternate": "CVR-A1 Cadaver (4/5) | LCT-7V2 Locust (4/5) | ALM-10D Fireball (4/5)"
          },
          {
            "roll": "3",
            "primary": "CMA-1S Chimera (4/5) | JVN-12N Javelin (4/5)",
            "support": "×2 Vedette (Ultra) | Hunter | Light Airstrike | ×2 Light Air Cover",
            "alternate": "ABS-4C Anubis (4/5) | SDR-8R Spider (4/5)"
          },
          {
            "roll": "4",
            "primary": "WVR-8K Wolverine (4/5)",
            "support": "Hunter | Patton (Ultra) | Vedette (Ultra) | Heavy Bombing | Light Bombing",
            "alternate": "GRM-01B Garm (4/5) | PNT-12A Panther (4/5)"
          },
          {
            "roll": "5",
            "primary": "GHR-8K Grasshopper (4/5)",
            "support": "Manticore (HPPC) | Pike (LB-X) | GAL-100 Galleon | Light Bombing | ×2 Light Air Strike",
            "alternate": "WHM-5L Warhammer (4/5)"
          },
          {
            "roll": "6+",
            "primary": "BZK-D1 Hollander III (3/4)",
            "support": "Hetzer (Cell) Veteran | LRM Carrier Veteran | Heavy Airstrike | Light Airstrike | Heavy Air Cover | Light Air Cover",
            "alternate": "BNDR-01Ar Bandersnatch (3/4)"
          }
        ]
      },
      "2": {
        "sourcePage": 188,
        "rows": [
          {
            "roll": "1−",
            "primary": "BLD-XX Blade (3/4) | RD-1R Road Runner (3/4)",
            "support": "×2 Scimitar Mk II Veteran | ×2 Harasser Veteran | Harasser Veteran | Maxim (BA Factory) Veteran | IS Standard BA Veteran | IS Standard BA Veteran | Sniper | Heavy Bombing | Light Bombing",
            "alternate": "Baboon (Howler) (3/4) | V4-LNT-J3 Valiant (3/4) | HM-1 Hitman (3/4)"
          },
          {
            "roll": "2",
            "primary": "",
            "support": "",
            "alternate": "",
            "note": "ROLL ×2 Scale 1"
          },
          {
            "roll": "3",
            "primary": "GRM-01B Garm (4/5) | Kit Fox (Uller) K (4/5) | VLK-QDD Valkyrie (4/5)",
            "support": "×2 Hetzer (Cell) | ×2 Vedette (Armor) | Maxim (BA Factory) | ×2 Jump Infantry | ×2 Strafing | ×3 Light Air Cover",
            "alternate": "BZK-D2 Hollander III (4/5) | EXR-2X Exhumer (4/5) | EYL-45A Eyleuka (4/5)"
          },
          {
            "roll": "4",
            "primary": "BJ2-OC Blackjack (4/5) | Stinger IIC (4/5) | WHM-6Rb Warhammer (4/5)",
            "support": "Hawk Moth II | ×2 Patton (Ultra) | ×2 Pike (LB-X) | Heavy Bombing | Heavy Air Strike | Heavy Air Cover | Light Air Cover",
            "alternate": "VND-4L Vindicator (4/5) | FLC-8R Falconer (4/5)"
          },
          {
            "roll": "5",
            "primary": "JR7-31P Rattlesnake (4/5) | RFL-8D Rifleman (4/5)",
            "support": "×2 Manticore (XL) | Ontos (Light Gauss) | ×2 Motorized Infantry | Long Tom | Strafing | Heavy Air Cover | Light Air Cover",
            "alternate": "GTL-4L Guillotine (4/5) | NSR-9FC Nightstar (4/5)"
          },
          {
            "roll": "6+",
            "primary": "DVS-2 Devastator (3/4)",
            "support": "×2 LRM Carrier Veteran | ×2 Motorized Infantry Veteran | ×3 Light Emplacement Veteran | Heavy Emplacement Veteran | Heavy Air Strike | ×2 Light Airstrike",
            "alternate": "Incubus (Vixen) 6 (3/4) | HSN-7D Hellspawn (3/4)"
          }
        ]
      },
      "3": {
        "sourcePage": 189,
        "rows": [
          {
            "roll": "1−",
            "primary": "ABS-3T Anubis (3/4) | BLD-XL Blade (3/4) | Locust IIC 3 (3/4)",
            "support": "×2 Condor (Ultra) Veteran | ×2 J. Edgar (Light PPC) Veteran | Maxim (BA Factory) Veteran | ×2 Marten Veteran | ×2 IS Standard BA Veteran | ×2 Jump Infantry Veteran | Long Tom | Sniper | ×4 Light Air Cover",
            "alternate": "STL-2D Stealth (3/4) | MON-96 Mongoose (3/4) | CLN-7V Chameleon (3/4) | SDR-9KC Venom (3/4)"
          },
          {
            "roll": "2",
            "primary": "",
            "support": "",
            "alternate": "",
            "note": "ROLL ×1 Scale 2 | ROLL ×1 Scale 1"
          },
          {
            "roll": "3",
            "primary": "BHKU-OC Black Hawk-KU (4/5) | HCT-7S Hatchetman (4/5) | JVN-12N Javelin (4/5) | SNT-04 Sentry (4/5)",
            "support": "×4 Condor (Ultra) | ×4 Vedette (Armor) | ×2 Sniper | Heavy Airstrike | Light Bombing | ×2 Heavy Air Cover",
            "alternate": "WVR-9R Wolverine (4/5) | Kit Fox (Uller) R (4/5) | TFT-L8 Thunder Fox (4/5) | OTL-8E Ostsol (4/5) | SNT-04 Sentry (4/5)"
          },
          {
            "roll": "4",
            "primary": "HEL-4A Helios | HUR-WO-R4O Huron Warrior | PNT-13K Panther",
            "support": "×3 Manticore (XL) | Manticore (HPPC) | ×2 Patton (Ultra) | ×2 Striker | Maxim (Factory BA) | Marten | ×2 IS Standard BA | Jump Infantry | Heavy Bombing | ×2 Light Airstrike | ×2 Heavy Air Cover",
            "alternate": "CN10-D Centurion | CPLT-C2 Catapult | ON2-M Orion | MLN-1D Merlin"
          },
          {
            "roll": "5",
            "primary": "AS8-KE Atlas (4/5) | CES-5R Caesar (4/5)",
            "support": "×2 Behemoth (Davion) | ×2 LRM Carrier | ×2 Scimitar Mk II | ×3 Motorized Infantry | Sniper | ×2 Heavy Airstrike | Heavy Air Cover | Light Air Cover",
            "alternate": "PTR-4D Penetrator (4/5) | BLK-NT-5H Black Knight (4/5) | CMA-2K Chimera (4/5)"
          },
          {
            "roll": "6+",
            "primary": "RJN-301-F Fujin (3/4) | Stormcrow (Ryoken) Prime (3/4)",
            "support": "Ontos (Light Gauss) Veteran | ×2 Patton (Ultra) Veteran | ×3 Motorized Infantry Veteran | ×3 Light Emplacement Veteran | ×2 Medium Emplacement Veteran | ×2 Heavy Bombing | ×3 Heavy Air Cover",
            "alternate": "FLS-10E Flashman | SCP-2N Scorpion (3/4)"
          }
        ]
      }
    }
  },
  "capellan": {
    "label": "Capellan Confederation",
    "scales": {
      "1": {
        "sourcePage": 190,
        "rows": [
          {
            "roll": "1−",
            "primary": "DOL-1A1 Dola (3/4) | WSP-8T Wasp (3/4)",
            "support": "Hawk Moth II Veteran | Hover APC | IS Standard BA Veteran | Light Airstrike | Light Air Cover",
            "alternate": "STG-6G Stinger (3/4) | MEB-13 Ebony (3/4))"
          },
          {
            "roll": "2",
            "primary": "FLE-21 Flea (4/5) | LCT-7V2 Locust (4/5)",
            "support": "×2 Pegasus (Upgrade) | Hover APC | IS Standard BA | ×2 Light Bombing",
            "alternate": "DOL-1A1 Dola (4/5) | MEB-9 Ebony (4/5)"
          },
          {
            "roll": "3",
            "primary": "D9-G10 Duan Gung (4/5)",
            "support": "GAL-106 Galleon | Jump Infantry | Jump Infantry | Heavy Airstrike | Light Air Cover",
            "alternate": "FLE-21 Flea (4/5) | LCT-7V Locust (4/5)"
          },
          {
            "roll": "4",
            "primary": "YHC-3E Yinghuochong (4/5)",
            "support": "Bulldog (Plasma) | ×2 Hetzer (Cell) | Heavy Bombing | ×2 Light Bombing | ×2 Light Air Cover",
            "alternate": "CTF-5L Cataphract (4/5)"
          },
          {
            "roll": "5",
            "primary": "RFL-7G Rifleman (4/5)",
            "support": "×2 Schrek (XL) | Light Bombing | Heavy Bombing | Light Air Cover",
            "alternate": "STG-6G Stinger (4/5) | SNK-2Br Snake (4/5)"
          },
          {
            "roll": "6+",
            "primary": "VND-4L Vindicator (3/4)",
            "support": "Manticore (XL) Veteran | Light Emplacement Veteran | Heavy Emplacement Veteran | Strafing | Light Air Cover",
            "alternate": "RD-1R Roadrunner (3/4) | STG-5T Stinger (3/4)"
          }
        ]
      },
      "2": {
        "sourcePage": 191,
        "rows": [
          {
            "roll": "1−",
            "primary": "ASN-109 Assassin (3/4) | TR5 Wraith (3/4)",
            "support": "×2 Hawk Moth II Veteran | Maxim (BA Factory) Veteran | ×2 IS Standard BA Veteran | Heavy Airstrike | ×2 Light Airstrike | Heavy Air Cover | Light Air Cover",
            "alternate": "PXH-5L Phoenix Hawk (3/4) | MEB-10 Ebony (3/4)"
          },
          {
            "roll": "2",
            "primary": "",
            "support": "",
            "alternate": "",
            "note": "ROLL ×2 Scale 1"
          },
          {
            "roll": "3",
            "primary": "MS1-OD Men Shen (4/5) | QKD-9M Quickdraw (4/5)",
            "support": "×2 Hetzer (Cell) | ×2 Vedette (Cell) | ×2 Bulldog (ERLL) | Heavy Airstrike | Heavy Bombing | Sniper",
            "alternate": "GRF-5L Griffin (4/5) | WSP-8T Wasp (4/5) | SHD-8L Shadow Hawk (4/5)"
          },
          {
            "roll": "4",
            "primary": "BNDR-01Ar Bandersnatch (4/5) | KW2-LH10 Lineholder (4/5)",
            "support": "×2 Bulldog (ERLL) | ×2 Hawk Moth II | ×2 Vedette (Armor) | ×2 Heavy Airstrike | Light Bombing | ×3 Light Air Cover",
            "alternate": "GN-2O Gùn (4/5) | CRD-7L Crusader (4/5) | DOL-1A2 Dola (4/5)"
          },
          {
            "roll": "5",
            "primary": "SHY-3B Shen Yi (4/5) | VND-7L Vindicator (4/5)",
            "support": "×2 Bulldog (Plasma) | Demolisher (Cell) | ×2 LRM Carrier | Heavy Bombing | ×2 Light Airstrike | Heavy Air Cover | ×2 Light Air Cover",
            "alternate": "AV1-OR Avatar (4/5) | CTF-5L Cataphract (4/5)"
          },
          {
            "roll": "6+",
            "primary": "TNZ-N1 Tian Zong (3/4)",
            "support": "×2 Demolisher (Gauss) Veteran | ×2 Manticore (HPPC) Veteran | Long Tom | ×2 Heavy Air Strike | Light Air Cover",
            "alternate": "FLE-21 Flea (3/4) | Y-H12GC Yu Huang (3/4)"
          }
        ]
      },
      "3": {
        "sourcePage": 192,
        "rows": [
          {
            "roll": "1−",
            "primary": "DOL-1A1 Dola (3/4) | MEB-11 Ebony (3/4) | TR5 Wraith (3/4)",
            "support": "×2 Hawk Moth II Veteran | ×2 Pegasus (Upgrade) Veteran | Maxim (BA Factory) | ×2 IS Standard BA Veteran | ×3 Thumper | ×2 Heavy Airstrike | ×2 Heavy Air Cover | Light Air Cover",
            "alternate": "ASN-109 Assassin (3/4) | BLD-XS Blade (3/4) | YOL-4C Yao Lien (3/4) | LCT-7V Locust (3/4)"
          },
          {
            "roll": "2",
            "primary": "",
            "support": "",
            "alternate": "",
            "note": "ROLL ×1 Scale 2 | ROLL ×1 Scale 1"
          },
          {
            "roll": "3",
            "primary": "LI-O Vandal (4/5) | SCP-1BR Scorpion (4/5) | YHC-3E Yinghuochong (4/5)",
            "support": "×2 Hetzer (Cell) | ×2 Vedette (Armor) | ×2 Maxim (BA Factory) | ×2 IS Standard BA | ×2 Jump Infantry | ×3 Sniper | Heavy Air Strike | Heavy Air Cover",
            "alternate": "HUR-WO-R4N Huron Warrior (4/5) | WVR-7H Wolverine II (4/5) | PXH-5L Phoenix Hawk (4/5) | SYU-6B Sha Yu (4/5)"
          },
          {
            "roll": "4",
            "primary": "CRD-8L Crusader (4/5) | TSG-10L Ti Ts'ang (4/5) | VND-7L Vindicator (4/5)",
            "support": "Demolisher (Gauss) | ×2 Hawk Moth II | ×2 LRM Carrier | ×2 Manticore (HPPC) | ×3 Motorized Infantry | ×3 Light Air Strike | Heavy Air Cover | ×2 Light Air Cover",
            "alternate": "ARC-7L Archer (4/5) | WHM-4L Warhammer (4/5) | MS-1A Mortis (4/5)"
          },
          {
            "roll": "5",
            "primary": "CPLT-C5A Catapult (4/5) | PLG-4Z Pillager (4/5)",
            "support": "Demolisher (Cell) | ×2 Schrek (XL) | ×2 Motorized Infantry | ×2 Heavy Airstrike | Heavy Bombing | ×2 Light Air Cover",
            "alternate": "MAD-4L Marauder II (4/5) | LHN-C5 Lightning (4/5)"
          },
          {
            "roll": "6",
            "primary": "EMP-8L Emperor (3/4) | LN-4B Lu Wei Bing (3/4)",
            "support": "Demolisher (Cell) Veteran | ×2 Manticore (HPPC) Veteran | ×2 Light Emplacement Veteran | ×2 Medium Emplacement Veteran | ×2 Strafing | ×2 Heavy Air Cover | ×2 Light Air Cover",
            "alternate": "THR-C4 Thunder (3/4) | HUR-WO-R4N Huron Warrior (3/4)"
          }
        ]
      }
    }
  },
  "draconis-combine": {
    "label": "Draconis Combine",
    "scales": {
      "1": {
        "sourcePage": 193,
        "rows": [
          {
            "roll": "1−",
            "primary": "RJN301-F Fujin (3/4)",
            "support": "×2 Hawk Moth II Veteran | Light Bombing",
            "alternate": "NX-80C Nyx (3/4)"
          },
          {
            "roll": "2",
            "primary": "HM-1r Hitman (4/5) | SDR-9K Venom",
            "support": "×2 J. Edgar (Light PPC) | ×2 APC, Hover | ×2 Foot Infantry | ×2 Light Air Cover",
            "alternate": "KBO-7A Kabuto (4/5) | JR7-N Jenner (4/5)"
          },
          {
            "roll": "3",
            "primary": "STG-3P Stinger (4/5) | WFT-2 Wolf Trap (Tora) (4/5)",
            "support": "×2 Bulldog (ERLL) | ×2 Vedette (Ultra) | Light Bombing",
            "alternate": "HM-1 Hitman (4/5) | RTX1-OG Raptor (4/5)"
          },
          {
            "roll": "4",
            "primary": "AVL-1O Avalanche (4/5)",
            "support": "×2 Manticore (XL) | NK-1C Narukami | Heavy Air Strike | Light Air Cover",
            "alternate": "NX-80 Nyx (4/5) | Arbalest (4/5)"
          },
          {
            "roll": "5",
            "primary": "SHD-3K Shadow Hawk (4/5)",
            "support": "Tokugawa (MRM) Veteran | Saracen Mk II Veteran | Light Air Strike | ×2 Light Air Cover | Behemoth (Kurita Upgrade) Veteran",
            "alternate": "CMA-1S Chimera (4/5) | SDR-7KC Spider (4/5)"
          },
          {
            "roll": "6+",
            "primary": "GHR-6K Grasshopper (3/4)",
            "support": "Light Air Strike | Heavy Air Cover | Light Air Cover",
            "alternate": "MON-96 Mongoose (3/4)"
          }
        ]
      },
      "2": {
        "sourcePage": 194,
        "rows": [
          {
            "roll": "1−",
            "primary": "RWN-02 Cricket (3/4) | SHD-3K Shadow Hawk (3/4)",
            "support": "×2 Saracen Mk II Veteran | Maxim (BA Factory) | ×2 IS Standard BA Veteran | IS Standard BA Veteran | ×2 Light Bombing | ×2 Light Air Cover | Heavy Air Cover",
            "alternate": "LNX-9C Lynx (3/4) | WVR-8K Wolverine (3/4) | VLT-3E Valiant (3/4)"
          },
          {
            "roll": "2",
            "primary": "",
            "support": "",
            "alternate": "",
            "note": "ROLL ×2 Scale 1"
          },
          {
            "roll": "3",
            "primary": "DRG-10K Grand Dragon (4/5) | WFT-2 Wolf Trap (Tora) (4/5)",
            "support": "×2 Drillson (MML) | ×2 Vedette (Cell) | Maxim (BA Factory) | ×2 IS Standard BA | ×3 Heavy Air Strike | ×3 Heavy Air Cover | Light Air Cover",
            "alternate": "AVL-1O Avalanche (4/5) | JR7-N Jenner (4/5) | GRF-5K Griffin (4/5)"
          },
          {
            "roll": "4",
            "primary": "HCT-7R Hatchetman (4/5) | MAD-9W2 Marauder (4/5)",
            "support": "×2 Tokugawa (MRM) | ×2 Bulldog (ERLL) | Strafing | ×2 Heavy Air Strike | ×2 Light Air Cover",
            "alternate": "ARC-9K Archer (4/5) | SH-1V Shiro (4/5)"
          },
          {
            "roll": "5",
            "primary": "AV1-OR Avatar (4/5) | PKP-1B Peacekeeper (4/5)",
            "support": "×2 LRM Carrier | Manticore (HPPC) | Heavy Air Strike | Heavy Air Cover | Light Air Cover | Behemoth (Kurita Upgrade) Veteran",
            "alternate": "NX-90 Nyx (4/5) | WVR-8K Wolverine (4/5)"
          },
          {
            "roll": "6+",
            "primary": "GUN-3ERD Gunslinger (3/4)",
            "support": "Manticore (XL) Veteran | ×2 Light Emplacement Veteran | ×2 Medium | Emplacement Veteran | Strafing | ×3 Light Air Cover",
            "alternate": "SDR-10K Spider (3/4) | HKZ-1P Hitotsume Kozo (3/4)"
          }
        ]
      },
      "3": {
        "sourcePage": 195,
        "rows": [
          {
            "roll": "1−",
            "primary": "PXH-7K Phoenix Hawk (3/4) | MON-96 Mongoose (3/4) | SCP-12K Scorpion (3/4)",
            "support": "×2 Drillson (MML) Veteran | ×2 J. Edgar (X-Pulse) Veteran | ×2 Pegasus (Upgrade) Veteran | ×2 APC, Hover | ×2 IS Battle Armor Veteran | ×2 Sniper | Heavy Bombing | ×2 Light Bombing | ×2 Light Air Cover",
            "alternate": "BSN-3K Bishamon (3/4) | EXR-3P Exhumer (3/4) | PXH-11K Phoenix Hawk L (3/4)"
          },
          {
            "roll": "2",
            "primary": "",
            "support": "",
            "alternate": "",
            "note": "ROLL ×1 Scale 2 | ROLL ×1 Scale 1"
          },
          {
            "roll": "3",
            "primary": "Arbalest 3 (4/5) | GRF-5K Griffin (4/5) | LNC25-09 Lancelot (4/5) | NDA-2KC No-Dachi (4/5)",
            "support": "×2 Pegasus (Upgrade) | ×2 Vedette (Armor) | Strafing | ×2 Heavy Bombing | ×3 Light Air Strike | ×2 Heavy Air Cover | ×2 Light Air Cover",
            "alternate": "BHKU-OC Black Hawk-KU (4/5) | PXH-7K Phoenix Hawk (4/5) | KIM-2C Komodo (4/5) | LNC25-09 Lancelot (4/5)"
          },
          {
            "roll": "4",
            "primary": "ARC-9K Archer (4/5) | GHR-8K Grasshopper (4/5) | PNT-13K Panther (4/5) | Shadow Cat III Prime (4/5)",
            "support": "Manticore (XL) | NK-1C Narukami | ×2 Tokugawa (MRM) | ×2 Heavy Air Strike | ×2 Light Air Strike | Heavy Air Cover | Light Air Cover",
            "alternate": "Sphinx 4 (4/5) | DRG-12K Grand Dragon (4/5)"
          },
          {
            "roll": "5",
            "primary": "HTM-30S Hatamoto-Suna (4/5) | MTR-7K Maelstrom (4/5)",
            "support": "×2 Bulldog (ERLL) | ×2 Drillson (MML) | ×2 Schrek (XL) | ×2 Maxim (BA Factory) | ×4 IS Standard BA",
            "alternate": "DRG-12K Grand Dragon (4/5) | WVR-8K Wolverine (4/5)"
          },
          {
            "roll": "6+",
            "primary": "MAD-9W2 Marauder (3/4) | SH-1V Shiro (3/4)",
            "support": "×2 NK-1C Narukami Veteran | ×2 Tokugawa (MRM) Veteran | Tokugawa (MRM) Veteran | ×2 IS Standard BA | Heavy Bombing | ×3 Light Airstrike | ×2 Light Air Cover",
            "alternate": "GUN-1ERD Gunslinger (3/4) | LNX-9Q Lynx (3/4)"
          }
        ]
      }
    }
  },
  "federated-suns": {
    "label": "Federated Suns",
    "scales": {
      "1": {
        "sourcePage": 196,
        "rows": [
          {
            "roll": "1−",
            "primary": "RSN-2 Rattlesnake II (3/4)",
            "support": "H-8 Warrior Veteran | Pegasus (Upgrade) Veteran | ×2 Light Airstrike | ×2 Light Air Cover",
            "alternate": "OSR-3D Osiris (3/4)"
          },
          {
            "roll": "2",
            "primary": "ALM-10D Fireball (4/5) | JVN-12N Javelin (4/5)",
            "support": "×2 Fox Armored Car | Marten | IS Standard BA | Light Bombing | Light Airstrike",
            "alternate": "PY-SR10 Preyseeker (4/5) | OSR-3D Osiris (4/5)"
          },
          {
            "roll": "3",
            "primary": "BZK-D1 Hollander III (4/5) | GRM-01A2 Garm (4/5)",
            "support": "×2 Striker | Heavy Airstrike | Light Bombing",
            "alternate": "CDR-1X Cuirass (4/5)"
          },
          {
            "roll": "4",
            "primary": "ENF-5R Enforcer (4/5) | SHD-6D Shadow Hawk (4/5)",
            "support": "Striker | Light Bombing | Heavy Air Cover",
            "alternate": "GRM-01B Garm (4/5)"
          },
          {
            "roll": "5",
            "primary": "WVR-10V2 Wolverine (4/5)",
            "support": "Patton (XL) | Vedette (Armor) | Heavy Air Strike | Light Airstrike | ×2 Light Air Cover",
            "alternate": "VLK-QDD Valkyrie (4/5) | WTH-3 Whitworth (4/5)"
          },
          {
            "roll": "6+",
            "primary": "HCT-7D Hatchetman (3/4)",
            "support": "Patton (XL) Veteran | Alacorn Mk. VII Veteran | Heavy Airstrike | Heavy Air Cover",
            "alternate": "LGB-14C2 Longbow (3/4)"
          }
        ]
      },
      "2": {
        "sourcePage": 197,
        "rows": [
          {
            "roll": "1−",
            "primary": "LGN-2D Legionnaire (3/4) | OSR-4D Osiris (3/4)",
            "support": "×2 Condor (Ultra) Veteran | Maxim (BA Factory) | ×2 IS Standard BA Veteran | ×4 Light Airstrike | ×2 Light Air Cover",
            "alternate": "CDR-2X Cuirass (3/4) | UCU-F4r Scarecrow (3/4)"
          },
          {
            "roll": "2",
            "primary": "",
            "support": "",
            "alternate": "",
            "note": "ROLL ×2 Scale 1"
          },
          {
            "roll": "3",
            "primary": "AGS-2D Argus (4/5) | ENF-6M Enforcer (4/5) | SNT-04 Sentry (4/5)",
            "support": "×2 Pandion WiGE | Maxim (BA Factory) | ×2 Jump Infantry | Heavy Bombing | ×3 Light Airstrike",
            "alternate": "RSN-2 Rattlesnake II (4/5) | HSN-10SR Hellspawn (4/5)"
          },
          {
            "roll": "4",
            "primary": "DV-11DK Dervish (4/5) | MAD-9D Marauder (4/5)",
            "support": "Condor (Laser) | Condor (Laser) | Vedette (Armor) | Vedette (Armor) | Strafing | Heavy Airstrike | Light Airstrike | ×3 Light Air Cover",
            "alternate": "BJ2-O Blackjack (4/5) | CN11-0D Centurion (4/5) | JVN-11B Javelin (4/5)"
          },
          {
            "roll": "5",
            "primary": "HMH-6E Hammerhands (4/5) | TNS-4T Thanatos (4/5)",
            "support": "×2 Patton (XL) | ×2 Tracked APC | ×2 Jump Infantry | Heavy Bombing | Heavy Airstrike | Heavy Air Cover | Light Air Cover",
            "alternate": "HSN-10SR Hellspawn (4/5) | CRD-7D Crusader (4/5)"
          },
          {
            "roll": "6+",
            "primary": "BLK-NT-4D Black Knight (3/4)",
            "support": "Pilum (Arrow IV) Veteran | IS Standard BA Veteran | ×2 Medium | Emplacement Veteran | ×2 Heavy Airstrike",
            "alternate": "UM-90 SuburbanMech (3/4) | DVS-10 Devastator (3/4)"
          }
        ]
      },
      "3": {
        "sourcePage": 198,
        "rows": [
          {
            "roll": "1−",
            "primary": "FEC-3C Fennec (3/4) | LGN-2XU Legionnaire (3/4) | OSR-4D Osiris (3/4)",
            "support": "×2 Condor (Ultra) Veteran | ×2 Fox Veteran | ×2 Pandion WiGE Veteran | ×2 IS Standard BA Veteran | ×2 Sniper | Heavy Bombing | ×3 Light Airstrike | ×2 Light Air Cover",
            "alternate": "CH11-NG Gunsmith (3/4) | RSN-1 Rattlesnake II (3/4) | PY-SR10 Prey Seeker (3/4)"
          },
          {
            "roll": "2",
            "primary": "",
            "support": "",
            "alternate": "",
            "note": "ROLL ×1 Scale 2 | ROLL ×1 Scale 1"
          },
          {
            "roll": "3",
            "primary": "ALM-10D Fireball (4/5) | CH11-NG Gunsmith (4/5) | CLN-7W Chameleon (4/5) | OTT-8J Ostscout (4/5)",
            "support": "×2 Drillson (Streak) | ×2 Fox | ×2 J. Edgar (X-Pulse) | ×2 Maxim (BA Factory) | ×2 Jump Infantry | ×2 IS Standard BA | ×2 Heavy Bombing | Light Bombing | ×2 Heavy Air Cover | ×2 Light Air Cover",
            "alternate": "UCU-F4r Scarecrow (4/5) | RSN-2 Rattlesnake II (4/5) | LGN-2F Legionnaire (4/5) | GSN-10G Hellspawn (4/5)"
          },
          {
            "roll": "4",
            "primary": "AGS-8DX Argus (4/5) | CN11-OA Centurion (4/5) | SHD-6D Shadow Hawk (4/5)",
            "support": "×2 Manticore (HPPC) | ×2 Patton (XL) | ×2 Striker (Stealth) | Maxim (BA Factory) | ×2 IS Standard BA | Pilum (Arrow IV) | ×2 Heavy Bombing | ×3 Light Air Cover",
            "alternate": "FLC-8R Falconer (4/5) | BHKU-OR Black Hawk-KU (4/5) | OTL-8E3 Ostsol (4/5)"
          },
          {
            "roll": "5",
            "primary": "AV1-O Avatar (4/5) | CES-4R Caesar (4/5) | VTR-12D Victor (4/5)",
            "support": "Hawk Moth II | ×2 Manticore (XL) | ×2 Patton (XL) | ×3 Motorized Infantry | Heavy Airstrike | Sniper | ×3 Light Airstrike | ×3 Light Air Cover",
            "alternate": "TLR2-O Templar III (4/5) | INF-NOB Inferno (4/5) | ENF-7D Enforcer III (4/5)"
          },
          {
            "roll": "6+",
            "primary": "DVS-11 Devastator (3/4) | MAD-9D Marauder (3/4)",
            "support": "Alacorn Mk. VII Veteran | Pegasus (Upgrade) Veteran | Medium Emplacement Veteran | Heavy Emplacement Veteran | ×2 Sniper | ×2 Heavy Air Strike | Light Bombing | Light Air Cover",
            "alternate": "MAD-10D Marauder II (3/4)"
          }
        ]
      }
    }
  },
  "raven-alliance": {
    "label": "Raven Alliance",
    "scales": {
      "1": {
        "sourcePage": 199,
        "rows": [
          {
            "roll": "1−",
            "primary": "Baboon (Howler) (3/4)",
            "support": "×2 Enyo Veteran | ×2 Light Airstrike | Heavy Air Cover | Light Air Cover",
            "alternate": "CVR-A1 Cadaver (3/4) | NTK-2Q Night Hawk (3/4)"
          },
          {
            "roll": "2",
            "primary": "NTK-2Q Night Hawk (4/5) | WSP-3A Wasp (4/5)",
            "support": "×2 GAL-100 Galleon | Maxim | ×2 Jump Infantry | Light Bombing | Light Airstrike | ×2 Light Air Cover",
            "alternate": "LCT-1V Locust (4/5) | MON-66b Mongoose (4/5) | Stinger IIC (4/5)"
          },
          {
            "roll": "3",
            "primary": "GRF-1N Griffin (4/5) | MCY-99 Mercury (4/5)",
            "support": "×2 Vedette | Tracked APC | Foot Infantry | Heavy Airstrike | Light Airstrike | Light Air Cover",
            "alternate": "LCT-1V Locust (4/5) | MON-66b Mongoose (4/5) | NTK-2Q Night Hawk (4/5) | Stinger IIC (4/5) | WSP-3A Wasp (4/5)"
          },
          {
            "roll": "4",
            "primary": "MLN-1D Merlin (4/5)",
            "support": "LRM Carrier | ×2 Manticore | Sniper | Light Airstrike | Heavy Air Cover",
            "alternate": "CVR-T1 Cadaver (4/5) | WSP-3A Wasp (4/5)"
          },
          {
            "roll": "5",
            "primary": "BMB-12D Bombardier (4/5)",
            "support": "×2 Bulldog | LRM Carrier | Heavy Bombing | ×2 Heavy Air Cover | Light Air Cover",
            "alternate": "Peregrine (Horned Owl) (4/5) | MLN-1D Merlin (4/5)"
          },
          {
            "roll": "6+",
            "primary": "Dark Crow 4 (3/4)",
            "support": "×2 Manticore Veteran | ×2 Light Airstrike | Light Air Cover",
            "alternate": "Stinger IIC (3/4) | STG-3R Stinger (3/4)"
          }
        ]
      },
      "2": {
        "sourcePage": 200,
        "rows": [
          {
            "roll": "1−",
            "primary": "Devil (3/4) | Baboon (Howler) (3/4)",
            "support": "×2 Condor Veteran | ×2 Maxim (BA Factory) | ×2 Elemental BA Veteran | ×2 Jump Infantry Veteran | Light Bombing | ×2 Light Airstrike",
            "alternate": "MCY-99 Mercury (3/4) | Clint IIC (3/4) | CVR-A1 Cadaver (3/4)"
          },
          {
            "roll": "2",
            "primary": "",
            "support": "",
            "alternate": "",
            "note": "ROLL ×2 Scale 1"
          },
          {
            "roll": "3",
            "primary": "Clint IIC (4/5) | GRF-1N Griffin (4/5) | OSR-2Cb Ostroc (4/5)",
            "support": "×4 Vedette | ×2 Tracked APC | ×2 Foot Infantry",
            "alternate": "Conjurer (Hellhound) (4/5) | MON-66b Mongoose (4/5)"
          },
          {
            "roll": "4",
            "primary": "CRD-2R Crusader (4/5) | CVR-T1 Cadaver (4/5) | MLN -1D Merlin (4/5)",
            "support": "×2 Manticore | ×2 Rommel | Strafing | Heavy Airstrike | Heavy Air Cover | Light Air Cover",
            "alternate": "CGR-2A2 Charger (4/5) | Dark Crow 3 (4/5)"
          },
          {
            "roll": "5",
            "primary": "Vapor Eagle (Goshawk) (4/5) | WHM-6Rb Warhammer (4/5)",
            "support": "×2 Hunter | ×2 Rommel | ×2 Motorized Infantry | Heavy Bombing | ×2 Light Airstrike | ×2 Light Air Cover",
            "alternate": "BMB-12D Bombardier (4/5) | MLN-1C Merlin (4/5) | LCT-1V Locust (4/5)"
          },
          {
            "roll": "6+",
            "primary": "Dark Crow (3/4) | MLN-1D Merlin (3/4)",
            "support": "LRM Carrier C Veteran | ×2 Motorized Infantry Veteran | Foot Infantry Veteran | ×2 Light Emplacement Veteran | Medium Emplacement Veteran | Light Bombing | ×3 Light Airstrike",
            "alternate": "Howler (Baboon) (3/4) | Devil (3/4)"
          }
        ]
      },
      "3": {
        "sourcePage": 201,
        "rows": [
          {
            "roll": "1−",
            "primary": "Clint IIC 2 (3/4) | Goshawk II (3/4)",
            "support": "×3 Enyo Veteran | Maxim (BA Factory) | ×2 Elemental Point Veteran | Heavy Bombing | ×3 Light Bombing | Heavy Air Cover | ×2 Light Air Cover",
            "alternate": "Stinger IIC (3/4) | CVR-T1 Cadaver (3/4) | Dark Crow (3/4) | MCY-99 Mercury (3/4)"
          },
          {
            "roll": "2",
            "primary": "",
            "support": "",
            "alternate": "",
            "note": "ROLL ×1 Scale 2 | ROLL ×1 Scale 1"
          },
          {
            "roll": "3",
            "primary": "Vapor Eagle (Goshawk) 2 (4/5) | Shadow Hawk IIC 7 (4/5) | Stinger IIC (4/5)",
            "support": "×2 Condor | ×2 Hunter | ×4 Vedette | Maxim (BA Factory) | ×2 IS Standard BA | Long Tom | ×2 Sniper | Light Bombing | ×2 Heavy Air Cover",
            "alternate": "Charger C (4/5) | Dark Crow 3 (4/5) | GRF-1N Griffin (4/5)"
          },
          {
            "roll": "4",
            "primary": "Merlin C (4/5) | NTK-2Q Night Hawk (4/5) | Rifleman IIC 9 (4/5)",
            "support": "×2 Hunter | ×2 Rommel | ×2 Vedette | ×4 Motorized Infantry | Long Tom | Heavy Bombing | Light Bombing | Heavy Air Cover | Light Air Cover",
            "alternate": "Glass Spider (Galahad) (4/5) | White Raven (4/5)"
          },
          {
            "roll": "5",
            "primary": "Deimos 2 (4/5) | Rifleman IIC 9 (4/5)",
            "support": "×2 LRM Carrier C | ×2 Rommel | ×2 SRM Carrier C | ×2 Motorized Infantry | Sniper | Heavy Airstrike | ×2 Heavy Air Cover | ×3 Light Air Cover",
            "alternate": "BLR-1Gb BattleMaster (4/5) | Dark Crow (4/5) | Merlin C (4/5)"
          },
          {
            "roll": "6+",
            "primary": "Charger C (3/4) | CRD-2R Crusader (3/4)",
            "support": "×2 LRM Carrier Veteran | ×2 Rommel Veteran | ×2 Heavy Emplacement Veteran | ×3 Light Emplacement Veteran | Heavy Airstrike | ×2 Light Airstrike | ×2 Heavy Air Cover | Light Air Cover",
            "alternate": "MLN-1D Merlin (3/4) | MCY-99 Mercury (3/4) | Devil (3/4)"
          }
        ]
      }
    }
  }
};

export const TRACK_NAMES = TRACKS.map(track => track.name);

// Brighter Hot Spots consumer adaptation of the semantic military identities
// from SANSd20/battletech-faction-colors. These are UI colors, not official
// BattleTech paint specifications. Unsupported identities retain neutral/local
// treatment rather than borrowing a government/faction palette.
export const FACTION_COLORS = {
  "Federated Suns": "#7FA52F",
  "Draconis Combine": "#D94343",
  "Capellan Confederation": "#2E9D68",
  "Clan Sea Fox": "#2A9FBE",
  "Raven Alliance": "#2A9FBE",
  "Mercenary": "#B6783D",
  "Corporate": "#DE7C22",
  "Local": "#7B95A5",
  "Rebels": "#B05A9D"
};

const factionSide = (id, name, faction) => ({ id, name, faction, color: FACTION_COLORS[faction] || FACTION_COLORS.Local });
const fixedHotSpotTrack = (sequence, trackId, attacker, defender, extra = {}) => ({
  sequence,
  label: "Track " + sequence,
  trackId,
  attacker,
  defender,
  ...extra
});
const winnerDependentTrack = (sequence, requires, outcomes, extra = {}) => ({
  sequence,
  label: "Track " + sequence,
  requires,
  outcomes,
  ...extra
});

const achernarCommandComplications = {
  ref: "Draconis Reach pp. 76–77",
  note: "At the start of each track, resolve each force independently and select every resulting effect below. Tybalt adds no modifier; Home Guard adds 1.",
  rows: [
    { roll: "1", name: "Republic Spider", text: "An SDR-8R Spider (Gunnery 3, Piloting 4; Alpha Strike Skill 3) enters from a random map edge perpendicular to the Defender’s edge. The player who lost first-turn Initiative controls it initially. Each turn, if only one player damaged the Spider during the previous turn, control goes to the player who did not damage it; if both or neither damaged it, control goes to the player who lost Initiative. If both players roll this complication, the Spider improves to Gunnery 2, Piloting 3; Alpha Strike Skill 2." },
    { roll: "2–3", name: "No Complication", text: "No complication applies." },
    { roll: "4", name: "Uncleared Minefields", text: "The opposing player places six heavy-density Battlefield Support minefields just before units deploy." },
    { roll: "5", name: "Rubble", text: "Before either player deploys, the opposing player converts six hexes (three 2-inch AoE counters) into rubble terrain. Rubble may replace buildings or be placed on clear terrain." },
    { roll: "6", name: "Partisan Support", text: "The opposing side receives support for this track only; multiply the listed unit quantities by the track’s Scale. If Tybalt rolled the complication, Home Guard gains Capellan support. If Home Guard rolled it, Tybalt gains Davion-aligned resistance. Roll 1D6 for the force: 1–2, two Mechanized Infantry Platoons; 3–4, two Fox Armored Cars; 5–6, one Vedette Medium Tank." },
    { roll: "7+", name: "Roll Twice", text: "Roll twice and apply both effects. Ignore duplicate results." }
  ]
};

const achernarVictoryRules = [
  "Achernar contract victory — Tybalt: if at least one defector vehicle survives all tracks, Tybalt wins the contract. If all defector vehicles are destroyed, Tybalt can still claim victory by winning both the Strike and Retreat scenarios.",
  "Achernar contract victory — Home Guard: Home Guard automatically wins if Tybalt does not meet its victory qualifications. Home Guard is also victorious if it destroys five or more Battlefield Support units granted to Tybalt through the Command Complications table."
];

function achernarVariant(trackId, sequence) {
  const base = TRACKS.find(track => track.id === trackId);
  const pageRef = base?.pageRef || "p. " + base?.page;
  const setupDetails = sequence <= 2
    ? ["Defector vehicles do not join Tybalt during Tracks 1–2."]
    : sequence === 3
      ? ["Defector force: Tybalt receives two J. Edgar Hover Tanks per Scale in every Track 3 branch, regardless of Tybalt’s tactical role. The crews use Gunnery 4 / Piloting 5 in BattleTech and Skill 4 in Alpha Strike. These same vehicles continue into every later track; reduce their number when one is destroyed."]
      : ["Defector carryover: Tybalt receives only the J. Edgar Hover Tanks that survived the previous track. Do not restore destroyed vehicles or grant a fresh complement. Select the number entering the current track below."];
  return {
    setupDetails,
    scaleNotesByScale: sequence === 3 ? {
      "1": ["Track 3 defector force: two J. Edgar Hover Tanks join Tybalt."],
      "2": ["Track 3 defector force: four J. Edgar Hover Tanks join Tybalt."],
      "3": ["Track 3 defector force: six J. Edgar Hover Tanks join Tybalt."]
    } : undefined,
    special: [...(base?.special || []), ...achernarVictoryRules],
    commandComplications: achernarCommandComplications,
    sourceRefs: [
      "Draconis Reach pp. 74–77",
      base?.name + " " + pageRef,
      "Shared rules pp. 167–168"
    ]
  };
}

function daharVariant(trackId) {
  const base = TRACKS.find(track => track.id === trackId);
  const pageRef = base?.pageRef || "p. " + base?.page;
  return {
    setupDetails: [
      ...(base?.setupDetails || []),
      "Dahar mapsheets: roll separately on the Dahar 1D6 mapsheet table for every required BattleTech mapsheet. Scale 1 normally uses one mapsheet; Scale 2–3 normally uses two mapsheets or one equivalent neoprene map. A more specific standard-track battlefield dimension, including Retreat, takes precedence over this general count. Do not reroll duplicate mapsheet results.",
      "Alpha Strike: use Desert as the primary terrain and the shared terrain procedure on p. 154. Dahar battlefields do not carry over between tracks.",
      "Repurposed Equipment: for each mission, both Attacker and Defender may add one independently rolled IndustrialMech MOD per Scale (one at Scale 1, two at Scale 2, three at Scale 3). These units use Gunnery 4 / Piloting 5 or Alpha Strike Skill 4, do not count toward normal Scale limits, follow the standard track’s deployment, and are rerolled for every mission.",
      "Temporary Hire: Dahar’s contract-specific eligibility threshold controls. A force below two-thirds of the maximum permissible BV/PV for its next track may hire additional IndustrialMech MODs from the Dahar table. General p. 29 still requires the resulting force to remain below the Scale limit. Temporary hires are capped at three per Scale, separate from the free Repurposed Equipment allocation, use the listed regular skills, deploy with the track force, and do not carry forward automatically."
    ],
    special: [
      ...(base?.special || []),
      "Successful track completion: a side must complete at least one objective and earn more finalized, adjusted objective VP than the opponent. Equal VP means neither side successfully completes the track."
    ],
    commandComplications: DAHAR_COMMAND_COMPLICATIONS,
    referenceTables: [
      { title: "Dahar Mapsheets (1D6)", headers: ["Roll", "Mapsheet", "Source"], rows: DAHAR_MAPSHEET_TABLE },
      { title: "Dahar IndustrialMech Random Allocation (2D6)", headers: ["Roll", "IndustrialMech", "BV", "PV"], rows: DAHAR_INDUSTRIALMECH_TABLE }
    ],
    sourceRefs: [
      "Draconis Reach pp. 82–85 (contracts 105112A–B; Mission Brief prints conflicting 105070A–B)",
      base?.name + " " + pageRef,
      "Successful tracks pp. 26, 29",
      "Command Rights p. 28 and complications p. 30",
      "Shared rules pp. 167–168"
    ]
  };
}

const gladiatorGenerator = {
  note: "For a non-player opponent, roll 2D6 for Experience Rating, apply the duel-class adjustment, use the resulting Experience Level, then roll for Piloting/Gunnery skills, Edge abilities, faction, and ’Mech assignment.",
  classAdjustments: [
    ["Light (Class 2)", "−2 to Experience Rating"],
    ["Medium (Class 3)", "No adjustment"],
    ["Heavy (Class 4)", "+2 to Experience Rating"],
    ["Assault (Class 5)", "+4 to Experience Rating"],
    ["Open (Class 6)", "+6 to Experience Rating; use the Assault RAT for the ’Mech" ]
  ],
  experienceLevels: [
    ["0–5", "Regular"],
    ["6–8", "Veteran"],
    ["9–12", "Elite"],
    ["13–15", "Heroic"],
    ["16–18", "Legendary"]
  ],
  skillLevels: {
    headers: ["1D6", "Regular", "Veteran", "Elite", "Heroic", "Legendary"],
    rows: [
      ["1–2", "5/5", "4/4", "3/3", "2/2", "1/1"],
      ["3–4", "5/4", "4/3", "3/2", "2/1", "1/0"],
      ["5–6", "4/5", "3/4", "2/3", "1/2", "0/1"]
    ]
  },
  edgeCounts: {
    headers: ["1D6", "Regular", "Veteran", "Elite", "Heroic", "Legendary"],
    rows: [
      ["1", "0", "0", "0", "1", "1"],
      ["2", "0", "1", "1", "2", "2"],
      ["3–4", "1", "2", "2", "2", "3"],
      ["5–6", "2", "2", "3", "3", "4"]
    ]
  },
  factions: {
    headers: ["2D6", "Faction"],
    rows: [
      ["2–4", "Republic of the Sphere"],
      ["5–6", "Draconis Combine"],
      ["7–8", "Mercenary"],
      ["9–11", "Federated Suns"]
    ]
  },
  edgeAbilities: {
    headers: ["2D6", "Edge Ability"],
    rows: [
      ["2", "Assassin"],
      ["3", "Coolant Flush"],
      ["4", "Patient"],
      ["5", "Jumping Jack"],
      ["6", "Cautious"],
      ["7", "+1 Edge Token"],
      ["8", "Marksman"],
      ["9", "Speed Demon"],
      ["10", "Melee Specialist"],
      ["11", "Nimble"],
      ["12", "Bulwark"]
    ]
  }
};

const gameWorldDuelObjectives = [
  { id: "duel-orders", name: "Orders", side: BOTH, vp: 50, text: "Survive at least two turns of attacks: your own, your opponent’s, or a mix." },
  { id: "duel-victory", name: "Victory!", side: BOTH, vp: 100, text: "Destroy the opponent or cause them to surrender. Double the reward if the opponent is a larger weight class." },
  { id: "duel-nice-showing", name: "Nice showing", side: BOTH, vp: 50, text: "Cripple the opponent. Double the reward if the opponent is a larger weight class." },
  { id: "duel-shoot-them", name: "Shoot Them", side: BOTH, vp: 10, repeatable: true, text: "For each 20 damage dealt to the opponent (2 damage in Alpha Strike)." },
  { id: "duel-beat-them", name: "Beat Them", side: BOTH, vp: 10, repeatable: true, text: "For each successful physical attack, maximum once per turn." },
  { id: "duel-head-shot", name: "Head Shot", side: BOTH, vp: 10, repeatable: true, text: "For each shot that hits the opponent’s head, or 20 VP for each natural 12 critical on the opponent." },
  { id: "duel-crushing-blow", name: "Crushing Blow", side: BOTH, vp: 10, repeatable: true, text: "For dealing critical damage to the opponent. Award 20 VP in Alpha Strike." },
  { id: "duel-turning-it-around", name: "Turning It Around", side: BOTH, vp: 10, repeatable: true, text: "After losing Initiative for two or more turns, win Initiative. Award 10 VP each time." },
  { id: "duel-humiliating-shot", name: "Humiliating Shot", side: BOTH, vp: 10, repeatable: true, text: "Successfully attack the opponent in the rear, maximum once per turn." },
  { id: "duel-boom", name: "Boom!", side: BOTH, vp: 10, repeatable: true, text: "For each ammunition explosion dealt to the opponent. Award 20 VP in Alpha Strike." }
];

const gameWorldDuelSetup = [
  "Contract #: N/A. Employer: None. There is no contract for Game Worlds beyond the payment received for taking part.",
  "The track is always a duel: one ’Mech versus one ’Mech matched by weight class—light, medium, heavy, assault, or open to any weight class. Do not use normal Scale limits, BV/PV limits, or Battlefield Support for a standard duel.",
  "The Defender selects a short edge as their home edge; the Attacker gets the opposite short edge.",
  "Attacker: enter from the Attacker’s home edge during the Movement Phase of Turn 1. Attacking units may exit only via their home edge; exiting by any other edge for any reason counts as unit destruction.",
  "Defender: enter from the Defender’s home edge during the Movement Phase of Turn 1. Defending units may exit only via their home edge; exiting by any other edge for any reason counts as unit destruction."
];

const gameWorldDuelSetupDetails = [
  "Game Worlds intensity is one to three tracks. Multiple players may choose this Hot Spot, on the same game world or different game worlds; use the Taking One for the Team option when an opposing duelist is needed.",
  "The source schedules a single duel per month so contestants can repair, recover, and train between duels.",
  "Choose the duel class in the setup controls. Class One—exoskeleton—is not supported by the Gladiator Generator. Otherwise, the duel is treated as Scale 1 only for costs and payments.",
  "Open class permits any weight class and generally uses better pilots. The source recommends using the Assault-class Random Assignment Table when randomly generating an open-class ’Mech.",
  "Team Option: a duel may be fought between teams using standard Scale levels and BV/PV limits per team. If more than half of a team by BV/PV is destroyed or crippled, the duel ends in the End Phase."
];

const gameWorldDuelSpecial = [
  "Combat Pay: the VP value of each objective is also its combat pay at 1 VP = 1 SP. A first-turn head-shot victory awards 100 SP for Victory!, 50 SP for Nice showing, and 10 SP for Head Shot.",
  "Reputation: each point of reputation increases total combat pay by 10 percent, up to the maximum set by the selected game world.",
  "Victory is Victory: unlike general tracks, a player may earn more objectives and still lose the duel. The player who destroys or causes the opponent to surrender through Victory! successfully completes the track and wins.",
  "Track End: after the end of any turn when at least one side has no units in play, or after the end of Turn 12 (Turn 10 in Alpha Strike).",
  "Game World campaign victory: earning two duel victories within a three-month period earns victory in the contract and Reputation. A victorious player also earns additional combat pay equal to standard combat pay multiplied by the competition class: light ×2, medium ×3, heavy ×4, assault ×5, open ×6."
];

const gameWorldDuelBaseVariant = {
  page: 130,
  type: "Game World Duel",
  summary: "A one-’Mech-versus-one-’Mech duel using the Game Worlds mission brief from Draconis Reach.",
  setup: gameWorldDuelSetup,
  setupDetails: gameWorldDuelSetupDetails,
  objectives: gameWorldDuelObjectives,
  special: gameWorldDuelSpecial,
  sourceRefs: ["Draconis Reach pp. 128–131", "Purchase Options pp. 22, 69"]
};

const gameWorldClassOptions = [
  { value: "light", label: "Class 2 · Light" },
  { value: "medium", label: "Class 3 · Medium" },
  { value: "heavy", label: "Class 4 · Heavy" },
  { value: "assault", label: "Class 5 · Assault" },
  { value: "open", label: "Class 6 · Open" }
];

const gameWorldSelection = (options, note) => ({
  id: "duel-class",
  label: "Duel class",
  placeholder: "Choose the weight class",
  options,
  note
});

const gameWorldVariant = (name, summary, setup, setupDetails, special, selection, sourceRefs = gameWorldDuelBaseVariant.sourceRefs) => ({
  ...gameWorldDuelBaseVariant,
  displayName: "Game Worlds · " + name,
  summary,
  setup: [...gameWorldDuelSetup, ...setup],
  setupDetails: [...gameWorldDuelSetupDetails, ...setupDetails],
  special: [...gameWorldDuelSpecial, ...special],
  selectionControls: [selection],
  gladiatorGenerator,
  sourceRefs
});

const carcassonneGameWorldVariant = gameWorldVariant(
  "Carcassonne",
  "A fungal-field arena duel on Carcassonne, where the abandoned colony has become a specialized MechWarrior circuit.",
  ["Game world: Carcassonne. Maximum Reputation: 5."],
  ["Mapsheets: roll 1D6. Results 1–3 use Fungal Crevasse, Left Half; results 4–6 use Fungal Crevasse, Right Half. Use the Map Pack: Alien Worlds map or the Alpha Strike Fungal Crevasse map.", "No Class Six—Open—duels."],
  ["Fungal Crevasse: apply the special rules for Fungal Crevasse from Map Pack: Alien Worlds or its Alpha Strike equivalent.", "Purchase Options: once a month, roll 2D6; on a 5+ one ’Mech is for sale, and on an 11+ two are for sale. Use the Federated Suns Purchase Options Table."],
  gameWorldSelection(gameWorldClassOptions.filter(option => option.value !== "open"), "Carcassonne does not hold open-class duels.")
);

const xhosaGameWorldVariant = gameWorldVariant(
  "Xhosa VII",
  "An Easter Ice Fight on the frozen plains of Xhosa VII, where duelists must control their ’Mechs on treacherous ice.",
  ["Game world: Xhosa VII. Maximum Reputation: 10."],
  ["The Easter Ice Fights are held once a year for one week during the Easter event. A player may play only one duel during the event.", "Mapsheets: roll 1D6. Results 1–2 use Woodland; 3–4 use Scattered Woods; 5 uses Desert #3; 6 uses Badlands #1. Use the listed Alpha Strike equivalents where applicable."],
  ["Xhosa VII adds 50 percent to combat pay from the duel.", "Freezing Blizzard: in BattleTech, units dissipate an extra 4 heat each turn and each player’s attack ranges are doubled for range modifiers only. In Alpha Strike, units dissipate 1 heat from the Heat Scale each turn and attacks receive a +2 target number modifier from the doubled range used for range modifiers. Damage remains based on actual range.", "Purchase Options: once a month, roll 2D6; on a 5+ one ’Mech is for sale, and on an 11+ two are for sale. Use the Federated Suns Purchase Options Table."],
  gameWorldSelection(gameWorldClassOptions, "Xhosa VII permits all listed duel classes.")
);

const tybaltGameWorldVariant = gameWorldVariant(
  "Tybalt",
  "A grudge-match duel at the Tybalt Festival Grounds, where Roughrider-backed games turn old ruins into an arena.",
  ["Game world: Tybalt. Maximum Reputation: 3."],
  ["Mapsheets: roll 1D6. Results 1–3 use City Central Park; 4 uses City Observatory Hill; 5–6 use City Park District. Use the listed Alpha Strike Urban equivalents.", "No Class Five—Assault—duels. All buildings are ruins: collapsed, with CF 0."],
  ["Purchase Options: use the Tybalt Hiring Hall rules on p. 69. For each ’Mech offered for sale, roll on the Clan Sea Fox Purchase Options Tables on p. 176."],
  gameWorldSelection(gameWorldClassOptions.filter(option => option.value !== "assault"), "Tybalt does not hold Class Five—Assault—duels."),
  ["Draconis Reach pp. 128–131", "Tybalt Hiring Hall p. 69", "Clan Sea Fox Purchase Options Tables p. 176"]
);

const gameWorldDuelTrack = {
  id: "game-world-duel",
  name: "Game Worlds Duel",
  page: 130,
  summary: gameWorldDuelBaseVariant.summary,
  setup: gameWorldDuelSetup,
  setupDetails: gameWorldDuelSetupDetails,
  objectives: gameWorldDuelObjectives,
  special: gameWorldDuelSpecial,
  sourceRefs: gameWorldDuelBaseVariant.sourceRefs
};

const bioGenRaidTrack = {
  id: "bio-gen-raid",
  name: "Bio-Gen Raid",
  page: 91,
  pageRef: "pp. 91–92",
  summary: "Eclipse Expeditions attacks Bio-Gen’s evacuated research campus, destroys its buildings, and releases enhanced reptile swarms.",
  setup: [
    "The Defender (Bio-Gen) selects a short edge as its home edge; the Attacker (Eclipse Expeditions) receives the opposite short home edge.",
    "The Defender places six Medium Level 2 buildings within 4 hexes (Alpha Strike: 8 inches) of the battlefield center. Each building is immobile (−4 target number modifier) and requires 30 damage (Alpha Strike: 4 damage) to destroy. All civilians have been evacuated.",
    "Attacker: half of the force enters from its home edge at the start of the track. The remaining force enters from an edge perpendicular to its home edge during the Movement Phase of Turn 2.",
    "Defender: deploy the entire force before Initiative anywhere on the Defender’s half of the battlefield. At least 50 percent must be within 3 hexes (Alpha Strike: 6 inches) of the designated buildings."
  ],
  objectives: [
    { id: "damage-collateral", name: "Damage the Collateral", side: A, vp: 200, text: "Destroy all the buildings." },
    { id: "rough-up-place", name: "Rough Up the Place", side: BOTH, vp: 100, text: "Destroy/Cripple at least 50 percent of the opponent’s force." },
    { id: "seek-destroy", name: "Seek and Destroy", side: D, vp: 200, text: "Destroy/Cripple the Commander." }
  ],
  special: [
    "Enhanced reptile swarms: each destroyed building spawns one enhanced swarm. The source does not further define exact spawn placement or timing beyond that trigger.",
    "BattleTech enhanced swarm: one hex large and 2 levels high. At the end of the Movement Phase, it moves 3 hexes toward the nearest unit. A unit occupying its hex during the Weapon Attack Phase takes 2D6 damage in 2-point clusters unless an Anti-Infantry (AI) weapon hits that hex. Roll 1D6 for damage direction: 1–4 uses the Front Table; 5–6 uses the Rear Table.",
    "Alpha Strike enhanced swarm: 2-inch AOE and 2 inches high; it deals 1 damage with a physical attack. The source gives no separate Alpha Strike movement conversion.",
    "Enhanced swarms otherwise follow the ordinary Lucerne swarm rules: inherited prohibited-terrain and attack-modifier rules, immunity to damage, and AI-hit suppression apply except where the enhanced rules explicitly replace them.",
    "Enough Chaos: do not roll random Command Complications for Bio-Gen Raid. Building-spawned enhanced swarms still apply.",
    "Track End: after the end of any turn when at least one side has no units in play, or after the end of Turn 12 (Turn 10 in Alpha Strike).",
    "Salvage: apply the general salvage rules on p. 31. A player that successfully completes the track may claim battlefield salvage; if neither side succeeds, both sides reclaim their own destroyed or crippled units. No Strike or Objective Raid salvage exception applies."
  ],
  sourceRefs: ["Draconis Reach pp. 91–92", "General salvage p. 31", "Commander and shared rules p. 167"]
};

export const MELCHER_GRASSLANDS_MAPSHEETS = [
  ["1", "Grassland #1", "BB"],
  ["2", "Grassland #2", "AGOAC"],
  ["3", "Grassland #3", "AGOAC"],
  ["4", "Woodland", "Map Pack: Grasslands"],
  ["5", "Open Terrain #2", "Map Pack: Grasslands"],
  ["6", "Open Terrain #3", "Map Pack: Grasslands"]
];

export const MELCHER_BLACK_MARKET = [
  ["2", "CattleMaster (Hunter) CTL-3R2", "245", "7"],
  ["3", "CattleMaster SecurityMech CTL-3R3", "358", "12"],
  ["4", "Demeter WLD-1-M", "327", "8"],
  ["5", "Crosscut ED-X4M", "430", "11"],
  ["6", "Burrower DTM-1M", "556", "18"],
  ["7", "Ground Pounder DVM-2M", "548", "18"],
  ["8", "Dig Lord RCL-4M", "706", "20"],
  ["9", "Dig Lord RCL-4M-B", "699", "22"],
  ["10", "Grommet MilitiaMech D90", "836", "25"],
  ["11", "MuckRaker GMMM-2M", "1,001", "22"],
  ["12", "MuckRaker GMMM-2M-B", "815", "27"]
];

export const MELCHER_COMMAND_COMPLICATIONS = {
  ref: "Draconis Reach pp. 96–98; general procedure p. 30",
  note: "Resolve independently for each contract force. Earwigs use Independent Command (+0); Border Collies use Liaison Command (+1). Select the final resolved effects directly.",
  rows: [
    { roll: "1–3", name: "No Complication", text: "No additional tactical effect." },
    { roll: "4", name: "Moonless Night", text: "Fight the current track under Moonless Night conditions." },
    { roll: "5", name: "Fighting on Stephens", text: "The affected player’s opponent receives one LCT-3V Locust or UM-R80 UrbanMech per Scale. The receiving player chooses the unit type. Crews use Gunnery 5 / Piloting 6 or Alpha Strike Skill 5; the force represents Davion raiders or Combine ashigaru." },
    { roll: "6", name: "Black Market AgroMechs", text: "At least 25 percent of the affected player’s force by unit count must be AgroMechs. Use owned units or employer-provided track-only units from the Black Market table." },
    { roll: "7+", name: "Roll Twice", text: "Resolve two effects and apply both. Do not reroll No Complication; reroll any other duplicate result." }
  ]
};

export const MELCHER_TEMPORARY_HIRES = [
  { name: "Leena", identity: "Border Collies temporary hire", unit: "Grand Dragon DRG-5K", bv: "1,358", pv: "33", gunnery: "3", piloting: "4", alphaStrikeSkill: "3", edge: "4", abilities: "None listed.", restriction: "May participate in only one of the two simultaneous Melcher tracks.", source: "Draconis Reach pp. 97–98" },
  { name: "Serge", identity: "Earwigs temporary hire", unit: "Hatchetman HCT-6M", bv: "1,274", pv: "45", gunnery: "3", piloting: "4", alphaStrikeSkill: "3", edge: "3", abilities: "Speed Demon.", restriction: "May participate in only one of the two simultaneous Melcher tracks.", source: "Draconis Reach pp. 97–98" }
];

const oxenInterceptTrack = {
  id: "oxen-intercept",
  name: "Oxen Intercept",
  page: 96,
  pageRef: "pp. 96–97",
  type: "Melcher custom track",
  summary: "Earwigs CattleMasters drive a herd across the battlefield while the Border Collies attempt to stop them.",
  setup: [
    "Use opposing long home edges.",
    "Attacker (Earwigs): place a one-hex herd token (Alpha Strike: 2-inch AOE) within 3 hexes (AS: 6 inches) of the Attacker home edge. Deploy the Attacker force within the same distance and add four CTL-3R CattleMasters adjacent to the herd (AS: within 2 inches).",
    "Defender (Border Collies): enter from the Defender home edge during the Movement Phase of Turn 2."
  ],
  objectives: [
    { id: "orders-attacker", name: "Orders", side: A, vp: 50, text: "At least half of the Attacker units by number reach the battlefield center line, not necessarily on the same turn, or the herd reaches the center line." },
    { id: "orders-defender", name: "Orders", side: D, vp: 50, text: "Attack a CattleMaster or another Attacker unit on two different turns." },
    { id: "oxen-free", name: "Oxen Free", side: A, vp: 400, text: "The herd reaches the Defender home edge." },
    { id: "live-to-celebrate", name: "Live to Celebrate", side: A, vp: 300, text: "More than half of the Attacker force exits through the Defender home edge." },
    { id: "rope-those-cows", name: "Rope Those Cows", side: D, vp: 400, text: "Destroy all four CattleMasters before the herd reaches the Defender home edge." },
    { id: "deliver-justice", name: "Deliver Justice", side: D, vp: 200, repeatable: true, maxCount: 2, text: "Cripple or destroy an Attacker unit. Maximum two awards (400 VP)." }
  ],
  special: [
    "Herd movement: at the start of its movement, move the herd 1 hex (AS: 2 inches) for each CattleMaster within 1 hex (AS: 2 inches). The herd moves before other Attacker units, and no other unit may move through its hex or AOE.",
    "The herd ignores terrain movement costs, but cannot change elevation by more than 1 level (AS: 2 inches) or enter depth-1 water (AS: depth 1 inch).",
    "Spooked herd: during the End Phase, if any weapons were fired within 3 hexes (AS: 6 inches) of the herd, roll 2D6. On 9+, the herd does not move next turn. Each side that fired in the area loses one-quarter of its combat pay, rounded up, for each spooked turn, to a maximum of two such reductions. Resolve this pay adjustment outside the VP tracker.",
    "Track End: during the End Phase when the herd reaches the Defender home edge, after Turn 10, or when all Attacker units have retreated, are crippled, or are destroyed.",
    "Salvage: Earwigs may not claim enemy salvage. If Border Collies successfully complete the track, apply the general salvage procedure; otherwise each side reclaims its own destroyed or crippled units."
  ],
  sourceRefs: ["Draconis Reach pp. 94–98", "Oxen Intercept pp. 96–97", "Shared rules pp. 167–168"]
};

export const SPECIAL_TRACKS = [gameWorldDuelTrack, bioGenRaidTrack, oxenInterceptTrack];

const gameWorldResults = [
  { id: "carcassonne", label: "Carcassonne", trackId: "game-world-duel", attacker: "duelist-one", defender: "duelist-two", variant: carcassonneGameWorldVariant },
  { id: "xhosa-vii", label: "Xhosa VII", trackId: "game-world-duel", attacker: "duelist-one", defender: "duelist-two", variant: xhosaGameWorldVariant },
  { id: "tybalt", label: "Tybalt", trackId: "game-world-duel", attacker: "duelist-one", defender: "duelist-two", variant: tybaltGameWorldVariant }
];

const gameWorldTracks = [1, 2, 3].map(sequence => ({
  sequence,
  label: "Track " + sequence,
  resultLabel: "Game world",
  results: gameWorldResults
}));

export const PASCAGOULA_MOUNTAINS_MAPSHEETS = Object.freeze([
  ["1", "Foothills #1", "MapPack: Grasslands"],
  ["2", "Foothills #2", "MapPack: Grasslands"],
  ["3", "Washout #1", "MapPack: Deserts"],
  ["4", "Washout #2", "MapPack: Deserts"],
  ["5", "Mines #1", "MapPack: Deserts"],
  ["6", "Mines #2", "MapPack: Deserts"]
]);

export const PASCAGOULA_COMMAND_COMPLICATIONS = {
  ref: "Draconis Reach pp. 30, 106",
  note: "Resolve each player’s complication separately. Both forces have Independent Command Rights (+0). Select the resolved result for each player, then apply it to the current track.",
  rows: [
    { roll: "1", name: "No Complication", text: "No complication applies." },
    { roll: "2", name: "Shifting Sand", effectScope: "shared-battlefield", effectId: "pascagoula-shifting-sand", text: "All clear terrain is shifting sand. It affects only 40+ ton units (Alpha Strike Size 2+), adding 1 MP per hex (AS: 1 inch MV per inch) and +1 to Piloting Skill Rolls in BattleTech. Hover and VTOL movement are unaffected." },
    { roll: "3", name: "Ash Fall", effectScope: "shared-battlefield", effectId: "pascagoula-ash-fall", text: "Direct and pulse energy weapon attacks receive a +1 target number modifier. In Alpha Strike, TAG and standard weapon attacks receive +1 to the target number." },
    { roll: "4", name: "Volcanic Eruptions", text: "In the affected player’s half, from the center line to their home edge, roll 2D6 against 7+ for every unit ending the Movement Phase there each turn. Success has no effect. Failure adds 4 heat (AS: 1 heat) and gives +1 to weapon attacks made by or against that unit for the current turn." },
    { roll: "5", name: "Crevasse", text: "Only units with jump or airborne movement deploy normally. All other units are delayed one turn and enter through their home edge during the Movement Phase." },
    { roll: "6", name: "Increased Repair Costs", text: "Repairs to units that participated in this track cost an additional 50 percent SP, whenever those repairs are performed." }
  ]
};

export const PASCAGOULA_PROVISIONAL_RULES = Object.freeze([
  "Tactical victory in Track 1 is determined by Pascagoula’s special victory condition, not by the displayed VP total. Use the manually recorded tactical winner to choose the Track 2 branch.",
  "For convoy extraction, all surviving Ryus must exit and at least one Ryu must exit. Destroyed Ryus do not prevent convoy victory, but destroying all four Ryus does not satisfy convoy extraction. Causing every opposing unit to flee or be destroyed remains an alternative victory condition.",
  "The relationship between this special tactical victory, general successful-track completion, combat pay, and overall contract victory remains unresolved. Adjudicate those campaign questions at the table."
]);

const pascagoulaTrack1Battlefield = {
  title: "Pascagoula Track 1 Mapsheets",
  headers: ["Scale", "BattleTech battlefield"],
  rows: [["1", "Mines #1"], ["2", "Mines #1 + Mines #2"], ["3", "Mines #1 + Mines #2"]]
};

const pascagoulaMountainsReference = {
  title: "Mountains Terrain Mapsheet Reference (1D6)",
  headers: ["Roll", "Mapsheet", "Source"],
  rows: PASCAGOULA_MOUNTAINS_MAPSHEETS
};

const pascagoulaTrack1Variant = {
  displayName: "Gem Convoy Raid",
  type: "Modified Objective Raid",
  summary: "A modified Objective Raid in which the four Ryu heavy transport WiGEs are mobile objectives carrying the convoy components.",
  setup: [
    "Battlefield size: use Mines #1 at Scale 1; use Mines #1 and Mines #2 at Scales 2–3. The four Ryu Heavy Transport WiGEs replace the standard Objective Raid buildings as mobile objectives.",
    "Attacker: Ranger Raiders. Defender: Jewel Thieves. The Jewel Thieves control the Fifth Ghost escorts instead of their own BattleMechs.",
    "Use Vedette Medium Tank BSP asset cards for the four Ryu transports."
  ],
  setupDetails: [
    "Home edges: the Defender selects a short edge; the Attacker uses the opposite short edge.",
    "Defender deployment: place the four Ryus up to 3 hexes (AS: 6 inches) from the Defender’s home edge. Place each Fifth Ghost escort within 4 hexes (AS: 8 inches) of a Ryu.",
    "Attacker deployment: the Ranger Raiders enter from their home edge during the Movement Phase of Turn 1. Apply Objective Raid’s restriction against Minefield or Immobile BSP assets.",
    "Convoy exit edge: designate the map edge opposite the Defender’s home edge as the Ryu exit edge.",
    "Scale 1 Fifth Ghost escorts: Chimera CHA-2K and Jenner JR7-C2. All escort pilots are Gunnery 3 / Piloting 4."
  ],
  scaleNotes: [
    "Scale 1: Mines #1; four Ryu Heavy Transport WiGEs using Vedette Medium Tank BSP asset cards; Fifth Ghost escorts Chimera CHA-2K and Jenner JR7-C2 at Gunnery 3 / Piloting 4.",
    "The four Ryus are mobile objectives and replace the standard Objective Raid buildings."
  ],
  scaleNotesByScale: {
    "1": [
      "Scale 1: Mines #1; four Ryu Heavy Transport WiGEs using Vedette Medium Tank BSP asset cards; Fifth Ghost escorts Chimera CHA-2K and Jenner JR7-C2 at Gunnery 3 / Piloting 4.",
      "The four Ryus are mobile objectives and replace the standard Objective Raid buildings."
    ],
    "2": [
      "Scale 2: Mines #1 and Mines #2; four Ryu Heavy Transport WiGEs using Vedette Medium Tank BSP asset cards; Fifth Ghost escorts Chimera CHA-2K, Jenner JR7-C2, Daimyo DMO-5K, and Dragon DRG-5Nr at Gunnery 3 / Piloting 4, with the Scale 2 additions using a C3 network.",
      "The four Ryus are mobile objectives and replace the standard Objective Raid buildings."
    ],
    "3": [
      "Scale 3: Mines #1 and Mines #2; four Ryu Heavy Transport WiGEs using Vedette Medium Tank BSP asset cards; Fifth Ghost escorts Chimera CHA-2K, Jenner JR7-C2, Daimyo DMO-5K, Dragon DRG-5Nr, and Nova Cat T at Gunnery 3 / Piloting 4, with the Scale 2 additions using a C3 network.",
      "The four Ryus are mobile objectives and replace the standard Objective Raid buildings."
    ]
  },
  special: [
    "Mobile objectives: use the standard Objective Raid component-collection and loading rules with the four Ryus as the objective locations. Each Ryu has components available as needed; practical limits are available Raider units, functioning hand actuators, carrying capacity, and time before the convoy exits.",
    "Loading and carrying: load one component per functioning hand actuator per turn. Carrying capacity is Light 1, Medium 2, Heavy 3, or Assault 4. A hand-actuator ’Mech can transfer one carried component to an adjacent unit at the end of a subsequent Movement Phase. Infantry can load one component onto an adjacent ’Mech or vehicle per turn, but cannot carry components; mechanized infantry must dismount. An asset vehicle can carry one component if assisted with loading and loses 1 MP while carrying it. Apply the p. 171 movement and jumping restrictions; carrying components does not prevent attacks.",
    "Extraction: components score when carried off the Attacker’s home edge. A unit that exits the battlefield is removed from play and cannot return for another load.",
    "Special tactical victory: a player wins when all surviving Ryus exit the edge opposite their home edge, with at least one Ryu successfully exiting, or when every opposing unit has fled or been destroyed. Destroyed Ryus do not prevent convoy victory, but destruction of all four Ryus does not satisfy convoy extraction. This provisional interpretation is separate from the Objective Raid VP tracker.",
    "Salvage: use the standard Objective Raid salvage rule. The Attacker may not claim salvage; the Defender claims salvage if they successfully complete the track, otherwise all salvage returns to its owners.",
    "Track 2 carryover reminder: damage and ammunition expenditure carry over; there are no repairs, ammunition reloading, or purchases between tracks."
  ],
  objectiveOverrides: {
    "orders-defender": {
      text: "All Defender units must stay within 3 hexes (AS: 6 inches) of one of the four mobile Ryu objectives, or closer to the Attacker’s home edge than one of the Ryus, for the first two turns, or be crippled or destroyed."
    },
    "grab-stuff": {
      name: "Grab the Stuff",
      text: "Each component successfully extracted from a Ryu and carried off the Attacker’s home edge."
    },
    "pay-for-that": {
      name: "You Must Pay for That",
      text: "Each qualifying non-asset Attacker unit crippled or destroyed."
    }
  },
  commandComplications: PASCAGOULA_COMMAND_COMPLICATIONS,
  referenceTables: [pascagoulaTrack1Battlefield],
  provisionalRules: PASCAGOULA_PROVISIONAL_RULES,
  sourceRefs: [
    "Draconis Reach pp. 103–107",
    "Objective Raid p. 171",
    "Campaign withdrawal and exit rules p. 31",
    "Command complications procedure p. 30",
    "Current Draconis Reach master errata"
  ]
};

function pascagoulaPursuitVariant(branch) {
  const base = TRACKS.find(track => track.id === "pursuit");
  const jewelDefends = branch === "jewel-defends";
  const branchDetails = jewelDefends
    ? [
        "Tactical support — Jewel Thieves (Defender): use their own Scale-based force plus applicable surviving Ryu transports.",
        "Tactical support — Ranger Raiders (Attacker): use their own Scale-based force plus surviving Fifth Ghost escorts.",
        "Ryu extraction prerequisite: at least one Ryu must exit through the Defender home edge before the Jewel Thieves may score any Defender objective other than Orders."
      ]
    : [
        "Tactical support — Ranger Raiders (Defender): use their surviving force from Track 1 plus surviving captured Ryu transports.",
        "Tactical support — Jewel Thieves (Attacker): use the applicable attacking force under the corrected contract rules.",
        "Mule extraction: place a Mule DropShip template within 5 hexes (AS: 10 inches) of the edge opposite the one from which the force entered. In BattleTech its template is the central hex plus all six adjacent hexes; in Alpha Strike use a 6-inch AOE. The crew is Gunnery 4 / Piloting 5.",
        "Loading the Mule: an eligible Ranger Raiders unit ending its turn adjacent to the Mule (AS: within 2 inches) loads aboard, is removed from play, and counts as successfully exited for applicable objectives.",
        "Ryu extraction prerequisite: at least one Ryu must load aboard the Mule and be removed from play before the Ranger Raiders may score any Defender objective other than Orders."
      ];
  return {
    displayName: jewelDefends ? "Pursuit · Jewel Thieves Defend" : "Pursuit · Ranger Raiders Defend",
    type: "Modified Pursuit",
    summary: "The Track 1 tactical winner defends during a modified Pursuit while the opposing mercenary force attacks.",
    setup: [...base.setup],
    setupDetails: [
      ...base.setupDetails,
      ...branchDetails,
      "Carryover: existing damage and ammunition expenditure carry over from Track 1. No repairs, ammunition reloading, or purchases are allowed between tracks.",
      "BattleTech mapsheets: preserve the standard Pursuit footprint and use the Mountains Terrain table when resolving required mapsheets.",
      "Alpha Strike terrain: preserve the standard Pursuit battlefield footprint. For Mountains terrain, at least half of selected terrain pieces must be hills."
    ],
    scaleNotes: [...base.scaleNotes],
    objectives: [...base.objectives],
    special: [...base.special],
    commandComplications: PASCAGOULA_COMMAND_COMPLICATIONS,
    referenceTables: [pascagoulaMountainsReference],
    defenderExtractionText: jewelDefends
      ? "At least one Ryu successfully exited through the Defender home edge."
      : "At least one Ryu successfully loaded aboard the Mule and was removed from play.",
    sourceRefs: [
      "Draconis Reach pp. 103–107",
      "Pursuit p. 172",
      "Mountains Terrain Table p. 150",
      "Alpha Strike terrain p. 154",
      "Current Draconis Reach master errata"
    ]
  };
}

const pascagoulaJewelDefenderVariant = pascagoulaPursuitVariant("jewel-defends");
const pascagoulaRangerDefenderVariant = pascagoulaPursuitVariant("ranger-defends");

const leBlancSharedSpecial = [
  "Successful track completion: a player must complete at least one objective and earn more objective VP than the opposing player. Equal VP means neither player successfully completes the track."
];

const leBlancReferenceTables = [
  { title: "Le Blanc Mapsheets (1D6)", headers: ["Roll", "Mapsheet", "Source"], rows: LE_BLANC_MAPSHEET_TABLE },
  { title: "Complication 6 · Attacker Opponent support per Scale", headers: ["Recipient role", "Current-track support"], rows: LE_BLANC_PARTISAN_PACKAGES.attacker.map(item => ["Attacker", item]) },
  { title: "Complication 6 · Defender Opponent support per Scale", headers: ["Recipient role", "Current-track support"], rows: LE_BLANC_PARTISAN_PACKAGES.defender.map(item => ["Defender", item]) }
];

function leBlancOverlay(trackId, existing = {}) {
  const base = TRACKS.find(track => track.id === trackId);
  const pageRef = base?.pageRef || "p. " + base?.page;
  return {
    ...existing,
    setupDetails: [
      ...(existing.setupDetails || base?.setupDetails || []),
      "BattleTech mapsheets: roll on the Le Blanc 1D6 table for each required mapsheet. Preserve the selected standard track’s specific battlefield dimensions and map quantity; Retreat’s two/four-mapsheet footprint takes precedence over the general Scale count.",
      "Alpha Strike terrain: every Le Blanc-specific mapsheet is from MapPack: City. Use the base terrain of the selected City mapsheet under the p. 154 terrain procedure; do not substitute Desert terrain solely because Le Blanc’s primary planetary terrain is Desert."
    ],
    special: [...(existing.special || base?.special || []), ...leBlancSharedSpecial],
    commandComplications: LE_BLANC_COMMAND_COMPLICATIONS,
    referenceTables: leBlancReferenceTables,
    temporaryHires: LE_BLANC_TEMPORARY_HIRES,
    sourceRefs: [
      "Draconis Reach pp. 86–89 (contracts 124704A–B)",
      base?.name + " " + pageRef,
      "Successful tracks pp. 26, 29",
      "Command Rights p. 28 and complications pp. 30, 89",
      "Mapsheets p. 89 and Alpha Strike terrain p. 154",
      "Temporary Hires pp. 29, 89",
      "Shared rules pp. 167–168"
    ]
  };
}

const leBlancTrack1Variant = leBlancOverlay("objective-raid", {
  displayName: "Objective Raid · Wreck the Place",
  summary: "An Objective Raid in which the Attacker destroys the Defender’s medium objective buildings.",
  setup: [
    "The Defender selects a short edge as their home edge; the Attacker gets the opposite short edge.",
    "The Defender designates two Medium objective buildings, height 1–4 levels (AS: 2–6 inches), within 4 hexes of the battlefield center, or 6 hexes at Scale 2+, in clear, rough, or wooded terrain or depth-0 water. If the center falls on a hex border, include every bordered hex. The objective buildings are destructible; apply the Wreck the Place durability rule below.",
    "Defender (Garrison): begin with all units in the play area; at least half of the force must be within 6 hexes of the objective buildings.",
    "Attacker (Raiders): enter from the home edge during the Movement Phase of Turn 1. The Attacker may not select Minefield or Immobile BSP assets."
  ],
  objectiveOverrides: {
    "grab-stuff": {
      name: "Wreck the Place",
      vp: 50,
      text: "Each medium objective building destroyed by the Attacker."
    }
  },
  special: [
    "Leg it!: the Attacker may not claim salvage.",
    "Objective buildings: medium buildings are immobile (−4 target number modifier) and can sustain 30 damage (AS: 4 damage) before being destroyed.",
    "Track End: after the end of any turn when at least one side has no units in play, or after the end of Turn 12 (Turn 10 in Alpha Strike).",
    "Salvage: the Attacker may not claim salvage. The Defender claims salvage if they successfully complete the track; otherwise all salvage returns to its owners."
  ]
});

const leBlancFinalVariant = trackId => leBlancOverlay(trackId);

const lucerneSharedSpecial = [
  "Successful track completion: a player must complete at least one objective and earn more objective VP than the opponent. Equal VP means neither player successfully completes the track."
];

const lucerneReferenceTables = [
  { title: "Lucerne Mapsheets · 1D6 Grasslands Table 1", headers: ["Roll", "Mapsheet", "Source"], rows: LUCERNE_MAPSHEET_TABLE }
];

function lucerneOverlay(trackId, { includeComplications = true } = {}) {
  const base = [...TRACKS, ...SPECIAL_TRACKS].find(track => track.id === trackId);
  const pageRef = base?.pageRef || "p. " + base?.page;
  return {
    setupDetails: [
      ...(base?.setupDetails || []),
      "BattleTech mapsheets: beginning with the Attacker, roll 1D6 on Grasslands Table 1 for every mapsheet required and ignore duplicate results. Scale 1 normally uses one mapsheet; Scales 2–3 normally use two. Any explicit selected-track battlefield footprint takes precedence.",
      "Alpha Strike terrain: use the base terrain type of the selected mapsheet, or the majority of selected mapsheets, under the p. 154 terrain-placement procedure. Lucerne remains classified as Wooded planetary terrain, but the contract uses the corrected Grasslands mapsheet table."
    ],
    special: [...(base?.special || []), ...lucerneSharedSpecial],
    commandComplications: includeComplications ? LUCERNE_COMMAND_COMPLICATIONS : null,
    referenceTables: lucerneReferenceTables,
    temporaryHires: LUCERNE_TEMPORARY_HIRES,
    temporaryHireNote: "Use these cards after the players resolve hiring under Draconis Reach pp. 29 and 92–93. Eligibility, availability, costs, bonuses, repairs, and replacement follow those rules.",
    sourceRefs: [
      "Draconis Reach pp. 90–93 (contracts 906245A–B)",
      base?.name + " " + pageRef,
      "Successful tracks pp. 26, 29",
      "General tactical procedure and salvage pp. 30–31",
      "Grasslands Mapsheet Table 1 p. 150 and Alpha Strike terrain p. 154",
      "Shared rules pp. 167–168"
    ]
  };
}

export const LUCERNE_TRACK_RESULTS = Object.freeze([
  { id: "recon", label: "Recon", trackId: "recon", attacker: "eclipse", defender: "bio-gen", variant: lucerneOverlay("recon") },
  { id: "breakthrough", label: "Breakthrough", trackId: "breakthrough", attacker: "eclipse", defender: "bio-gen", variant: lucerneOverlay("breakthrough") },
  { id: "objective-raid", label: "Objective Raid", trackId: "objective-raid", attacker: "eclipse", defender: "bio-gen", variant: lucerneOverlay("objective-raid") },
  { id: "pushback", label: "Pushback", trackId: "pushback", attacker: "bio-gen", defender: "eclipse", variant: lucerneOverlay("pushback") },
  { id: "pursuit", label: "Pursuit", trackId: "pursuit", attacker: "bio-gen", defender: "eclipse", variant: lucerneOverlay("pursuit") },
  { id: "assault", label: "Assault", trackId: "assault", attacker: "eclipse", defender: "bio-gen", variant: lucerneOverlay("assault") },
  { id: "bio-gen-raid", label: "Bio-Gen Raid · mandatory sixth played track", trackId: "bio-gen-raid", attacker: "eclipse", defender: "bio-gen", variant: lucerneOverlay("bio-gen-raid", { includeComplications: false }) }
]);

export const PROTECTION_PROVISIONAL_RULES = Object.freeze([
  "Alpha Strike uses the general terrain-placement procedure on pp. 154–155. Protection’s BattleTech-only Level 0 flooding and water-token conversion are not translated into invented Alpha Strike dimensions or quantities.",
  "For Roll Twice, apply the selecting force’s Command Rights modifier to the initial and secondary rolls, resolve exactly two secondary results, reroll secondary Roll Twice results and duplicate effects other than No Complication, and do not recurse.",
  "In Atlantis City, Local Partisans become naval patrol boats only when the same player resolved both Local Partisans and Monsoon through Roll Twice; another player’s Monsoon does not convert that support award.",
  "If Platinum Sands holds the Mobile HQ at the end of the final turn, Platinum Sands alone successfully completes the track even when both sides have 450 effective VP."
]);

export const PROTECTION_STANDARD_MAPSHEETS = Object.freeze({
  title: "Standard Protection Mapsheet Table",
  headers: ["1D6", "Mapsheet"],
  rows: [
    ["1", "Hilltops #1 (CI)"],
    ["2", "Desert #3 (AGOAC)"],
    ["3", "Rolling Hills #1 (MP: Grasslands)"],
    ["4", "Rolling Hills #2 (MP: Grasslands, CI)"],
    ["5", "Rolling Hills #3 (MP: Grasslands)"],
    ["6", "Sand Drifts #1 (MP: Deserts)"]
  ],
  whenSelection: { id: "battlefield-type", value: "standard" }
});

export const PROTECTION_ATLANTIS_MAPSHEETS = Object.freeze({
  title: "Atlantis City Mapsheet Table",
  headers: ["1D6", "Mapsheet"],
  rows: [
    ["1", "Corporate Campus (MP: City)"],
    ["2", "Family Quarters (MP: City)"],
    ["3", "HPG Heliport (MP: City)"],
    ["4", "Business District (MP: City)"],
    ["5", "Shopping District (MP: City)"],
    ["6", "HPG Offices (MP: City)"]
  ],
  whenSelection: { id: "battlefield-type", value: "atlantis" }
});

export const PROTECTION_TEMPORARY_HIRES = Object.freeze([
  {
    name: "Surf Rock",
    identity: "Old Man Hawthorne · local retired MechWarrior",
    unit: "Thunderbolt TDR-12R",
    bv: "1,975",
    pv: "41",
    gunnery: "4",
    piloting: "5",
    alphaStrikeSkill: "4",
    edge: "3",
    abilities: "No additional special pilot ability is stated.",
    restriction: "50 Support Points per participating track, plus 50 Support Points for each unit he destroys. Resolve availability, eligibility, payment, repairs, and replacement from the sourcebook.",
    source: "Draconis Reach p. 112 · current errata"
  }
]);

export function protectionPartisanSupport(battlefieldType, localPartisans, samePlayerMonsoon) {
  if (!localPartisans) return null;
  return {
    quantity: 2,
    naval: battlefieldType !== "atlantis" || Boolean(samePlayerMonsoon)
  };
}

export function evaluateProtectionPursuit({ captureHeld = false, attackerVp = 0, defenderVp = 0, attackerObjectives = 0, defenderObjectives = 0 } = {}) {
  if (captureHeld) {
    return { attackerVp: 450, defenderVp, attackerSuccessful: true, defenderSuccessful: false };
  }
  return {
    attackerVp,
    defenderVp,
    attackerSuccessful: attackerObjectives > 0 && attackerVp > defenderVp,
    defenderSuccessful: defenderObjectives > 0 && defenderVp > attackerVp
  };
}

export const PROTECTION_COMMAND_COMPLICATIONS = {
  ref: "Draconis Reach pp. 30, 111",
  note: "Select each player’s already-resolved result. Protection uses House Command (+2) for Platinum Sands and Liaison Command (+1) for Kanagawa Group; Independent is +0 and Integrated is +3. The browser does not roll dice or select Command Rights.",
  provisional: PROTECTION_PROVISIONAL_RULES.slice(1, 3),
  rows: [
    { roll: "1–3", name: "No Complication", text: "No complication applies." },
    { roll: "4", name: "R&R", effectScope: "player-specific", text: "Your employer provided good rest and relaxation at a local resort, but the enemy arrived during it. Take a −2 penalty to Initiative rolls for the first 2 turns." },
    { roll: "5", name: "Less Support", effectScope: "player-specific", text: "Last-minute changes to the battle plan leave you with less support. Reduce the Battlefield Support available to you for the track by 10 BSP (AS: 2 BSP) per Scale." },
    { roll: "6", name: "Local Partisans", effectScope: "opposing-support", effectId: "protection-local-partisans", supportOnly: true, text: "Your opponent receives support from a local partisan group: two additional Vedette Medium Tank battlefield assets. On standard maps, these Vedettes represent patrol boats. Change their motive type from Tracked to Naval, allow them to enter Depth 0 and deeper water hexes, and treat them as Level 0 (surface) for shooting." },
    { roll: "7", name: "Monsoon", effectScope: "shared-battlefield", effectId: "protection-monsoon", text: "Your employer determines that monsoon conditions offer the perfect opportunity to attack. On standard maps, reduce all hex levels by 1 as a storm surge floods the area. On Atlantis City maps, treat every Level 0 hex as Depth 0 water. All attacks receive an additional +1 target number modifier at medium range and +2 at long range (AS: +1 target number modifier to all weapon attacks at medium or long range)." },
    { roll: "8+", name: "Roll Twice", text: "Roll twice and apply both effects. Do not reroll No Complication, but reroll any other duplicate effect. If both options 6 and 7 are rolled, the Vedettes represent patrol boats crazy enough to sail into the flooded streets of Atlantis City." }
  ]
};

const protectionBattlefieldSelections = [
  {
    id: "battlefield-type",
    label: "Battlefield type",
    placeholder: "Choose the battlefield",
    default: "standard",
    options: [
      { value: "standard", label: "Standard Protection battlefield" },
      { value: "atlantis", label: "Atlantis City" }
    ],
    note: "The Attacker may choose Atlantis City and take the printed −1 Reputation consequence. Reputation is recorded outside the browser."
  },
  {
    id: "atlantis-response",
    label: "Defender response at Atlantis City",
    placeholder: "Choose the Defender’s response",
    options: [
      { value: "check-fire", label: "Check fire · +1 to all Gunnery rolls" },
      { value: "engage", label: "Engage without restriction" }
    ],
    note: "Check fire grants the Defender +1 Reputation regardless of outcome. Engaging without restriction costs the Defender −1 Reputation. Reputation is recorded outside the browser.",
    visibleWhen: { id: "battlefield-type", value: "atlantis" }
  }
];

function protectionBattlefieldRules(trackId) {
  const sizeRules = trackId === "pursuit"
    ? []
    : [
        { text: "At Scale 1, use one mapsheet.", scales: [1] },
        { text: "At Scales 2–3, use two mapsheets or one neoprene BattleMat.", scales: [2, 3] }
      ];
  return [
    ...sizeRules,
    { text: "BattleTech standard battlefield: after determining the mapsheets, treat all Level 0 ground as Level 0 water. Each player receives six Depth 1 water tokens to place in Level 0 water hexes; two Depth 1 tokens may be stacked to create a Depth 2 water hex. Tracked and wheeled assets may be difficult or impossible to use, so select assets accordingly.", whenSelection: { id: "battlefield-type", value: "standard" } },
    { text: "Alpha Strike terrain — approved provisional treatment: use the general terrain-placement requirements on pp. 154–155 and the base terrain type of the selected mapsheet or majority of mapsheets. Do not apply Protection’s BattleTech-only Level 0 flooding or water-token conversion. Ordinary water terrain required by the general rules remains available.", whenSelection: { id: "battlefield-type", value: "standard" } },
    { text: "Atlantis City: use the city mapsheets exactly as printed. Do not apply the standard Protection water modifications. Applicable Command Complications may still modify the battlefield.", whenSelection: { id: "battlefield-type", value: "atlantis" } }
  ];
}

function protectionVariant(trackId, extra = {}) {
  const base = TRACKS.find(track => track.id === trackId);
  const { special: extraSpecial = [], ...rest } = extra;
  return {
    ...rest,
    special: [...(base?.special || []), ...extraSpecial],
    battlefieldRules: protectionBattlefieldRules(trackId),
    selectionControls: protectionBattlefieldSelections,
    referenceTables: [PROTECTION_STANDARD_MAPSHEETS, PROTECTION_ATLANTIS_MAPSHEETS],
    battlefieldProvisional: [PROTECTION_PROVISIONAL_RULES[0]],
    commandComplications: PROTECTION_COMMAND_COMPLICATIONS,
    temporaryHires: PROTECTION_TEMPORARY_HIRES,
    temporaryHireNote: "Surf Rock becomes available under the printed Protection threshold on p. 112. Use pp. 29, 32, 35, and 112 for eligibility, force limits, payment, repairs, replacement, and permanent hiring; the browser provides tactical reference only.",
    sourceRefs: ["Draconis Reach pp. 108–112", "General rules pp. 29–31, 39–40, 150–155", "Selected standard track pp. 167–175", "Current Draconis Reach master errata"]
  };
}

const protectionTrack1Variant = protectionVariant("recon", {
  displayName: "Protection Recon",
  summary: "The second month of the Protection contract begins open hostilities with a Recon track.",
  setupDetails: [
    "Contract sequence: this is the second month of the Protection contract. Play one Recon track with the Platinum Sands player as Attacker and the Kanagawa Group player as Defender. The winner determines who is the Attacker in Track 2."
  ]
});

const protectionTrack2Variant = protectionVariant("meeting-engagement", {
  displayName: "Protection Meeting Engagement",
  summary: "The third month escalates the Protection contract to a Meeting Engagement.",
  setupDetails: [
    "Contract sequence: this is the third month of the Protection contract. Play a Meeting Engagement; the winner of Track 1 is the Attacker."
  ]
});

const protectionTrack3Variant = protectionVariant("flank", {
  displayName: "Protection Flank",
  summary: "When the first two tracks are split, the fourth month becomes a Flank decided by a 2D6 roll-off.",
  setupDetails: [
    "Contract sequence: this is the fourth month. If Platinum Sands won both previous tracks, play Assault with Platinum Sands as Attacker. If Kanagawa Group won both, play Pushback with Kanagawa Group as Attacker. If each side won one previous track, play Flank and resolve the Attacker role by a 2D6 roll-off; the higher result may choose Attacker or Defender."
  ],
  roleChoiceLabel: "Choose the side assigned to the Attacker role after the 2D6 roll-off",
  roleChoiceHint: "The source says the higher roll may choose Attacker or Defender; record the final role assignment here.",
  roleChoicePendingInstruction: "Select the Attacker to display objectives."
});

const protectionTrack4Variant = protectionVariant("pursuit", {
  displayName: "Protection Pursuit",
  summary: "The fifth month is a Pursuit to capture Governor Hale’s Mobile HQ.",
  setupDetails: [
    "Contract sequence: this is the fifth month. Play Pursuit with Platinum Sands as Attacker and Kanagawa Group as Defender.",
    "Kanagawa Group receives an extra Mobile HQ asset with Regular Skill (Gunnery 4, Piloting 5, Skill 4) and hover movement instead of wheeled movement. It represents Governor Hale’s vehicle.",
    "Platinum Sands is ordered to capture the Mobile HQ rather than destroy it. A Platinum Sands ’Mech adjacent to the Mobile HQ during the Physical Attack Phase may attempt the capture as a physical attack with a +1 target number modifier and all other normal modifiers; missing hand actuators make the roll more difficult. For Alpha Strike, resolve it as a typical melee attack with an additional +1 target number modifier."
  ],
  special: [
    "Mobile HQ capture: a successful capture causes no damage, prevents the Mobile HQ from moving, and prevents the capturing ’Mech from moving or firing in following rounds unless it voluntarily releases the Mobile HQ in the End Phase. Kanagawa Group may attempt to free it in following rounds. Destroying the capturing ’Mech or causing it to fall releases the Mobile HQ at the End Phase of the current turn. If Platinum Sands still has the Mobile HQ captured at the end of the final turn, it is considered to have completed all mission objectives and receives maximum combat bonus pay."
  ]
});

export const SUN_PRAIRIE_COMMAND_COMPLICATIONS = Object.freeze({
  ref: "Draconis Reach pp. 30, 115",
  note: "Select each player’s already-resolved result. Sun Prairie Garrison uses Liaison Command (+1) and Sun Prairie Raid uses Independent Command (+0); House is +2 and Integrated is +3. The browser does not roll dice or select Command Rights.",
  provisional: ["For Roll Twice, apply the selecting force’s Command Rights modifier to the initial and both secondary rolls, resolve exactly two secondary results, ignore secondary Roll Twice results, and ignore duplicate effects without rerolling or recursing."],
  rows: [
    { roll: "1", name: "Lostech Cache", text: "If the affected player successfully completes this track, that player gains an additional 100 SP from recovery of a small cache. The browser presents this conditional reward but does not award or track Support Points." },
    { roll: "2–3", name: "No Complication", text: "No additional effect." },
    { roll: "4–5", name: "Battlefield Confusion", text: "The affected player suffers a −2 Initiative penalty for the first two turns of the battle." },
    { roll: "6", name: "Rubble", effectScope: "opposing-placement", supportOnly: true, text: "The selecting player’s opponent may place six rubble hexes (Alpha Strike: six 2-inch AOE terrain templates). Do not multiply this entitlement by Scale." },
    { roll: "7", name: "Fire and Smoke", effectScope: "shared-battlefield", effectId: "sun-prairie-fire-smoke", text: "Shared battlefield condition: every area on fire is also covered in light smoke. BattleTech: during the Heat Phase, a unit occupying a burning hex adds 5 heat; it also adds 2 heat for each burning hex moved through during the Movement Phase. Alpha Strike: a unit entering or moving through a burning area builds 1 heat during that turn’s End Phase. In either system, non-heat-tracking units convert heat to damage. Any attack whose line of sight passes through smoke, or whose target is in smoke, receives a +1 target number modifier." },
    { roll: "8+", name: "Roll Twice", text: "Roll twice and apply both effects. Ignore duplicate effects and do not reroll them." }
  ]
});

export const SUN_PRAIRIE_MAPSHEET_TABLE = Object.freeze({
  title: "Sun Prairie Mapsheet Table · Grasslands · Reference only",
  headers: ["1D6", "Mapsheet", "Primary terrain"],
  rows: [
    ["1", "Open Terrain #2", "Grasslands"],
    ["2", "Open Terrain #3", "Grasslands"],
    ["3", "Rolling Hills #3", "Grasslands"],
    ["4", "Rolling Hills #3", "Grasslands"],
    ["5", "Lakes", "Grasslands"],
    ["6", "Forward Base", "Grasslands"]
  ]
});

export const SUN_PRAIRIE_TEMPORARY_HIRES = Object.freeze([{ id: "phillips-watson", name: "Phillips Watson", identity: "Sun Prairie Raid temporary hire", unit: "Dragon Fire DGR-6FC", bv: "1,858", pv: "43", gunnery: "3", piloting: "3", alphaStrikeSkill: "3", edge: "4", abilities: "Patient Edge Ability", restriction: "Raid only. 100 SP per participating track, plus 50 SP if the ’Mech takes internal damage in more than one location (Alpha Strike: more than 1 structure damage). Payment and damage tracking remain outside the browser.", source: "Draconis Reach p. 115 · current official errata" }]);

export const SUN_PRAIRIE_TACTICAL_SUPPORT = Object.freeze([{ id: "prairie-rangers", title: "Prairie Rangers", association: "Sun Prairie Garrison", details: ["Four Veteran motorized platoons carrying energy rifles · Gunnery 3 · Piloting 4 · Alpha Strike Skill 3.", "Combined printed value: 496 BV / 48 PV. This is not a per-platoon value.", "Battlefield Support alternative: use four Veteran motorized conventional Infantry and purchase the group using 496 BV instead of BSP.", "Cost reference: 50 SP per participating track, plus 50 SP for each Prairie Ranger unit destroyed. Payment and losses remain outside the browser."], source: "Draconis Reach p. 115" }]);

const sunPrairieBattlefieldDetails = [
  "BattleTech mapsheets: roll once on the Sun Prairie Grasslands table for every required mapsheet. Scale 1 normally uses one mapsheet; Scales 2–3 normally use two mapsheets. A more specific selected-track battlefield footprint takes precedence.",
  "Alpha Strike terrain: use a battlefield 48 inches across, with a width of 36 inches at Scale 1 and 48 inches at Scales 2–3, unless the selected standard track specifies a different footprint. Grasslands halves each player’s normal eight-terrain-piece allowance to four, rounded up; each player determines which normal placement areas lose the removed pieces."
];

function sunPrairieVariant(trackId) {
  const base = TRACKS.find(track => track.id === trackId);
  const pageRef = base?.pageRef || "p. " + base?.page;
  return {
    displayName: base?.name,
    type: "Sun Prairie contract track",
    setupDetails: [...(base?.setupDetails || []), ...sunPrairieBattlefieldDetails],
    special: [...(base?.special || [])],
    commandComplications: SUN_PRAIRIE_COMMAND_COMPLICATIONS,
    referenceTables: [SUN_PRAIRIE_MAPSHEET_TABLE],
    temporaryHires: SUN_PRAIRIE_TEMPORARY_HIRES,
    temporaryHireNote: "The first time a force cannot field at least two-thirds of the maximum permissible BV/PV for its next track, its associated local mercenary offers services. Players decide separately for each track whether to pay for participation. Eligibility, payment, damage, and losses remain outside the browser.",
    tacticalSupport: SUN_PRAIRIE_TACTICAL_SUPPORT,
    sourceRefs: ["Sun Prairie contracts and mission brief pp. 113–115", base?.name + " " + pageRef, "Mapsheets and Command Complications p. 30", "Grasslands terrain p. 150 and Alpha Strike terrain pp. 154–155", "Shared rules pp. 167–168", "Current Draconis Reach master errata"]
  };
}

export const TIGRESS_PROVISIONAL_RULES = Object.freeze([
  "Captain Sutera Galindo is the mandatory Track 2 liaison; the conflicting narrative reference to Captain Philomena Kang is not treated as a second tactical character.",
  "Only Legion Trainers retain VP earned during the training phase. VP earned by the trainee force while controlled by the Roughriders player does not carry into Recon.",
  "When the actual Roughriders arrive, start a new Recon turn counter at Recon Turn 1. Training turns do not consume Recon’s eight turns; Recon ends after Recon Turn 8 or an applicable earlier Recon ending condition.",
  "The actual Roughriders enter from the trainees’ original home edge. Existing units remain in position, the home edges do not change, and no redeployment occurs.",
  "Treat the Twenty-three-hour day Fatigue result as 5+ after Command Rights modifiers, rather than the printed 5–6 range.",
  "Meeting Engagement’s normal ending conditions do not end overall Track 1 before the scheduled Roughriders arrival. The training portion is a phase of Track 1, not an independently completed track.",
  "All standard Recon objective timing uses the restarted Recon clock: Defender Orders covers the first two Recon turns, Observe and Report requires more than four Recon turns, and Deny is resolved at Recon Turn 8.",
  "A Legion Trainers training objective completed during the training phase satisfies their objective-completion prerequisite for Track 1 success. They do not also need a Recon objective. Roughriders qualify only through Recon objectives. Either side must still finish with more total VP; a 350–350 tie means neither side successfully completes Track 1."
]);

export const TIGRESS_COMMAND_COMPLICATIONS = {
  ref: "Draconis Reach pp. 30, 118 · BMM p. 78 · AS:CE p. 54",
  note: "Resolve each player’s 1D6 externally after mapsheets are determined. Legion Trainers use House Command (+2); Roughriders Recon use Liaison Command (+1).",
  provisional: ["Treat the printed 5–6 Fatigue result as 5+ after Command Rights modifiers, so modified results above 6 resolve as Twenty-three-hour day."],
  rows: [
    { roll: "1–2", name: "No complication", text: "No complication applies." },
    { roll: "3", name: "Tigress Home Guard support", fixedRecipientId: "legion-trainers", text: "Starting when both players have entered the map, Legion Trainers may spend up to 4 BSP per Scale (4/8/12 BSP at Scales 1/2/3) on Defensive Aerospace Support or Artillery Support." },
    { roll: "4", name: "Rabid Foxes air support", fixedRecipientId: "roughriders", text: "Starting when both players have entered the map, Roughriders Recon may spend up to 4 BSP per Scale (4/8/12 BSP at Scales 1/2/3) on Offensive Aerospace Support." },
    { roll: "5+", name: "Twenty-three-hour day", effectScope: "shared-battlefield", effectId: "tigress-fatigue", text: "The twenty-three-hour Tigress day has left all combatants without enough sleep. On a To-Hit roll of 12, a successful attack is a near miss and does no damage." }
  ]
};

export const TIGRESS_WOODED_MAPSHEETS = Object.freeze({
  title: "Wooded Terrain Mapsheet Table · 1D6", headers: ["Roll", "Mapsheet", "Source"],
  rows: [["1", "Woodland", "MapPack: Mercenaries"], ["2", "Scattered Woods", "MapPack: Mercenaries"], ["3", "Grassland #3", "A Game of Armored Combat"], ["4", "Rolling Hills #2", "Clan Invasion"], ["5", "Desert #3", "A Game of Armored Combat"], ["6", "Rolling Hills #1", "MapPack: Grasslands"]]
});

export const TIGRESS_HILLS_MAPSHEETS = Object.freeze({
  title: "Hills Terrain Mapsheet Table · 1D6", headers: ["Roll", "Mapsheet", "Source"],
  rows: [["1", "Hilltops #1", "Clan Invasion"], ["2", "Foothills #2", "MapPack: Grasslands"], ["3", "Rolling Hills #1", "MapPack: Grasslands"], ["4", "Rolling Hills #2", "Clan Invasion"], ["5", "Rolling Hills #3", "MapPack: Grasslands"], ["6", "Rolling Hills #4", "MapPack: Grasslands"]]
});

export const TIGRESS_TEMPORARY_HIRES = Object.freeze([{ id: "joachim-vierziger", name: "Joachim Vierziger", identity: "Tigress local mercenary", unit: "Avatar AV1-OG", bv: "1,775", pv: "34", gunnery: "1", piloting: "3", alphaStrikeSkill: "2", edge: "4", abilities: "Marksman", restriction: "300 Support Points per participating track. General eligibility: the hiring force is below 2,000 BV or 80 PV per Scale before hiring, and the resulting force remains within its Scale limit. Availability, payment, repair, and replacement remain outside the browser.", source: "Draconis Reach pp. 29, 119 · Campaign Pilot Card p. 163" }]);

export const TIGRESS_TRAINEE_SUPPORT = Object.freeze([{ id: "laurel-trainees", title: "Laurel’s Legion trainees", association: "Track 1 · scenario-provided training force", details: ["The trainees participate from the start of the training phase under the Roughriders player’s temporary control. Legion Trainers field an equal-BV/PV force."], detailsByScale: { "1": ["Scale 1: Vindicator VND-7L · Gunnery 4 / Piloting 6 · Alpha Strike Skill 5."], "2": ["Scale 2: Vindicator VND-7L and Cicada CDA-4A · each Gunnery 4 / Piloting 6 · Alpha Strike Skill 5."], "3": ["Scale 3: officer-cadet Vindicator VND-7L · Gunnery 4 / Piloting 5 · Alpha Strike Skill 4; two Cicada CDA-4As · Gunnery 4 / Piloting 6 · Alpha Strike Skill 5."] }, source: "Draconis Reach p. 118" }]);

export const TIGRESS_SUTERA_SUPPORT = Object.freeze([{ id: "sutera-galindo", title: "Captain Sutera Galindo", association: "Track 2 · mandatory Roughriders Recon liaison · Rabid Foxes, formerly Ceti Hussars", details: ["Caesar CES-5D · Gunnery 3 / Piloting 3 · Alpha Strike Skill 3.", "Five Edge tokens · Bulwark · Protector.", "Campaign Pilot Card handicap 41, incorporating current official errata.", "This is mandatory tactical support, not a Temporary Hire."], source: "Draconis Reach pp. 119, 162 · current official errata" }]);

const tigressBattlefield = {
  wooded: ["BattleTech mapsheets: roll once on the Wooded Terrain table for every required mapsheet. Scale 1 normally uses one mapsheet; Scales 2–3 normally use two. Preserve any more-specific standard-track footprint exception.", "Alpha Strike Wooded terrain: the battlefield is 48 inches across and 36 inches wide at Scale 1 or 48 inches wide at Scales 2–3. Each player places the normal eight terrain pieces; at least half of all placed pieces must be woods, using the general placement zones."],
  hills: ["BattleTech mapsheets: roll once on the Hills Terrain table for every required mapsheet. Scale 1 normally uses one mapsheet; Scales 2–3 normally use two. Preserve any more-specific standard-track footprint exception.", "Alpha Strike Hills terrain: the battlefield is 48 inches across and 36 inches wide at Scale 1 or 48 inches wide at Scales 2–3. Each player places the normal eight terrain pieces; at least half of all placed pieces must be hills, using the general placement zones."]
};

const tigressCommonSpecialRules = ["Contract victory: either or both players may claim victory by successfully completing at least one of the two tracks."];

const tigressTrack1TrainingVariant = {
  page: 118, displayName: "Training Mission · Training Phase", type: "Tigress Track 1 · Meeting Engagement phase",
  summary: "Legion Trainers conduct a simulated Meeting Engagement against scenario-provided Laurel’s Legion trainees controlled temporarily by the Roughriders player.",
  setup: [...TRACKS.find(track => track.id === "meeting-engagement").setup, "The trainees participate from the start of the training phase. They are Capellan personnel temporarily controlled by the Roughriders player; the actual Roughriders mercenary force has not yet entered.", "Legion Trainers field a force equal in BV/PV to the trainee roster. Energy weapons are dialed down, ammunition-based weapons use paint rounds, and damage is tracked as though the weapons operate at full power."],
  setupDetails: [...tigressBattlefield.wooded, "The actual Roughriders Recon force equals the combined BV/PV of Legion Trainers and the trainee roster. It enters 1D6 − 2 turns into the scenario, with a minimum of two turns; resolve the roll externally.", "At arrival, use the manual phase control. The Roughriders enter from the trainees’ original home edge; existing units remain in position, home edges remain unchanged, and no redeployment occurs."],
  special: [...TRACKS.find(track => track.id === "meeting-engagement").special.filter(item => !item.startsWith("Track End:")), "The scheduled arrival changes this same tactical track to Recon. Meeting Engagement’s normal ending conditions do not end overall Track 1 before that arrival; do not resolve the training phase as a separate contract track.", "Training-phase salvage remains unavailable under the inherited Meeting Engagement rule.", ...tigressCommonSpecialRules],
  commandComplications: TIGRESS_COMMAND_COMPLICATIONS, referenceTables: [TIGRESS_WOODED_MAPSHEETS], tacticalSupport: TIGRESS_TRAINEE_SUPPORT, temporaryHires: TIGRESS_TEMPORARY_HIRES,
  temporaryHireNote: "Joachim Vierziger follows the general Temporary Hire eligibility rule on p. 29. Hiring administration remains outside the browser.",
  sourceRefs: ["Tigress training pp. 116–119", "Meeting Engagement pp. 170–171", "Wooded terrain pp. 151, 154–156", "Temporary Hires p. 29", "Command Complications pp. 30, 118", "Current Draconis Reach master errata"]
};

const tigressTrack1ReconVariant = {
  page: 118, displayName: "Training Mission · Recon Phase", type: "Tigress Track 1 · Recon phase",
  summary: "The actual Roughriders have arrived. Roughriders Recon is Attacker; Legion Trainers plus the transferred trainees is Defender on the unchanged Wooded battlefield.",
  setup: ["Continue on the existing Wooded battlefield. Existing units remain in position, home edges remain unchanged, and no unit redeploys.", "Actual Roughriders enter from the trainees’ original home edge 1D6 − 2 turns into the overall scenario, minimum two turns. Their force equals the combined BV/PV of Legion Trainers and the trainees."],
  setupDetails: [...tigressBattlefield.wooded, "Do not apply Recon’s ordinary initial deployment procedure to units already participating in the training mission."],
  objectiveOverrides: {
    "orders-defender": { text: "At least half of the Defender’s units by number, excluding assets, remain on the battlefield and survive (are not destroyed) the first two Recon turns." },
    "observe-report": { text: "At least 50 percent of the Attacker’s starting force by BV/PV, including assets, survives and exits its home edge anytime after four Recon turns." },
    "deny": { text: "Any Attacker objectives not met by the end of Recon Turn 8 are counted for the Defender instead. Defender units withdrawing from their home edge before Recon Turn 8 count as Scanned and Destroyed for objective purposes. The printed Deny values are 50/100/200/300." }
  },
  special: [...TRACKS.find(track => track.id === "recon").special.filter(item => !item.startsWith("Track End:")), "At transition, erase simulated damage sustained by Legion Trainers and trainees and transfer trainee control to Legion Trainers. Their energy weapons return to full power on the following turn.", "Legion Trainers’ and trainees’ ammunition-based weapons are unusable. Their ammunition does not explode when a normally explosive slot receives a critical hit; Gauss weapons remain an exception. These restrictions do not apply to the newly arrived Roughriders.", "Start a new Recon turn counter at Recon Turn 1 when the actual Roughriders arrive. Training turns do not consume Recon’s eight turns. Recon ends after the End Phase of Recon Turn 8 or any earlier Recon ending condition.", "Legion Trainers retain their training-phase VP as a separate contribution. Trainee-earned VP under Roughriders player control does not carry forward.", "A completed Legion Trainers training objective counts toward their Track 1 objective-completion prerequisite. Roughriders must complete a Recon objective. The qualifying side must also finish with more total VP; a tie means neither side successfully completes Track 1.", ...tigressCommonSpecialRules],
  commandComplications: TIGRESS_COMMAND_COMPLICATIONS, referenceTables: [TIGRESS_WOODED_MAPSHEETS], tacticalSupport: TIGRESS_TRAINEE_SUPPORT, temporaryHires: TIGRESS_TEMPORARY_HIRES, provisionalRules: TIGRESS_PROVISIONAL_RULES,
  temporaryHireNote: "Joachim Vierziger follows the general Temporary Hire eligibility rule on p. 29. Hiring administration remains outside the browser.",
  sourceRefs: ["Tigress transition pp. 118–119", "Recon p. 174", "Shared Scanning pp. 167–168", "Wooded terrain pp. 151, 154–156", "Temporary Hires p. 29", "Command Complications pp. 30, 118", "Current Draconis Reach master errata"]
};

const tigressTrack2Variant = {
  page: 119, displayName: "Tigress Meeting Engagement", type: "Tigress Track 2",
  summary: "Track 2 is a Meeting Engagement using surviving elements from Track 1, with Captain Sutera Galindo joining Roughriders Recon.",
  setup: [...TRACKS.find(track => track.id === "meeting-engagement").setup],
  setupDetails: ["One side consists of remaining Legion Trainers and surviving trainees; the other consists of remaining actual Roughriders Recon elements.", ...tigressBattlefield.hills],
  special: [...TRACKS.find(track => track.id === "meeting-engagement").special, "All ammunition-based weapons on the Legion Trainers side use live ammunition. Both sides repair armor damage and replenish ammunition, but internal structure damage and critical hits remain from Track 1.", "No Track 1 VP carries into Track 2.", ...tigressCommonSpecialRules],
  commandComplications: TIGRESS_COMMAND_COMPLICATIONS, referenceTables: [TIGRESS_HILLS_MAPSHEETS], tacticalSupport: TIGRESS_SUTERA_SUPPORT, temporaryHires: TIGRESS_TEMPORARY_HIRES, provisionalRules: [TIGRESS_PROVISIONAL_RULES[0]],
  temporaryHireNote: "Joachim Vierziger follows the general Temporary Hire eligibility rule on p. 29. Hiring administration remains outside the browser.",
  sourceRefs: ["Tigress Track 2 pp. 116–119", "Meeting Engagement pp. 170–171", "Campaign Pilot Card p. 162", "Hills terrain pp. 150, 154–156", "Temporary Hires p. 29", "Command Complications pp. 30, 118", "Current Draconis Reach master errata"]
};

const xhosaCommandComplications = {
  ref: "Draconis Reach pp. 30, 123",
  note: "Official campaign procedure: after the mapsheets are determined, each player rolls 1D6 to determine possible complications. Add 1 for Liaison Command, 2 for House Command, or 3 for Integrated Command. The browser displays the complete table without selecting or applying a complication automatically.",
  rows: [
    { roll: "1–3", name: "No Complication", text: "No effect." },
    { roll: "4", name: "Heavy snowfall", text: "Your forces must fight following a heavy snowfall before they can be properly prepped for the conditions. Reduce running speed by 1 MP (for Alpha Strike, reduce movement by 2 inches and TMM by 1), and halve the MP of Battlefield Support units." },
    { roll: "5", name: "Active geothermal activity", text: "Steam from active geothermal activity causes havoc with sensors and energy weapons not properly calibrated to the conditions. Apply a +1 target number modifier to pulse and direct-fire energy weapons. For Alpha Strike, any unit with the ENE special ability receives the +1 target number modifier. Your opponent does not suffer these penalties unless they also roll this complication." },
    { roll: "6", name: "Equipment malfunctions", text: "Harsh conditions result in major equipment malfunctions. Reduce the damage of all Battlefield Support Strikes by half, rounding down." },
    { roll: "7", name: "Freezing Blizzard", text: "Your employer considers the blizzard of the century to be the best time to attack, ordering you into the field early. Increased heat dissipation applies to both sides; the range modification applies only to the player who rolled this complication. If both sides roll this complication, both sides receive the heat dissipation (not doubled) and both sides receive the range modification. BattleTech: units dissipate an extra 4 points of heat each turn. For your attacks only, double ranges when determining range modifiers—for example, a target 4 hexes away is treated as though it were 8 hexes away for range modifiers only. Damage and any other modifiers still use the unmodified range. Alpha Strike: units dissipate 1 heat from the heat scale each turn. For your attacks only, double ranges when determining range modifiers—for example, a target at range 4 inches is treated as if it were 8 inches away for a +2 target number modifier from medium range. Damage values use the actual range, so a unit with only 2/-/- attacking a target 4 inches away receives the medium-range modifier but may still attack with its short-range damage of 2." },
    { roll: "8+", name: "Roll Twice", text: "Roll twice and apply both effects. Do not reroll No Complication, but reroll any other duplicate effects." }
  ]
};

const xhosaMapsheetTable = [
  "Official mapsheet table for every Operation Cold Relief track: roll 1D6. Results 1–2: Woodland (MP: Grasslands); for Alpha Strike, Woods.",
  "Result 3–4: Scattered Woods (MP: Grasslands); for Alpha Strike, Woods. Result 5: Desert #3 (AGOAC); for Alpha Strike, Woods. Result 6: Badlands #1 (MP: Deserts); for Alpha Strike, Hills, Frozen Solid Ice."
];

const xhosaCommonSpecialRules = [
  "Victory — official source rule: the winner of the final track is the victor of Operation Cold Relief.",
  "Temporary Hire — official source rule: the first time a mercenary force is unable to field a force of at least two-thirds of the maximum permissible BV/PV for its next track, a local mercenary offers their services. The player may choose for each track whether to pay the local mercenary to participate.",
  "The Twins — official source rule: Avery pilots a Wasp WSP-5A (517 BV / 17 PV) with two Edge tokens, Piloting 5 and Gunnery 4 (Skill 4); Morgan pilots a Stinger STG-6G (503 BV / 18 PV) with two Edge tokens, Piloting 5 and Gunnery 4 (Skill 4). They must be hired and fielded together and charge 50 Support Points per track they participate in. If one is killed during a track, the other becomes unstable and goes on a rampage during downtime, causing 200 Support Points worth of damage before being brought down. If both survive to the end, they sign on permanently and are added to the player’s forces for free.",
  "Purchase Options — official source rule: at the end of each track, roll 2D6. On a 9+, one ’Mech is for sale, always a Wasp or Stinger variant of the player’s choice; on an 11+, one ’Mech is available from either the Federated Suns or Draconis Combine list based on the contract employer. If at least one ’Mech is for sale, the player may purchase any vehicle or infantry from the same House’s Tanker and Battle Armor Options Tables, up to two purchases of each per month.",
  "Contract transition — official source rule: after the final track, the forces settle into a stalemate. Mercenaries have fulfilled their contracts and may leave or renegotiate new contracts using the Random Contracts rules; any renegotiated contracts are automatically Retainer contracts."
];

function xhosaVariant(trackId, extra = {}) {
  const base = TRACKS.find(track => track.id === trackId);
  const objectives = extra.objectives || base?.objectives;
  return {
    page: extra.page || 122,
    displayName: extra.displayName,
    summary: extra.summary,
    setupDetails: [...xhosaMapsheetTable, ...(extra.setupDetails || [])],
    objectives,
    special: [...(base?.special || []), ...xhosaCommonSpecialRules, ...(extra.special || [])],
    commandComplications: xhosaCommandComplications,
    sourceRefs: ["Draconis Reach pp. 122–123", "Command complications procedure p. 30", "Current Draconis Reach master errata"]
  };

}

const xhosaTrack2Base = TRACKS.find(track => track.id === "breakthrough");
const xhosaTrack2Objectives = [
  ...xhosaTrack2Base.objectives,
  {
    id: "supply-trucks-exit",
    name: "Supply Trucks Through",
    side: A,
    vp: 50,
    repeatable: true,
    text: "Each of the four MASH vehicles representing the logistics trucks that successfully exits its home edge."
  },
  {
    id: "stop-supply-trucks",
    name: "Stop the Supply Trucks",
    side: D,
    vp: 50,
    repeatable: true,
    text: "Each of the four MASH vehicles destroyed, crippled, or otherwise prevented from exiting its home edge."
  }
];

const xhosaTrack1Variant = xhosaVariant("recon", {
  displayName: "Operation Cold Relief · Reconnaissance",
  summary: "Track 1 is a standard Recon mission representing the Federated Suns relief force reconnoitering the new arrivals.",
  setupDetails: [
    "Official mission sequence: in the first month, both forces arrive and land within support range of the ongoing siege. Play this as a standard Recon track with the Federated Suns as Attacker and the Draconis Combine as Defender."
  ]
});

const xhosaTrack2Variant = xhosaVariant("breakthrough", {
  displayName: "Operation Cold Relief · Supply Breakthrough",
  summary: "Track 2 is a standard Breakthrough mission with four logistics trucks carrying relief supplies for the Federated Suns force.",
  objectives: xhosaTrack2Objectives,
  setupDetails: [
    "Official mission sequence: in the second month, supplies must be delivered. Play this as a Breakthrough with the Federated Suns as Attacker and the Draconis Combine as Defender.",
    "The Federated Suns receives four MASH vehicles to represent logistics trucks. These vehicles lack the MASH special ability.",
    "The Federated Suns receives 50 VP for each logistics truck that successfully exits its home edge. The Draconis Combine receives 50 VP for each logistics truck destroyed, crippled, or otherwise prevented from exiting its home edge.",
    "Track 2 result: if at least two of the four supply trucks pass through the Breakthrough, select Federated Suns as the Track 2 winner for Track 3; otherwise select Draconis Combine. The browser records this source-defined result through the Track 3 winner selector rather than inferring it automatically."
  ]
});

const xhosaTrack3AssaultVariant = xhosaVariant("assault", {
  displayName: "Operation Cold Relief · Counterattack",
  summary: "If at least 50 percent of the supply trucks passed through the Breakthrough, the Federated Suns attacks in a standard Assault track.",
  setupDetails: [
    "Official mission sequence: if 50 percent or more of the supply trucks passed through the Breakthrough, the Federated Suns won Track 2 and is the Attacker in an Assault track. The supplies and new arrivals give them an opportunity to mass and counterattack the Draconis Combine."
  ]
});

const xhosaTrack3StrikeVariant = xhosaVariant("strike", {
  page: 123,
  displayName: "Operation Cold Relief · Strike",
  summary: "If less than 50 percent of the supply trucks passed through the Breakthrough, the Draconis Combine attacks in a standard Strike track.",
  setupDetails: [
    "Official mission sequence: if less than 50 percent of the supply trucks passed through the Breakthrough, the Draconis Combine won Track 2 and is the Attacker in a Strike track. The time is right to make an assault on the Federated Suns headquarters."
  ]
});

const actOfPiracyCommandComplications = {
  ref: "Draconis Reach pp. 30, 126",
  note: "Official contract procedure: roll this table once for the track, not once per player. The browser displays the complete table without selecting or applying a complication automatically.",
  rows: [
    { roll: "1–3", name: "No Complication", text: "No effect." },
    { roll: "4", name: "Minefield", text: "Each player may place two Minefield Supports within 3 hexes (AS: 5 inches) of the map’s center line. See p. 56, AS:CE; p. 79, BMM; or the BattleTech: Mercenaries box set." },
    { roll: "5", name: "Meeting in the field", text: "The two forces encounter each other. Only half of each player’s units, rounded up, may deploy on Turn 1. The remainder may enter the map on Turn 2." },
    { roll: "6", name: "Torrential downpour", text: "Torrential rain turns all clear, Depth 0 water hexes into mud. If there are fewer than six clear, Depth 0 water hexes, each player may select three hexes to reach at least six mud hexes. For Alpha Strike, the opposing player may place two 6-inch AOE mud terrain templates. Mud: a hex covered in mud adds +1 MP cost per hex; entering a mud hex forces a Piloting Skill Roll; all PSRs made in a mud hex, including the entering roll, receive a +1 target number modifier. For Alpha Strike, any unit moving through mud may bog down; see p. 60, AS:CE." }
  ]
};

const actOfPiracySystemTable = [
  "System result 1 — Beaumont (Savannah): loot is Agricultural Machinery; use the Federated Suns opposing force table; no special conditions.",
  "System result 2 — De Berry (Grassland): loot is Mining Machinery; use the Mercenary opposing force table. Ice: all water and all Level 1+ hexes are covered in ice. Piloting or driving Skill checks made while on an ice hex receive a +4 target number modifier. For Alpha Strike, all terrain features cost an additional +1 MP per inch from ice.",
  "System result 3 — Tancredi IV (Urban): loot is Laser Weapons; use the Draconis Combine opposing force table. Lasers: the raiding player may take some or all payment from the Piracy Payment Table for this raid as repair-only funds; double those Support Points and keep them in a separate repair pool.",
  "System result 4 — Mirach (Mountains): loot is Ores; use the Mercenary opposing force table. Low Gravity: all units have +1 Walking/Cruising MP. For Alpha Strike, all units have +2 inches MV.",
  "System result 5 — Johnsondale (Urban): loot is Combat Vehicles; use the Federated Suns opposing force table. Salvage choice: when this track is rolled, the raiding player chooses whether to capture completed vehicles or only components. If only components are chosen, there are no special conditions. If vehicles are chosen, each objective component is a shutdown Striker Light Tank, the Law player receives two free Striker Light Tanks per Scale, and captured Strikers join the capturing player’s force after the contract instead of being sold as standard components. If using BSP, each component retrieved gives one free Striker Light Tank for one track use, up to one Striker per Scale per track.",
  "System result 6 — Hazelhurst (Hills): loot is Casks of Wine; use the Raven Alliance opposing force table. Units carrying the raid objective may not move more than half their MV or 8 inches, whichever is slower, without destroying the cargo."
];

const actOfPiracySystemRollOptions = [
  { value: "1", label: "1 · Beaumont (Savannah)" },
  { value: "2", label: "2 · De Berry (Grassland)" },
  { value: "3", label: "3 · Tancredi IV (Urban)" },
  { value: "4", label: "4 · Mirach (Mountains)" },
  { value: "5", label: "5 · Johnsondale (Urban)" },
  { value: "6", label: "6 · Hazelhurst (Hills)" }
];

const actOfPiracyVariant = {
  page: 124,
  displayName: "Act of Piracy · Objective Raid",
  type: "Opposing Contract",
  summary: "A one-track piracy contract using the standard Objective Raid mission. Pirates always attack while the Law protects a randomly selected system or controls a generated local militia force.",
  setup: [
    ...TRACKS.find(track => track.id === "objective-raid").setup,
    "Pirates are always the Attacker; the Law is always the Defender."
  ],
  setupDetails: [
    "Official contract sequence: both sides are player-controlled mercenaries. The first month is travel; the second month is the single Objective Raid track; the third month is travel while the Pirates sell their goods or escape and the Law repairs its position.",
    "The Law rolls 1D6 to determine which system it is protecting. The Pirates then roll 1D6 to determine which system is attacked and the special conditions. If the Pirates attack the system the Law is garrisoning, the two mercenaries battle each other. Otherwise, the Law controls a generated local militia garrison force; the system result determines its faction. See the Opposing Force Tables on p. 186.",
    "If the Law player controls a generated opposing force, that player receives one-half Base Pay as a bonus, cannot receive salvage from this track, and does not take damage or risk units. The browser records this source rule but does not generate the militia force or campaign payment automatically.",
    "System, loot, opposing force, and condition table:",
    ...actOfPiracySystemTable,
    "Piracy Goods & Components Table: roll 1D6. Goods acquired / payment per component: 1 — None / 250 SP; 2 — 375 SP / 300 SP; 3 — 750 SP / 400 SP; 4 — 1,250 SP / 500 SP; 5 — 1,500 SP / 550 SP; 6 — 1,650 SP / 600 SP; 7 — no goods entry / 650 SP. The goods payment is multiplied by contract Scale. Add 1 to the Piracy Component Table roll if the track takes place on Tancredi IV or Mirach."
  ],
  sourceRolls: [
    {
      id: "law-protected-system",
      label: "Law’s protected system roll",
      options: actOfPiracySystemRollOptions,
      note: "The Law rolls 1D6 to determine which system it is protecting."
    },
    {
      id: "pirates-attacked-system",
      label: "Pirates’ attacked system roll",
      options: actOfPiracySystemRollOptions,
      note: "The Pirates roll 1D6 to determine which system is attacked and which system conditions apply."
    }
  ],
  scaleNotesByScale: {
    "1": ["Piracy Goods Table payment is multiplied by contract Scale 1. Johnsondale provides two free Striker Light Tanks to the Law per the source rule."],
    "2": ["Piracy Goods Table payment is multiplied by contract Scale 2. Johnsondale provides four free Striker Light Tanks to the Law per the source rule."],
    "3": ["Piracy Goods Table payment is multiplied by contract Scale 3. Johnsondale provides six free Striker Light Tanks to the Law per the source rule."]
  },
  special: [
    ...TRACKS.find(track => track.id === "objective-raid").special,
    "Victory — official source rule: if either player successfully completes the track, that player wins the contract.",
    "Piracy — official source rule: piracy contract terms cannot be negotiated. There is no employer, combat bonus, or Base Pay. The Pirates pay transportation and maintenance themselves and may go into the red for those costs without taking on debt until the contract ends. Each completed act of piracy has a chance of lowering Pirate Reputation; see p. 25.",
    "Piracy payment — official source rule: after the contract, make two payment rolls. The first roll on the Piracy Goods Table determines goods from undefended raids, paid per contract Scale regardless of track results. The second roll on the Piracy Component Table determines payment for each component pirated during the contract. After payment, a negative warchest becomes debt; see p. 36.",
    "Purchase Options — official source rule: neither employer has ’Mechs available. Each month, roll 2D6; on a 7+ one ’Mech is for sale, and on an 11+ two are for sale. If a ’Mech is available, roll on the Sea Fox Purchase Options Table on p. 176. The browser displays these campaign rules without performing purchases or bookkeeping.",
    "Law opposing-force exception — official source rule: when the Law controls a generated local militia force, the Law player receives half Base Pay, cannot claim salvage, and does not carry damage or unit risk from the track."
  ],
  commandComplications: actOfPiracyCommandComplications,
  sourceRefs: ["Draconis Reach pp. 124–126", "Objective Raid p. 171", "Command complications procedure p. 30", "Opposing Force Tables p. 186", "Piracy rules pp. 25, 36, 176", "Current Draconis Reach master errata"]
};

const malloryCampaignSetupDetails = [
  "Battlefield size: normally use one mapsheet (Alpha Strike: 36 × 48 inches) for a battle between single formations. For a larger battle involving multiple formations on each side, add a second mapsheet rolled from the Savannah Terrain table on p. 151.",
  "Strategic roles: the formation moving into the enemy-occupied hex initiates the engagement; the formation holding the attacked hex defends it. Select the initiating military side above for this engagement.",
  "Pre-battle withdrawal: if the defending formation has not yet moved this strategic map turn, it may withdraw one hex to the adjacent unoccupied hex closest to its base and abandon the attacked hex instead of fighting. The browser loads a tactical track only when the Defender does not take that option.",
  "Multiple engagements: a formation may attack, be attacked, or be counterattacked more than once during a strategic map turn. Units may therefore enter several tactical battles without time to repair between them. This browser does not track that carried damage."
];

const malloryCampaignTacticalRules = [
  "Preserve the Island: no more than 21 BSP (Alpha Strike: 5 BSP) may be spent on Battlefield Support: Strikes choices in this combat track.",
  "Forced Withdrawal is not in effect. A unit may voluntarily retreat through its own home edge; remove it from combat and from the track’s unit totals. Damage suffered before retreat still requires repair normally.",
  "Command Complications: none are used during the Loneliness Island campaign.",
  "Combat Pay: players do not receive the standard Combat Pay for successfully completing these tactical tracks. The employers instead pay for claimed strategic hexes; this browser shows relevant payments as reference information only.",
  "Campaign bookkeeping boundary: hex ownership, payments, purchases, repairs, strategic movement, and campaign victory remain source-reference information. This tactical browser does not determine eligibility or award those benefits automatically."
];

const malloryVariant = (trackId, configuration) => {
  const baseTrack = TRACKS.find(track => track.id === trackId);
  return {
    page: baseTrack.page,
    displayName: configuration.displayName,
    type: "Loneliness Island Hex Battle",
    summary: configuration.summary,
    setup: configuration.useCampaignBattlefieldSize ? baseTrack.setup.slice(1) : [...baseTrack.setup],
    scaleNotes: configuration.useCampaignBattlefieldSize ? [] : [...(baseTrack.scaleNotes || [])],
    setupDetails: [...(baseTrack.setupDetails || []), ...configuration.setupDetails, ...malloryCampaignSetupDetails],
    objectives: baseTrack.objectives,
    special: [...baseTrack.special, ...(configuration.special || []), ...malloryCampaignTacticalRules],
    sourceRefs: ["Draconis Reach pp. 135–139", configuration.trackReference, "Current Draconis Reach master errata"]
  };
};

const malloryRoleChoice = {
  roleChoice: true,
  roleChoiceLabel: "Strategic attacking formation",
  roleChoiceHint: "Choose the contract side whose formation moved into the enemy-occupied hex. It uses the tactical Attacker role; the side holding the hex uses Defender."
};

const malloryHexTrack = (sequence, label, trackId, variant, extra = {}) => fixedHotSpotTrack(
  sequence,
  trackId,
  "dragon-banner",
  "sword-sunburst",
  { label, variant, ...malloryRoleChoice, ...extra }
);

const malloryEmptyVariant = malloryVariant("recon", {
  displayName: "Empty Hexes · Recon",
  summary: "A Recon skirmish in an otherwise unnamed Loneliness Island hex.",
  setupDetails: [
    "Strategic hex type: Empty Hexes. Bonus: none.",
    "Terrain: Savannah. Use one of River Delta/Drainage Basin #2 (Map Pack: Savannah), Mountain Lake (Map Pack: Savannah), or Sinkhole 1 (Map Pack: Savannah)."
  ],
  trackReference: "Recon p. 174"
});

const malloryOperatingBaseVariant = malloryVariant("retreat", {
  displayName: "Operating Base / Landing Zone · Retreat",
  summary: "A Retreat battle at an enemy operating base, where the defender may recall a formation to protect the command center.",
  setupDetails: [
    "Strategic hexes: 0601, 0614, 0106, 1110, 0512, and 0803.",
    "Terrain: Urban. Use City Ruins (Map Pack: Savannah). The Defender arranges eight building tokens on paved hexes.",
    "Defensive recall: the defending player may immediately recall one formation of their choice to defend the base, even if that formation has already moved during the strategic map turn."
  ],
  special: [
    "Ownership-dependent campaign benefit: capturing the enemy HQ by winning this track ends the Loneliness Island campaign. Displayed for reference only; the browser does not resolve campaign victory."
  ],
  useCampaignBattlefieldSize: true,
  trackReference: "Retreat pp. 174–175"
});

const malloryAgroMechVariant = malloryVariant("defend", {
  displayName: "AgroMech Repair Facilities · Defend",
  summary: "A Defend battle around the island’s AgroMech repair gantries.",
  setupDetails: [
    "Strategic hexes: 0306 and 0808.",
    "Terrain: Urban. Use CityTech (Map Pack: Savannah). Players alternate placing six building tokens."
  ],
  special: [
    "Ownership-dependent campaign benefit: contract Support improves by 40 percent for each facility held—from Straight / 40 percent to Straight / 80 percent, then Straight / 100 percent. Do not apply automatically."
  ],
  trackReference: "Defend p. 169"
});

const malloryDefensivePositionVariant = malloryVariant("assault", {
  displayName: "Defensive Position · Assault",
  summary: "An Assault against a natural chokepoint that can draw nearby unmoved formations into its garrison.",
  setupDetails: [
    "Strategic hexes: 0307, 0312, 0505, 0510, 0910, and 1004. Payment: 100 SP per strategic map turn while held; reference only.",
    "Terrain: Grasslands. Use BattleTech (Map Pack: Savannah) or a mapsheet chosen by the Defender from Map Pack: Grasslands.",
    "Alpha Strike terrain adjustment: after the battlefield is set up, the Defender selects their home edge and may move four terrain pieces up to 6 inches.",
    "Defensive Garrison: a formation posted in an unoccupied Defensive Position hex defends it when attacked. It may request reinforcements from any friendly formations within movement range that have not moved this strategic map turn. Those formations immediately enter the attacked hex, join the Defenders, merge for this track, and count as moved after the attack is resolved."
  ],
  trackReference: "Assault p. 168"
});

const malloryIrrigationVariant = malloryVariant("pushback", {
  displayName: "Irrigation Control · Pushback",
  summary: "A Pushback battle in wetlands surrounding the island’s automated irrigation controls.",
  setupDetails: [
    "Strategic hex: 0303.",
    "Terrain: Wetlands with one building at least 4 inches wide in the center. Use Wide River (Map Pack: Savannah) and place a large building token in the center of the mapsheet."
  ],
  special: [
    "Ownership-dependent tactical benefit: in one battle per strategic map turn, the eligible controlling player may designate 10 contiguous hexes as Depth 1 water. In Alpha Strike, place one river 3 inches wide and 12 inches long. Single rubble counters from Map Pack: City may mark water. Do not apply unless control and once-per-turn eligibility are established.",
    "Ownership-dependent campaign benefit: controlling Irrigation Control increases SP received from cities by 50 percent and directly offsets the penalty from choosing a BPWW Landing Zone. Reference only."
  ],
  trackReference: "Pushback p. 173"
});

const malloryBpwwVariant = malloryVariant("meeting-engagement", {
  displayName: "BPWW Facilities · Meeting Engagement",
  summary: "A Meeting Engagement at the Brotherhood’s wetland dock and logistics facilities.",
  setupDetails: [
    "Strategic hex: 1106.",
    "Terrain: Wetlands plus four small buildings within 2 inches of each other and touching water. Use Large Lakes #1 (Map Pack: Savannah); the Defender places building tokens on lake hexes to form a dock facility."
  ],
  special: [
    "Ownership-dependent campaign benefit: BattleMech purchases require a held BPWW hex. The central BPWW facilities add a 10 percent purchase premium; Landing Zone BPWW facilities use the source’s randomly determined premium. Purchased units arrive at the Landing Zone under the source formation rules. Reference only."
  ],
  trackReference: "Meeting Engagement pp. 170–171"
});

const malloryBoshiGumiVariant = malloryVariant("strike", {
  displayName: "Boshi-gumi Yakuza Operating Bases · Strike",
  summary: "A Strike mission against a Boshi-gumi smuggling base in an urban business district.",
  setupDetails: [
    "Strategic hexes: 0310 and 0907. Payment: 200 SP per strategic map turn while held; reference only.",
    "Terrain: Urban. Use Business District (Map Pack: City)."
  ],
  special: [
    "Ownership-dependent campaign benefit: holding a yakuza operating base permits recruitment of Gunnery 4 / Piloting 5 MechWarriors (Alpha Strike: Skill 4). Do not apply automatically."
  ],
  trackReference: "Strike p. 175"
});

const malloryCityVariant = malloryVariant("pursuit", {
  displayName: "City Hexes · Pursuit (Roles Reversed)",
  summary: "A Pursuit through Melancholia or Leamington with the standard scenario’s Attacker and Defender roles reversed.",
  setupDetails: [
    "Strategic hexes: 0209 and 1006. Payment: 500 SP per strategic map turn while held; reference only.",
    "Terrain: Urban. Use Plaza (Map Pack: City) or Roundabout (Map Pack: City).",
    "Role reversal: the side whose formation initiated the strategic engagement uses the Pursuit Defender role. The side whose formation held the city uses the Pursuit Attacker role. Objective ownership, deployment labels, and VP columns follow those reversed tactical roles."
  ],
  special: [
    "Ownership-dependent tactical benefit: the eligible city holder receives an additional 21 BSP that may be spent on Infantry Battlefield Support units in each engagement. In Alpha Strike, use two Mechanized Hover Platoons (Flamer). Do not add this support unless ownership establishes eligibility."
  ],
  useCampaignBattlefieldSize: true,
  trackReference: "Pursuit p. 172"
});

const malloryManufacturingVariant = malloryVariant("objective-raid", {
  displayName: "Manufacturing Plant · Objective Raid",
  summary: "An Objective Raid at the island’s civilian vehicle and prefab manufacturing plant.",
  setupDetails: [
    "Strategic hex: 0309.",
    "Terrain: Urban. Use HPG Heliport (Map Pack: City)."
  ],
  special: [
    "Ownership-dependent tactical benefit: the eligible plant holder receives an additional 24 BSP that may be used to purchase vehicles or emplacements in each engagement. In Alpha Strike, use two Flatbed Trucks (SRM) and two medium emplacements. Do not add this support unless ownership establishes eligibility."
  ],
  trackReference: "Objective Raid p. 171"
});

const malloryCommunicationVariant = malloryVariant("objective-raid", {
  displayName: "Communication Array · Objective Raid",
  summary: "An Objective Raid against the uplink connecting Loneliness Island to the planetary communications network.",
  setupDetails: [
    "Strategic hex: 0607. Payment: 400 SP per strategic map turn while held; reference only.",
    "Terrain: Urban. Use HPG Offices (Map Pack: City)."
  ],
  trackReference: "Objective Raid p. 171"
});

const malloryBiotechVariant = malloryVariant("breakthrough", {
  displayName: "Biotech Research Centre · Breakthrough",
  summary: "A Breakthrough battle around FABL’s field-hospital-capable biotech research centre.",
  setupDetails: [
    "Strategic hex: 0707. Payment: 200 SP per strategic map turn while held; reference only.",
    "Terrain: Light Urban. Use CityTech (Map Pack: Savannah). Players alternate placing six large building tokens."
  ],
  special: [
    "Ownership-dependent campaign benefit: all wounded MechWarriors belonging to the holder heal one additional injury per strategic map turn. Do not apply automatically."
  ],
  trackReference: "Breakthrough pp. 168–169"
});

const malloryShippingPortVariant = malloryVariant("flank", {
  displayName: "Shipping Port · Flank",
  summary: "A Flank battle among the buildings and waterways of Loneliness Island’s western shipping port.",
  setupDetails: [
    "Strategic hex: 0109.",
    "Terrain: Wetlands plus two small and two medium buildings within 4 inches of each other, with at least two buildings within 2 inches of water. Use River Delta/Drainage Basin #1 (Map Pack: Savannah) and arrange the building tokens to resemble a port."
  ],
  special: [
    "Ownership-dependent campaign benefit: holding the shipping port cancels the effects of one BPWW hex held by the opponent and permits hiring new Gunnery 6 / Piloting 6 MechWarriors (Alpha Strike: Skill 6). Do not apply automatically."
  ],
  trackReference: "Flank pp. 170–171"
});

const malloryTrainingVariant = malloryVariant("pushback", {
  displayName: "Training Simulators · Pushback",
  summary: "A Pushback battle at the RSIS research facility’s advanced training simulator.",
  setupDetails: [
    "Strategic hex: 0508. Payment: 200 SP per strategic map turn while held; reference only.",
    "Terrain: Light Urban. Use Park District (Map Pack: City)."
  ],
  special: [
    "Ownership-dependent campaign benefit: holding the simulator hex doubles the SP that can be assigned to Named Pilots during each strategic map turn. Do not apply automatically."
  ],
  trackReference: "Pushback p. 173"
});

const malloryRestrictedFacility = {
  nonPlayable: true,
  displayName: "RSIS/FABL Research Facility",
  summary: "The protected research facility is a restricted strategic hex and does not generate a tactical track.",
  setupDetails: [
    "Strategic hex: 0507.",
    "No formations may enter this hex. The RSIS team is willing and able to destroy the facility if it is threatened."
  ],
  special: [
    "No tactical scenario, objectives, VP, or track-end procedure applies to this selection.",
    "The browser displays the restriction only; it does not track strategic movement or facility status."
  ],
  sourceRefs: ["Draconis Reach p. 139", "Current Draconis Reach master errata"]
};

export const ALTA_VISTA_PROVISIONAL_RULES = [
  "Leaving with cargo ends progression but is not Raven contract victory; Ravens must win Retreat.",
  "Escobar and Ravens contract victories are evaluated independently, except where the source imposes no victor.",
  "A successful Withdrawal Order is a successful track completion, distinct from tactical victory; prohibited Retreat is not declined Retreat.",
  "Escobar’s required completions use the Meeting Engagements actually played: 1 of 1, 1 of 2, or 2 of 3."
];

export const ALTA_VISTA_MUTUAL_WITHDRAWAL_CLARIFICATION = "When both players leave under Withdrawal Order, the contract continues normally with the next Meeting Engagement if one remains.";

export const ALTA_VISTA_COMMAND_COMPLICATIONS = {
  note: "Resolve complications for Escobar only, then select every resulting effect below. Escobar rolls once for Liaison Command, twice for House Command, or three times for Integrated Command; reroll duplicate results of 4, 5, or 6.",
  rows: [
    { roll: "1–2", name: "No Complication", text: "No additional effect." },
    { roll: "3", name: "Minefields", text: "Each player may select up to 20 BSP of Minefield assets per Scale. All minefields must be visible and placed within or adjacent to a building. A minefield detonation inside or adjacent to a building automatically damages that building." },
    { roll: "4", name: "Late Arrivals", text: "Half of each player’s units by number, rounded up, are delayed. Those units enter from their own home edge during the Movement Phase of Turn 2." },
    { roll: "5", name: "Glare", text: "A ranged attack receives a +1 Target Number modifier when the attacker’s line of sight passes within 1 hex (Alpha Strike: 2 inches) of a building, or when the target is within that distance of a building." },
    { roll: "6", name: "Withdrawal Order", text: "Beginning in the End Phase of BattleTech Turn 3 (Alpha Strike Turn 2), roll 2D6. The order triggers on 4 or less, increasing the target number by 1 each subsequent turn. Escobar then orders all participants off the battlefield immediately. Record each player’s current response below; Retreat is prohibited for every response to this order." }
  ],
  ref: "Draconis Reach pp. 80–81"
};

const altaMeetingBase = TRACKS.find(track => track.id === "meeting-engagement");
const altaRetreatBase = TRACKS.find(track => track.id === "retreat");

export const altaVistaMeetingVariant = sequence => ({
  page: 80,
  pageRef: "pp. 80–81",
  displayName: "Warehouse Trial " + sequence + " · Meeting Engagement",
  type: "Alta Vista Warehouse Trial",
  summary: "The Ravens attack one of Alta Vista’s three warehouse complexes while Escobar defends it.",
  setupDetails: [
    "Tactical roles: Ravens are the Attacker; Escobar is the Defender.",
    "Terrain: Light Urban. This trial concerns warehouse complex " + sequence + " of the three complexes available in the campaign.",
    "Treat every unlabeled building as Medium, CF 30 and two levels high in BattleTech; CF 4 and 2 inches high in Alpha Strike.",
    "Building preservation bonus: if no buildings are destroyed in this track, Escobar offers 100 Support Points to each side. This campaign payment is separate from tactical Victory Points.",
    "Temporary hire — Raven: War Crow Prime, 2,835 BV / 56 PV, 2 Edge, Piloting 3 / Gunnery 3 (Alpha Strike Skill 3), 200 SP for this track.",
    "Temporary hire — Roland D’Isque: Kintaro KTO-19b, 1,265 BV / 39 PV, 1 Edge, Marksman Edge Ability, Piloting 5 / Gunnery 3 (Alpha Strike Skill 4), 50 SP for this track.",
    "Before each track, either player may pay to hire one available temporary pilot. If one player chooses Raven or Roland D’Isque, the other may hire only the other pilot. Roll 2D6 for priority; high roll chooses first and ties are rerolled."
  ],
  special: [
    ...altaMeetingBase.special,
    "Campaign progression: a normal Raven tactical victory presents the choices to depart with cargo, stop, or seek revenge. Revenge immediately triggers Retreat; the other choices end progression without Raven contract victory. A non-Raven result continues to the next warehouse trial if one remains.",
    "Command Complication 6 separates successful completion from tactical victory. Mutual compliance awards both sides successful completion and Raven tactical victory, prohibits Retreat, and continues to the next warehouse trial when one remains.",
    "Players record building preservation, temporary hires, survivors, and battlefield carryover with their campaign records."
  ],
  commandComplications: ALTA_VISTA_COMMAND_COMPLICATIONS,
  sourceRefs: ["Draconis Reach pp. 78–81", "Meeting Engagement pp. 170–171", "Shared rules pp. 167–168"]
});

export const altaVistaRetreatVariant = () => ({
  page: 174,
  pageRef: "pp. 174–175",
  displayName: "Immediate Revenge · Retreat",
  type: "Alta Vista Conditional Retreat",
  summary: "After a normal Raven warehouse victory, the Ravens pursue Escobar immediately using the surviving forces and battlefield.",
  setup: [
    "Retain the immediately preceding Meeting Engagement’s mapsheets, Light Urban terrain, battlefield alignment, and applicable battlefield carryover.",
    "Escobar remains the Defender and the Ravens remain the Attacker. Escobar selects the same short home edge used in the preceding trial; the Ravens use the opposite short edge.",
    "Only the Raven force surviving the immediately preceding Meeting Engagement participates. It enters from the Raven home edge during the Movement Phase of Turn 2, following the standard Retreat Attacker timing.",
    "Place Escobar’s surviving preceding-track force in the center of the play area before Turn 1. Escobar may add other available units up to the applicable Scale limit; added units enter from the Raven home edge during the Movement Phase of Turn 1, following the standard Retreat Defender timing."
  ],
  setupDetails: [
    "Alta Vista’s surviving-force and center-placement instructions override conflicting standard Retreat deployment instructions.",
    "Only a temporary hire that survived the immediately preceding warehouse trial can carry into Retreat. No fresh temporary hire is available for Retreat.",
    "Use the surviving forces, mapsheets, alignment, terrain, damage, and ammunition state from the immediately preceding warehouse trial."
  ],
  objectives: altaRetreatBase.objectives,
  special: [
    ...altaRetreatBase.special,
    "No Alta Vista Command Complications are rolled during Retreat.",
    "When Retreat concludes, the Alta Vista contract ends."
  ],
  commandComplications: null,
  sourceRefs: ["Draconis Reach pp. 78–81", "Retreat pp. 174–175", "Shared rules pp. 167–168"]
});

const melcherBattlefieldDetails = [
  "BattleTech mapsheets: each simultaneous Scale 1 track uses one roll on Grasslands Table 1.",
  "Alpha Strike battlefield: 48 inches across by 36 inches wide. Each player normally selects eight terrain pieces; Grasslands halves that allowance to four, rounded up. For each of the four removed pieces, that player chooses which normal placement area loses one piece. Preserve the standard placement zones and resolve the chosen reductions at the table.",
  "Contract Scale is 2, but each of the two simultaneous tactical tracks is fixed at Scale 1. A unit or named temporary hire assigned to one track cannot participate in the other."
];

const melcherReferenceTables = [
  { title: "Melcher Mapsheets · Grasslands Table 1 (1D6)", headers: ["Roll", "Mapsheet", "Source"], rows: MELCHER_GRASSLANDS_MAPSHEETS },
  { title: "Black Market AgroMechs (2D6)", headers: ["Roll", "Unit", "BV", "PV"], rows: MELCHER_BLACK_MARKET }
];

function melcherOverlay(trackId, extra = {}) {
  const base = [...TRACKS, ...SPECIAL_TRACKS].find(track => track.id === trackId);
  return {
    ...extra,
    setupDetails: [...(extra.setupDetails || base?.setupDetails || []), ...melcherBattlefieldDetails],
    special: [
      ...(extra.special || base?.special || []),
      "Successful track completion: a player must complete at least one objective and earn more objective VP than the opponent. Equal VP means neither player successfully completes the track. Either contract side wins its contract by successfully completing at least one of the two simultaneous tracks."
    ],
    commandComplications: MELCHER_COMMAND_COMPLICATIONS,
    referenceTables: melcherReferenceTables,
    temporaryHires: MELCHER_TEMPORARY_HIRES,
    temporaryHireNote: "Use these cards after resolving Melcher Temporary Hire availability and charges under Draconis Reach pp. 97–98 and the general rules. A named hire may participate in only one simultaneous track.",
    sourceRefs: ["Draconis Reach pp. 94–98", base?.name + " " + (base?.pageRef || "p. " + base?.page), "Grasslands Table 1 p. 150", "Command complications pp. 30, 96–98", "Current Draconis Reach master errata"]
  };
}

const melcherOxenVariant = melcherOverlay("oxen-intercept", {
  displayName: "Oxen Intercept",
  type: "Melcher custom track"
});

const melcherObjectiveRaidBase = TRACKS.find(track => track.id === "objective-raid");
const melcherObjectiveRaidVariant = melcherOverlay("objective-raid", {
  displayName: "Objective Raid · Scientist Extraction",
  type: "Modified Objective Raid",
  setupDetails: [
    ...(melcherObjectiveRaidBase?.setupDetails || []),
    "Earwigs are the Attacker and Border Collies are the Defender. Add two Heavy Wheeled APCs carrying the scientists. When using Battlefield Support Assets, represent each with a Galleon Light Tank GAL-100 that has no attacks.",
    "Initially, only the two scientist APCs may use Grab the Stuff. If an APC is destroyed, another Attacker unit or asset vehicle acquires its scientists by ending movement adjacent to it (AS: in base contact); mark that unit as eligible to use Grab the Stuff.",
    "All Attacker units are treated as having functioning hands for the purpose of grabbing components. Preserve the remaining standard Objective Raid component, transfer, movement, attack, track-end, and scoring rules."
  ],
  special: [
    ...(melcherObjectiveRaidBase?.special || []),
    "Melcher salvage restriction: Earwigs may not claim enemy salvage. If Border Collies successfully complete the track, apply the general salvage procedure; otherwise each side reclaims its own destroyed or crippled units."
  ]
});

export const NEW_IVAARSEN_LIGHT_URBAN_MAPSHEETS = [
  ["1", "River CommCenter", "MapPack: Grasslands"],
  ["2", "Park District", "MapPack: City"],
  ["3", "Central Park", "MapPack: City"],
  ["4", "AeroBase #1", "MapPack: Deserts"],
  ["5", "AeroBase #2", "MapPack: Deserts"],
  ["6", "Roundabout", "MapPack: City"]
];

export const NEW_IVAARSEN_RYUKEN_SUPPORT = [
  ["1", "Wight WGT-1LAW/SC", "1,142", "29"],
  ["2", "Panther PNT-14R", "1,291", "25"],
  ["3", "Rokurokubi RK-4K", "1,286", "27"],
  ["4", "Phoenix Hawk PXH-7K", "1,241", "35"],
  ["5", "Wolf Trap WFT-2B", "1,439", "31"],
  ["6", "Centurion CN11-O", "1,236", "28"]
];

export const NEW_IVAARSEN_CHARACTERS = [
  { id: "duncan", name: "Sir Duncan Atterton", identity: "Stephensons special character", unit: "Sentry SNT-W5", bv: "1,143", pv: "27", gunnery: "3", piloting: "4", alphaStrikeSkill: "3", source: "Draconis Reach pp. 99–102" },
  { id: "siona", name: "Siona Stephenson", identity: "Stephensons special character", unit: "Gunsmith CH-11NG", bv: "1,465", pv: "36", gunnery: "3", piloting: "4", alphaStrikeSkill: "3", source: "Draconis Reach pp. 99–102" }
];

export const NEW_IVAARSEN_COMMAND_COMPLICATIONS = {
  separateBySide: true,
  note: "Resolve each force’s Command Complications outside the browser, then select the resulting effects. The listed command-right modifiers apply to the initial and secondary rolls. Secondary Roll Twice results do not recurse; use the provisional duplicate procedures shown below.",
  provisional: [
    "Stephensons: resolve two secondary results; reroll a secondary 8+, keep a duplicate No Complication result, and reroll any other duplicate.",
    "ISF: resolve two secondary results; ignore a secondary 8+, ignore duplicate actual effects, and do not reroll duplicates. A duplicate No Complication has no additional effect."
  ],
  groups: [
    { sideId: "stephensons", title: "Stephensons · Liaison Command (+1)", rollLabel: "Adjusted 1D6" },
    { sideId: "isf", title: "ISF · House Command (+2)", rollLabel: "Adjusted 1D6" }
  ],
  rows: [
    { roll: "1–3", name: "No Complication", text: "No additional effect.", sides: ["stephensons"] },
    { roll: "4", name: "Duncan’s Burden", text: "Sir Duncan Atterton receives a +1 Target Number modifier to all Skill rolls. If Duncan is not participating, this result has no effect and is not rerolled.", absentText: "Sir Duncan Atterton is not participating, so this resolved result has no tactical effect and is not rerolled.", duncanOnly: true, sides: ["stephensons"] },
    { roll: "5", name: "Falling Damage", text: "Before the track begins, one random BattleMech in the Stephensons force suffers falling damage. Add 2 to the Stephensons’ cumulative destroyed-building-hex total for the first two tracks; record this adjustment with the Track 3 setup total because the browser does not alter it automatically.", sides: ["stephensons"] },
    { roll: "6", name: "Urban Crossfire", text: "All Stephensons units receive a +1 ranged-attack Target Number modifier against ISF BattleMechs when a building hex is adjacent to and directly behind the target along the line of sight.", sides: ["stephensons"] },
    { roll: "7", name: "Forced Withdrawal", text: "The ISF rolls 1D6 to determine the turn on which Sir Duncan Atterton must begin Forced Withdrawal. If Duncan is not participating, this result has no effect and is not rerolled.", absentText: "Sir Duncan Atterton is not participating, so this resolved result has no tactical effect and is not rerolled.", duncanOnly: true, sides: ["stephensons"] },
    { roll: "8+", name: "Roll Twice", text: "Resolve two additional Stephensons results using the approved provisional duplicate procedure.", sides: ["stephensons"] },
    { roll: "1–3", name: "No Complication", text: "No additional effect.", sides: ["isf"] },
    { roll: "4", name: "Collateral Damage", text: "Add 1 to the ISF cumulative destroyed-building-hex total for the first two tracks. Record this adjustment with the Track 3 setup total; the browser does not alter it automatically.", sides: ["isf"] },
    { roll: "5", name: "Long Tom Support", text: "The Stephensons receive two Long Tom Artillery Support Attacks per Scale for this track.", sides: ["isf"] },
    { roll: "6", name: "Mechanized Infantry Support", text: "After initial deployment, the Stephensons receive two BSP Mechanized Infantry Platoons per Scale; each may be placed atop any building hex.", sides: ["isf"] },
    { roll: "7", name: "Striker Support", text: "The Stephensons receive one BSP Striker Light Tank per Scale for this track.", sides: ["isf"] },
    { roll: "8+", name: "Roll Twice", text: "Resolve two additional ISF results using the approved provisional duplicate procedure.", sides: ["isf"] }
  ],
  ref: "Draconis Reach pp. 99–102"
};

const newIvaarsenBattlefieldDetails = [
  "BattleTech mapsheets: use Light Urban Table 7. Scale 1 uses one mapsheet; Scales 2–3 use two mapsheets. Duplicate results are permitted.",
  "Alpha Strike terrain: use a battlefield 48 inches across, with a width of 36 inches at Scale 1 and 48 inches at Scales 2–3. Each player chooses eight terrain pieces and places them using the standard Light Urban placement bands."
];

const newIvaarsenReferenceTables = [{
  title: "Light Urban Mapsheets · Table 7 (1D6) · Reference only",
  headers: ["Roll", "Mapsheet", "Source"],
  rows: NEW_IVAARSEN_LIGHT_URBAN_MAPSHEETS
}];

function newIvaarsenOverlay(trackId, extra = {}) {
  const base = TRACKS.find(track => track.id === trackId);
  return {
    ...extra,
    displayName: extra.displayName || base.name,
    type: "New Ivaarsen contract track",
    setupDetails: [...(base.setupDetails || []), ...newIvaarsenBattlefieldDetails, ...(extra.setupDetails || [])],
    special: [
      ...(base.special || []),
      "Both participating forces are player-controlled Mercenary commands.",
      "Building Damage: for Tracks 1–2, players record each side’s cumulative destroyed building hexes outside the browser, including applicable Command Complication adjustments. Do not count the four Defender-designated Strike objective buildings.",
      "Each participating Stephensons special character grants the ISF one Ryuken-ni support BattleMech for this track, to a maximum of two. The quantity is independent of Scale; resolve the specific units from the Ryuken-ni reference table at the table.",
      "Total Warfare substitutions: an assigned BSP infantry unit may be represented by any Inner Sphere Motorized Infantry Platoon; an assigned Light Wheeled BSP vehicle may be represented by a Striker Light Tank (564 BV / 20 PV).",
      ...(extra.special || [])
    ],
    commandComplications: NEW_IVAARSEN_COMMAND_COMPLICATIONS,
    referenceTables: newIvaarsenReferenceTables,
    sourceRefs: ["Draconis Reach pp. 99–102", base.name + " " + (base.pageRef || "p. " + base.page), "Light Urban Table 7 p. 154", "Current Draconis Reach master errata"]
  };
}

const newIvaarsenStrikeVariant = newIvaarsenOverlay("strike", {
  displayName: "Track 1 · Strike",
  setupDetails: ["Sir Duncan Atterton participates automatically in Track 1."],
  special: ["Do not include the four Defender-designated Strike objective buildings when recording destroyed building hexes for the Track 3 comparison."]
});

const newIvaarsenMeetingVariant = newIvaarsenOverlay("meeting-engagement", {
  displayName: "Track 2 · Meeting Engagement",
  setupDetails: ["Before setup, record whether Sir Duncan Atterton’s Sentry was destroyed in Track 1. Duncan participates only when that BattleMech remains operational."],
  special: ["Record cumulative building hexes destroyed by each force for later Track 3 setup, including any resolved Command Complication adjustments."]
});

const newIvaarsenAssaultVariant = newIvaarsenOverlay("assault", {
  displayName: "Track 3 · Assault",
  setupDetails: ["Before setup, separately record whether Duncan’s Sentry was destroyed in either prior track and whether Duncan survived both prior tracks. Siona Stephenson participates only if Duncan survived both prior tracks."],
  special: ["At the beginning of Track 3, compare cumulative building hexes destroyed in Tracks 1–2, including complication adjustments. If the ISF total is higher, the Stephensons receive one additional BSP Mechanized Infantry Platoon per point of difference; do not multiply this support by Scale."]
});

export const HOT_SPOTS = [
  {
    id: "achernar",
    name: "Achernar",
    region: "Capellan Confederation",
    terrain: "Wooded",
    source: "Draconis Reach pp. 74–77",
    note: "Tybalt and Home Guard contest five linked tactical tracks on Achernar.",
    contractReference: {
      summary: ["Tybalt and Home Guard are player-controlled Mercenary forces.", "Source: Draconis Reach pp. 74–77."],
      progression: ["Track 2 depends on the Track 1 winner. Track 3 depends on the winners of Tracks 1 and 2. Tracks 4 and 5 use surviving defector vehicles from the preceding track."],
      victory: ["Tybalt wins if at least one defector vehicle survives all tracks, or—when Track 3 was Strike—by winning both Strike and Retreat.", "Home Guard wins automatically if Tybalt does not qualify, and also wins if it destroys five or more Battlefield Support units granted to Tybalt by Command Complications."],
      provisional: ["Evaluate the two contracts independently. If both sides meet their conditions, both contracts succeed. Tybalt’s Strike-and-Retreat alternative is available only when Track 3 was Strike."]
    },
    sides: [factionSide("tybalt", "Tybalt", "Mercenary"), factionSide("home-guard", "Home Guard", "Mercenary")],
    tracks: [
      fixedHotSpotTrack(1, "meeting-engagement", "tybalt", "home-guard", { label: "Track 1 · Meeting Engagement", variant: achernarVariant("meeting-engagement", 1) }),
      winnerDependentTrack(2, [1], {
        tybalt: { trackId: "pursuit", attacker: "tybalt", defender: "home-guard", variant: achernarVariant("pursuit", 2) },
        "home-guard": { trackId: "recon", attacker: "home-guard", defender: "tybalt", variant: achernarVariant("recon", 2) }
      }, { label: "Track 2 · Pursuit or Recon" }),
      winnerDependentTrack(3, [1, 2], {
        "tybalt|tybalt": { trackId: "strike", attacker: "tybalt", defender: "home-guard", variant: achernarVariant("strike", 3) },
        "tybalt|home-guard": { trackId: "meeting-engagement", attacker: "home-guard", defender: "tybalt", variant: achernarVariant("meeting-engagement", 3) },
        "home-guard|tybalt": { trackId: "breakthrough", attacker: "tybalt", defender: "home-guard", variant: achernarVariant("breakthrough", 3) },
        "home-guard|home-guard": { trackId: "defend", attacker: "tybalt", defender: "home-guard", variant: achernarVariant("defend", 3) }
      }, { label: "Track 3 · conditional tactical track" }),
      fixedHotSpotTrack(4, "breakthrough", "tybalt", "home-guard", { label: "Track 4 · Breakthrough", variant: achernarVariant("breakthrough", 4) }),
      fixedHotSpotTrack(5, "retreat", "home-guard", "tybalt", { label: "Track 5 · Retreat", variant: achernarVariant("retreat", 5) })
    ]
  },
  {
    id: "alta-vista",
    name: "Alta Vista",
    region: "Clan Sea Fox",
    terrain: "Light Urban",
    source: "Draconis Reach pp. 78–81",
    note: "Select the current warehouse trial or the conditional immediate Retreat.",
    contractReference: {
      summary: ["Escobar defends Alta Vista’s warehouse complexes against the Ravens.", "Source: Draconis Reach pp. 78–81."],
      progression: ["Play up to three warehouse Meeting Engagements. A normal Raven victory may lead to immediate Retreat only if the Ravens choose revenge. Withdrawal Order outcomes prohibit Retreat."],
      victory: ["Raven contract victory requires winning the conditional Retreat. Escobar’s required successful completions depend on the number of Meeting Engagements actually played."],
      provisional: ALTA_VISTA_PROVISIONAL_RULES
    },
    sides: [factionSide("escobar", "Escobar", "Mercenary"), factionSide("ravens", "Ravens", "Mercenary")],
    tracks: [
      fixedHotSpotTrack(1, "meeting-engagement", "ravens", "escobar", { label: "Warehouse Trial 1", variant: altaVistaMeetingVariant(1) }),
      fixedHotSpotTrack(2, "meeting-engagement", "ravens", "escobar", { label: "Warehouse Trial 2", variant: altaVistaMeetingVariant(2) }),
      fixedHotSpotTrack(3, "meeting-engagement", "ravens", "escobar", { label: "Warehouse Trial 3", variant: altaVistaMeetingVariant(3) }),
      fixedHotSpotTrack(4, "retreat", "ravens", "escobar", { label: "Immediate Retreat", variant: altaVistaRetreatVariant() })
    ]
  },
  {
    id: "dahar-iv",
    name: "Dahar IV",
    region: "Federated Suns",
    terrain: "Desert",
    source: "Draconis Reach pp. 82–85",
    trackSelectorLabel: "Track",
    note: "Select the current tactical track directly.",
    contractReference: {
      summary: ["105112A · Dahar Garrison · Duke Romy Sandoval-Dobson · Federated Suns employer alignment · Mercenary force.", "105112B · Dahar Raid · Felix Kurita · Draconis Combine employer alignment · Mercenary force.", "Three months. Source: Draconis Reach pp. 82–85."],
      progression: ["At the beginning of each month, roll twice on the Mission Table and play valid tracks in rolled order. Each track type may be played only once; a duplicate produces no track and is not rerolled."],
      victory: ["Two consecutive successfully completed played tracks win the contract immediately. Otherwise, after Month 3, the side with more successfully completed tracks wins."],
      provisional: DAHAR_PROVISIONAL_RULES
    },
    sides: [
      { ...factionSide("garrison", "Dahar Garrison", "Mercenary"), contract: "105112A", employer: "Duke Romy Sandoval-Dobson", employerAlignment: "Federated Suns" },
      { ...factionSide("raid", "Dahar Raid", "Mercenary"), contract: "105112B", employer: "Felix Kurita", employerAlignment: "Draconis Combine" }
    ],
    tracks: DAHAR_TRACK_RESULTS.map((result, index) => ({ ...result, sequence: index + 1, label: result.label, variant: daharVariant(result.trackId) }))
  },
  {
    id: "le-blanc",
    name: "Le Blanc",
    region: "Federated Suns",
    terrain: "Desert",
    source: "Draconis Reach pp. 86–89",
    note: "Track 2 is selected from the outcome of Track 1.",
    contractReference: {
      summary: ["124704A · Operation Sundown · Draconis Combine Mustered Soldiery—Professional Soldiery Liaison · Tai-i Rebecca Anderson · Raid · three months.", "124704B · Le Blanc Garrison · Armed Forces of the Federated Suns—Department of Mercenary Relations · Leftenant Giles Durand · Garrison · three months.", "Le Blanc, Federated Suns · Desert · Intensity 2. Source: Draconis Reach pp. 86–89."],
      progression: ["Months 1–2 cover preparation, travel, garrison duty, infiltration, and intelligence gathering. Both tactical tracks occur in Month 3. Track 2 is Strike when the Draconis Combine successfully completes Track 1; otherwise it is Retreat."],
      victory: ["Successful completion of the final track wins the contract."],
      provisional: LE_BLANC_PROVISIONAL_RULES
    },
    sides: [factionSide("draconis-combine", "Draconis Combine", "Draconis Combine"), factionSide("federated-suns", "Federated Suns", "Federated Suns")],
    tracks: [
      fixedHotSpotTrack(1, "objective-raid", "draconis-combine", "federated-suns", { displayName: "Objective Raid · Wreck the Place", variant: leBlancTrack1Variant }),
      winnerDependentTrack(2, [1], {
        yes: { trackId: "strike", attacker: "draconis-combine", defender: "federated-suns", variant: leBlancFinalVariant("strike") },
        no: { trackId: "retreat", attacker: "federated-suns", defender: "draconis-combine", variant: leBlancFinalVariant("retreat") }
      }, {
        previousOutcomeLabel: "Did the Draconis Combine successfully complete Track 1?",
        previousOutcomeOptions: [
          { value: "yes", label: "Yes — play Strike" },
          { value: "no", label: "No — play Retreat (Federated Suns success or neither side)" }
        ],
        previousOutcomeHint: "Pending is not treated as No. Otherwise, the Federated Suns initiates Retreat."
      })
    ]
  },
  {
    id: "lucerne",
    name: "Lucerne / PZH2",
    region: "Draconis Combine",
    terrain: "Wooded",
    source: "Draconis Reach pp. 90–93",
    trackSelectorLabel: "Track",
    note: "Select the current tactical track directly. Bio-Gen Raid is the mandatory sixth played track if reached.",
    contractReference: {
      summary: ["906245A · Bio-Gen Retainer · Bio-Gen Industries · CEO Marie Valentina · Garrison/Retainer/Defense.", "906245B · Eclipse Expeditions Special Operations · Eclipse Expeditions LLC · Guildmaster Phil Newsted · Expedition/Raid.", "PZH2, Lucerne · Wooded · six months · Intensity 2–6 tracks. Source: Draconis Reach pp. 90–93."],
      progression: ["Each month, roll on the Track Table to determine the number of tracks, then determine the unique standard tracks played. Bio-Gen Raid is the mandatory sixth played track if that point is reached."],
      victory: ["The side with more successfully completed tracks wins; equal totals produce no victor."],
      provisional: LUCERNE_PROVISIONAL_RULES
    },
    sides: [factionSide("bio-gen", "Bio-Gen", "Mercenary"), factionSide("eclipse", "Eclipse Expeditions", "Mercenary")],
    tracks: LUCERNE_TRACK_RESULTS.map((result, index) => ({ ...result, sequence: index + 1, label: result.label }))
  },
  {
    id: "melcher",
    name: "Melcher",
    region: "Federated Suns / Draconis Combine",
    terrain: "Grasslands",
    source: "Draconis Reach pp. 94–98",
    fixedScale: 1,
    fixedScaleNote: "Each simultaneous tactical track is fixed at Scale 1; the overall contract is Scale 2.",
    note: "Select either simultaneous Scale 1 tactical track. Forces and named hires assigned to one track cannot be reused in the other.",
    contractReference: {
      summary: ["867530A · Cattle Rustling · Melcher Food Corporation · Federated Suns-aligned employer · Earwigs participating faction Mercenary · Independent Command.", "867530B · Thousand Oaks Garrison · Surinami Processing · Draconis Combine-aligned employer · Border Collies participating faction Mercenary · Liaison Command.", "Three-month Retainer contracts. Melcher is contract Scale 2 with Intensity 2; the two tactical tracks are each Scale 1. Source: Draconis Reach pp. 94–98."],
      progression: ["Play Oxen Intercept and the modified Objective Raid simultaneously using separate Scale 1 forces. No unit may participate in both tracks, and each named temporary hire may be assigned to only one track."],
      victory: ["A contract side wins by successfully completing at least one of the two tracks. Earwigs may not claim enemy salvage. The browser scores only the currently selected tactical track and does not maintain cross-track history."]
    },
    sides: [factionSide("earwigs", "Earwigs", "Mercenary"), factionSide("border-collies", "Border Collies", "Mercenary")],
    tracks: [
      fixedHotSpotTrack(1, "oxen-intercept", "earwigs", "border-collies", { label: "Track 1 · Oxen Intercept", displayName: "Oxen Intercept", variant: melcherOxenVariant }),
      fixedHotSpotTrack(2, "objective-raid", "earwigs", "border-collies", { label: "Track 2 · Scientist Extraction", displayName: "Objective Raid · Scientist Extraction", variant: melcherObjectiveRaidVariant })
    ]
  },
  {
    id: "new-ivaarsen",
    name: "New Ivaarsen",
    region: "Draconis Combine",
    terrain: "Light Urban",
    source: "Draconis Reach pp. 99–102",
    note: "Select the current tactical track directly. The browser presents current-track rules and scoring without maintaining campaign history.",
    contractReference: {
      summary: ["421145A · Asset Recovery · House Stephenson · Federated Suns political alignment · Stephensons participating faction Mercenary · Raid · Liaison Command · three months.", "421145B · Guerrilla Suppression · ISF New Ivaarsen Occupation Command · Draconis Combine political alignment · ISF participating faction Mercenary · Retainer · House Command · three months.", "New Ivaarsen · Light Urban · three tracks. Guerrilla Suppression salvage is 100 percent (13), incorporating current errata. Source: Draconis Reach pp. 99–102."],
      progression: ["Play Strike, Meeting Engagement, and Assault in order. The browser displays only the selected tactical track; record cross-track outcomes with the campaign record.", "For Track 3, enter the cumulative destroyed-building-hex totals from Tracks 1–2, including applicable complication adjustments and excluding the four Defender-designated Strike objective buildings."],
      victory: ["Stephensons win if Siona Stephenson survives Track 3 and either Siona or Sir Duncan Atterton has an operational BattleMech.", "ISF wins if it successfully completes at least one track. The conditions are independent, so both contracts may succeed."]
    },
    sides: [
      { ...factionSide("stephensons", "Stephensons", "Mercenary"), contract: "421145A", employer: "House Stephenson", employerAlignment: "Federated Suns" },
      { ...factionSide("isf", "ISF", "Mercenary"), contract: "421145B", employer: "ISF New Ivaarsen Occupation Command", employerAlignment: "Draconis Combine" }
    ],
    tracks: [
      fixedHotSpotTrack(1, "strike", "stephensons", "isf", { label: "Track 1 · Strike", variant: newIvaarsenStrikeVariant }),
      fixedHotSpotTrack(2, "meeting-engagement", "stephensons", "isf", { label: "Track 2 · Meeting Engagement", variant: newIvaarsenMeetingVariant }),
      fixedHotSpotTrack(3, "assault", "isf", "stephensons", { label: "Track 3 · Assault", variant: newIvaarsenAssaultVariant })
    ]
  },
  {
    id: "pascagoula",
    name: "Pascagoula",
    region: "Draconis Combine",
    terrain: "Mountains",
    source: "Draconis Reach pp. 103–107",
    trackSelectorLabel: "Track",
    note: "Select either tactical track directly. Track 2 requires the manually adjudicated Track 1 tactical winner and does not infer that winner from VP.",
    contractReference: {
      summary: [
        "145202A · Family Jewels · Oyabun Jamal Matsumoto · Draconis Combine / Yakuza-aligned employer · Jewel Thieves participating faction Mercenary · Security Duty · three months · Independent Command (nonnegotiable).",
        "145202B · The Great Ruby Robbery · Colonel Kenneth Ramaley · Federated Suns / Illician Lancers-aligned employer · Ranger Raiders participating faction Mercenary · Objective Raid · three months, incorporating current errata · Independent Command (nonnegotiable).",
        "Pascagoula · Mountains · Intensity 2 tracks. Both tracks occur during Month 2; Months 1 and 3 have no tracks. Source: Draconis Reach pp. 103–107."
      ],
      progression: [
        "No repairs or ammunition reloading occur between the two tracks. Existing damage and ammunition expenditure carry over, and purchases cannot be made between tracks.",
        "Jewel Thieves may make one Draconis Combine faction purchase per month (p. 19). Ranger Raiders may make one Federated Suns faction purchase per month (p. 22). Purchases and other campaign administration remain outside this browser."
      ],
      victory: [
        "Each player must successfully complete both tracks to achieve contract victory. Track 1’s special tactical winner is recorded manually for the Track 2 branch; the browser does not equate that winner automatically with general successful-track completion."
      ],
      provisional: PASCAGOULA_PROVISIONAL_RULES
    },
    sides: [
      { ...factionSide("jewel-thieves", "Jewel Thieves", "Mercenary"), contract: "145202A", employer: "Oyabun Jamal Matsumoto", employerAlignment: "Draconis Combine / Yakuza" },
      { ...factionSide("ranger-raiders", "Ranger Raiders", "Mercenary"), contract: "145202B", employer: "Colonel Kenneth Ramaley", employerAlignment: "Federated Suns / Illician Lancers" }
    ],
    tracks: [
      fixedHotSpotTrack(1, "objective-raid", "ranger-raiders", "jewel-thieves", { label: "Track 1 · Modified Objective Raid", displayName: "Gem Convoy Raid", variant: pascagoulaTrack1Variant }),
      winnerDependentTrack(2, [1], {
        "jewel-thieves": { trackId: "pursuit", attacker: "ranger-raiders", defender: "jewel-thieves", displayName: "Pursuit · Jewel Thieves Defend", variant: pascagoulaJewelDefenderVariant },
        "ranger-raiders": { trackId: "pursuit", attacker: "jewel-thieves", defender: "ranger-raiders", displayName: "Pursuit · Ranger Raiders Defend", variant: pascagoulaRangerDefenderVariant }
      }, { label: "Track 2 · Modified Pursuit" })
    ]
  },
  {
    id: "protection",
    name: "Protection",
    region: "Draconis Combine",
    terrain: "Wetlands",
    source: "Draconis Reach pp. 108–112",
    trackSelectorLabel: "Track",
    note: "Select the current Protection tactical track directly. Only prior winners required to resolve the current track are recorded; campaign administration remains outside the browser.",
    contractReference: {
      summary: [
        "138910A · Platinum Sands Supplemental Security Agreement · CEO Arthur Blanchet · Platinum Sands Holdings · Federated Suns sympathies · Platinum Sands participating force Mercenary · Retainer · six months · Base Pay 110 percent (8) · Straight Support / 20 percent (2) · Transportation 100 percent (9) · Salvage Rights 60 percent (9) · House Command (7).",
        "138910B · Protection Garrison · Governor Kalani Hale · Kanagawa Group · Draconis Combine alignment · Kanagawa Group participating force Mercenary · Retainer · six months · Base Pay 100 percent (7) · Straight Support / 40 percent (3) · Transportation 100 percent (9) · Salvage Rights 40 percent (7) · Liaison Command (8).",
        "Protection, Draconis Combine · primary terrain Wetlands · Intensity 4 tracks. Source: Draconis Reach pp. 108–112."
      ],
      progression: [
        "Month 1 has no track. Month 2 is Recon. Month 3 is Meeting Engagement. Month 4 is Assault, Pushback, or Flank according to the first two winners. Month 5 is Pursuit. Month 6 has no track.",
        "Purchase Options: each month roll 2D6; on 7+ one ’Mech is available and on 11+ two are available. Roll once on the Sea Fox Purchase Options Table (p. 176) for each available ’Mech. If a ’Mech is available, up to two vehicles and two battle armor units may also be purchased from the Sea Fox tables. Purchases and payment remain outside the browser."
      ],
      victory: ["The player with the most track victories wins the contract. A tie ends in a draw."],
      provisional: PROTECTION_PROVISIONAL_RULES
    },
    sides: [
      { ...factionSide("platinum-sands", "Platinum Sands", "Mercenary"), contract: "138910A", employer: "CEO Arthur Blanchet · Platinum Sands Holdings", employerAlignment: "Federated Suns sympathies" },
      { ...factionSide("kanagawa-group", "Kanagawa Group", "Mercenary"), contract: "138910B", employer: "Governor Kalani Hale · Kanagawa Group", employerAlignment: "Draconis Combine" }
    ],
    tracks: [
      fixedHotSpotTrack(1, "recon", "platinum-sands", "kanagawa-group", { variant: protectionTrack1Variant }),
      winnerDependentTrack(2, [1], {
        "platinum-sands": { trackId: "meeting-engagement", attacker: "platinum-sands", defender: "kanagawa-group", variant: protectionTrack2Variant },
        "kanagawa-group": { trackId: "meeting-engagement", attacker: "kanagawa-group", defender: "platinum-sands", variant: protectionTrack2Variant }
      }),
      winnerDependentTrack(3, [1, 2], {
        "platinum-sands|platinum-sands": { trackId: "assault", attacker: "platinum-sands", defender: "kanagawa-group", variant: protectionVariant("assault", { displayName: "Protection Assault", setupDetails: ["Contract sequence: this is the fourth month. Platinum Sands won both previous tracks, so play Assault with Platinum Sands as Attacker."] }) },
        "kanagawa-group|kanagawa-group": { trackId: "pushback", attacker: "kanagawa-group", defender: "platinum-sands", variant: protectionVariant("pushback", { displayName: "Protection Pushback", setupDetails: ["Contract sequence: this is the fourth month. Kanagawa Group won both previous tracks, so play Pushback with Kanagawa Group as Attacker."] }) },
        "platinum-sands|kanagawa-group": { trackId: "flank", roleChoice: true, roleChoiceRequired: true, roleChoicePlainLabels: true, variant: protectionTrack3Variant },
        "kanagawa-group|platinum-sands": { trackId: "flank", roleChoice: true, roleChoiceRequired: true, roleChoicePlainLabels: true, variant: protectionTrack3Variant }
      }, { roleChoiceLabel: protectionTrack3Variant.roleChoiceLabel, roleChoiceHint: protectionTrack3Variant.roleChoiceHint }),
      fixedHotSpotTrack(4, "pursuit", "platinum-sands", "kanagawa-group", { variant: protectionTrack4Variant })
    ]
  },
  {
    id: "sun-prairie",
    name: "Sun Prairie",
    region: "Federated Suns",
    terrain: "Grasslands",
    source: "Draconis Reach pp. 113–115",
    trackSelectorLabel: "Track",
    note: "Select the current tactical track directly. The monthly roll schedule, duplicate handling, No Track result, contract victory, and purchase options remain in Contract Reference.",
    contractReference: {
      summary: [
        "105070A · Sun Prairie Garrison · Baron Elias Navarro · Federated Suns employer alignment · Garrison participating force Mercenary · Garrison · three months, incorporating current errata · Base Pay 100 percent (7) · Battle Support / 30 percent (11) · Transportation 50 percent (7) · Salvage Rights 20 percent (5) · Liaison Command (8).",
        "105070B · Sun Prairie Raid · Tai-sa Roland Samuels · Draconis Combine employer alignment · Raid participating force Mercenary · Raid · three months · Base Pay 70 percent (4) · Straight Support / 20 percent (2) · Transportation 0 percent (5) · Salvage Rights 50 percent (8) · Independent Command (11), incorporating current errata · combat pay is doubled.",
        "Sun Prairie, Federated Suns · primary terrain Grasslands · Intensity 0–5 tracks. Source: Draconis Reach pp. 113–115."
      ],
      progression: [
        "For each of the three months, make two independent 1D6 track rolls: the first determines the first track and the second determines the second. Each track type may be played only once; a duplicate produces no track for that roll, and a result of 6 produces no track. Only the five playable tactical tracks appear in the browser selector."
      ],
      tables: [{ title: "Track Table · 1D6", headers: ["Roll", "Track", "Attacker", "Defender"], rows: [["1", "Breakthrough", "Raid", "Garrison"], ["2", "Objective Raid", "Raid", "Garrison"], ["3", "Strike", "Raid", "Garrison"], ["4", "Recon", "Garrison", "Raid"], ["5", "Meeting Engagement", "Garrison", "Raid"], ["6", "No Track", "—", "—"]] }],
      victory: [
        "If either player successfully completes two played tracks in a row, that player wins immediately. Otherwise, after Month 3, the player with more successfully completed tracks wins.",
        "If the final totals are tied and both players successfully completed at least one track, both are victorious. If neither completed a track, neither is victorious."
      ],
      purchaseOptions: ["Neither employer has BattleMechs for direct purchase. Each month, an external 2D6 roll locates one ’Mech on 7+ or two on 11+; use the Federated Suns Purchase Options Table on p. 22 for each. If a ’Mech is available, up to two vehicles and two battle armor units may also be purchased that month from the Federated Suns Tanker and Battle Armor Options Tables. The browser does not roll, calculate, or manage purchases."],
      provisional: [
        "Consecutive successful played tracks determine early victory independently of calendar-month boundaries and may occur in the same or different months. Duplicate and No Track rolls do not interrupt a streak; a played track without successful completion interrupts that force’s streak. The source’s parenthetical reference to two months is treated as illustrative, not as an additional requirement.",
        "For Roll Twice, apply the selecting force’s Command Rights modifier to the initial and both secondary rolls, resolve exactly two secondary results, ignore secondary Roll Twice results, and ignore duplicate effects without rerolling or recursing."
      ]
    },
    sides: [
      { ...factionSide("garrison", "Sun Prairie Garrison", "Mercenary"), contract: "105070A", employer: "Baron Elias Navarro", employerAlignment: "Federated Suns" },
      { ...factionSide("raid", "Sun Prairie Raid", "Mercenary"), contract: "105070B", employer: "Tai-sa Roland Samuels", employerAlignment: "Draconis Combine" }
    ],
    tracks: [
      fixedHotSpotTrack(1, "breakthrough", "raid", "garrison", { label: "Breakthrough", variant: sunPrairieVariant("breakthrough") }),
      fixedHotSpotTrack(2, "objective-raid", "raid", "garrison", { label: "Objective Raid", variant: sunPrairieVariant("objective-raid") }),
      fixedHotSpotTrack(3, "strike", "raid", "garrison", { label: "Strike", variant: sunPrairieVariant("strike") }),
      fixedHotSpotTrack(4, "recon", "garrison", "raid", { label: "Recon", variant: sunPrairieVariant("recon") }),
      fixedHotSpotTrack(5, "meeting-engagement", "garrison", "raid", { label: "Meeting Engagement", variant: sunPrairieVariant("meeting-engagement") })
    ]
  },
  {
    id: "tigress",
    name: "Tigress",
    region: "Capellan Confederation",
    terrain: "Wooded / Hills",
    source: "Draconis Reach pp. 116–119",
    trackSelectorLabel: "Track",
    note: "Select either tactical track directly. Track 1 is one hybrid mission with a manual Training-to-Recon phase control; Track 2 is a separate Meeting Engagement.",
    contractReference: {
      summary: [
        "312332A · Tigress Trainers · Mandrissa Estrella Laurel · Capellan Confederation / House Laurel employer alignment · Legion Trainers participating force Mercenary · Cadre Duty · three months · Base Pay 110 percent (8) · Straight Support / 80 percent (6), incorporating current errata · Transportation 100 percent (9) · Exchange Salvage (3) · House Command (7), incorporating current errata.",
        "312332B · Roughriders Reconnaissance · Duke Loren Hansen · Federated Suns / Hansen’s Roughriders employer alignment · Roughriders Recon participating force Mercenary · Recon Raid · three months · Base Pay 80 percent (5) · Battle Support / 10 percent (9) · Transportation 50 percent (7) · Salvage Rights 100 percent (13) · Liaison Command (8).",
        "Tigress · primary terrain Grasslands · Intensity 2 tracks. Month 1 has no track, both tracks occur in Month 2, and Month 3 has no track. Source: Draconis Reach pp. 116–119."
      ],
      progression: [
        "Tigress Trainers Exchange Salvage credits qualifying salvage at 50 percent toward a Blade BLD-XR, Rook NH-2, or Rook NH-3X. Stored exchange value is lost when the force leaves the system; negotiated battle-loss compensation uses the same list.",
        "Track 1 is one hybrid tactical track: simulated Meeting Engagement training followed by Recon when the actual Roughriders arrive. Track 2 is a separate Meeting Engagement."
      ],
      tables: [{ title: "Laurel’s Legion Random Allocation Table · 1D6", headers: ["Roll", "BattleMech", "BV", "PV"], rows: [["1", "Blade BLD-XR", "1,101", "33"], ["2", "Rook NH-2", "1,525", "34"], ["3", "Rook NH-3X", "1,746", "46"], ["4", "Koschei KSC-6L", "1,465", "43"], ["5", "Thunderbolt TDR-10SE", "2,008", "44"], ["6", "Cataphract CTF-5LL", "2,322", "39"]] }],
      victory: ["Each contract is evaluated independently. Either or both players may claim victory by successfully completing at least one of the two tracks."],
      purchaseOptions: ["Roughriders Recon may make one roll per month on the Sea Fox Random Purchase Table (p. 176). Legion Trainers may make one roll per month on the Laurel’s Legion table above. When applicable, the player may purchase up to two vehicles and two battle armor units per month from the Sea Fox Tanker and Battle Armor Options Tables. Purchases and exchange balances remain outside the browser."],
      provisional: TIGRESS_PROVISIONAL_RULES
    },
    sides: [
      { ...factionSide("legion-trainers", "Legion Trainers", "Mercenary"), contract: "312332A", employer: "Mandrissa Estrella Laurel", employerAlignment: "Capellan Confederation / House Laurel" },
      { ...factionSide("roughriders", "Roughriders Recon", "Mercenary"), contract: "312332B", employer: "Duke Loren Hansen", employerAlignment: "Federated Suns / Hansen’s Roughriders" }
    ],
    tracks: [
      {
        sequence: 1,
        label: "Track 1 · Training Mission",
        phases: {
          training: { trackId: "meeting-engagement", roleChoice: true, roleChoiceRequired: true, roleChoicePlainLabels: true, displayName: "Training Mission · Training Phase", variant: tigressTrack1TrainingVariant },
          recon: { trackId: "recon", attacker: "roughriders", defender: "legion-trainers", displayName: "Training Mission · Recon Phase", variant: tigressTrack1ReconVariant }
        },
        roleChoiceLabel: "Choose the Training-phase Attacker",
        roleChoiceHint: "The other training participant is Defender. This choice also identifies the trainees’ original home edge for the Roughriders arrival."
      },
      { ...fixedHotSpotTrack(2, "meeting-engagement", null, null, { label: "Track 2 · Meeting Engagement", variant: tigressTrack2Variant }), roleChoice: true, roleChoiceRequired: true, roleChoicePlainLabels: true, roleChoiceLabel: "Choose the Track 2 Attacker", roleChoiceHint: "The source does not assign the roles; choose the resolved tabletop Attacker." }
    ]
  },
  {
    id: "xhosa-vii",
    name: "Xhosa VII",
    region: "Federated Suns",
    terrain: "Cold / Hills",
    source: "Draconis Reach pp. 122–123",
    note: "Operation Cold Relief is a three-track opposing contract. Track 1 is Recon, Track 2 is Breakthrough with four scored logistics trucks, and Track 3 resolves to Assault or Strike based on whether at least 50 percent of the trucks passed through Track 2.",
    sides: [factionSide("federated-suns", "Federated Suns", "Federated Suns"), factionSide("draconis-combine", "Draconis Combine", "Draconis Combine")],
    tracks: [
      fixedHotSpotTrack(1, "recon", "federated-suns", "draconis-combine", { variant: xhosaTrack1Variant }),
      fixedHotSpotTrack(2, "breakthrough", "federated-suns", "draconis-combine", { variant: xhosaTrack2Variant }),
      winnerDependentTrack(3, [2], {
        "federated-suns": { trackId: "assault", attacker: "federated-suns", defender: "draconis-combine", variant: xhosaTrack3AssaultVariant },
        "draconis-combine": { trackId: "strike", attacker: "draconis-combine", defender: "federated-suns", variant: xhosaTrack3StrikeVariant }
      })
    ]
  },
  {
    id: "game-worlds",
    name: "Game Worlds",
    region: "Draconis Reach",
    terrain: "World selected below",
    source: "Draconis Reach pp. 128–131",
    opforMode: "gladiator",
    hideSideSelector: true,
    hideScaleSelector: true,
    note: "Game Worlds is a one-to-three-track duel hot spot. Choose the game world and duel class for each track. The browser records the duel rules, objectives, and Gladiator Generator procedure without creating a force or resolving campaign payments automatically.",
    sides: [factionSide("duelist-one", "Duelist One", "Mercenary"), factionSide("duelist-two", "Duelist Two", "Mercenary")],
    tracks: gameWorldTracks
  },
  {
    id: "act-of-piracy",
    name: "Act of Piracy",
    region: "Random System",
    terrain: "Random",
    source: "Draconis Reach pp. 124–126",
    opforMode: "source-table",
    note: "Act of Piracy and Garrison are opposing one-track contracts. Pirates are always the Attacker in the Objective Raid; the Law is always the Defender. System selection, loot, conditions, campaign payments, and the Law’s generated-force exception remain source-reference rules rather than automatic campaign bookkeeping.",
    sides: [factionSide("pirates", "Pirates", "Mercenary"), factionSide("law", "The Law", "Local")],
    tracks: [
      fixedHotSpotTrack(1, "objective-raid", "pirates", "law", { variant: actOfPiracyVariant })
    ]
  },
  {
    id: "mallorys-world",
    name: "Mallory’s World",
    region: "Loneliness Island",
    terrain: "Savannah / Urban",
    source: "Draconis Reach pp. 132–141",
    trackSelectorLabel: "Strategic Hex Type",
    fixedScale: 3,
    fixedScaleNote: "Mallory's World is designed and balanced for Scale 3. See Veteran Command (p. 19) for starting directly at this Scale.",
    note: "Choose the strategic hex type being attacked. The browser resolves the printed standard tactical track and Loneliness Island modifications without tracking strategic movement, ownership, payments, repairs, or campaign victory.",
    sides: [
      factionSide("dragon-banner", "Raise the Dragon Banner", "Draconis Combine"),
      factionSide("sword-sunburst", "Raise the Sword and Sunburst", "Federated Suns")
    ],
    tracks: [
      malloryHexTrack(1, "Empty Hexes", "recon", malloryEmptyVariant),
      malloryHexTrack(2, "Operating Base / Landing Zone", "retreat", malloryOperatingBaseVariant),
      malloryHexTrack(3, "AgroMech Repair Facilities", "defend", malloryAgroMechVariant),
      malloryHexTrack(4, "Defensive Position", "assault", malloryDefensivePositionVariant),
      malloryHexTrack(5, "Irrigation Control", "pushback", malloryIrrigationVariant),
      malloryHexTrack(6, "BPWW Facilities", "meeting-engagement", malloryBpwwVariant),
      malloryHexTrack(7, "Boshi-gumi Yakuza Operating Bases", "strike", malloryBoshiGumiVariant),
      malloryHexTrack(8, "City Hexes", "pursuit", malloryCityVariant, {
        reverseRoles: true,
        roleChoiceHint: "Choose the contract side whose formation moved into the city. The source reverses Pursuit roles: that strategic attacker uses the tactical Defender role, while the city holder uses tactical Attacker."
      }),
      malloryHexTrack(9, "Manufacturing Plant", "objective-raid", malloryManufacturingVariant),
      malloryHexTrack(10, "Communication Array", "objective-raid", malloryCommunicationVariant),
      malloryHexTrack(11, "Biotech Research Centre", "breakthrough", malloryBiotechVariant),
      malloryHexTrack(12, "Shipping Port", "flank", malloryShippingPortVariant),
      malloryHexTrack(13, "Training Simulators", "pushback", malloryTrainingVariant),
      {
        sequence: 14,
        label: "RSIS/FABL Research Facility · Hex 0507 · Non-playable",
        trackId: null,
        attacker: null,
        defender: null,
        variant: malloryRestrictedFacility
      }
    ]
  }
];

export const PLAYER_VISIBLE_HOT_SPOT_IDS = Object.freeze(["achernar", "alta-vista", "dahar-iv", "le-blanc", "lucerne", "melcher", "new-ivaarsen", "pascagoula", "protection", "sun-prairie", "tigress"]);


