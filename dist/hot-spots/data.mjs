export const SOURCES = {
  primary: "Hot Spots: Draconis Reach, First Printing, pp. 167–175",
  errata: "Hot Spots: Draconis Reach official master errata thread (current list reviewed 11 November 2026); Hot Spots Hinterlands Errata v2.41 reviewed for applicability",
  supersession: "Draconis Reach supersedes the supplied Hinterlands track text; Hinterlands track corrections are not applied to these records.",
  pascagoula: "Hot Spots: Draconis Reach, First Printing, pp. 104–106; Objective Raid p. 171; campaign withdrawal and exit rules p. 31; current Draconis Reach master errata",
  militaryPalette: "BattleTech Faction Colors, palettes/military-ui.yaml, verified main e3cd8c9c9899b04aebd314a2a921ad3edd4092f1",
  opposingForces: "Hot Spots: Draconis Reach, First Printing, Opposing Force Tables pp. 186–201"
};

export const PROTECTION_DENY_QUALIFYING_OBJECTIVE_IDS = Object.freeze([
  "identify-opposition",
  "preemptive-strike",
  "observe-report"
]);

export function calculateProtectionDenyVp(completedObjectiveIds = []) {
  const completed = new Set(completedObjectiveIds);
  const completedQualifyingObjectives = PROTECTION_DENY_QUALIFYING_OBJECTIVE_IDS.filter(id => completed.has(id)).length;
  return 300 - (100 * completedQualifyingObjectives);
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
    text: "BattleTech: four or more pilot damage; all sensor critical slots destroyed; one gyro and one engine critical hit; two engine critical hits; side torso destroyed; internal structure damage in three or more limbs or two or more torso locations; or loss of all qualifying weapons. Alpha Strike: no armor plus half starting structure, no medium/long-range damage when the unit began with some, or immobilized through damage, critical, or motive effects.",
    ref: "Draconis Reach p. 167"
  },
  {
    title: "Scanning",
    text: "BattleTech scans begin during the Physical Attack Phase and complete at the end phase of the following turn. Without a functioning probe, the scanner may not make weapon attacks during the second turn, while the source permits physical attacks; a probe permits weapon and physical attacks and ignores LOS within probe range. Alpha Strike scans begin during the Combat Phase, require LOS within 4 inches, and complete at the end phase of the following turn.",
    ref: "Draconis Reach p. 167"
  },
  {
    title: "Scanning range",
    table: {
      headers: ["Scanning Equipment", "BT Range", "AS Range", "LOS Required", "Weapon Attacks on 2nd Turn"],
      rows: [
        ["Default Sensors", "4", "9″", "Yes", "No"],
        ["Light Active Probe (LRP)", "3", "6″", "No", "Yes"],
        ["Watchdog (WAT)", "3", "6″", "No", "Yes"],
        ["Beagle Active Probe (BAP)", "4", "9″", "No", "Yes"],
        ["Asset with PRB", "4", "N/A", "No", "Yes"],
        ["Clan Active Probe", "5", "N/A", "No", "Yes"],
        ["Bloodhound (BH)", "8", "12″", "No", "Yes"]
      ]
    },
    text: "Sprinting units cannot scan, and a Fire Control critical hit blocks scanning unless a functioning probe is present.",
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
      "Track End: after the end of any turn when at least one side has no ’Mech units in play, or after the end of Turn 10 (Turn 8 in Alpha Strike).",
      "Salvage: the side that successfully completes the track earns all salvage."
    ]
  },
  {
    id: "breakthrough",
    name: "Breakthrough",
    page: 168,
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
      "Defender (Standard): set up anywhere at least 5 hexes (AS: 10 inches) from the home edge; at Scale 2+, use 10 hexes / 16 inches.",
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
      "Salvage: both sides may claim salvage from one shared pool. The player that successfully completed the track chooses first. If neither side completed it, or both completed all objectives, no opposing salvage is claimed and each side gets its own destroyed or crippled units returned."
    ]
  },
  {
    id: "recon",
    name: "Recon",
    page: 174,
    summary: "The Attacker attempts to assess the composition of the Defender’s force before slipping away.",
    setup: [
      "The Attacker chooses any edge as their home edge first. The Defender may choose any other edge.",
      "Defender (Standard): set up anywhere; at least 50 percent of units by number, including assets, must be within the half of the play area closest to the Attacker’s home edge.",
      "Attacker (Raiders): enter from the home edge during the Movement Phase of Turn 1. The Attacker may not select Minefield or Immobile BSP assets."
    ],
    objectives: [
      { id: "orders-attacker", name: "Orders", side: A, vp: 50, text: "Scan at least one Defender unit by number per Scale, including assets." },
      { id: "orders-defender", name: "Orders", side: D, vp: 50, text: "At least half of the Defender’s units by number, excluding assets, remain on the battlefield and survive (are not destroyed) the first two turns." },
      { id: "identify-opposition", name: "Identify The Opposition", side: A, vp: 100, text: "Successfully scan at least two thirds of the Defender’s starting force by number, including assets." },
      { id: "preemptive-strike", name: "Preemptive Strike", side: A, vp: 100, text: "Destroy or cripple at least 25 percent of the Defender’s starting force by BV/PV, excluding assets." },
      { id: "observe-report", name: "Observe And Report", side: A, vp: 100, text: "At least 50 percent of the Attacker’s starting force by BV/PV, including assets, survives and exits its home edge anytime after four turns." },
      { id: "deny", name: "Deny", side: D, vp: 50, vpOptions: [50, 100, 200, 300], text: "Any Attacker objectives not met by the end of Turn 8 are counted for the Defender instead. Defender units withdrawing from their home edge before Turn 8 count as Scanned and Destroyed for objective purposes. The printed value is shown as 50/100/200/300; select the applicable value." }
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
      "Salvage: both sides may claim salvage from one shared pool. The player that successfully completed the track chooses first. If neither side completed it, or both completed all objectives, no opposing salvage is claimed and each side gets its own destroyed or crippled units returned."
    ],
    errataNote: "The supplied v2.41 errata changes the older Hinterlands Strike scanning paragraph. The Draconis Reach p. 167 scanning rules plus the specific Strike restriction above are used here."
  }
];

