export const SOURCES = {
  primary: "Hot Spots: Draconis Reach, First Printing, pp. 167–175",
  errata: "Hot Spots Hinterlands Errata v2.41, reviewed for applicability",
  supersession: "Draconis Reach supersedes the supplied Hinterlands track text; Hinterlands track corrections are not applied to these records.",
  militaryPalette: "BattleTech Faction Colors, palettes/military-ui.yaml, verified main e3cd8c9c9899b04aebd314a2a921ad3edd4092f1"
};

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
    text: "BattleTech / Alpha Strike: default sensors 4 hexes / 9 inches; Light Active Probe 3 / 6; Watchdog 3 / 6; Beagle Active Probe 4 / 9; asset with PRB 4 / N/A; Clan Active Probe 5 / N/A; Bloodhound 8 / 12. Sprinting units cannot scan, and a Fire Control critical hit blocks scanning unless a functioning probe is present.",
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

export const TRACK_NAMES = TRACKS.map(track => track.name);

// Consumer adaptation of the current military-dark-ui palette from
// SANSd20/battletech-faction-colors. These are semantic UI colors, not official
// BattleTech paint specifications. Unsupported identities retain neutral/local
// treatment rather than borrowing a government/faction palette.
export const FACTION_COLORS = {
  "Federated Suns": "#586B31",
  "Draconis Combine": "#9E2B2B",
  "Capellan Confederation": "#3D6D55",
  "Clan Sea Fox": "#66737D",
  "Mercenary": "#7c6854",
  "Corporate": "#ae6c2d",
  "Local": "#66737d",
  "Rebels": "#8d5f83"
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
      fixedHotSpotTrack(1, "objective-raid", "draconis-combine", "federated-suns", { displayName: "Objective Raid · Wreck the Place" }),
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
      fixedHotSpotTrack(1, "objective-raid", "ranger-raiders", "jewel-thieves", { displayName: "Objective Raid · Fifth Ghost" }),
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
    sides: [factionSide("platinum-sands", "Platinum Sands", "Corporate"), factionSide("kanagawa-group", "Kanagawa Group", "Draconis Combine")],
    tracks: [
      fixedHotSpotTrack(1, "recon", "platinum-sands", "kanagawa-group"),
      winnerDependentTrack(2, [1], {
        "platinum-sands": { trackId: "meeting-engagement", attacker: "platinum-sands", defender: "kanagawa-group" },
        "kanagawa-group": { trackId: "meeting-engagement", attacker: "kanagawa-group", defender: "platinum-sands" }
      }),
      winnerDependentTrack(3, [1, 2], {
        "platinum-sands|platinum-sands": { trackId: "assault", attacker: "platinum-sands", defender: "kanagawa-group" },
        "kanagawa-group|kanagawa-group": { trackId: "pushback", attacker: "kanagawa-group", defender: "platinum-sands" },
        "platinum-sands|kanagawa-group": { trackId: "flank", roleChoice: true },
        "kanagawa-group|platinum-sands": { trackId: "flank", roleChoice: true }
      }, { roleChoiceLabel: "Choose the roll-off winner for the Attacker role" }),
      fixedHotSpotTrack(4, "pursuit", "platinum-sands", "kanagawa-group")
    ]
  },
  {
    id: "sun-prairie",
    name: "Sun Prairie",
    region: "Federated Suns",
    terrain: "Grasslands",
    source: "Draconis Reach pp. 114–115",
    note: "Each track uses the source’s 1D6 table. Result 6 produces no track for that month.",
    sides: [factionSide("garrison", "Sun Prairie Garrison", "Federated Suns"), factionSide("raid", "Sun Prairie Raid", "Draconis Combine")],
    tracks: [1, 2, 3, 4, 5].map(sequence => ({
      sequence,
      label: "Track " + sequence,
      resultLabel: "Track result (source 1D6)",
      results: [
        { id: "breakthrough", label: "1 · Breakthrough", trackId: "breakthrough", attacker: "raid", defender: "garrison" },
        { id: "objective-raid", label: "2 · Objective Raid", trackId: "objective-raid", attacker: "raid", defender: "garrison" },
        { id: "strike", label: "3 · Strike", trackId: "strike", attacker: "raid", defender: "garrison" },
        { id: "recon", label: "4 · Recon", trackId: "recon", attacker: "garrison", defender: "raid" },
        { id: "meeting-engagement", label: "5 · Meeting Engagement", trackId: "meeting-engagement", attacker: "garrison", defender: "raid" },
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
    note: "Track 1 begins as a training mission using Meeting Engagement rules and then proceeds as Recon for objectives and VP.",
    sides: [factionSide("legion-trainers", "Legion Trainers", "Capellan Confederation"), factionSide("roughriders", "Roughriders Recon", "Mercenary")],
    tracks: [
      fixedHotSpotTrack(1, "recon", "legion-trainers", "roughriders", { displayName: "Training Mission · Meeting Engagement → Recon" }),
      fixedHotSpotTrack(2, "meeting-engagement", "legion-trainers", "roughriders")
    ]
  },
  {
    id: "xhosa-vii",
    name: "Xhosa VII",
    region: "Federated Suns",
    terrain: "Cold / Hills",
    source: "Draconis Reach pp. 122–123",
    sides: [factionSide("federated-suns", "Federated Suns", "Federated Suns"), factionSide("draconis-combine", "Draconis Combine", "Draconis Combine")],
    tracks: [
      fixedHotSpotTrack(1, "recon", "federated-suns", "draconis-combine"),
      fixedHotSpotTrack(2, "breakthrough", "federated-suns", "draconis-combine"),
      winnerDependentTrack(3, [2], {
        "federated-suns": { trackId: "assault", attacker: "federated-suns", defender: "draconis-combine" },
        "draconis-combine": { trackId: "strike", attacker: "draconis-combine", defender: "federated-suns" }
      })
    ]
  }
];

