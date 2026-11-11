// Checklist content: the bare-minimum body-off frame swap for a 2007 FJ Cruiser, with
// torque specs and manual paths from the factory manuals (RM0240U repair, BM0240U collision).
// Each step's `id` is permanent (saved progress, notes and photos are keyed by it); the
// P#-## code shown in the app is its position. Loaded before app.js.
const PHASES = [
 {
  "id": "p0",
  "name": "Before you start",
  "blurb": "Two things to settle before anything comes apart.",
  "steps": [
   {
    "id": "p0-03",
    "t": "Check the new frame matches the old one",
    "d": "Set the new frame next to the old one and check every attachment point is there and in the same place:",
    "list": [
     "4 body mount holes per rail (A ø26, C/F/G ø43)",
     "Engine mount brackets and the No.3 crossmember mounts",
     "Front arm pockets, front diff mounts and rack mounts",
     "Rear link, lateral rod, shock and stabilizer mounts",
     "Bumper reinforcement nuts (M10) and the brake/fuel line clip holes"
    ],
    "after": "Measure 2–3 diagonals between body mount holes and log them in Frame check. If anything is missing or off, stop here.",
    "tools": [
     "Tape measure",
     "Camera"
    ],
    "man": [
     "BM0240U@2007 › Vehicle Exterior › Body Dimension Drawings › Frame Dimension-Upper Face (Three-Dimensional Distance)",
     "BM0240U@2007 › Vehicle Exterior › Body Dimension Drawings › Frame Dimension-Lower Face (Three-Dimensional Distance)"
    ]
   },
   {
    "id": "p0-05",
    "t": "Have the single-use parts and fluids on hand",
    "d": "The manual says these can't be reused, and the job needs the fluids:",
    "list": [
     "8 cab mount lock nuts (and cushions, if yours are cracked)",
     "2 cotter pins for the tie rod ends",
     "2 rear shock upper nuts and 2 rear stabilizer link-to-frame nuts",
     "Brake hose clips",
     "Exhaust gaskets and manifold nuts",
     "4 fuel tank cushions",
     "A/T control cable clip (A/T)",
     "Fluids: DOT 3 brake fluid, Toyota SLLC coolant, GL-5 gear oil for the front diff, power steering fluid, ATF WS (A/T)"
    ],
    "tools": [
     "Parts diagrams"
    ],
    "refs": [
     [
      "OEM parts diagrams",
      "https://www.toyotapartsdeal.com/parts-list/2007-toyota-fj_cruiser/body/frame.html"
     ]
    ]
   }
  ]
 },
 {
  "id": "p1",
  "name": "Engine bay",
  "blurb": "Disconnect everything that runs between the body and the engine. The radiator, shroud, A/C condenser, brake booster and ECM stay on the body. The engine, transmission and rack stay on the frame.",
  "steps": [
   {
    "id": "p1-01",
    "t": "Relieve fuel pressure",
    "d": "Do this first, while the engine still runs. The fuel lines move to the new frame later, and the fuel pump relay is on the body:",
    "list": [
     "Disconnect the battery negative.",
     "Remove the relay block upper cover and pull the circuit opening relay.",
     "Reconnect the negative, start the engine and let it stall.",
     "Turn the key to ON, crank again and confirm it won't run.",
     "Remove the fuel cap, then reinstall the relay."
    ],
    "tools": [
     "Relay puller",
     "Fire extinguisher"
    ],
    "warn": "Codes P0171/P0174 may set; clear them later. Some pressure remains, so wrap joints with a rag when you open them.",
    "specs": [
     {
      "f": "Battery negative terminal",
      "nm": "3.9",
      "imp": "35 in·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE FUEL › FUEL SYSTEM › PRECAUTION"
    ]
   },
   {
    "id": "p1-03",
    "t": "Disconnect the battery and wait 90 seconds",
    "d": "Ignition and headlight switch off. Loosen the terminal nut fully without twisting the cable. Wait at least 90 seconds before any airbag-related work; the SRS has a backup power source. Don't use a memory saver. Clock, radio and DTC memory will be erased.",
    "tools": [
     "10 mm wrench"
    ],
    "man": [
     "RM0240U@2007 › General › INTRODUCTION › REPAIR INSTRUCTION › PRECAUTION"
    ]
   },
   {
    "id": "p1-02",
    "t": "Center the steering and separate the shaft",
    "d": "Wheels straight ahead. Tie the steering wheel with the seat belt so it can't turn; that protects the airbag clock spring. Matchmark the sliding yoke and both shafts, then remove yoke bolts A and B and slide the yoke off.",
    "warn": "Don't turn the steering wheel until the shaft is back together.",
    "tools": [
     "Metric sockets",
     "Paint pen"
    ],
    "specs": [
     {
      "f": "Yoke / intermediate shaft bolts A, B, C",
      "nm": "36",
      "imp": "27 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Steering › STEERING COLUMN › STEERING COLUMN ASSEMBLY › REMOVAL"
    ],
    "refs": [
     [
      "ToyTec photos",
      "https://toyteclifts.com/pub/media/mageworx/downloads/attachment/file/0/5/05b1-k_1.pdf"
     ]
    ]
   },
   {
    "id": "p1-06",
    "t": "Drain the coolant",
    "d": "Remove the service hole cover in the engine under cover and put a hose on the radiator drain. Loosen the 3 drain plugs (radiator and engine), remove the radiator cap and drain the reservoir. Capacity is 9.8 L (A/T) or 9.4 L (M/T).",
    "tools": [
     "Drain pan",
     "Hose"
    ],
    "specs": [
     {
      "f": "Engine drain plugs",
      "nm": "13",
      "imp": "9 ft·lbf",
      "note": ""
     },
     {
      "f": "No.1 engine under cover",
      "nm": "29",
      "imp": "21 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE COOLING › COOLANT › REPLACEMENT"
    ]
   },
   {
    "id": "p1-09",
    "t": "Disconnect the radiator and take the fan off",
    "d": "The radiator and shroud stay in the body. Only what connects to the engine comes off:",
    "list": [
     "Remove the upper radiator support seal (7 clips).",
     "Loosen the 4 fan pulley nuts while the belt is still on, then remove the belt (turn the tensioner counterclockwise).",
     "Take off the 4 nuts and zip-tie the fan and its fluid coupling inside the shroud so it lifts with the body.",
     "Disconnect both radiator hoses at the engine.",
     "A/T: disconnect the 2 oil cooler hoses at the radiator and plug them."
    ],
    "tools": [
     "Metric sockets",
     "Hose clamp pliers",
     "Line plugs",
     "Zip ties"
    ],
    "specs": [
     {
      "f": "Fan pulley nuts (on reinstall)",
      "nm": "21",
      "imp": "16 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE COOLING › RADIATOR › REMOVAL",
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE ENGINE MECHANICAL › DRIVE BELT › REMOVAL"
    ]
   },
   {
    "id": "p1-11",
    "t": "Disconnect the heater hoses",
    "d": "Spring clips at the heater unit; slide them with pliers. Note the clip angle and the hose paint marks for reassembly. Cap both ends.",
    "tools": [
     "Hose clamp pliers",
     "Caps"
    ],
    "man": [
     "RM0240U@2007 › Vehicle Interior › AIR CONDITIONING › AIR CONDITIONING UNIT › REMOVAL"
    ]
   },
   {
    "id": "p1-10",
    "t": "Unbolt the A/C compressor and hang it from the body",
    "d": "Toyota's own engine removal leaves the A/C sealed. Unplug the compressor connector, remove its 4 bolts, and tie the compressor up in the engine bay so it lifts with the body. No refrigerant recovery and no recharge.",
    "warn": "Don't kink or stretch the hoses. Before the lift, check the compressor will rise clear of the engine. If it can't, have the refrigerant recovered and disconnect the hoses at the compressor instead; then you'll need the recharge step in Phase 7.",
    "tools": [
     "Metric sockets",
     "Rope or ratchet strap"
    ],
    "specs": [
     {
      "f": "Compressor bolts (on reinstall)",
      "nm": "24.5",
      "imp": "18 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE ENGINE MECHANICAL › ENGINE ASSEMBLY › REMOVAL"
    ]
   },
   {
    "id": "p1-13",
    "t": "Pull the intake tube off the throttle body",
    "d": "The airbox is on the body and the throttle body is on the engine. Loosen the clamp at the throttle body and pull the tube off.",
    "tools": [
     "Screwdriver"
    ]
   },
   {
    "id": "p1-12",
    "t": "Free the power steering cooler pipe from the body",
    "d": "The collision manual's engine-compartment drawing lists a power steering cooler pipe bracket nut (M6) on the body. Unbolt that bracket so the pipe stays with the chassis. Look for any other PS line clips on the body too.",
    "tools": [
     "10 mm socket"
    ],
    "man": [
     "BM0240U@2007 › Vehicle Exterior › Body Dimension Drawings › Body Dimension Drawings-Engine Compartment"
    ]
   },
   {
    "id": "p1-15",
    "t": "Disconnect the engine harness and pull it into the engine bay",
    "d": "The ECM is <b>inside the cab behind the glove box</b>. The manual's engine removal pulls the harness out through the firewall:",
    "list": [
     "Remove the glove box. On an A/T 4WD, also remove the 4WD control ECU No.2.",
     "Unplug the 3 ECM connectors, the 2 A/C unit connectors, the body ground, and on an A/T 4WD the 4WD ECU and front diff connectors.",
     "Feed the engine wire through the firewall into the engine room.",
     "No.2 engine wire: unplug at the engine room relay block (connector and nut), plus the body ground and the frame ground."
    ],
    "tools": [
     "Trim tools",
     "10/12 mm sockets",
     "Blue tape flags",
     "Zip bags"
    ],
    "warn": "Photograph each connector before unplugging it. Press the release tab and wiggle; old tabs are brittle.",
    "specs": [
     {
      "f": "Frame ground",
      "nm": "19",
      "imp": "14 ft·lbf",
      "note": ""
     },
     {
      "f": "Body ground",
      "nm": "8.4",
      "imp": "74 in·lbf",
      "note": ""
     },
     {
      "f": "Relay block wire nut",
      "nm": "10",
      "imp": "7.4 ft·lbf",
      "note": ""
     },
     {
      "f": "ECM nuts (if removed)",
      "nm": "8.0",
      "imp": "71 in·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE ENGINE MECHANICAL › ENGINE ASSEMBLY › REMOVAL",
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE ENGINE CONTROL SYSTEM › ECM › REMOVAL",
     "EM0240U › routing"
    ]
   },
   {
    "id": "p1-17",
    "t": "Disconnect the clutch line",
    "v": "mt",
    "d": "Separate the clutch tube at the flexible hose, using the 10 mm flare wrench, where the line passes from the body to the transmission. Plug both ends; don't let the reservoir run dry.",
    "tools": [
     "10 mm flare-nut wrench",
     "Plugs"
    ],
    "specs": [
     {
      "f": "Release cylinder flexible hose tube",
      "nm": "15",
      "imp": "11 ft·lbf",
      "note": ""
     },
     {
      "f": "Accumulator hose tube flare nut",
      "nm": "15",
      "imp": "11 ft·lbf",
      "note": ""
     },
     {
      "f": "Clutch line bracket",
      "nm": "12",
      "imp": "8.7 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Drivetrain › CLUTCH › CLUTCH RELEASE CYLINDER › REMOVAL"
    ]
   },
   {
    "id": "p1-08",
    "t": "Remove the front bumper",
    "d": "It's attached to both the body and the frame, and it's in the way of the front cab mounts. You're replacing it with a steel bumper, so take it off in whatever order is easiest: grille, cover, then the reinforcement and its extensions (4 nuts each).",
    "tools": [
     "Trim tools",
     "Metric sockets",
     "Helper"
    ],
    "man": [
     "RM0240U@2007 › Vehicle Exterior › EXTERIOR › FRONT BUMPER › REMOVAL"
    ],
    "refs": [
     [
      "ToyTec photos",
      "https://toyteclifts.com/pub/media/mageworx/downloads/attachment/file/0/5/05b1-k_1.pdf"
     ]
    ]
   },
   {
    "id": "p1-19",
    "t": "Unclip the front fender splash shields",
    "d": "Pull the splash shield clips (5–6 per side; the manual's pages don't agree on the count) where they meet the frame side.",
    "tools": [
     "Clip pliers"
    ]
   }
  ]
 },
 {
  "id": "p2",
  "name": "Cab and underbody",
  "blurb": "The rest of the connections between the body and the chassis.",
  "steps": [
   {
    "id": "p2-04",
    "t": "Remove the automatic shifter linkages",
    "v": "at",
    "d": "<b>Transfer lever:</b> remove the A/T and transfer knobs and the boot (4 screws). Remove the snap ring and pull the transfer high/low lever out of its retainer. <b>A/T cable:</b> at the transmission, remove the nut and clip to free the cable, and 2 bolts for the bracket. Photograph the adjustment first.",
    "tools": [
     "Snap ring pliers",
     "Pliers",
     "Metric sockets"
    ],
    "specs": [
     {
      "f": "Control cable nut at transmission",
      "nm": "14",
      "imp": "10 ft·lbf",
      "note": "New clip"
     },
     {
      "f": "Control cable bracket",
      "nm": "14",
      "imp": "10 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Drivetrain › A750F AUTOMATIC TRANSMISSION › AUTOMATIC TRANSMISSION ASSEMBLY › REMOVAL"
    ]
   },
   {
    "id": "p2-05",
    "t": "Remove the manual shift levers",
    "v": "mt",
    "d": "Remove the transfer and M/T knobs and the boot (4 screws, 2 clips). Transfer lever: snap ring off, pull it from the retainer. M/T lever: lift the cap boot, cover the cap with a rag, press down, turn counterclockwise and pull it out.",
    "tools": [
     "Snap ring pliers",
     "Rag"
    ],
    "man": [
     "RM0240U@2007 › Drivetrain › RA61F MANUAL TRANSMISSION › MANUAL TRANSMISSION ASSEMBLY › REMOVAL"
    ]
   },
   {
    "id": "p2-06",
    "t": "Unhook the parking brake cables inside the cab",
    "d": "Remove the parking brake hole cover, console upper rear panel and front console box to reach the lever. The rear cables (No.2 and No.3) hook straight onto the pull rod. Loosen the adjusting nut, unhook both cable ends, squeeze the spring cap claws and push the cables down through the floor. They stay with the chassis.",
    "tools": [
     "Metric sockets",
     "Pliers"
    ],
    "man": [
     "RM0240U@2007 › Brake › PARKING BRAKE › PARKING BRAKE CABLE › REMOVAL"
    ]
   },
   {
    "id": "p2-03",
    "t": "Disconnect the fuel pump connector",
    "d": "Remove the LH rear seat cushion (2 bolts), fold back the carpet, remove the service hole cover (3 screws) and unplug the fuel pump connector.",
    "tools": [
     "Phillips"
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE FUEL › FUEL TANK › REMOVAL"
    ],
    "specs": [
     {
      "f": "Rear seat cushion bolts (on reinstall)",
      "nm": "37",
      "imp": "27 ft·lbf",
      "note": ""
     }
    ]
   },
   {
    "id": "p2-09",
    "t": "Disconnect the filler neck and EVAP hoses at the tank",
    "d": "The filler neck and charcoal canister are on the body; the tank is on the frame. Loosen the filler hose clamp at the tank and disconnect the breather tube quick connector. At the canister, disconnect the vent, outlet and EVAP hoses and the leak detection pump connector.",
    "warn": "Quick connectors: pinch the retainer and pull by hand, never with tools. Bag the open ends.",
    "tools": [
     "Pliers",
     "Plugs",
     "Zip bags"
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE FUEL › FUEL TANK › REMOVAL",
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE EMISSION CONTROL › CANISTER › REMOVAL"
    ]
   },
   {
    "id": "p2-07",
    "t": "Split the brake lines away from the booster",
    "d": "Key OFF, then pump the brake pedal 20+ times to release the booster's accumulator pressure. Follow the 4 tubes from the booster on the cowl down to where they leave the body, separate them at the first union past the body, and plug each end right away.",
    "tools": [
     "10 mm flare-nut wrench",
     "Line plugs",
     "Red tape",
     "Rags"
    ],
    "warn": "Don't open the lines at the booster, and don't let the reservoir run dry. If either happens, the manual requires a master cylinder solenoid bleed with a Techstream scan tool.",
    "specs": [
     {
      "f": "Brake line flare (union) nuts",
      "nm": "15",
      "imp": "11 ft·lbf",
      "note": "14 N·m (10 ft·lbf) using SST 09023-00101 on a 300 mm wrench"
     }
    ],
    "man": [
     "RM0240U@2007 › Brake › BRAKE › HYDRAULIC BRAKE BOOSTER › REMOVAL",
     "RM0240U@2007 › Brake › BRAKE › BRAKE FLUID › BLEEDING"
    ]
   },
   {
    "id": "p2-10",
    "t": "Unplug the chassis harness connectors",
    "d": "Anywhere a body harness meets a chassis harness: ABS sensor leads, rear diff lock actuator, A.D.D. actuator, trailer wiring and the body-to-frame grounds. Also unhook the diff and transfer breather hoses and the A.D.D. vacuum hoses if they're clipped to the body. Flag both halves of every connector.",
    "tools": [
     "Trim tools",
     "Picks",
     "Blue tape"
    ],
    "man": [
     "EM0240U › routing",
     "RM0240U@2007 › Drivetrain › DIFFERENTIAL › DIFFERENTIAL VACUUM ACTUATOR › REPLACEMENT"
    ]
   }
  ]
 },
 {
  "id": "p3",
  "name": "Lift the body",
  "blurb": "The manual's lift rules: rubber pads, lock the arms, lift a little and rock it to check it's stable.",
  "steps": [
   {
    "id": "p3-01",
    "t": "Final walkaround",
    "d": "Go through phases 1 and 2 again with a flashlight and look for anything still running between the body and the chassis. Check the shifter area, parking brake cables, steering yoke, harness at the firewall, brake lines, PS cooler pipe, breathers and filler neck.",
    "tools": [
     "Flashlight",
     "Mirror"
    ]
   },
   {
    "id": "p2-11",
    "t": "Remove the 8 cab mount nuts",
    "d": "Four per side: No.1, No.2, No.4 and the rear end mount. The bolts stay in the body. Take the lock nuts off from underneath and throw them away.",
    "warn": "If a bolt spins, hold the head from inside (pull back the carpet, or for the front passenger mount, unbolt the washer bottle). If it still won't hold, cut the nut off.",
    "tools": [
     "1/2″ breaker bar",
     "Impact",
     "Deep sockets",
     "Penetrating oil",
     "Torch or cutoff wheel"
    ],
    "specs": [
     {
      "f": "Cab mounts No.1, No.2, No.4, rear end",
      "nm": "45",
      "imp": "33 ft·lbf",
      "note": "Tighten vertically; new lock nuts"
     }
    ],
    "man": [
     "BM0240U@2007 › Vehicle Exterior › Body Panel Replacement › Body Lower Back Panel (Cut)"
    ],
    "refs": [
     [
      "ToyTec photos",
      "https://toyteclifts.com/pub/media/mageworx/downloads/attachment/file/0/5/05b1-k_1.pdf"
     ]
    ]
   },
   {
    "id": "p3-03",
    "t": "Set the lift arms on the body",
    "d": "The factory lift points are on the frame, so choose body pickup points next to the cab mount brackets and floor structure. Use rubber pads, wood blocks and tall adapters. Keep the doors on and closed. Center the body's weight between the arms and lock the arms.",
    "tools": [
     "2×6 blocks",
     "Tall adapters"
    ],
    "warn": "Don't lift on the rocker pinch welds alone. With the engine staying on the frame, the empty body is light in front, so find its balance before you go high.",
    "man": [
     "RM0240U@2007 › General › INTRODUCTION › REPAIR INSTRUCTION › VEHICLE LIFT AND SUPPORT LOCATIONS",
     "BM0240U@2007 › General › Introduction › Notice About Vehicle Condition When Jacking Up Vehicle"
    ]
   },
   {
    "id": "p3-04",
    "t": "Lift slowly, then raise until the engine clears",
    "d": "Lift 2–3 inches and rock the body gently to check it's stable. Walk around with a helper and look for anything still connected. Then raise it until the intake and the top of the engine clear the radiator support and firewall, and lock the lift.",
    "tools": [
     "2 helpers"
    ],
    "refs": [
     [
      "ToyTec photos",
      "https://toyteclifts.com/pub/media/mageworx/downloads/attachment/file/0/5/05b1-k_1.pdf"
     ]
    ]
   },
   {
    "id": "p3-06",
    "t": "Roll the chassis out",
    "d": "Wheels straight, then push it clear of the lift.",
    "tools": [
     "2 helpers"
    ],
    "warn": "Nobody goes under the raised body."
   },
   {
    "id": "p3-02",
    "t": "Leave the body supported",
    "d": "Leave it locked on the lift, or set it on a dolly or 4 tall stands if you want the lift for the chassis work.",
    "tools": [
     "Tall stands or dolly (optional)"
    ]
   }
  ]
 },
 {
  "id": "p4",
  "name": "Strip the old chassis",
  "blurb": "Move whole assemblies; don't take apart anything that can go across in one piece.",
  "steps": [
   {
    "id": "p4-01",
    "t": "Photograph the line and harness routing",
    "d": "Before anything comes off, photograph every brake, fuel and harness clip along the frame. You'll copy the routing onto the new frame.",
    "tools": [
     "Camera"
    ]
   },
   {
    "id": "p4-02",
    "t": "Remove the propeller shafts",
    "d": "Matchmark each flange to the diff and the transfer, then remove the 4 bolts or nuts at each end.",
    "tools": [
     "Paint pen",
     "Metric sockets"
    ],
    "specs": [
     {
      "f": "All propeller shaft flange joints",
      "nm": "88",
      "imp": "65 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Drivetrain › PROPELLER SHAFT › REAR PROPELLER SHAFT ASSEMBLY › REMOVAL",
     "RM0240U@2007 › Drivetrain › PROPELLER SHAFT › FRONT PROPELLER SHAFT ASSEMBLY (for 4WD) › REMOVAL"
    ]
   },
   {
    "id": "p4-03",
    "t": "Remove the exhaust",
    "d": "Unplug the heated oxygen sensors first, then remove the tail pipe, center pipe (with springs), No.2 front pipe and front pipe. The gaskets and manifold nuts are single-use.",
    "tools": [
     "O2 sensor socket",
     "Penetrating oil",
     "Torch"
    ],
    "specs": [
     {
      "f": "Front pipe x manifold",
      "nm": "54",
      "imp": "40 ft·lbf",
      "note": "New nuts and gaskets"
     },
     {
      "f": "No.2 front pipe nut",
      "nm": "54",
      "imp": "40 ft·lbf",
      "note": ""
     },
     {
      "f": "No.2 front pipe bolt",
      "nm": "48",
      "imp": "35 ft·lbf",
      "note": ""
     },
     {
      "f": "Center pipe bolts (with springs)",
      "nm": "43",
      "imp": "32 ft·lbf",
      "note": "Spring free length at least 40.5 mm"
     },
     {
      "f": "Tail pipe",
      "nm": "48",
      "imp": "35 ft·lbf",
      "note": ""
     },
     {
      "f": "Stopper bracket (4WD)",
      "nm": "19",
      "imp": "14 ft·lbf",
      "note": ""
     },
     {
      "f": "Heated O2 sensor",
      "nm": "44",
      "imp": "33 ft·lbf",
      "note": "The exhaust table says 43"
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE EXHAUST › EXHAUST PIPE › REMOVAL"
    ]
   },
   {
    "id": "p4-04",
    "t": "Remove the engine, transmission and transfer case",
    "d": "Moving them as one unit:",
    "list": [
     "Disconnect and cap the power steering pressure feed tube at the gear.",
     "Hang the engine from the hangers with a leveler.",
     "Support the transmission on a jack.",
     "Remove the front suspension member brackets (4 bolts each side).",
     "Remove the No.3 frame crossmember.",
     "Remove the 4 bolts and 4 nuts holding the engine mount insulators to the frame brackets.",
     "Lift and roll it out."
    ],
    "tools": [
     "Engine hoist",
     "Load leveler",
     "Transmission jack",
     "Line caps",
     "Helper"
    ],
    "specs": [
     {
      "f": "Engine mount insulators x frame brackets (4 bolts, 4 nuts)",
      "nm": "38",
      "imp": "28 ft·lbf",
      "note": ""
     },
     {
      "f": "No.3 frame crossmember (4 bolts + 4 nuts)",
      "nm": "72",
      "imp": "53 ft·lbf",
      "note": ""
     },
     {
      "f": "No.3 crossmember x mount insulator (4)",
      "nm": "19",
      "imp": "14 ft·lbf",
      "note": ""
     },
     {
      "f": "Rear No.1 mount insulator x transmission (4)",
      "nm": "65",
      "imp": "48 ft·lbf",
      "note": ""
     },
     {
      "f": "Front suspension member brackets",
      "nm": "33",
      "imp": "24 ft·lbf",
      "note": ""
     },
     {
      "f": "Engine hanger bolts",
      "nm": "33",
      "imp": "24 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE ENGINE MECHANICAL › ENGINE ASSEMBLY › REMOVAL",
     "RM0240U@2007 › Drivetrain › A750F AUTOMATIC TRANSMISSION › AUTOMATIC TRANSMISSION ASSEMBLY › REMOVAL",
     "RM0240U@2007 › Drivetrain › RA61F MANUAL TRANSMISSION › MANUAL TRANSMISSION ASSEMBLY › REMOVAL",
     "RM0240U@2007 › Steering › POWER STEERING › POWER STEERING LINK (for 4WD) › REMOVAL"
    ]
   },
   {
    "id": "p4-05",
    "t": "Remove the front suspension corners as assemblies",
    "d": "Each corner (knuckle, hub, brake, both arms, coilover and CV axle) comes out in one piece, so the ball joints, hub nuts and brakes stay together. Matchmark the camber and toe cams on the lower arms first.",
    "list": [
     "Separate the stabilizer links at the knuckles and unbolt the stabilizer bar from the frame.",
     "Separate the tie rod ends from the knuckles.",
     "Separate the front brake hoses from the frame lines at their brackets, and unbolt the ABS sensor wire brackets.",
     "Support the lower arm on a jack. Remove the upper arm pivot bolt and the 3 coilover nuts on top of the frame.",
     "Remove the lower arm cam bolts.",
     "Pull the CV axle's inner end out of the diff and lower the corner out."
    ],
    "warn": "Lower arm cam bolts often seize in their sleeves on rusty trucks. Have new cam bolt kits on hand before you start.",
    "tools": [
     "Tie rod end puller",
     "Floor jack",
     "Breaker bar",
     "Pry bar",
     "Paint pen",
     "10 mm flare-nut wrench"
    ],
    "man": [
     "RM0240U@2007 › Suspension › SUSPENSION › FRONT SHOCK ABSORBER WITH COIL SPRING › REMOVAL",
     "RM0240U@2007 › Suspension › SUSPENSION › FRONT UPPER SUSPENSION ARM › REMOVAL",
     "RM0240U@2007 › Suspension › SUSPENSION › FRONT LOWER SUSPENSION ARM › REMOVAL"
    ]
   },
   {
    "id": "p4-06",
    "t": "Remove the front differential",
    "d": "Drain it (the CV axles are already out). Remove the breather bracket bolt and disconnect the A.D.D. connector and vacuum hose if you have them. Support it on a jack, remove the No.1 mounting nut, then the 2 mounting bolts and 2 nuts, and lower it.",
    "tools": [
     "Transmission jack",
     "Metric sockets"
    ],
    "man": [
     "RM0240U@2007 › Drivetrain › DIFFERENTIAL › FRONT DIFFERENTIAL CARRIER ASSEMBLY › REMOVAL"
    ]
   },
   {
    "id": "p4-07",
    "t": "Remove the steering gear",
    "d": "The power steering feed tube is already off (engine step). Disconnect the return hose (clip only), then remove the 2 bolts and 2 nuts holding the gear to the frame.",
    "tools": [
     "Metric sockets"
    ],
    "warn": "The nuts have a detent. On install, turn only the bolt, never the nut.",
    "man": [
     "RM0240U@2007 › Steering › POWER STEERING › POWER STEERING LINK (for 4WD) › REMOVAL"
    ]
   },
   {
    "id": "p4-08",
    "t": "Remove the rear axle as an assembly",
    "d": "The axle, brakes, springs, shocks and links come out together. The parking brake cables stay on the axle; they just unbolt from the frame.",
    "list": [
     "Support the axle housing on a jack.",
     "Separate the brake tube from the rear flexible hose at the frame bracket.",
     "Unbolt the parking brake cables from the frame (5 bolts; the RH heat insulator comes off first).",
     "Unplug the ABS and diff lock connectors and unhook the breather at the frame.",
     "Remove the shock upper nuts, the stabilizer link-to-frame nuts, the lateral rod frame bolt, and the upper and lower arm frame bolts.",
     "Lower the axle and springs slowly."
    ],
    "warn": "The manual says not to snap the brake line or parking brake cable as the housing comes down.",
    "tools": [
     "2 floor jacks",
     "10 mm flare-nut wrench",
     "Metric sockets"
    ],
    "man": [
     "RM0240U@2007 › Suspension › SUSPENSION › REAR COIL SPRING › REMOVAL",
     "RM0240U@2007 › Brake › PARKING BRAKE › PARKING BRAKE CABLE › REMOVAL"
    ]
   },
   {
    "id": "p2-08",
    "t": "Remove the fuel tank",
    "d": "Support the tank on a jack.",
    "list": [
     "Remove the No.1 protector (4 nuts, bracket nut).",
     "Disconnect the main and return tube quick connectors and the vent hose.",
     "Remove the 2 bands and lower the tank."
    ],
    "warn": "Quick connectors: pinch the retainer and pull by hand. Clean them first and bag the ends.",
    "tools": [
     "Transmission jack",
     "Metric sockets",
     "Fire extinguisher"
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE FUEL › FUEL TANK › REMOVAL"
    ]
   },
   {
    "id": "p4-09",
    "t": "Strip the lines and harness off the frame",
    "d": "Brake tubes, fuel and EVAP lines, the frame harness and grounds. Bag the clips by location.",
    "tools": [
     "Flare-nut wrenches",
     "Trim tools",
     "Zip bags"
    ]
   }
  ]
 },
 {
  "id": "p5",
  "name": "Build the new chassis",
  "blurb": "Snug every suspension pivot now. Final torque happens at ride height in Phase 7.",
  "steps": [
   {
    "id": "p5-02",
    "t": "Lines and harness onto the new frame",
    "d": "Follow your routing photos and use new clips: brake tubes, fuel and EVAP lines, the frame harness and grounds. Keep lines clear of sharp edges, moving parts and the exhaust.",
    "tools": [
     "Tubing cutter",
     "Bender",
     "Flaring tool",
     "10 mm flare-nut wrench"
    ],
    "specs": [
     {
      "f": "Brake flare (union) nuts",
      "nm": "15",
      "imp": "11 ft·lbf",
      "note": "14 N·m with SST"
     },
     {
      "f": "Frame ground",
      "nm": "19",
      "imp": "14 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › General › MAINTENANCE › BRAKE › GENERAL MAINTENANCE"
    ]
   },
   {
    "id": "p5-13",
    "t": "Install the fuel tank",
    "d": "4 new cushions on the tank, then:",
    "list": [
     "Lift it into place on a jack and install the 2 bands.",
     "Connect the main and return tubes (push until they click, then pull to check) and the vent hose.",
     "Install the No.1 protector."
    ],
    "tools": [
     "Transmission jack",
     "Torque wrench"
    ],
    "specs": [
     {
      "f": "Fuel tank bands",
      "nm": "40",
      "imp": "30 ft·lbf",
      "note": ""
     },
     {
      "f": "No.1 protector x band",
      "nm": "20",
      "imp": "15 ft·lbf",
      "note": ""
     },
     {
      "f": "No.3 protector x tank",
      "nm": "5.0",
      "imp": "44 in·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE FUEL › FUEL TANK › INSTALLATION"
    ]
   },
   {
    "id": "p5-04",
    "t": "Install the rear axle",
    "d": "Lift the axle assembly into place with the springs seated. Bolt the arms, lateral rod, shocks and stabilizer links to the frame (snug only), bolt the parking brake cables back to the frame, and reconnect the brake tube to the rear flexible hose with a new clip.",
    "tools": [
     "2 floor jacks",
     "Metric sockets"
    ],
    "specs": [
     {
      "f": "Upper control arms x frame and axle",
      "nm": "80",
      "imp": "59 ft·lbf",
      "note": "Ride height. Hold the bolt, turn the nut."
     },
     {
      "f": "Lower control arms x frame and axle",
      "nm": "130",
      "imp": "96 ft·lbf",
      "note": "Ride height. Hold the nut, turn the bolt."
     },
     {
      "f": "Lateral control rod x frame and axle",
      "nm": "130",
      "imp": "96 ft·lbf",
      "note": "Ride height. Hold the nut, turn the bolt."
     },
     {
      "f": "Rear shock upper x frame",
      "nm": "25",
      "imp": "18 ft·lbf",
      "note": "New nut; hold the piston rod"
     },
     {
      "f": "Stabilizer link x frame",
      "nm": "15",
      "imp": "11 ft·lbf",
      "note": "New nut"
     },
     {
      "f": "Brake tube x flexible hose",
      "nm": "15",
      "imp": "11 ft·lbf",
      "note": "New clips"
     },
     {
      "f": "Parking brake cable x frame (5 bolts)",
      "nm": "13",
      "imp": "9 ft·lbf",
      "note": ""
     },
     {
      "f": "Cable heat insulator",
      "nm": "13",
      "imp": "9 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Suspension › SUSPENSION › REAR COIL SPRING › INSTALLATION"
    ]
   },
   {
    "id": "p5-05",
    "t": "Install the front differential",
    "d": "Lift it into place on a jack and bolt it to the frame. Reconnect the breather bracket, and the A.D.D. connector and vacuum hose if you have them.",
    "tools": [
     "Transmission jack",
     "Torque wrench"
    ],
    "specs": [
     {
      "f": "Front diff mounting bolts and nuts x frame",
      "nm": "137",
      "imp": "101 ft·lbf",
      "note": ""
     },
     {
      "f": "No.1 diff mounting nut",
      "nm": "87",
      "imp": "64 ft·lbf",
      "note": ""
     },
     {
      "f": "A.D.D. actuator bolts",
      "nm": "21",
      "imp": "15 ft·lbf",
      "note": ""
     },
     {
      "f": "Breather bracket",
      "nm": "13",
      "imp": "10 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Drivetrain › DIFFERENTIAL › FRONT DIFFERENTIAL CARRIER ASSEMBLY › INSTALLATION"
    ]
   },
   {
    "id": "p5-06",
    "t": "Install the steering gear",
    "d": "Bolt the gear to the frame, turning only the bolt (the nut has a detent). Reconnect the return hose.",
    "tools": [
     "Torque wrench"
    ],
    "specs": [
     {
      "f": "Steering gear x frame (2 bolts, 2 nuts)",
      "nm": "100",
      "imp": "74 ft·lbf",
      "note": "Turn only the bolt"
     },
     {
      "f": "PS tube brackets",
      "nm": "28",
      "imp": "21 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Steering › POWER STEERING › POWER STEERING LINK (for 4WD) › INSTALLATION"
    ]
   },
   {
    "id": "p5-07",
    "t": "Install the front corners",
    "d": "Slide each CV axle into the diff until its snap ring clicks, then bolt the corner to the frame. Line up the cam matchmarks. Snug the arm pivots; final torque at ride height.",
    "list": [
     "Lower arm cam bolts.",
     "Upper arm pivot bolt.",
     "3 coilover nuts on top of the frame. The coil spring's lower end faces the rear.",
     "Tie rod ends to the knuckles, with new cotter pins.",
     "Stabilizer bar to the frame, links to the knuckles.",
     "Front brake hoses to the frame lines, and the ABS wire brackets."
    ],
    "tools": [
     "Torque wrench",
     "6 mm hex",
     "10 mm flare-nut wrench"
    ],
    "specs": [
     {
      "f": "Lower arm x frame",
      "nm": "135",
      "imp": "100 ft·lbf",
      "note": "Ride height"
     },
     {
      "f": "Upper arm x frame",
      "nm": "115",
      "imp": "85 ft·lbf",
      "note": "Ride height"
     },
     {
      "f": "Coilover upper (3 nuts)",
      "nm": "64",
      "imp": "47 ft·lbf",
      "note": ""
     },
     {
      "f": "Tie rod end x knuckle",
      "nm": "91",
      "imp": "67 ft·lbf",
      "note": "New cotter pin. The PS spec table says 49; every procedure page says 91."
     },
     {
      "f": "Stabilizer bracket x frame",
      "nm": "40",
      "imp": "30 ft·lbf",
      "note": ""
     },
     {
      "f": "Stabilizer link x knuckle",
      "nm": "70",
      "imp": "52 ft·lbf",
      "note": "Hold the stud with a 6 mm hex"
     },
     {
      "f": "Brake flare (union) nuts",
      "nm": "15",
      "imp": "11 ft·lbf",
      "note": "14 N·m with SST"
     }
    ],
    "man": [
     "RM0240U@2007 › Suspension › SUSPENSION › FRONT SHOCK ABSORBER WITH COIL SPRING › INSTALLATION",
     "RM0240U@2007 › Suspension › SUSPENSION › FRONT UPPER SUSPENSION ARM › INSTALLATION",
     "RM0240U@2007 › Suspension › SUSPENSION › FRONT LOWER SUSPENSION ARM › INSTALLATION"
    ]
   },
   {
    "id": "p5-09",
    "t": "Install the engine, transmission and transfer case",
    "d": "Lower them onto the mount insulators with the transmission on a jack, then install the No.3 crossmember and the front suspension member brackets. Reconnect the PS pressure feed tube at the gear.",
    "tools": [
     "Engine hoist",
     "Leveler",
     "Transmission jack",
     "Torque wrench"
    ],
    "specs": [
     {
      "f": "Engine mount insulators x frame brackets",
      "nm": "38",
      "imp": "28 ft·lbf",
      "note": ""
     },
     {
      "f": "No.3 frame crossmember",
      "nm": "72",
      "imp": "53 ft·lbf",
      "note": ""
     },
     {
      "f": "No.3 crossmember x mount insulator",
      "nm": "19",
      "imp": "14 ft·lbf",
      "note": ""
     },
     {
      "f": "Rear No.1 mount insulator x transmission",
      "nm": "65",
      "imp": "48 ft·lbf",
      "note": ""
     },
     {
      "f": "Front suspension member brackets",
      "nm": "33",
      "imp": "24 ft·lbf",
      "note": ""
     },
     {
      "f": "PS pressure feed tube at gear",
      "nm": "44",
      "imp": "33 ft·lbf",
      "note": "42 N·m (31 ft·lbf) with SST 09023-12701"
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE ENGINE MECHANICAL › ENGINE ASSEMBLY › INSTALLATION",
     "RM0240U@2007 › Drivetrain › A750F AUTOMATIC TRANSMISSION › AUTOMATIC TRANSMISSION ASSEMBLY › INSTALLATION",
     "RM0240U@2007 › Drivetrain › RA61F MANUAL TRANSMISSION › MANUAL TRANSMISSION ASSEMBLY › INSTALLATION",
     "RM0240U@2007 › Steering › POWER STEERING › POWER STEERING LINK (for 4WD) › INSTALLATION"
    ]
   },
   {
    "id": "p5-10",
    "t": "Install the exhaust and propeller shafts",
    "d": "New gaskets, and new nuts at the manifolds. Line up the propeller shaft matchmarks.",
    "tools": [
     "Torque wrench"
    ],
    "specs": [
     {
      "f": "Front pipe x manifold",
      "nm": "54",
      "imp": "40 ft·lbf",
      "note": "New nuts"
     },
     {
      "f": "Center pipe bolts",
      "nm": "43",
      "imp": "32 ft·lbf",
      "note": ""
     },
     {
      "f": "Tail pipe",
      "nm": "48",
      "imp": "35 ft·lbf",
      "note": ""
     },
     {
      "f": "Propeller shaft flanges",
      "nm": "88",
      "imp": "65 ft·lbf",
      "note": ""
     },
     {
      "f": "Propeller shaft heat insulator",
      "nm": "16",
      "imp": "12 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE EXHAUST › EXHAUST PIPE › INSTALLATION"
    ]
   },
   {
    "id": "p5-11",
    "t": "Wheels on",
    "d": "Mount the wheels so the chassis can roll under the body.",
    "tools": [
     "Torque wrench"
    ],
    "specs": [
     {
      "f": "Wheel nuts, steel wheels",
      "nm": "112",
      "imp": "82 ft·lbf",
      "note": ""
     },
     {
      "f": "Wheel nuts, aluminum wheels",
      "nm": "103",
      "imp": "76 ft·lbf",
      "note": ""
     }
    ]
   }
  ]
 },
 {
  "id": "p6",
  "name": "Body back on and reconnect",
  "blurb": "Phases 1 and 2 in reverse.",
  "steps": [
   {
    "id": "p6-01",
    "t": "Raise the body and roll the new chassis under",
    "tools": [
     "2-post lift",
     "2 helpers"
    ]
   },
   {
    "id": "p6-02",
    "t": "Fit the cab mount cushions",
    "d": "Put the new or reused cushions on the frame brackets in the order your photos show.",
    "tools": [
     "Cushions",
     "Photos"
    ],
    "refs": [
     [
      "OEM parts diagrams",
      "https://www.toyotapartsdeal.com/parts-list/2007-toyota-fj_cruiser/body/frame.html"
     ]
    ]
   },
   {
    "id": "p6-03",
    "t": "Lower the body onto alignment pins",
    "d": "Drop punches or long bolts through the mount holes. As it comes down, watch the steering yoke, the transfer lever tower, the parking brake cables through the floor, the harness at the firewall, the filler neck and the hanging A/C compressor.",
    "tools": [
     "Drift punches",
     "2 helpers"
    ],
    "man": [
     "BM0240U@2007 › Vehicle Exterior › Body Panel Replacement › Body Lower Back Panel (Cut)"
    ]
   },
   {
    "id": "p6-04",
    "t": "Torque the cab mounts",
    "d": "Start all 8 by hand with <b>new lock nuts</b>. Tighten each bolt vertically (square to the mount).",
    "tools": [
     "Torque wrench",
     "Deep sockets"
    ],
    "specs": [
     {
      "f": "Cab mounts No.1, No.2, No.4, rear end",
      "nm": "45",
      "imp": "33 ft·lbf",
      "note": "New lock nuts (single-use)"
     }
    ],
    "man": [
     "BM0240U@2007 › Vehicle Exterior › Body Panel Replacement › Body Lower Back Panel (Cut)"
    ]
   },
   {
    "id": "p6-05",
    "t": "Reconnect the steering shaft",
    "d": "Line up the matchmarks, then untie the steering wheel.",
    "tools": [
     "Torque wrench"
    ],
    "specs": [
     {
      "f": "Yoke / intermediate shaft bolts A, B, C",
      "nm": "36",
      "imp": "27 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Steering › STEERING COLUMN › STEERING COLUMN ASSEMBLY › INSTALLATION"
    ]
   },
   {
    "id": "p6-06",
    "t": "Feed the harness back and plug everything in",
    "d": "Feed the engine wire back through the firewall. Plug in the ECM (3), A/C unit (2) and, on the A/T 4WD, the 4WD ECU and front diff connectors. Reconnect the relay block connector and nut and every ground. Then the chassis connectors from Phase 2.",
    "tools": [
     "Trim tools",
     "Torque wrench"
    ],
    "specs": [
     {
      "f": "Frame ground",
      "nm": "19",
      "imp": "14 ft·lbf",
      "note": ""
     },
     {
      "f": "Body ground",
      "nm": "8.4",
      "imp": "74 in·lbf",
      "note": ""
     },
     {
      "f": "Relay block wire nut",
      "nm": "10",
      "imp": "7.4 ft·lbf",
      "note": ""
     },
     {
      "f": "ECM nuts",
      "nm": "8.0",
      "imp": "71 in·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE ENGINE MECHANICAL › ENGINE ASSEMBLY › INSTALLATION"
    ]
   },
   {
    "id": "p6-07",
    "t": "Reconnect the A/T shift cable and transfer lever",
    "v": "at",
    "d": "Cable to the transmission with a new clip. To adjust: push the control shaft fully rearward, turn it back 2 notches to N, and set the shift lever to N. Refit the transfer lever and its snap ring.",
    "tools": [
     "Snap ring pliers",
     "Torque wrench"
    ],
    "specs": [
     {
      "f": "Control cable nut",
      "nm": "14",
      "imp": "10 ft·lbf",
      "note": ""
     },
     {
      "f": "Control cable bracket",
      "nm": "14",
      "imp": "10 ft·lbf",
      "note": ""
     },
     {
      "f": "Control cable x body nuts",
      "nm": "5.5",
      "imp": "49 in·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Drivetrain › A750F AUTOMATIC TRANSMISSION › AUTOMATIC TRANSMISSION ASSEMBLY › INSTALLATION",
     "RM0240U@2007 › Drivetrain › A750F AUTOMATIC TRANSMISSION › FLOOR SHIFT ASSEMBLY › ADJUSTMENT"
    ]
   },
   {
    "id": "p6-08",
    "t": "Refit the M/T and transfer levers",
    "v": "mt",
    "d": "Put MP grease on the M/T lever tip, press it in and turn clockwise. Refit the transfer lever and its snap ring.",
    "tools": [
     "MP grease",
     "Snap ring pliers"
    ],
    "man": [
     "RM0240U@2007 › Drivetrain › RA61F MANUAL TRANSMISSION › MANUAL TRANSMISSION ASSEMBLY › INSTALLATION"
    ]
   },
   {
    "id": "p6-09",
    "t": "Reconnect and adjust the parking brake",
    "d": "Hook the cables back onto the pull rod. Set the lever travel with the adjusting nut: <b>5–7 clicks at 200 N (45 lbf)</b>. Work the lever 3–4 times, check for drag, and check the warning light comes on at the first click.",
    "tools": [
     "Metric sockets"
    ],
    "specs": [
     {
      "f": "Parking brake lever x body",
      "nm": "13",
      "imp": "9 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Brake › PARKING BRAKE › PARKING BRAKE LEVER › ON-VEHICLE INSPECTION"
    ]
   },
   {
    "id": "p6-10",
    "t": "Reconnect brake, clutch, fuel pump, filler and EVAP",
    "d": "Brake unions at the body-to-chassis joints, and the clutch line (M/T). Fuel pump connector through the service hole. Filler hose clamp and breather tube at the tank, and the canister hoses and connector. Quick connectors: push until they click, then pull to check.",
    "tools": [
     "10 mm flare-nut wrench",
     "Torque wrench"
    ],
    "specs": [
     {
      "f": "Brake flare (union) nuts",
      "nm": "15",
      "imp": "11 ft·lbf",
      "note": "14 N·m with SST"
     },
     {
      "f": "Clutch flexible hose tube (M/T)",
      "nm": "15",
      "imp": "11 ft·lbf",
      "note": "",
      "v": "mt"
     }
    ]
   },
   {
    "id": "p6-11",
    "t": "Reconnect the engine bay",
    "d": "In order:",
    "list": [
     "Bolt the A/C compressor back on the engine and plug in its connector.",
     "Fit the fan onto the pulley studs with the 4 nuts loose, install the belt, then torque the fan nuts.",
     "Radiator hoses, and the A/T cooler hoses with their clamps.",
     "Heater hoses, spring clips at the marked angle.",
     "Intake tube, the power steering cooler pipe bracket and the upper radiator support seal."
    ],
    "tools": [
     "Torque wrench",
     "Hose clamp pliers"
    ],
    "specs": [
     {
      "f": "A/C compressor bolts",
      "nm": "24.5",
      "imp": "18 ft·lbf",
      "note": ""
     },
     {
      "f": "Fan pulley nuts",
      "nm": "21",
      "imp": "16 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE COOLING › RADIATOR › INSTALLATION",
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE ENGINE MECHANICAL › DRIVE BELT › INSTALLATION"
    ]
   },
   {
    "id": "p6-12",
    "t": "Front bumper and fender liners",
    "d": "Install your new steel bumper (or the stock one), and clip the fender liners back to the frame. Chase the M10 bumper nut threads on the new frame first.",
    "tools": [
     "Metric sockets",
     "Trim tools"
    ],
    "specs": [
     {
      "f": "Stock bumper extension / reinforcement",
      "nm": "65",
      "imp": "48 ft·lbf",
      "note": ""
     }
    ]
   },
   {
    "id": "p6-13",
    "t": "Close up the interior",
    "d": "Service hole cover, LH rear seat cushion, console and glove box.",
    "tools": [
     "Trim tools",
     "Torque wrench"
    ],
    "specs": [
     {
      "f": "Rear seat cushion bolts",
      "nm": "37",
      "imp": "27 ft·lbf",
      "note": ""
     }
    ]
   }
  ]
 },
 {
  "id": "p7",
  "name": "Fluids, bleeding, alignment and calibration",
  "blurb": "The order matters: brakes before driving, alignment before VSC calibration.",
  "steps": [
   {
    "id": "p7-01",
    "t": "Battery on, fuel leak check",
    "d": "Reconnect the battery. Turn the key to ON a few times to prime the fuel system and check every fuel joint before you start the engine. Clear P0171/P0174 from the pressure relief.",
    "tools": [
     "10 mm wrench",
     "Flashlight",
     "Fire extinguisher"
    ],
    "specs": [
     {
      "f": "Battery terminal",
      "nm": "3.9",
      "imp": "35 in·lbf",
      "note": ""
     }
    ]
   },
   {
    "id": "p7-02",
    "t": "Bleed the brakes",
    "d": "The manual's sequence:",
    "list": [
     "Bleed the booster and accumulator: key ON and wait for the pump to stop, then key OFF and pump the pedal 20+ times. Repeat 5 times. Key ON, check the pump stops in about 8–14 s.",
     "Front lines: with the key ON and the pump stopped, pump and hold the pedal, open the bleeder, close it, release. Repeat until clear.",
     "Rear lines: hold the pedal down and open the bleeder; fluid flows out on its own. Keep the reservoir above MIN.",
     "Level: key OFF, pump 20+ times, fill to MAX. It normally drops about 5 mm at key ON."
    ],
    "tools": [
     "Pressure bleeder",
     "Clear hose",
     "DOT 3"
    ],
    "warn": "If the reservoir ran empty or a line was opened at the booster, you also need the master cylinder solenoid bleed (Techstream Active Test \"SRMF\").",
    "specs": [
     {
      "f": "Bleeder plugs",
      "nm": "11",
      "imp": "8 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Brake › BRAKE › BRAKE FLUID › BLEEDING"
    ]
   },
   {
    "id": "p7-03",
    "t": "Bleed the clutch",
    "v": "mt",
    "d": "Fill the brake reservoir and bleed the clutch at the release cylinder bleeder.",
    "tools": [
     "Clear hose",
     "DOT 3"
    ],
    "specs": [
     {
      "f": "Clutch bleeder plug",
      "nm": "11",
      "imp": "8 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Drivetrain › CLUTCH › CLUTCH RELEASE CYLINDER › INSTALLATION"
    ]
   },
   {
    "id": "p7-04",
    "t": "Fill and bleed the coolant",
    "d": "Fill the radiator to overflow, squeezing the hoses as you go. Cap it and fill the reservoir to FULL. Warm up at 2,000–2,500 rpm with the heater blower on, temp at WARM and A/C off until the fan runs, squeezing the hoses to push air out. Let it cool, top up, and repeat until the level holds.",
    "tools": [
     "Spill-free funnel",
     "Toyota SLLC"
    ],
    "specs": [
     {
      "f": "Cooling system leak test pressure",
      "nm": "177 kPa",
      "imp": "25.7 psi",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Engine-Hybrid System › 1GR-FE COOLING › COOLANT › REPLACEMENT"
    ]
   },
   {
    "id": "p7-05",
    "t": "Bleed the power steering",
    "d": "Turn lock to lock with the engine off, then again at idle, holding 2–3 s at each lock. Check the reservoir level.",
    "tools": [
     "Helper"
    ],
    "man": [
     "RM0240U@2007 › Steering › POWER STEERING › POWER STEERING SYSTEM › ON-VEHICLE INSPECTION"
    ]
   },
   {
    "id": "p7-07",
    "t": "Check the A/T fluid",
    "v": "at",
    "d": "Some fluid was lost at the cooler hoses. Top up, then check it at temperature:",
    "list": [
     "Start with the fluid below 30°C.",
     "Enter temperature mode: jumper DLC3 TC (13) to CG (4), start the engine, and move the lever P to L and back.",
     "Then shift to D and toggle N↔D for at least 6 s. The A/T OIL TEMP light shows 2 s, then goes off.",
     "Idle until the light comes on (36–46°C).",
     "Remove the overflow plug; fluid should trickle out."
    ],
    "tools": [
     "DLC3 jumper",
     "ATF WS"
    ],
    "specs": [
     {
      "f": "Overflow plug",
      "nm": "20",
      "imp": "15 ft·lbf",
      "note": ""
     },
     {
      "f": "Refill plug",
      "nm": "39",
      "imp": "29 ft·lbf",
      "note": ""
     },
     {
      "f": "Drain plug",
      "nm": "28",
      "imp": "21 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Drivetrain › A750F AUTOMATIC TRANSMISSION › AUTOMATIC TRANSMISSION FLUID › ADJUSTMENT"
    ]
   },
   {
    "id": "p7-08",
    "t": "Refill the front diff",
    "d": "Only the front diff was drained. GL-5 hypoid oil, 1.35–1.45 L (1.45–1.55 L of 75W-90 with A.D.D.), to 0–5 mm below the filler hole.",
    "tools": [
     "Fluid pump",
     "Gear oil"
    ],
    "specs": [
     {
      "f": "Front diff filler plug",
      "nm": "39",
      "imp": "29 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Drivetrain › DIFFERENTIAL › DIFFERENTIAL OIL › ON-VEHICLE INSPECTION"
    ]
   },
   {
    "id": "p7-09",
    "t": "Final-torque the suspension at ride height",
    "d": "With the weight on the wheels, bounce each corner a few times, then torque every pivot you loosened: the front lower and upper arm frame bolts, and the rear upper and lower arm and lateral rod frame bolts.",
    "tools": [
     "Torque wrench",
     "Helper"
    ],
    "specs": [
     {
      "f": "Front lower arm x frame",
      "nm": "135",
      "imp": "100 ft·lbf",
      "note": ""
     },
     {
      "f": "Front upper arm x frame",
      "nm": "115",
      "imp": "85 ft·lbf",
      "note": ""
     },
     {
      "f": "Rear upper arms",
      "nm": "80",
      "imp": "59 ft·lbf",
      "note": ""
     },
     {
      "f": "Rear lower arms",
      "nm": "130",
      "imp": "96 ft·lbf",
      "note": ""
     },
     {
      "f": "Lateral control rod",
      "nm": "130",
      "imp": "96 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › General › SERVICE SPECIFICATIONS › SUSPENSION › TORQUE SPECIFICATIONS"
    ]
   },
   {
    "id": "p7-11",
    "t": "Wheel alignment",
    "d": "The manual's conditions: tires checked, vehicle empty (no spare or tools aboard), corners bounced, and vehicle height checked first.",
    "list": [
     "4WD (GSJ15): camber 0°09′ ±30′, caster 2°49′ ±30′, SAI 12°21′ ±30′.",
     "2WD (GSJ10): camber −0°34′, caster 3°34′.",
     "Toe-in: 0°05′ ±0°10′.",
     "Left–right difference 30′ or less for camber and caster.",
     "Rack end length difference 1.0 mm or less."
    ],
    "tools": [
     "Alignment shop"
    ],
    "specs": [
     {
      "f": "Tie rod lock nuts",
      "nm": "88",
      "imp": "65 ft·lbf",
      "note": ""
     }
    ],
    "man": [
     "RM0240U@2007 › Suspension › SUSPENSION › FRONT WHEEL ALIGNMENT › ADJUSTMENT"
    ]
   },
   {
    "id": "p7-12",
    "t": "VSC zero-point calibration",
    "d": "Required after an alignment. First clear any codes; C1210 is expected after the battery has been off. Conditions: level ground, vehicle perfectly still, engine off, wheels straight, A/T in P or M/T in neutral, parking brake on.",
    "list": [
     "Clear: key ON, then connect and disconnect DLC3 Ts to CG 4+ times within 8 s.",
     "Calibrate: key OFF, jumper Ts to CG, key ON.",
     "Keep the truck still for 2+ s and check the VSC TRAC light blinks. If it doesn't, clear and redo."
    ],
    "tools": [
     "DLC3 jumper (or Techstream)"
    ],
    "warn": "It runs only once per test-mode entry; clear the stored data before repeating.",
    "man": [
     "RM0240U@2007 › Brake › BRAKE CONTROL › VEHICLE STABILITY CONTROL SYSTEM › CALIBRATION"
    ]
   },
   {
    "id": "p7-13",
    "t": "Road test and retorque",
    "d": "Recheck the cab mounts, suspension and lug nuts at 50 miles and again at 500. Log them in the notes.",
    "tools": [
     "Torque wrench"
    ],
    "specs": [
     {
      "f": "Cab mounts",
      "nm": "45",
      "imp": "33 ft·lbf",
      "note": ""
     }
    ]
   },
   {
    "id": "p7-06",
    "t": "Recharge the A/C (only if you had it recovered)",
    "d": "Skip this if you hung the compressor in Phase 1. Otherwise: new O-rings oiled with ND-OIL8, pull a vacuum and check it holds, then charge 570–630 g of R-134a.",
    "tools": [
     "Vacuum pump and gauges, or an A/C shop"
    ],
    "specs": [
     {
      "f": "A/C hoses at compressor",
      "nm": "9.8",
      "imp": "87 in·lbf",
      "note": ""
     }
    ]
   }
  ]
 }
];

const SPEC_GROUPS = [
 {
  "g": "Body mounts",
  "src": "BM0240U@2007 › Vehicle Exterior › Body Panel Replacement › Body Lower Back Panel (Cut) (BP-35)",
  "rows": [
   {
    "f": "Cab mounts No.1, No.2, No.4, rear end",
    "nm": "45",
    "imp": "33 ft·lbf",
    "note": "New lock nuts; tighten bolt vertically"
   }
  ]
 },
 {
  "g": "Engine and transmission mounts",
  "src": "RM0240U@2007 › Engine-Hybrid System › 1GR-FE ENGINE MECHANICAL › ENGINE ASSEMBLY › INSTALLATION",
  "rows": [
   {
    "f": "Engine mount insulators x frame brackets (4 bolts, 4 nuts)",
    "nm": "38",
    "imp": "28 ft·lbf",
    "note": ""
   },
   {
    "f": "Front mount brackets x block (LH 3, RH 4)",
    "nm": "43",
    "imp": "31 ft·lbf",
    "note": ""
   },
   {
    "f": "Rear No.1 mount insulator x transmission",
    "nm": "65",
    "imp": "48 ft·lbf",
    "note": ""
   },
   {
    "f": "No.3 frame crossmember (4 bolts + 4 nuts)",
    "nm": "72",
    "imp": "53 ft·lbf",
    "note": ""
   },
   {
    "f": "No.3 crossmember x mount insulator",
    "nm": "19",
    "imp": "14 ft·lbf",
    "note": ""
   },
   {
    "f": "Front suspension member brackets",
    "nm": "33",
    "imp": "24 ft·lbf",
    "note": ""
   },
   {
    "f": "Engine hanger bolts",
    "nm": "33",
    "imp": "24 ft·lbf",
    "note": ""
   },
   {
    "f": "Frame ground",
    "nm": "19",
    "imp": "14 ft·lbf",
    "note": ""
   },
   {
    "f": "Body ground",
    "nm": "8.4",
    "imp": "74 in·lbf",
    "note": ""
   },
   {
    "f": "Relay block wire nut",
    "nm": "10",
    "imp": "7.4 ft·lbf",
    "note": ""
   },
   {
    "f": "ECM nuts",
    "nm": "8.0",
    "imp": "71 in·lbf",
    "note": ""
   }
  ]
 },
 {
  "g": "Steering",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › POWER STEERING + procedure pages",
  "rows": [
   {
    "f": "Yoke / intermediate shaft bolts A, B, C",
    "nm": "36",
    "imp": "27 ft·lbf",
    "note": ""
   },
   {
    "f": "Steering gear x frame",
    "nm": "100",
    "imp": "74 ft·lbf",
    "note": "Turn only the bolt"
   },
   {
    "f": "Tie rod end x knuckle",
    "nm": "91",
    "imp": "67 ft·lbf",
    "note": "Spec table says 49; procedures say 91"
   },
   {
    "f": "Tie rod lock nut",
    "nm": "88",
    "imp": "65 ft·lbf",
    "note": ""
   },
   {
    "f": "PS pressure feed tube at gear",
    "nm": "44",
    "imp": "33 ft·lbf",
    "note": "42 with SST"
   },
   {
    "f": "PS tube brackets",
    "nm": "28",
    "imp": "21 ft·lbf",
    "note": ""
   },
   {
    "f": "PS feed union bolt at pump",
    "nm": "51",
    "imp": "38 ft·lbf",
    "note": "New gasket"
   },
   {
    "f": "Steering column nuts",
    "nm": "26",
    "imp": "19 ft·lbf",
    "note": "Spec table says 21"
   },
   {
    "f": "Steering wheel nut",
    "nm": "50",
    "imp": "37 ft·lbf",
    "note": ""
   }
  ]
 },
 {
  "g": "Front suspension and axle",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › SUSPENSION › TORQUE SPECIFICATIONS",
  "rows": [
   {
    "f": "Lower arm x frame",
    "nm": "135",
    "imp": "100 ft·lbf",
    "note": "Ride height"
   },
   {
    "f": "Upper arm x frame",
    "nm": "115",
    "imp": "85 ft·lbf",
    "note": "Ride height"
   },
   {
    "f": "Coilover upper (3 nuts)",
    "nm": "64",
    "imp": "47 ft·lbf",
    "note": ""
   },
   {
    "f": "Coilover lower x lower arm",
    "nm": "135",
    "imp": "100 ft·lbf",
    "note": "Ride height"
   },
   {
    "f": "Front support x shock nut",
    "nm": "25",
    "imp": "18 ft·lbf",
    "note": ""
   },
   {
    "f": "Upper ball joint x knuckle",
    "nm": "110",
    "imp": "81 ft·lbf",
    "note": "New nut and clip"
   },
   {
    "f": "Lower ball joint x lower arm",
    "nm": "140",
    "imp": "103 ft·lbf",
    "note": "New nut, cotter pin"
   },
   {
    "f": "Lower ball joint attachment x knuckle",
    "nm": "160",
    "imp": "118 ft·lbf",
    "note": ""
   },
   {
    "f": "Stabilizer bracket x frame",
    "nm": "40",
    "imp": "30 ft·lbf",
    "note": ""
   },
   {
    "f": "Stabilizer link x bar / knuckle",
    "nm": "70",
    "imp": "52 ft·lbf",
    "note": ""
   },
   {
    "f": "Axle hub x knuckle",
    "nm": "80",
    "imp": "59 ft·lbf",
    "note": ""
   },
   {
    "f": "Front hub nut (4WD)",
    "nm": "235",
    "imp": "174 ft·lbf",
    "note": "New cotter pin"
   },
   {
    "f": "Front wheel adjusting nut (2WD)",
    "nm": "275",
    "imp": "203 ft·lbf",
    "note": "New nut"
   },
   {
    "f": "Speed sensor",
    "nm": "8.3",
    "imp": "73 in·lbf",
    "note": ""
   },
   {
    "f": "Brake tube bracket",
    "nm": "29",
    "imp": "21 ft·lbf",
    "note": ""
   }
  ]
 },
 {
  "g": "Rear suspension",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › SUSPENSION › TORQUE SPECIFICATIONS",
  "rows": [
   {
    "f": "Upper control arms",
    "nm": "80",
    "imp": "59 ft·lbf",
    "note": "Ride height"
   },
   {
    "f": "Lower control arms",
    "nm": "130",
    "imp": "96 ft·lbf",
    "note": "Ride height"
   },
   {
    "f": "Lateral control rod",
    "nm": "130",
    "imp": "96 ft·lbf",
    "note": "Ride height"
   },
   {
    "f": "Shock upper x frame",
    "nm": "25",
    "imp": "18 ft·lbf",
    "note": "New nut"
   },
   {
    "f": "Shock lower x axle",
    "nm": "98",
    "imp": "72 ft·lbf",
    "note": "Ride height"
   },
   {
    "f": "Stabilizer bracket cover x axle",
    "nm": "30",
    "imp": "22 ft·lbf",
    "note": ""
   },
   {
    "f": "Stabilizer link x bar",
    "nm": "70",
    "imp": "52 ft·lbf",
    "note": ""
   },
   {
    "f": "Stabilizer link x frame",
    "nm": "15",
    "imp": "11 ft·lbf",
    "note": "New nut"
   },
   {
    "f": "Rear axle shaft x housing",
    "nm": "120",
    "imp": "89 ft·lbf",
    "note": ""
   }
  ]
 },
 {
  "g": "Differentials and driveline",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › DIFFERENTIAL / PROPELLER SHAFT / transfer",
  "rows": [
   {
    "f": "Front diff mounting bolts and nuts x frame",
    "nm": "137",
    "imp": "101 ft·lbf",
    "note": ""
   },
   {
    "f": "No.1 diff mounting nut",
    "nm": "87",
    "imp": "64 ft·lbf",
    "note": ""
   },
   {
    "f": "No.1 support x carrier",
    "nm": "186",
    "imp": "137 ft·lbf",
    "note": ""
   },
   {
    "f": "No.2 support x carrier",
    "nm": "160",
    "imp": "118 ft·lbf",
    "note": "One page misprints 11 ft·lbf"
   },
   {
    "f": "No.3 support x carrier",
    "nm": "108",
    "imp": "80 ft·lbf",
    "note": ""
   },
   {
    "f": "A.D.D. actuator bolts",
    "nm": "21",
    "imp": "15 ft·lbf",
    "note": ""
   },
   {
    "f": "Breather bracket",
    "nm": "13",
    "imp": "10 ft·lbf",
    "note": ""
   },
   {
    "f": "Propeller shaft flanges",
    "nm": "88",
    "imp": "65 ft·lbf",
    "note": ""
   },
   {
    "f": "Transfer companion flange nuts",
    "nm": "118",
    "imp": "87 ft·lbf",
    "note": ""
   },
   {
    "f": "Transfer x transmission",
    "nm": "24",
    "imp": "17 ft·lbf",
    "note": ""
   },
   {
    "f": "Transfer lower protector",
    "nm": "18",
    "imp": "13 ft·lbf",
    "note": ""
   },
   {
    "f": "Rear diff carrier nuts (diff lock)",
    "nm": "25",
    "imp": "18 ft·lbf",
    "note": "New gasket"
   }
  ]
 },
 {
  "g": "Brakes and parking brake",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › BRAKE / PARKING BRAKE / BRAKE CONTROL",
  "rows": [
   {
    "f": "Brake flare (union) nuts",
    "nm": "15",
    "imp": "11 ft·lbf",
    "note": "14 N·m (10 ft·lbf) with SST"
   },
   {
    "f": "Rear hose x caliper union bolt",
    "nm": "31",
    "imp": "23 ft·lbf",
    "note": "New gasket"
   },
   {
    "f": "Bleeder plugs",
    "nm": "11",
    "imp": "8 ft·lbf",
    "note": ""
   },
   {
    "f": "Front caliper x knuckle",
    "nm": "123",
    "imp": "91 ft·lbf",
    "note": ""
   },
   {
    "f": "Rear caliper mounting x axle",
    "nm": "100",
    "imp": "74 ft·lbf",
    "note": ""
   },
   {
    "f": "Rear caliper x mounting",
    "nm": "88",
    "imp": "65 ft·lbf",
    "note": ""
   },
   {
    "f": "Hydraulic booster nuts",
    "nm": "14",
    "imp": "10 ft·lbf",
    "note": ""
   },
   {
    "f": "Parking brake cable x frame",
    "nm": "13",
    "imp": "9 ft·lbf",
    "note": ""
   },
   {
    "f": "Cable x parking brake plate",
    "nm": "8.0",
    "imp": "71 in·lbf",
    "note": ""
   },
   {
    "f": "Cable heat insulator",
    "nm": "13",
    "imp": "9 ft·lbf",
    "note": ""
   },
   {
    "f": "Parking brake lever x body",
    "nm": "13",
    "imp": "9 ft·lbf",
    "note": ""
   },
   {
    "f": "Yaw rate sensor x body",
    "nm": "13",
    "imp": "10 ft·lbf",
    "note": ""
   }
  ]
 },
 {
  "g": "Wheels",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › AXLE › TORQUE SPECIFICATIONS",
  "rows": [
   {
    "f": "Wheel nuts, steel",
    "nm": "112",
    "imp": "82 ft·lbf",
    "note": ""
   },
   {
    "f": "Wheel nuts, aluminum",
    "nm": "103",
    "imp": "76 ft·lbf",
    "note": ""
   }
  ]
 },
 {
  "g": "Fuel and EVAP",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › 1GR-FE FUEL / EMISSION CONTROL",
  "rows": [
   {
    "f": "Fuel tank band",
    "nm": "40",
    "imp": "30 ft·lbf",
    "note": ""
   },
   {
    "f": "No.1 protector x band",
    "nm": "20",
    "imp": "15 ft·lbf",
    "note": ""
   },
   {
    "f": "Protector bracket",
    "nm": "5.5",
    "imp": "49 in·lbf",
    "note": ""
   },
   {
    "f": "No.3 protector x tank",
    "nm": "5.0",
    "imp": "44 in·lbf",
    "note": ""
   },
   {
    "f": "Charcoal canister x body",
    "nm": "20",
    "imp": "15 ft·lbf",
    "note": ""
   }
  ]
 },
 {
  "g": "Exhaust",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › 1GR-FE EXHAUST",
  "rows": [
   {
    "f": "Front pipe x manifold",
    "nm": "54",
    "imp": "40 ft·lbf",
    "note": "New nuts, gaskets"
   },
   {
    "f": "No.2 front pipe nut",
    "nm": "54",
    "imp": "40 ft·lbf",
    "note": ""
   },
   {
    "f": "No.2 front pipe bolt",
    "nm": "48",
    "imp": "35 ft·lbf",
    "note": ""
   },
   {
    "f": "Center pipe bolts (springs)",
    "nm": "43",
    "imp": "32 ft·lbf",
    "note": ""
   },
   {
    "f": "Tail pipe",
    "nm": "48",
    "imp": "35 ft·lbf",
    "note": ""
   },
   {
    "f": "Stopper bracket (4WD)",
    "nm": "19",
    "imp": "14 ft·lbf",
    "note": ""
   },
   {
    "f": "Heated O2 / A/F sensors",
    "nm": "44",
    "imp": "33 ft·lbf",
    "note": "Exhaust table says 43"
   },
   {
    "f": "Manifold stays",
    "nm": "40",
    "imp": "30 ft·lbf",
    "note": ""
   }
  ]
 },
 {
  "g": "Automatic transmission (A750F)",
  "v": "at",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › A750F AUTOMATIC TRANSMISSION",
  "rows": [
   {
    "f": "Bell housing bolt A (17 mm head)",
    "nm": "71",
    "imp": "53 ft·lbf",
    "note": ""
   },
   {
    "f": "Bell housing bolt B (14 mm head)",
    "nm": "37",
    "imp": "27 ft·lbf",
    "note": ""
   },
   {
    "f": "Torque converter x drive plate",
    "nm": "48",
    "imp": "35 ft·lbf",
    "note": ""
   },
   {
    "f": "Control cable nut / bracket",
    "nm": "14",
    "imp": "10 ft·lbf",
    "note": ""
   },
   {
    "f": "Control cable x body nuts",
    "nm": "5.5",
    "imp": "49 in·lbf",
    "note": ""
   },
   {
    "f": "Floor shift assembly",
    "nm": "14",
    "imp": "10 ft·lbf",
    "note": ""
   },
   {
    "f": "Oil cooler tubes",
    "nm": "34",
    "imp": "25 ft·lbf",
    "note": "30 with SST"
   },
   {
    "f": "Cooler clamp bolt A / B",
    "nm": "14 / 5.5",
    "imp": "10 ft·lbf / 49 in·lbf",
    "note": ""
   },
   {
    "f": "Drain / overflow / refill plug",
    "nm": "28 / 20 / 39",
    "imp": "21 / 15 / 29 ft·lbf",
    "note": ""
   },
   {
    "f": "Propeller shaft heat insulator",
    "nm": "16",
    "imp": "12 ft·lbf",
    "note": ""
   }
  ]
 },
 {
  "g": "Manual transmission and clutch (RA61F)",
  "v": "mt",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › RA61F MANUAL TRANSMISSION / CLUTCH",
  "rows": [
   {
    "f": "Bell housing bolt A / B",
    "nm": "72 / 37",
    "imp": "53 / 28 ft·lbf",
    "note": ""
   },
   {
    "f": "Drain and filler plugs",
    "nm": "37",
    "imp": "27 ft·lbf",
    "note": ""
   },
   {
    "f": "Release cylinder bolts",
    "nm": "12",
    "imp": "8.7 ft·lbf",
    "note": ""
   },
   {
    "f": "Release cylinder hose tube",
    "nm": "15",
    "imp": "11 ft·lbf",
    "note": ""
   },
   {
    "f": "Accumulator hose tube flare",
    "nm": "15",
    "imp": "11 ft·lbf",
    "note": ""
   },
   {
    "f": "Hose tube bracket nuts",
    "nm": "19",
    "imp": "14 ft·lbf",
    "note": ""
   },
   {
    "f": "Clutch bleeder",
    "nm": "11",
    "imp": "8 ft·lbf",
    "note": ""
   }
  ]
 },
 {
  "g": "Cooling and A/C",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › 1GR-FE COOLING / AIR CONDITIONING",
  "rows": [
   {
    "f": "Radiator (4 bolts)",
    "nm": "21",
    "imp": "16 ft·lbf",
    "note": ""
   },
   {
    "f": "Fan pulley nuts",
    "nm": "21",
    "imp": "16 ft·lbf",
    "note": ""
   },
   {
    "f": "Fan x fluid coupling",
    "nm": "9.0",
    "imp": "80 in·lbf",
    "note": ""
   },
   {
    "f": "Fan shroud / reserve tank",
    "nm": "5.0",
    "imp": "44 in·lbf",
    "note": ""
   },
   {
    "f": "Engine drain plugs",
    "nm": "13",
    "imp": "9 ft·lbf",
    "note": ""
   },
   {
    "f": "No.1 engine under cover",
    "nm": "29",
    "imp": "21 ft·lbf",
    "note": ""
   },
   {
    "f": "A/C hoses at compressor",
    "nm": "9.8",
    "imp": "87 in·lbf",
    "note": ""
   },
   {
    "f": "Compressor bolts",
    "nm": "24.5",
    "imp": "18 ft·lbf",
    "note": ""
   },
   {
    "f": "Condenser / tube bolts",
    "nm": "5.4",
    "imp": "48 in·lbf",
    "note": ""
   }
  ]
 },
 {
  "g": "Body and interior",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › EXTERIOR / SEAT / ENGINE HOOD - DOOR / SRS",
  "rows": [
   {
    "f": "Front bumper extension / reinforcement",
    "nm": "65",
    "imp": "48 ft·lbf",
    "note": ""
   },
   {
    "f": "Front bumper upper retainer, cover bolts",
    "nm": "8.0",
    "imp": "71 in·lbf",
    "note": ""
   },
   {
    "f": "Rear bumper bolts",
    "nm": "8.0",
    "imp": "71 in·lbf",
    "note": ""
   },
   {
    "f": "Front airbag sensor",
    "nm": "9.0",
    "imp": "80 in·lbf",
    "note": ""
   },
   {
    "f": "Hood hinge x hood",
    "nm": "13",
    "imp": "10 ft·lbf",
    "note": "Engine section says 18"
   },
   {
    "f": "Hood lock",
    "nm": "8.0",
    "imp": "71 in·lbf",
    "note": ""
   },
   {
    "f": "Door hinges x body",
    "nm": "26",
    "imp": "19 ft·lbf",
    "note": ""
   },
   {
    "f": "Side step x body",
    "nm": "20",
    "imp": "14 ft·lbf",
    "note": ""
   },
   {
    "f": "Front / rear seat bolts",
    "nm": "37",
    "imp": "27 ft·lbf",
    "note": ""
   },
   {
    "f": "Seat belt anchors",
    "nm": "42",
    "imp": "31 ft·lbf",
    "note": ""
   },
   {
    "f": "Battery terminal",
    "nm": "3.9",
    "imp": "35 in·lbf",
    "note": ""
   }
  ]
 },
 {
  "g": "Standard bolts (when no spec is given)",
  "src": "RM0240U@2007 › General › SERVICE SPECIFICATIONS › STANDARD BOLT › SPECIFIED TORQUE FOR STANDARD BOLTS",
  "rows": [
   {
    "f": "4T, hex flange: M6 / M8 / M10 / M12",
    "nm": "6 / 14 / 29 / 53",
    "imp": "",
    "note": "Read the strength class off the bolt head"
   },
   {
    "f": "7T, hex flange: M6 / M8 / M10 / M12",
    "nm": "12 / 28 / 58 / 105",
    "imp": "",
    "note": ""
   },
   {
    "f": "8T, hex flange: M8 / M10 / M12",
    "nm": "33 / 68 / 120",
    "imp": "",
    "note": ""
   },
   {
    "f": "9T, hex flange: M8 / M10 / M12",
    "nm": "37 / 78 / 140",
    "imp": "",
    "note": ""
   }
  ]
 }
];

window.FJ_DATA = { PHASES, SPEC_GROUPS };