export const MISSION_OPFOR_OVERRIDES = {
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

export const SPECIAL_TRACKS = [gameWorldDuelTrack];

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

const pascagoulaTrack1Variant = {
  displayName: "Gem Convoy Raid",
  type: "Modified Objective Raid",
  summary: "A modified Objective Raid in which the four Ryu heavy transport WiGEs are mobile objectives carrying the convoy components.",
  setup: [
    "Pascagoula Track 1 uses Mines #1 at Scale 1. The four Ryu Heavy Transport WiGEs replace the standard Objective Raid buildings as mobile objectives.",
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
      "Scale 3: Mines #1 and Mines #2 plus any additional mapsheets rolled on the Mountains Terrain table; four Ryu Heavy Transport WiGEs using Vedette Medium Tank BSP asset cards; Fifth Ghost escorts Chimera CHA-2K, Jenner JR7-C2, Daimyo DMO-5K, Dragon DRG-5Nr, and Nova Cat T at Gunnery 3 / Piloting 4, with the Scale 2 additions using a C3 network.",
      "The four Ryus are mobile objectives and replace the standard Objective Raid buildings."
    ]
  },
  special: [
    "Mobile objectives — agreed table interpretation: use the standard Objective Raid component-collection and loading rules with the four Ryus as the objective locations. For table use, each Ryu has components available as needed; this is a working interpretation, not an official errata ruling. Practical limits are available Raider units, functioning hand actuators, carrying capacity, and time before the convoy exits.",
    "Loading and carrying: load one component per functioning hand actuator per turn. Carrying capacity is Light 1, Medium 2, Heavy 3, or Assault 4. A hand-actuator ’Mech can transfer one carried component to an adjacent unit at the end of a subsequent Movement Phase. Infantry can load one component onto an adjacent ’Mech or vehicle per turn, but cannot carry components; mechanized infantry must dismount. An asset vehicle can carry one component if assisted with loading and loses 1 MP while carrying it. Apply the p. 171 movement and jumping restrictions; carrying components does not prevent attacks.",
    "Extraction: components score when carried off the Attacker’s home edge. A unit that exits the battlefield is removed from play and cannot return for another load.",
    "Track End — agreed table interpretation, separate from VP scoring: Pascagoula’s special ending conditions replace Objective Raid’s generic 12-turn limit. The track ends when all surviving operational Ryus have exited the designated map edge, or when all opposing units have fled or been destroyed. Destroyed Ryus no longer count as operational convoy units required to exit. Destroying a Ryu does not itself award victory; determine victory by objective VP totals.",
    "Salvage: use the standard Objective Raid salvage rule. The Attacker may not claim salvage; the Defender claims salvage if they successfully complete the track, otherwise all salvage returns to its owners.",
    "Track 2 carryover reminder: damage and ammunition expenditure carry over; there are no repairs or reloading between tracks. This is a reminder only; Track 2 is not modified by this browser update."
  ],
  objectiveOverrides: {
    "orders-defender": {
      text: "Agreed table interpretation: all Defender units must stay within 3 hexes (AS: 6 inches) of one of the four mobile Ryu objectives, or closer to the Attacker’s home edge than one of the Ryus, for the first two turns, or be crippled or destroyed."
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
  commandComplications: {
    ref: "Draconis Reach pp. 30, 106",
    note: "The mission brief provides this table but does not specify a separate roll timing. General campaign rules state that command complications are usually determined from a table, with each player rolling separately and modifying the result by Command Rights. The browser displays the table without selecting or applying a result automatically.",
    rows: [
      { roll: "1", name: "No complications", text: "No complication applies." },
      { roll: "2", name: "Shifting Sand", text: "All clear terrain is covered in shifting sand. Shifting sand affects only 40+ ton units (Alpha Strike Size 2+), adding a +1 MP cost per hex (Alpha Strike: +1 inch MV per inch) and +1 to Piloting Skill Rolls in BattleTech. It does not affect units using hover or VTOL movement." },
      { roll: "3", name: "Ash Fall", text: "A volcanic eruption and prevailing winds cover the battlefield in falling ash. All direct and pulse energy weapon attacks receive a +1 target number modifier (Alpha Strike: +1 target number modifier to all TAG and standard weapon attacks)." },
      { roll: "4", name: "Volcanic Geysers", text: "The player’s half of the battlefield, from the center line to their home edge, contains small geyser-like volcanic eruptions. Each turn, every unit that ends the Movement Phase in that half rolls 2D6 against a target number of 7+. Success has no effect. On a failure, the unit triggers an eruption, gains 4 heat (Alpha Strike: 1 heat), and has a +1 target number modifier to all weapon attacks made by or against it that turn while covered in steam and boiling water." },
      { roll: "5", name: "Delayed Deployment", text: "A crevasse blocks the route to the battlefield. Only units with jump or airborne movement modes deploy as usual. All other units are delayed one turn and enter through their home edge during the Movement Phase." },
      { roll: "6", name: "Increased Repair Costs", text: "Sand gets into everything. All repairs cost an additional 50 percent of SP after this track. The additional cost applies regardless of when repairs are made; whenever units that participated in this track are repaired, add 50 percent." }
    ]
  },
  sourceRefs: [
    "Draconis Reach pp. 104–106",
    "Objective Raid p. 171",
    "Campaign withdrawal and exit rules p. 31",
    "Command complications procedure p. 30",
    "Current Draconis Reach master errata"
  ]
};

const leBlancTrack1Variant = {
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
  ],
  sourceRefs: ["Draconis Reach p. 88", "Objective Raid p. 171"]
};

const protectionCommandComplications = {
  ref: "Draconis Reach pp. 30, 111",
  note: "Official procedure: after determining the mapsheets, each player rolls 1D6. Add 1 for Liaison Command, 2 for House Command, or 3 for Integrated Command. The browser displays the complete table but does not select or apply a complication automatically.",
  rows: [
    { roll: "1–3", name: "No Complication", text: "No complication applies." },
    { roll: "4", name: "R&R", text: "Your employer provided good rest and relaxation at a local resort, but the enemy arrived during it. Take a −2 penalty to Initiative rolls for the first 2 turns." },
    { roll: "5", name: "Less Support", text: "Last-minute changes to the battle plan leave you with less support. Reduce the Battlefield Support available to you for the track by 10 BSP (AS: 2 BSP) per Scale." },
    { roll: "6", name: "Local Partisans", text: "Your opponent receives support from a local partisan group: two additional Vedette Medium Tank battlefield assets. On standard maps, these Vedettes represent patrol boats. Change their motive type from Tracked to Naval, allow them to enter Depth 0 and deeper water hexes, and treat them as Level 0 (surface) for shooting." },
    { roll: "7", name: "Monsoon", text: "Your employer determines that monsoon conditions offer the perfect opportunity to attack. On standard maps, reduce all hex levels by 1 as a storm surge floods the area. On Atlantis City maps, treat every Level 0 hex as Depth 0 water. All attacks receive an additional +1 target number modifier at medium range and +2 at long range (AS: +1 target number modifier to all weapon attacks at medium or long range)." },
    { roll: "8+", name: "Roll Twice", text: "Roll twice and apply both effects. Do not reroll No Complication, but reroll any other duplicate effect. If both options 6 and 7 are rolled, the Vedettes represent patrol boats crazy enough to sail into the flooded streets of Atlantis City." }
  ]
};

const protectionWaterRules = [
  "Protection maps — official source rule: after rolling for the standard mapsheets, treat all Level 0 ground as Level 0 water. Each player receives six Depth 1 water tokens to place in Level 0 water hexes; two Depth 1 tokens may be stacked to create a Depth 2 water hex. These adjustments make tracked and wheeled assets more difficult or potentially impossible to use, so select assets accordingly.",
  "Standard Protection mapsheet table: roll 1D6 — 1 Hilltops #1 (CI); 2 Desert #3 (AGOAC); 3 Rolling Hills #1 (MP: Grasslands); 4 Rolling Hills #2 (MP: Grasslands, CI); 5 Rolling Hills #3 (MP: Grasslands); 6 Sand Drifts #1 (MP: Deserts).",
  "Atlantis City option — official source rule: the Attacker may instead engage at the capital, Atlantis City, by taking a −1 Reputation penalty. Use the Atlantis City mapsheet table; those mapsheets are not modified by the Protection water rules. The Defender then chooses either to check fire, giving all Gunnery rolls for the track a +1 target number modifier and gaining +1 Reputation regardless of the outcome, or to take a −1 Reputation penalty and engage without the Gunnery penalty. Do not apply this option unless the table establishes it.",
  "Atlantis City mapsheet table: roll 1D6 — 1 Corporate Campus (MP: City); 2 Family Quarters (MP: City); 3 HPG Heliport (MP: City); 4 Business District (MP: City); 5 Shopping District (MP: City); 6 HPG Offices (MP: City)."
];

const protectionCampaignRules = [
  "Protection campaign victory — official source rule: the player with the most track victories wins the contract. A tie ends in a draw.",
  "Temporary Hire — official source rule: the first time a mercenary force cannot field at least two-thirds of the maximum permissible BV/PV for its next track, a local mercenary offers services. The player may choose whether to pay that mercenary to participate in each track.",
  "Surf Rock — optional local mercenary: Old Man Hawthorne pilots a Thunderbolt TDR-12R (1,975 BV / 41 PV), has three Edge tokens, Piloting 5 and Gunnery 4 (AS: Skill 4), and demands 50 Support Points per track plus a 50-point bonus for each unit he destroys.",
  "Purchase Options — official campaign rule: each month, roll 2D6; on 7+ one ’Mech is available for purchase, and on 11+ two are available. Roll on the Sea Fox Purchase Options Table (p. 176) for each. If a ’Mech is available, the player may also purchase vehicles or battle armor from the Sea Fox Tanker and Battle Armor Options Tables, up to two purchases of each per month."
];

function protectionVariant(trackId, extra = {}) {
  const base = TRACKS.find(track => track.id === trackId);
  const { special: extraSpecial = [], ...rest } = extra;
  return {
    ...rest,
    special: [...(base?.special || []), ...protectionWaterRules, ...protectionCampaignRules, ...extraSpecial],
    commandComplications: protectionCommandComplications,
    sourceRefs: ["Draconis Reach pp. 110–112", "Command complications procedure p. 30", "Current Draconis Reach master errata"]
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
  roleChoiceHint: "The source says the higher roll may choose Attacker or Defender; record the final role assignment here."
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

const sunPrairieCommandComplications = {
  ref: "Draconis Reach p. 115",
  note: "Official procedure: each player rolls 1D6 to determine possible complications. Add 1 for Liaison Command, 2 for House Command, or 3 for Integrated Command. The browser displays the complete table without selecting or applying a complication automatically.",
  rows: [
    { roll: "1", name: "Lostech cache found!", text: "If you successfully complete this track, gain an additional 100 SP from recovery of a small cache." },
    { roll: "2–3", name: "No Complication", text: "No effect." },
    { roll: "4–5", name: "Opportunism and rumors of treasure", text: "Mercenaries suffer a −2 penalty to Initiative rolls for the first two turns of battle." },
    { roll: "6", name: "Uneven footing / ghost town rubble", text: "The opposing player may place 6 rubble hexes (AS: 2-inch AOE terrain templates)." },
    { roll: "7", name: "Tinderbox conditions", text: "The opposing player may place 6 markers on a hex to mark it and adjacent hexes on fire (AS: six 6-inch AOE fire templates). Any area on fire also has light smoke. BattleTech: during the Heat Phase, a unit in a burning hex adds 5 heat, and a unit adds 2 heat for each burning hex moved through during the Movement Phase; non-heat-tracking units convert heat to damage. Alpha Strike: units entering or moving through a burning area build 1 heat during the End Phase; non-heat-tracking units convert heat to damage. Smoke: BattleTech and Alpha Strike attacks with line of sight through smoke or against a target in smoke receive a +1 target number modifier." },
    { roll: "8+", name: "Roll twice and apply both effects", text: "Ignore and do not reroll duplicate effects." }
  ]
};

const sunPrairieSetupDetails = [
  "Official track selection: each month, roll two 1D6 results. The first 1D6 determines the first track that month and the second 1D6 determines the second track. Each track may be played only once; a duplicate track result produces no track for that roll. If all six rolls across the three-month contract are 1s, play only one track. If all six rolls are unique, play five tracks; a result of 6 means no track.",
  "Official mapsheet table: roll 1D6 — 1 Open Terrain #2 (MP: Grasslands); 2 Open Terrain #3 (MP: Grasslands); 3 Rolling Hills #3 (MP: Grasslands); 4 Rolling Hills #3 (MP: Grasslands); 5 Lakes (MP: Grasslands); 6 Forward Base (MP: Grasslands)."
];

const sunPrairieSpecialRules = [
  "Sun Prairie contract victory — official source rule: if either player successfully completes two tracks in a row, that player wins the contract. If this happens after only two tracks, there is no third-month track and that player wins. Otherwise, after the third month, the player with more successfully completed tracks wins. If the result is tied and both players have successfully completed at least one track, both are victorious; otherwise, there is no victor.",
  "Temporary Hire — official source rule: the first time a mercenary force cannot field at least two-thirds of the maximum permissible BV/PV for its next track, a local mercenary offers services. The player may choose whether to pay that local mercenary to participate in each track.",
  "Garrison support — official source rule: Prairie Rangers offer four Veteran motorized platoons carrying energy rifles (Gunnery 3 / Piloting 4; Alpha Strike Skill 3; 496 BV / 48 PV). If using Battlefield Support assets, use four Veteran motorized conventional Infantry, but purchase them using 496 BV instead of BSP. Prairie Rangers demand 50 SP per track participated in and an additional 50 SP for each Prairie Ranger unit destroyed.",
  "Raid support — official source rule: Phillips Watson pilots a Dragon Fire DGR-6FC (1,858 BV / 43 PV), has four Edge tokens and the Patient Edge Ability, and uses Piloting 3 / Gunnery 3 (Alpha Strike Skill 3). He requests 100 SP per track participated in and an additional 50 SP if his ’Mech takes internal damage in more than one location (Alpha Strike: more than 1 structure damage).",
  "Purchase Options — official campaign rule: neither employer has BattleMechs available for purchase. Each month, roll 2D6: on 7+ one ’Mech is available, and on 11+ two ’Mechs are available. Roll on the Federated Suns Purchase Options Table (p. 22) for each. If a ’Mech is available, vehicles or battle armor may also be purchased from the Federated Suns Tanker and Battle Armor Options Tables (p. 22), up to two purchases of each per month."
];

function sunPrairieVariant(trackId) {
  const base = TRACKS.find(track => track.id === trackId);
  return {
    page: 114,
    summary: "The Sun Prairie Garrison and Sun Prairie Raid briefing adds a two-roll monthly track procedure, a Grasslands mapsheet table, and a source-defined Command Complications table to the selected standard mission.",
    setupDetails: sunPrairieSetupDetails,
    special: [...(base?.special || []), ...sunPrairieSpecialRules],
    commandComplications: sunPrairieCommandComplications,
    sourceRefs: ["Draconis Reach pp. 113–115", "Current Draconis Reach master errata"]
  };
}

const tigressCommandComplications = {
  ref: "Draconis Reach pp. 30, 118",
  note: "Official campaign procedure: after the mapsheets are determined, each player rolls 1D6. Add 1 for Liaison Command, 2 for House Command, or 3 for Integrated Command. The browser displays the complete table without selecting or applying a complication automatically.",
  rows: [
    { roll: "1–2", name: "No complication", text: "No complication applies." },
    { roll: "3", name: "Tigress Home Guard support", text: "Starting when both players have entered the map, the Legion Trainers may spend up to 4 BSP per Scale Level (4/8/12 for Scales 1/2/3) on any Battlefield Support Table options under Defensive Aerospace Support or Artillery Support (see p. 78, BMM, or p. 54, AS:CE)." },
    { roll: "4", name: "Rabid Foxes air support", text: "Starting when both players have entered the map, Roughriders Recon may spend up to 4 BSP per Scale Level (4/8/12 for Scales 1/2/3) on any Battlefield Support Table options under Offensive Aerospace Support." },
    { roll: "5–6", name: "Twenty-three-hour day", text: "The twenty-three-hour Tigress day has left all combatants without enough sleep. On a To-Hit roll of 12, a successful attack is a near miss and does no damage." }
  ]
};

const tigressCommonSpecialRules = [
  "Victory — official source rule: either or both players may claim victory in the contract if they successfully complete at least one of the tracks.",
  "Temporary Hire — official source rule: a local mercenary is available to hire. Joachim Vierziger pilots an Avatar AV1-OG (1,775 BV / 34 PV), has four Edge tokens and the Marksman Edge Ability, and uses Piloting 3 / Gunnery 1 (Alpha Strike Skill 2). He demands 300 Support Points per track he participates in.",
  "Purchase Options — official source rule: the Roughriders Recon player may make purchases from the Sea Fox Random Purchase Table (p. 176, one roll per month). The Legion Trainers player may make purchases from the Laurel’s Legion Random Allocation Table (one roll per month). Additionally, the player may purchase any vehicle or infantry on the Sea Fox Tanker and Battle Armor Options Tables (p. 176), up to two purchases of each per month."
];

const tigressTrack1Variant = {
  page: 118,
  displayName: "Training Mission · Meeting Engagement → Recon",
  summary: "Track 1 begins as a Meeting Engagement training mission, then becomes a standard Recon scenario once the trainee ’Mechs enter the battlefield.",
  setup: [
    ...TRACKS.find(track => track.id === "meeting-engagement").setup,
    "Training mission: the trainee force fights a Legion Trainers force of equal BV/PV. All energy weapons are dialed down, ammunition-based weapons use paint rounds, and all damage is tracked as though the weapons are at full power."
  ],
  setupDetails: [
    "Working table interpretation — trainee provenance: the listed Vindicator and Cicada units are scenario-provided trainee ’Mechs, not purchased units or generated OpFor. Roughriders Recon brings and initially controls them. The Roughriders Recon player also brings a force equal to the combined BV/PV of the Legion Trainers and their trainee ’Mechs.",
    "The Roughriders Recon player controls the trainee ’Mechs when they enter. Trainees enter the field 1D6 − 2 turns into the scenario, with a minimum delay of 2 turns.",
    "When the trainees enter, control of the trainee ’Mechs switches from Roughriders Recon to Legion Trainers. Mapsheets for this track are rolled from the Wooded Terrain table.",
    "Track transition: once the trainees enter, proceed as a standard Recon scenario for objectives and VP. Any VP accrued by Legion Trainers during the preceding turns is added to their final total."
  ],
  scaleNotesByScale: {
    "1": ["Scale 1 trainee: one Vindicator VND-7L with Gunnery 4 / Piloting 6 (Alpha Strike Skill 5)."],
    "2": ["Scale 2 trainees: one Vindicator VND-7L and one Cicada CDA-4A, both with Gunnery 4 / Piloting 6 (Alpha Strike Skill 5)."],
    "3": ["Scale 3 trainees: a short lance of three ’Mechs — one Vindicator VND-7L with Gunnery 4 / Piloting 5 (Alpha Strike Skill 4, officer-cadet) and two Cicada CDA-4As with Gunnery 4 / Piloting 6 (Alpha Strike Skill 5)."]
  },
  special: [
    ...TRACKS.find(track => track.id === "recon").special,
    "Training damage and ammunition: when the trainees enter, erase all damage sustained by the Legion Trainers and trainee ’Mechs. Their energy weapons return to full power the following turn. Ammunition-based weapons are effectively defunct, but their ammunition does not explode if a normally explosive slot receives a critical hit; Gauss weapons are the exception.",
    ...tigressCommonSpecialRules
  ],
  commandComplications: tigressCommandComplications,
  sourceRefs: ["Draconis Reach pp. 118–119", "Command complications procedure p. 30", "Current Draconis Reach master errata"]
};

const tigressTrack2Variant = {
  page: 119,
  displayName: "Tigress Meeting Engagement",
  summary: "Track 2 is a Meeting Engagement using the surviving elements from Track 1, with the Roughriders Recon liaison joining their side.",
  setupDetails: [
    "Force carryover: one side consists of any remaining Legion Trainers and trainees that survived Track 1; the other consists of any remaining Roughriders Recon elements.",
    "Roughriders Recon liaison: Captain Sutera Galindo, formerly of the Ceti Hussars and now a member of the elite Rabid Foxes, accompanies Roughriders Recon during Track 2. She pilots a Caesar CES-5D painted in her former unit’s colors, with Gunnery 3 / Piloting 3 (Alpha Strike Skill 3).",
    "Mapsheets for this track are rolled from the Hills Terrain table (see p. 150)."
  ],
  special: [
    ...TRACKS.find(track => track.id === "meeting-engagement").special,
    "Track 1 carryover: all ammunition-based weapons on the Legion Trainers side are loaded with live ammunition. Both sides have had time to repair armor damage and replenish ammunition, but internal structure damage and critical hits remain from Track 1.",
    ...tigressCommonSpecialRules
  ],
  commandComplications: tigressCommandComplications,
  sourceRefs: ["Draconis Reach pp. 118–119", "Command complications procedure p. 30", "Current Draconis Reach master errata"]
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

export const HOT_SPOTS = [
  {
    id: "achernar",
    name: "Achernar",
    region: "Capellan Confederation",
    terrain: "Wooded",
    source: "Draconis Reach pp. 74–77",
    sides: [factionSide("tybalt", "Tybalt", "Mercenary"), factionSide("home-guard", "Home Guard", "Capellan Confederation")],
    tracks: [
      fixedHotSpotTrack(1, "meeting-engagement", "tybalt", "home-guard"),
      winnerDependentTrack(2, [1], {
        tybalt: { trackId: "pursuit", attacker: "tybalt", defender: "home-guard" },
        "home-guard": { trackId: "recon", attacker: "home-guard", defender: "tybalt" }
      }),
      winnerDependentTrack(3, [1, 2], {
        "tybalt|tybalt": { trackId: "strike", attacker: "tybalt", defender: "home-guard" },
        "tybalt|home-guard": { trackId: "meeting-engagement", attacker: "home-guard", defender: "tybalt" },
        "home-guard|tybalt": { trackId: "breakthrough", attacker: "tybalt", defender: "home-guard" },
        "home-guard|home-guard": { trackId: "defend", attacker: "tybalt", defender: "home-guard" }
      }),
      fixedHotSpotTrack(4, "breakthrough", "tybalt", "home-guard"),
      fixedHotSpotTrack(5, "retreat", "home-guard", "tybalt")
    ]
  },
  {
    id: "alta-vista",
    name: "Alta Vista",
    region: "Clan Sea Fox",
    terrain: "Light Urban",
    source: "Draconis Reach pp. 80–81",
    note: "The source allows repeated Meeting Engagement tracks and a conditional extraction choice. The selector exposes the standard Meeting Engagement sequence; the source note remains in the reference card.",
    sides: [factionSide("escobar", "Escobar", "Local"), factionSide("ravens", "Ravens", "Clan Sea Fox")],
    tracks: [
      fixedHotSpotTrack(1, "meeting-engagement", "ravens", "escobar"),
      fixedHotSpotTrack(2, "meeting-engagement", "ravens", "escobar"),
      fixedHotSpotTrack(3, "meeting-engagement", "ravens", "escobar", { label: "Track 3 · optional source continuation" })
    ]
  },
  {
    id: "dahar-iv",
    name: "Dahar IV",
    region: "Federated Suns",
    terrain: "Desert",
    source: "Draconis Reach pp. 84–85",
    note: "Each track uses the source’s 1D6 table. Select the source result for the current track sequence.",
    sides: [factionSide("garrison", "Dahar Garrison", "Federated Suns"), factionSide("raid", "Dahar Raid", "Draconis Combine")],
    tracks: [1, 2, 3, 4, 5, 6].map(sequence => ({
      sequence,
      label: "Track " + sequence,
      resultLabel: "Track result (source 1D6)",
      results: [
        { id: "recon", label: "1 · Recon", trackId: "recon", attacker: "raid", defender: "garrison" },
        { id: "flank", label: "2 · Flank", trackId: "flank", attacker: "raid", defender: "garrison" },
        { id: "strike", label: "3 · Strike", trackId: "strike", attacker: "raid", defender: "garrison" },
        { id: "meeting", label: "4 · Meeting Engagement", trackId: "meeting-engagement", attacker: "garrison", defender: "raid" },
        { id: "assault", label: "5 · Assault", trackId: "assault", attacker: "garrison", defender: "raid" },
        { id: "retreat", label: "6 · Retreat", trackId: "retreat", attacker: "garrison", defender: "raid" }
      ]
    }))
  },
  {
    id: "le-blanc",
    name: "Le Blanc",
    region: "Federated Suns",
    terrain: "Desert",
    source: "Draconis Reach pp. 88–89",
    sides: [factionSide("draconis-combine", "Draconis Combine", "Draconis Combine"), factionSide("federated-suns", "Federated Suns", "Federated Suns")],
    tracks: [
      fixedHotSpotTrack(1, "objective-raid", "draconis-combine", "federated-suns", { displayName: "Objective Raid · Wreck the Place", variant: leBlancTrack1Variant }),
      winnerDependentTrack(2, [1], {
        "draconis-combine": { trackId: "strike", attacker: "draconis-combine", defender: "federated-suns" },
        "federated-suns": { trackId: "retreat", attacker: "federated-suns", defender: "draconis-combine" }
      })
    ]
  },
  {
    id: "lucerne",
    name: "Lucerne / PZH2",
    region: "Draconis Combine",
    terrain: "Wooded",
    source: "Draconis Reach pp. 92–93",
    note: "The source uses a 1D6 table and may generate a second track. Select the source result for each displayed sequence.",
    sides: [factionSide("bio-gen", "Bio-Gen", "Corporate"), factionSide("eclipse", "Eclipse Expeditions", "Mercenary")],
    tracks: [1, 2].map(sequence => ({
      sequence,
      label: "Track " + sequence,
      resultLabel: "Track result (source 1D6)",
      results: [
        { id: "recon", label: "1 · Recon", trackId: "recon", attacker: "eclipse", defender: "bio-gen" },
        { id: "breakthrough", label: "2 · Breakthrough", trackId: "breakthrough", attacker: "eclipse", defender: "bio-gen" },
        { id: "objective-raid", label: "3 · Objective Raid", trackId: "objective-raid", attacker: "eclipse", defender: "bio-gen" },
        { id: "pushback", label: "4 · Pushback", trackId: "pushback", attacker: "bio-gen", defender: "eclipse" },
        { id: "pursuit", label: "5 · Pursuit", trackId: "pursuit", attacker: "eclipse", defender: "bio-gen" },
        { id: "assault", label: "6 · Assault", trackId: "assault", attacker: "eclipse", defender: "bio-gen" }
      ]
    }))
  },
  {
    id: "melcher",
    name: "Melcher",
    region: "Federated Suns / Draconis Combine",
    terrain: "Grasslands",
    source: "Draconis Reach pp. 97–98",
    sides: [factionSide("earwigs", "Earwigs", "Draconis Combine"), factionSide("border-collies", "Border Collies", "Federated Suns")],
    tracks: [
      fixedHotSpotTrack(1, "objective-raid", "earwigs", "border-collies", { displayName: "Oxen Intercept · Objective Raid rules" }),
      fixedHotSpotTrack(2, "objective-raid", "earwigs", "border-collies", { displayName: "Objective Raid" })
    ]
  },
  {
    id: "new-ivaarsen",
    name: "New Ivaarsen",
    region: "Draconis Combine",
    terrain: "Light Urban",
    source: "Draconis Reach pp. 101–102",
    campaignState: {
      title: "Cross-track campaign state",
      note: "Record the source’s running values after each track. These entries remain associated with their track sequence when you switch between New Ivaarsen tracks. Do not count the four buildings designated by the Defender in the Strike track.",
      sourceRefs: ["Draconis Reach pp. 101–102"],
      fields: [
        { id: "stephensonsBuildingDamage", label: "Stephensons building hexes destroyed this track", type: "number", min: 0, default: 0 },
        { id: "isfBuildingDamage", label: "ISF building hexes destroyed this track", type: "number", min: 0, default: 0 },
        { id: "sirDuncanStatus", label: "Sir Duncan Atterton after this track", type: "status", default: "not-recorded" },
        { id: "sionaStatus", label: "Siona Stephenson after this track", type: "status", default: "not-recorded" },
        { id: "specialCharactersPresent", label: "Stephenson special characters present this track", type: "number", min: 0, max: 2, default: 0 }
      ]
    },
    sides: [factionSide("stephensons", "Stephensons", "Draconis Combine"), factionSide("isf", "ISF", "Federated Suns")],
    tracks: [
      fixedHotSpotTrack(1, "strike", "stephensons", "isf"),
      fixedHotSpotTrack(2, "meeting-engagement", "stephensons", "isf"),
      fixedHotSpotTrack(3, "assault", "isf", "stephensons")
    ]
  },
  {
    id: "pascagoula",
    name: "Pascagoula",
    region: "Draconis Combine",
    terrain: "Mountains",
    source: "Draconis Reach pp. 104–106",
    sides: [factionSide("jewel-thieves", "Jewel Thieves", "Draconis Combine"), factionSide("ranger-raiders", "Ranger Raiders", "Federated Suns")],
    tracks: [
      fixedHotSpotTrack(1, "objective-raid", "ranger-raiders", "jewel-thieves", { variant: pascagoulaTrack1Variant }),
      winnerDependentTrack(2, [1], {
        "jewel-thieves": { trackId: "pursuit", attacker: "jewel-thieves", defender: "ranger-raiders" },
        "ranger-raiders": { trackId: "pursuit", attacker: "ranger-raiders", defender: "jewel-thieves" }
      })
    ]
  },
  {
    id: "protection",
    name: "Protection",
    region: "Draconis Combine",
    terrain: "Urban",
    source: "Draconis Reach pp. 110–112",
    note: "Protection contract 138910A–B, Intensity 4: the source frames Platinum Sands and Kanagawa Group as opposing player-controlled mercenary contracts. The browser retains the source’s Track 1–4 sequence and winner-dependent roles; contract pay, Reputation bookkeeping, and no-track months remain reference notes rather than automatic calculations.",
    sides: [factionSide("platinum-sands", "Platinum Sands", "Corporate"), factionSide("kanagawa-group", "Kanagawa Group", "Draconis Combine")],
    tracks: [
      fixedHotSpotTrack(1, "recon", "platinum-sands", "kanagawa-group", { variant: protectionTrack1Variant }),
      winnerDependentTrack(2, [1], {
        "platinum-sands": { trackId: "meeting-engagement", attacker: "platinum-sands", defender: "kanagawa-group", variant: protectionTrack2Variant },
        "kanagawa-group": { trackId: "meeting-engagement", attacker: "kanagawa-group", defender: "platinum-sands", variant: protectionTrack2Variant }
      }),
      winnerDependentTrack(3, [1, 2], {
        "platinum-sands|platinum-sands": { trackId: "assault", attacker: "platinum-sands", defender: "kanagawa-group", variant: protectionVariant("assault", { displayName: "Protection Assault", setupDetails: ["Contract sequence: this is the fourth month. Platinum Sands won both previous tracks, so play Assault with Platinum Sands as Attacker."] }) },
        "kanagawa-group|kanagawa-group": { trackId: "pushback", attacker: "kanagawa-group", defender: "platinum-sands", variant: protectionVariant("pushback", { displayName: "Protection Pushback", setupDetails: ["Contract sequence: this is the fourth month. Kanagawa Group won both previous tracks, so play Pushback with Kanagawa Group as Attacker."] }) },
        "platinum-sands|kanagawa-group": { trackId: "flank", roleChoice: true, variant: protectionTrack3Variant },
        "kanagawa-group|platinum-sands": { trackId: "flank", roleChoice: true, variant: protectionTrack3Variant }
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
    note: "Sun Prairie Garrison and Sun Prairie Raid are opposing player-controlled mercenary contracts. Each month uses two 1D6 results; duplicate track results produce no track for that roll, and result 6 produces no track.",
    sides: [factionSide("garrison", "Sun Prairie Garrison", "Federated Suns"), factionSide("raid", "Sun Prairie Raid", "Draconis Combine")],
    tracks: [1, 2, 3, 4, 5].map(sequence => ({
      sequence,
      label: "Track " + sequence,
      resultLabel: "Track result (source 1D6)",
      results: [
        { id: "breakthrough", label: "1 · Breakthrough", trackId: "breakthrough", attacker: "raid", defender: "garrison", variant: sunPrairieVariant("breakthrough") },
        { id: "objective-raid", label: "2 · Objective Raid", trackId: "objective-raid", attacker: "raid", defender: "garrison", variant: sunPrairieVariant("objective-raid") },
        { id: "strike", label: "3 · Strike", trackId: "strike", attacker: "raid", defender: "garrison", variant: sunPrairieVariant("strike") },
        { id: "recon", label: "4 · Recon", trackId: "recon", attacker: "garrison", defender: "raid", variant: sunPrairieVariant("recon") },
        { id: "meeting-engagement", label: "5 · Meeting Engagement", trackId: "meeting-engagement", attacker: "garrison", defender: "raid", variant: sunPrairieVariant("meeting-engagement") },
        { id: "none", label: "6 · No track this month", trackId: null, attacker: null, defender: null }
      ]
    }))
  },
  {
    id: "tigress",
    name: "Tigress",
    region: "Capellan Confederation",
    terrain: "Wooded / Hills",
    source: "Draconis Reach pp. 118–119",
    note: "Tigress has two opposing player-controlled mercenary contracts. Track 1 is a Meeting Engagement training mission that becomes Recon after the trainees enter; Track 2 is a Meeting Engagement using surviving forces.",
    sides: [factionSide("legion-trainers", "Legion Trainers", "Capellan Confederation"), factionSide("roughriders", "Roughriders Recon", "Mercenary")],
    tracks: [
      fixedHotSpotTrack(1, "recon", "legion-trainers", "roughriders", { variant: tigressTrack1Variant }),
      fixedHotSpotTrack(2, "meeting-engagement", "legion-trainers", "roughriders", { variant: tigressTrack2Variant })
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
  }
];


