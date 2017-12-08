export const tileDictionary = {
  0: {passible: true, type: "floor"},
  1: {passible: true, type: "floor"},
  2: {passible: true, type: "floor"},
  3: {passible: false, type: "wall"},
  4: {passible: false, type: "wall"},
  5: {passible: false, type: "player"},
  6: {passible: true, type: "stairs", subtype: "stairs down"},
  7: {passible: true, type: "stairs", subtype: "stairs up"},
  8: {passible: false, type: "monster"},
  9: {passible: false, type: "monster"},
  10: {passible: false, type: "monster"},
  11: {passible: false, type: "monster"},
  12: {passible: false, type: "monster"},
  13: {passible: false, type: "monster"},
  14: {passible: false, type: "monster"},
  15: {passible: false, type: "monster"},
  16: {passible: true, type: "item"},
  17: {passible: true, type: "item"},
  18: {passible: true, type: "item"},
  19: {passible: true, type: "item"},
  20: {passible: true, type: "item"},
  24: {passible: true, type: "item"},
  25: {passible: true, type: "item"},
  26: {passible: true, type: "item"},
  27: {passible: true, type: "item"},
  28: {passible: true, type: "item"},
};

export const monsterDictionary = {
  8: { name:"giant rat", subtype:"animal", hp: [1,3], weapon: { damage: [1,2], verb: "bites" }, xpVal: 50, damageModifier: 0, armor: { protection: 0 }, threat: 1 },
  9: { name:"green slime", subtype:"ooze", hp: [1,4], weapon: { damage: [1,3], verb: "splashes" }, xpVal: 75, damageModifier: 0, armor: { protection: 0 }, threat: 1 },
  10: { name:"wild dog", subtype:"animal", hp: [1,6], weapon: { damage: [1,6], verb: "bites" }, xpVal: 80, damageModifier: 0, armor: { protection: 0 }, threat: 2 },
  11: { name:"goblin", subtype:"goblin", hp: [1,6], weapon: { damage: [1,6], verb: "claws" }, xpVal: 120, damageModifier: 0, armor: { protection: 1 }, threat: 3 },
  12: { name:"kobld", subtype:"goblin", hp: [2,4], weapon: { damage: [1,6], verb: "stabs" }, xpVal: 150, damageModifier: 1, armor: { protection: 0 }, threat: 4 },
  13: { name:"orc", subtype:"goblin", hp: [2,6], weapon: { damage: [1,6], verb: "smacks" }, xpVal: 175, damageModifier: 1, armor: { protection: 1 }, threat: 5 },
  14: { name:"skeleton", subtype:"undead", hp: [2,8], weapon: { damage: [1,8], verb: "slashes" }, xpVal: 250, damageModifier: 2, armor: { protection: 1 }, threat: 6 },
  15: { name:"black dragon", subtype:"dragon", hp: [3,10], weapon: { damage: [1,10], verb: "bashes" }, xpVal: 450, damageModifier: 4, armor: { protection: 4 }, threat: Infinity }
};

export const itemDictionary = {// threat should be threshold
  16: {name: "dagger", type:"weapon", subtype: "weapon", damage: [1,6], verb: "stab", threat: 1},
  17: {name: "short sword", type:"weapon", subtype: "weapon", damage: [1,8], verb: "slash", threat: 3},
  18: {name: "dark sword", type:"weapon", subtype: "weapon", damage: [1,10], verb: "slash", threat: 5},
  19: {name: "emerald mace", type:"weapon", subtype: "weapon", damage: [2,6], verb: "bash", threat: 6},
  20: {name: "ruby axe", type:"weapon", subtype: "weapon", damage: [2,8], verb: "hack", threat: 8},
  24: {name: "leather armor", subtype: "armor", protection: 1, threat: 1},
  25: {name: "chain armor", subtype: "armor", protection: 2, threat: 3},
  26: {name: "scale armor", subtype: "armor", protection: 3, threat: 5},
  27: {name: "plate armor", subtype: "armor", protection: 4, threat: 7},
  28: {name: "star armor", subtype: "armor", protection: 5, threat: 9},
  //15: {name: "health potion", subtype: "health", heals: 10}
};
