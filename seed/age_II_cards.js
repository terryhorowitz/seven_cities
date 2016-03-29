module.exports = [
  {//raw resources
    name: "Brickyard",
    cost: [1],
    functionality: ["clay", "clay"],
    type: "Raw Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 4,
    picture: "2_brickyard_4.png"
  },
  {
    name: "Brickyard",
    cost: [1],
    functionality: ["clay", "clay"],
    type: "Raw Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 3,
    picture: "2_brickyard_3.png"
  },
  {
    name: "Quarry",
    cost: [1],
    functionality: ["stone", "stone"],
    type: "Raw Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 3,
    picture: "2_quarry_3.png"
  },
  {
    name: "Quarry",
    cost: [1],
    functionality: ["stone", "stone"],
    type: "Raw Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 4,
    picture: "2_quarry_4.png"
  },
  {
    name: "Foundry",
    cost: [1],
    functionality: ["ore", "ore"],
    type: "Raw Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 4,
    picture: "2_foundry_4.png"
  },
  {
    name: "Foundry",
    cost: [1],
    functionality: ["ore", "ore"],
    type: "Raw Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 3,
    picture: "2_foundry_3.png"
  },
  {
    name: "Sawmill",
    cost: [1],
    functionality: ["wood", "wood"],
    type: "Raw Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 3,
    picture: "2_sawmill_3.png"
  },
  {
    name: "Sawmill",
    cost: [1],
    functionality: ["wood", "wood"],
    type: "Raw Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 4,
    picture: "2_sawmill_4.png"
  },//processed resources
  {
    name: "Glassworks",
    cost: null,
    functionality: ['glass'],
    type: "Processed Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 3,
    picture: "2_glassworks_3.png"
  },
  {
    name: "Glassworks",
    cost: null,
    functionality: ['glass'],
    type: "Processed Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 5,
    picture: "2_glassworks_5.png"
  },
  {
    name: "Press",
    cost: null,
    functionality: ['papyrus'],
    type: "Processed Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 5,
    picture: "2_press_5.png"
  },
  {
    name: "Press",
    cost: null,
    functionality: ['papyrus'],
    type: "Processed Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 3,
    picture: "2_press_3.png"
  },
  {
    name: "Loom",
    cost: null,
    functionality: ['textile'],
    type: "Processed Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 5,
    picture: "2_loom_5.png"
  },
  {
    name: "Loom",
    cost: null,
    functionality: ['textile'],
    type: "Processed Resource",
    upgradeTo: null,
    era: 2,
    numPlayers: 3,
    picture: "2_loom_3.png"
  },//war
  {
    name: "Stables",
    cost: ["clay", "wood", "ore"],
    functionality: ["war", "war"],
    type: "War",
    upgradeTo: null,
    era: 2,
    numPlayers: 5,
    picture: "2_stables_5.png"
  },
  {
    name: "Stables",
    cost: ["clay", "wood", "ore"],
    functionality: ["war", "war"],
    type: "War",
    upgradeTo: null,
    era: 2,
    numPlayers: 3,
    picture: "2_stables_3.png"
  },
  {
    name: "Walls",
    cost: ["stone", "stone", "stone"],
    functionality: ["war", "war"],
    type: "War",
    upgradeTo: ["Fortifications"],
    era: 2,
    numPlayers: 3,
    picture: "2_walls_3.png"
  },
  {
    name: "Walls",
    cost: ["stone", "stone", "stone"],
    functionality: ["war", "war"],
    type: "War",
    upgradeTo: ["Fortifications"],
    era: 2,
    numPlayers: 7,
    picture: "2_walls_7.png"
  },
  {
    name: "Archery Range",
    cost: ["wood", "wood", "ore"],
    functionality: ["war", "war"],
    type: "War",
    upgradeTo: null,
    era: 2,
    numPlayers: 6,
    picture: "2_archery_range_6.png"
  },
  {
    name: "Archery Range",
    cost: ["wood", "wood", "ore"],
    functionality: ["war", "war"],
    type: "War",
    upgradeTo: null,
    era: 2,
    numPlayers: 3,
    picture: "2_archery_range_3.png"
  },
  {
    name: "Training Ground",
    cost: ["ore", "ore", "wood"],
    functionality: ["war", "war"],
    type: "War",
    upgradeTo: ["Circus"],
    era: 2,
    numPlayers: 4,
    picture: "2_training_ground_4.png"
  },
  {
    name: "Training Ground",
    cost: ["ore", "ore", "wood"],
    functionality: ["war", "war"],
    type: "War",
    upgradeTo: ["Circus"],
    era: 2,
    numPlayers: 6,
    picture: "2_training_ground_6.png"
  },
  {
    name: "Training Ground",
    cost: ["ore", "ore", "wood"],
    functionality: ["war", "war"],
    type: "War",
    upgradeTo: ["Circus"],
    era: 2,
    numPlayers: 7,
    picture: "2_training_ground_7.png"
  },//Victory points
  {
    name: "Statue",
    cost: ["ore", "ore", "wood"],
    functionality: [4],
    type: "Victory Points",
    upgradeTo: ["Gardens"],
    era: 2,
    numPlayers: 3,
    picture: "2_statue_3.png"
  },
  {
    name: "Statue",
    cost: ["ore", "ore", "wood"],
    functionality: [4],
    type: "Victory Points",
    upgradeTo: ["Gardens"],
    era: 2,
    numPlayers: 7,
    picture: "2_statue_7.png"
  },
  {
    name: "Aqueduct",
    cost: ["stone", "stone", "stone"],
    functionality: [5],
    type: "Victory Points",
    upgradeTo: null,
    era: 2,
    numPlayers: 7,
    picture: "2_aqueduct_7.png"
  },
  {
    name: "Aqueduct",
    cost: ["stone", "stone", "stone"],
    functionality: [5],
    type: "Victory Points",
    upgradeTo: null,
    era: 2,
    numPlayers: 3,
    picture: "2_aqueduct_3.png"
  },
  {
    name: "Temple",
    cost: ["wood", "clay", "glass"],
    functionality: [3],
    type: "Victory Points",
    upgradeTo: ["Pantheon"],
    era: 2,
    numPlayers: 6,
    picture: "2_temple_6.png"
  },
  {
    name: "Temple",
    cost: ["wood", "clay", "glass"],
    functionality: [3],
    type: "Victory Points",
    upgradeTo: ["Pantheon"],
    era: 2,
    numPlayers: 3,
    picture: "2_temple_3.png"
  },
  {
    name: "Courthouse",
    cost: ["clay", "clay", "textile"],
    functionality: [4],
    type: "Victory Points",
    upgradeTo: null,
    era: 2,
    numPlayers: 3,
    picture: "2_courthouse_3.png"
  },
  {
    name: "Courthouse",
    cost: ["clay", "clay", "textile"],
    functionality: [4],
    type: "Victory Points",
    upgradeTo: null,
    era: 2,
    numPlayers: 5,
    picture: "2_courthouse_5.png"
  },//technology
  {
    name: "Laboratory",
    cost: ["clay", "clay", "papyrus"],
    functionality: ["gear"],
    type: "Technology",
    upgradeTo: ["Observatory", "Siege Workshop"],
    era: 2,
    numPlayers: 3,
    picture: "2_laboratory_3.png"
  },
  {
    name: "Laboratory",
    cost: ["clay", "clay", "papyrus"],
    functionality: ["gear"],
    type: "Technology",
    upgradeTo: ["Observatory", "Siege Workshop"],
    era: 2,
    numPlayers: 5,
    picture: "2_laboratory_5.png"
  },
  {
    name: "School",
    cost: ["wood", "papyrus"],
    functionality: ["tablet"],
    type: "Technology",
    upgradeTo: ["Academy", "Study"],
    era: 2,
    numPlayers: 7,
    picture: "2_school_7.png"
  },
  {
    name: "School",
    cost: ["wood", "papyrus"],
    functionality: ["tablet"],
    type: "Technology",
    upgradeTo: ["Academy", "Study"],
    era: 2,
    numPlayers: 3,
    picture: "2_school_3.png"
  },
  {
    name: "Libray",
    cost: ["stone", "stone", "textile"],
    functionality: ["tablet"],
    type: "Technology",
    upgradeTo: ["Senate", "University"],
    era: 2,
    numPlayers: 6,
    picture: "2_library_6.png"
  },
  {
    name: "Libray",
    cost: ["stone", "stone", "textile"],
    functionality: ["tablet"],
    type: "Technology",
    upgradeTo: ["Senate", "University"],
    era: 2,
    numPlayers: 3,
    picture: "2_library_3.png"
  },
  {
    name: "Dispensary",
    cost: ["ore", "ore", "glass"],
    functionality: ["compass"],
    type: "Technology",
    upgradeTo: ["Lodge", "Arena"],
    era: 2,
    numPlayers: 4,
    picture: "2_dispensary_4.png"
  },
  {
    name: "Dispensary",
    cost: ["ore", "ore", "glass"],
    functionality: ["compass"],
    type: "Technology",
    upgradeTo: ["Lodge", "Arena"],
    era: 2,
    numPlayers: 3,
    picture: "2_dispensary_3.png"
  },//trading
  {
    name: "Bazar",
    cost: null,
    functionality: ["left", "right", "self", 2, "Processed Resource"],
    type: "Trading",
    upgradeTo: null,
    era: 2,
    numPlayers: 7,
    picture: "2_bazar_7.png"
  },
  {
    name: "Bazar",
    cost: null,
    functionality: ["left", "right", "self", 2, "Processed Resource"],
    type: "Trading",
    upgradeTo: null,
    era: 2,
    numPlayers: 4,
    picture: "2_bazar_4.png"
  },
  {
    name: "Vineyard",
    cost: null,
    functionality: ["left", "right", "self", 1, "Raw Resource"],
    type: "Trading",
    upgradeTo: null,
    era: 2,
    numPlayers: 6,
    picture: "2_vineyard_6.png"
  },
  {
    name: "Vineyard",
    cost: null,
    functionality: ["left", "right", "self", 1, "Raw Resource"],
    type: "Trading",
    upgradeTo: null,
    era: 2,
    numPlayers: 3,
    picture: "2_vineyard_3.png"
  },
  {
    name: "Forum",
    cost: ["clay", "clay"],
    functionality: ["Processed Resource"],
    type: "Trading",
    upgradeTo: ["Haven"],
    era: 2,
    numPlayers: 7,
    picture: "2_forum_7.png"
  },
  {
    name: "Forum",
    cost: ["clay", "clay"],
    functionality: ["Processed Resource"],
    type: "Trading",
    upgradeTo: ["Haven"],
    era: 2,
    numPlayers: 3,
    picture: "2_forum_3.png"
  },
  {
    name: "Forum",
    cost: ["clay", "clay"],
    functionality: ["Processed Resource"],
    type: "Trading",
    upgradeTo: ["Haven"],
    era: 2,
    numPlayers: 6,
    picture: "2_forum_6.png"
  },
  {
    name: "Caravansery",
    cost: ["wood", "wood"],
    functionality: ["Raw Resource"],
    type: "Trading",
    upgradeTo: ["Lighthouse"],
    era: 2,
    numPlayers: 3,
    picture: "2_caravansery_3.png"
  },
  {
    name: "Caravansery",
    cost: ["wood", "wood"],
    functionality: ["Raw Resource"],
    type: "Trading",
    upgradeTo: ["Lighthouse"],
    era: 2,
    numPlayers: 5,
    picture: "2_caravansery_5.png"
  },
  {
    name: "Caravansery",
    cost: ["wood", "wood"],
    functionality: ["Raw Resource"],
    type: "Trading",
    upgradeTo: ["Lighthouse"],
    era: 2,
    numPlayers: 6,
    picture: "2_caravansery_6.png"
  }
];