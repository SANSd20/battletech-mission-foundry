export const SOURCES = {
  primary: "Hot Spots: Draconis Reach, First Printing, pp. 167–175",
  errata: "Hot Spots Hinterlands Errata v2.41, reviewed for applicability",
  supersession: "Draconis Reach supersedes the supplied Hinterlands track text; Hinterlands track corrections are not applied to these records.",
  militaryPalette: "BattleTech Faction Colors, palettes/military-ui.yaml, verified main e3cd8c9c9899b04aebd314a2a921ad3edd4092f1",
  opposingForces: "Hot Spots: Draconis Reach, First Printing, Opposing Force Tables pp. 186–201"
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
    table: {
      headers: ["Sensor / rule", "BattleTech", "Alpha Strike"],
      rows: [
        ["Default sensors", "4 hexes", "9 inches"],
        ["Light Active Probe", "3 hexes", "6 inches"],
        ["Watchdog", "3 hexes", "6 inches"],
        ["Beagle Active Probe", "4 hexes", "9 inches"],
        ["Asset with PRB", "4 hexes", "N/A"],
        ["Clan Active Probe", "5 hexes", "N/A"],
        ["Bloodhound", "8 hexes", "12 inches"],
        ["LOS", "Ignored with probe within range", "Required within 4 inches"],
        ["Weapon attacks", "No without probe; yes with probe", "No without PRB; yes with PRB"]
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
          "primary": "CMA-2K Chimera (3/4)",
          "support": "×4 Ryu Heavy Transport WiGE (use Vedette Medium Tank asset cards)",
          "alternate": "",
          "note": "All Ghost MechWarriors have Gunnery 3 / Piloting 4."
        },
        "2": {
          "primary": "CMA-2K Chimera (3/4) | JR7-C2 Jenner (3/4)",
          "support": "×4 Ryu Heavy Transport WiGE (use Vedette Medium Tank asset cards)",
          "alternate": "",
          "note": "All Ghost MechWarriors have Gunnery 3 / Piloting 4."
        },
        "3": {
          "primary": "CMA-2K Chimera (3/4) | DMO-5K Daimyo (3/4) | JR7-C2 Jenner (3/4)",
          "support": "×4 Ryu Heavy Transport WiGE (use Vedette Medium Tank asset cards)",
          "alternate": "",
          "note": "All Ghost MechWarriors have Gunnery 3 / Piloting 4."
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
      fixedHotSpotTrack(1, "objective-raid", "ranger-raiders", "jewel-thieves"),
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

