/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/
//
//var mongoose = require('mongoose');
//var Promise = require('bluebird');
//var chalk = require('chalk');
//var connectToDb = require('./server/db');
//var User = Promise.promisifyAll(mongoose.model('User'));
//
//var seedUsers = function () {
//
//    var users = [
//        {
//            email: 'testing@fsa.com',
//            password: 'password'
//        },
//        {
//            email: 'obama@gmail.com',
//            password: 'potus'
//        }
//    ];
//
//    return User.createAsync(users);
//
//};
//
//connectToDb.then(function () {
//    User.findAsync({}).then(function (users) {
//        if (users.length === 0) {
//            return seedUsers();
//        } else {
//            console.log(chalk.magenta('Seems to already be user data, exiting!'));
//            process.kill(0);
//        }
//    }).then(function () {
//        console.log(chalk.green('Seed successful!'));
//        process.kill(0);
//    }).catch(function (err) {
//        console.error(err);
//        process.kill(1);
//    });
//});

var Card = require('./server/db/models').Card;

//if statement with gameDBObj.sync({force:true}) if we have cards already???
var ageICards = [//raw resource
  {
    name: "Lumber Yard",
    cost: null,
    functionality: ['wood'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 3,
    picture: "1_lumber_yard_3.png"
  },  
  {
    name: "Lumber Yard",
    cost: null,
    functionality: ['wood'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 4,
    picture: "1_lumber_yard_4.png"
  },
  {
    name: "Clay Pool",
    cost: null,
    functionality: ['clay'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 3,
    picture: "1_clay_pool_3.png"
  },
  {
    name: "Excavation",
    cost: [1],
    functionality: ['stone/clay'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 4,
    picture: "1_excavation_4.png"
  },
  {
    name: "Clay Pit",
    cost: [1],
    functionality: ['clay/ore'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 3,
    picture: "1_clay_pit_3.png"
  },
  {
    name: "Ore Vein",
    cost: null,
    functionality: ['ore'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 3,
    picture: "1_ore_vein_3.png"
  },
  {
    name: "Clay Pool",
    cost: null,
    functionality: ['clay'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 5,
    picture: "1_clay_pool_5.png"
  },
  {
    name: "Ore Vein",
    cost: null,
    functionality: ['ore'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 4,
    picture: "1_ore_vein_4.png"
  },
  {
    name: "Stone Pit",
    cost: null,
    functionality: ['stone'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 5,
    picture: "1_stone_pit_5.png"
  },
  {
    name: "Stone Pit",
    cost: null,
    functionality: ['stone'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 3,
    picture: "1_stone_pit_3.png"
  },
  {
    name: "Tree Farm",
    cost: [1],
    functionality: ['wood/clay'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 6,
    picture: "1_tree_farm_6.png"
  },
  {
    name: "Forest Cave",
    cost: [1],
    functionality: ['wood/ore'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 5,
    picture: "1_forest_cave_5.png"
  },
  {
    name: "Timber Yard",
    cost: [1],
    functionality: ['stone/wood'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 3,
    picture: "1_timber_yard_3.png"
  },
  {
    name: "Mine",
    cost: [1],
    functionality: ['stone/ore'],
    type: "Raw Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 6,
    picture: "1_mine_6.png"
  },//processed resources
  {
    name: "Glassworks",
    cost: null,
    functionality: ['glass'],
    type: "Processed Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 6,
    picture: "1_glassworks_6.png"
  },
  {
    name: "Glassworks",
    cost: null,
    functionality: ['glass'],
    type: "Processed Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 3,
    picture: "1_glassworks_3.png"
  },
  {
    name: "Press",
    cost: null,
    functionality: ['papyrus'],
    type: "Processed Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 3,
    picture: "1_press_3.png"
  },
  {
    name: "Press",
    cost: null,
    functionality: ['papyrus'],
    type: "Processed Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 6,
    picture: "1_press_6.png"
  },
  {
    name: "Loom",
    cost: null,
    functionality: ['textile'],
    type: "Processed Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 6,
    picture: "1_loom_6.png"
  },
  {
    name: "Loom",
    cost: null,
    functionality: ['textile'],
    type: "Processed Resource",
    upgradeTo: null,
    era: 1,
    numPlayers: 3,
    picture: "1_loom_3.png"
  },//victory points
  {
    name: "Theater",
    cost: null,
    functionality: [2],
    type: "Victory Points",
    upgradeTo: ["Statue"],
    era: 1,
    numPlayers: 3,
    picture: "1_theater_3.png"
  },
  {
    name: "Theater",
    cost: null,
    functionality: [2],
    type: "Victory Points",
    upgradeTo: ["Statue"],
    era: 1,
    numPlayers: 6,
    picture: "1_theater_6.png"
  },
  {
    name: "Altar",
    cost: null,
    functionality: [2],
    type: "Victory Points",
    upgradeTo: ["Temple"],
    era: 1,
    numPlayers: 5,
    picture: "1_altar_5.png"
  },
  {
    name: "Altar",
    cost: null,
    functionality: [2],
    type: "Victory Points",
    upgradeTo: ["Temple"],
    era: 1,
    numPlayers: 3,
    picture: "1_altar_3.png"
  },
  {
    name: "Pawnshop",
    cost: null,
    functionality: [3],
    type: "Victory Points",
    upgradeTo: null,
    era: 1,
    numPlayers: 7,
    picture: "1_pawnshop_7.png"
  },
  {
    name: "Pawnshop",
    cost: null,
    functionality: [3],
    type: "Victory Points",
    upgradeTo: null,
    era: 1,
    numPlayers: 4,
    picture: "1_pawnshop_4.png"
  },
  {
    name: "Baths",
    cost: ["stone"],
    functionality: [3],
    type: "Victory Points",
    upgradeTo: ["Aqueduct"],
    era: 1,
    numPlayers: 3,
    picture: "1_baths_3.png"
  },
  {
    name: "Baths",
    cost: ["stone"],
    functionality: [3],
    type: "Victory Points",
    upgradeTo: ["Aqueduct"],
    era: 1,
    numPlayers: 7,
    picture: "1_baths_7.png"
  },//technology
  {
    name: "Workshop",
    cost: ["glass"],
    functionality: ["gear"],
    type: "Technology",
    upgradeTo: ["Laboratory", "Archery Range"],
    era: 1,
    numPlayers: 7,
    picture: "1_workshop_7.png"
  },
  {
    name: "Workshop",
    cost: ["glass"],
    functionality: ["gear"],
    type: "Technology",
    upgradeTo: ["Laboratory", "Archery Range"],
    era: 1,
    numPlayers: 3,
    picture: "1_workshop_3.png"
  },
  {
    name: "Scriptorium",
    cost: ["papyrus"],
    functionality: ["tablet"],
    type: "Technology",
    upgradeTo: ["Courthouse", "Library"],
    era: 1,
    numPlayers: 3,
    picture: "1_scriptorium_3.png"
  },
  {
    name: "Scriptorium",
    cost: ["papyrus"],
    functionality: ["tablet"],
    type: "Technology",
    upgradeTo: ["Courthouse", "Library"],
    era: 1,
    numPlayers: 4,
    picture: "1_scriptorium_4.png"
  },
  {
    name: "Apothecary",
    cost: ["textile"],
    functionality: ["compass"],
    type: "Technology",
    upgradeTo: ["Stables", "Dispensary"],
    era: 1,
    numPlayers: 5,
    picture: "1_apothecary_5.png"
  },
  {
    name: "Apothecary",
    cost: ["textile"],
    functionality: ["compass"],
    type: "Technology",
    upgradeTo: ["Stables", "Dispensary"],
    era: 1,
    numPlayers: 3,
    picture: "1_apothecary_3.png"
  },//war
  {
    name: "Stockade",
    cost: ["wood"],
    functionality: ["war"],
    type: "War",
    upgradeTo: null,
    era: 1,
    numPlayers: 3,
    picture: "1_stockade_3.png"
  },
  {
    name: "Stockade",
    cost: ["wood"],
    functionality: ["war"],
    type: "War",
    upgradeTo: null,
    era: 1,
    numPlayers: 7,
    picture: "1_stockade_7.png"
  },
  {
    name: "Barracks",
    cost: ["ore"],
    functionality: ["war"],
    type: "War",
    upgradeTo: null,
    era: 1,
    numPlayers: 5,
    picture: "1_barracks_5.png"
  },
  {
    name: "Barracks",
    cost: ["ore"],
    functionality: ["war"],
    type: "War",
    upgradeTo: null,
    era: 1,
    numPlayers: 3,
    picture: "1_barracks_3.png"
  },
  {
    name: "Guard Tower",
    cost: ["clay"],
    functionality: ["war"],
    type: "War",
    upgradeTo: null,
    era: 1,
    numPlayers: 3,
    picture: "1_guard_tower_3.png"
  },
  {
    name: "Guard Tower",
    cost: ["clay"],
    functionality: ["war"],
    type: "War",
    upgradeTo: null,
    era: 1,
    numPlayers: 4,
    picture: "1_guard_tower_4.png"
  },//trading
  {
    name: "Tavern",
    cost: null,
    functionality: [5],
    type: "Trading",
    upgradeTo: null,
    era: 1,
    numPlayers: 7,
    picture: "1_tavern_7.png"
  },
  {
    name: "Tavern",
    cost: null,
    functionality: [5],
    type: "Trading",
    upgradeTo: null,
    era: 1,
    numPlayers: 5,
    picture: "1_tavern_5.png"
  },
  {
    name: "Tavern",
    cost: null,
    functionality: [5],
    type: "Trading",
    upgradeTo: null,
    era: 1,
    numPlayers: 4,
    picture: "1_tavern_4.png"
  },
  {
    name: "Marketplace",
    cost: null,
    functionality: ["left", "right", "Processed Resource"],
    type: "Trading",
    upgradeTo: ["Caravansery"],
    era: 1,
    numPlayers: 3,
    picture: "1_marketplace_3.png"
  },
  {
    name: "Marketplace",
    cost: null,
    functionality: ["left", "right", "Processed Resource"],
    type: "Trading",
    upgradeTo: ["Caravansery"],
    era: 1,
    numPlayers: 6,
    picture: "1_marketplace_6.png"
  },
  {
    name: "East Trading Post",
    cost: null,
    functionality: ["right", "Raw Resource"],
    type: "Trading",
    upgradeTo: ["Forum"],
    era: 1,
    numPlayers: 7,
    picture: "1_east_trading_post_7.png"
  },
  {
    name: "East Trading Post",
    cost: null,
    functionality: ["right", "Raw Resource"],
    type: "Trading",
    upgradeTo: ["Forum"],
    era: 1,
    numPlayers: 3,
    picture: "1_east_trading_post_3.png"
  },
  {
    name: "West Trading Post",
    cost: null,
    functionality: ["left", "Raw Resource"],
    type: "Trading",
    upgradeTo: ["Forum"],
    era: 1,
    numPlayers: 7,
    picture: "1_west_trading_post_7.png"
  },
  {
    name: "West Trading Post",
    cost: null,
    functionality: ["left", "Raw Resource"],
    type: "Trading",
    upgradeTo: ["Forum"],
    era: 1,
    numPlayers: 3,
    picture: "1_west_trading_post_3.png"
  },
];

var ageIICards = [
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
    picture: "2_libray_6.png"
  },
  {
    name: "Libray",
    cost: ["stone", "stone", "textile"],
    functionality: ["tablet"],
    type: "Technology",
    upgradeTo: ["Senate", "University"],
    era: 2,
    numPlayers: 3,
    picture: "2_libray_3.png"
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

var ageIIICards = [//victory points
  {
    name: "Town Hall",
    cost: ["stone", "stone", "ore", "glass"],
    functionality: [6],
    type: "Victory Points",
    upgradeTo: null,
    era: 3,
    numPlayers: 5,
    picture: "3_town_hall_5.png"
  },
  {
    name: "Town Hall",
    cost: ["stone", "stone", "ore", "glass"],
    functionality: [6],
    type: "Victory Points",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_town_hall_3.png"
  },
  {
    name: "Town Hall",
    cost: ["stone", "stone", "ore", "glass"],
    functionality: [6],
    type: "Victory Points",
    upgradeTo: null,
    era: 3,
    numPlayers: 6,
    picture: "3_town_hall_6.png"
  },
  {
    name: "Senate",
    cost: ["wood", "wood", "stone", "ore"],
    functionality: [6],
    type: "Victory Points",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_senate_3.png"
  },
  {
    name: "Senate",
    cost: ["wood", "wood", "stone", "ore"],
    functionality: [6],
    type: "Victory Points",
    upgradeTo: null,
    era: 3,
    numPlayers: 5,
    picture: "3_senate_5.png"
  },
  {
    name: "Gardens",
    cost: ["clay", "clay", "wood"],
    functionality: [5],
    type: "Victory Points",
    upgradeTo: null,
    era: 3,
    numPlayers: 4,
    picture: "3_gardens_4.png"
  },
  {
    name: "Gardens",
    cost: ["clay", "clay", "wood"],
    functionality: [5],
    type: "Victory Points",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_gardens_3.png"
  },
  {
    name: "Pantheon",
    cost: ["clay", "clay", "ore", "glass", "papyrus", "textile"],
    functionality: [7],
    type: "Victory Points",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_pantheon_3.png"
  },
  {
    name: "Pantheon",
    cost: ["clay", "clay", "ore", "glass", "papyrus", "textile"],
    functionality: [7],
    type: "Victory Points",
    upgradeTo: null,
    era: 3,
    numPlayers: 6,
    picture: "3_pantheon_6.png"
  },
  {
    name: "Palace",
    cost: ["stone", "ore", "wood", "clay", "glass", "papyrus", "textile"],
    functionality: [8],
    type: "Victory Points",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_palace_3.png"
  },
  {
    name: "Palace",
    cost: ["stone", "ore", "wood", "clay", "glass", "papyrus", "textile"],
    functionality: [8],
    type: "Victory Points",
    upgradeTo: null,
    era: 3,
    numPlayers: 7,
    picture: "3_palace_7.png"
  },//war
  {
    name: "Arsenal",
    cost: ["wood", "wood", "ore", "textile"],
    functionality: ["war", "war", "war"],
    type: "War",
    upgradeTo: null,
    era: 3,
    numPlayers: 4,
    picture: "3_arsenal_4.png"
  },
  {
    name: "Arsenal",
    cost: ["wood", "wood", "ore", "textile"],
    functionality: ["war", "war", "war"],
    type: "War",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_arsenal_3.png"
  },
  {
    name: "Arsenal",
    cost: ["wood", "wood", "ore", "textile"],
    functionality: ["war", "war", "war"],
    type: "War",
    upgradeTo: null,
    era: 3,
    numPlayers: 7,
    picture: "3_arsenal_7.png"
  },
  {
    name: "Circus",
    cost: ["stone", "stone", "stone", "ore"],
    functionality: ["war", "war", "war"],
    type: "War",
    upgradeTo: null,
    era: 3,
    numPlayers: 5,
    picture: "3_circus_5.png"
  },
  {
    name: "Circus",
    cost: ["stone", "stone", "stone", "ore"],
    functionality: ["war", "war", "war"],
    type: "War",
    upgradeTo: null,
    era: 3,
    numPlayers: 6,
    picture: "3_circus_6.png"
  },
  {
    name: "Circus",
    cost: ["stone", "stone", "stone", "ore"],
    functionality: ["war", "war", "war"],
    type: "War",
    upgradeTo: null,
    era: 3,
    numPlayers: 4,
    picture: "3_circus_4.png"
  },
  {
    name: "Fortifications",
    cost: ["ore", "ore", "ore", "stone"],
    functionality: ["war", "war", "war"],
    type: "War",
    upgradeTo: null,
    era: 3,
    numPlayers: 7,
    picture: "3_fortifications_7.png"
  },
  {
    name: "Fortifications",
    cost: ["ore", "ore", "ore", "stone"],
    functionality: ["war", "war", "war"],
    type: "War",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_fortifications_3.png"
  },
  {
    name: "Siege Workshop",
    cost: ["clay", "clay", "clay", "wood"],
    functionality: ["war", "war", "war"],
    type: "War",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_siege_workshop_3.png"
  },
  {
    name: "Siege Workshop",
    cost: ["clay", "clay", "clay", "wood"],
    functionality: ["war", "war", "war"],
    type: "War",
    upgradeTo: null,
    era: 3,
    numPlayers: 5,
    picture: "3_siege_workshop_5.png"
  },//technology
  {
    name: "Univeristy",
    cost: ["wood", "wood", "papyrus", "glass"],
    functionality: ["tablet"],
    type: "Technology",
    upgradeTo: null,
    era: 3,
    numPlayers: 4,
    picture: "3_university_4.png"
  },
  {
    name: "Univeristy",
    cost: ["wood", "wood", "papyrus", "glass"],
    functionality: ["tablet"],
    type: "Technology",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_university_3.png"
  },
  {
    name: "Observatory",
    cost: ["ore", "ore", "glass", "textile"],
    functionality: ["gear"],
    type: "Technology",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_observatory_3.png"
  },
  {
    name: "Observatory",
    cost: ["ore", "ore", "glass", "textile"],
    functionality: ["gear"],
    type: "Technology",
    upgradeTo: null,
    era: 3,
    numPlayers: 7,
    picture: "3_observatory_7.png"
  },
  {
    name: "Academy",
    cost: ["stone", "stone", "stone", "glass"],
    functionality: ["compass"],
    type: "Technology",
    upgradeTo: null,
    era: 3,
    numPlayers: 7,
    picture: "3_academy_7.png"
  },
  {
    name: "Academy",
    cost: ["stone", "stone", "stone", "glass"],
    functionality: ["compass"],
    type: "Technology",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_academy_3.png"
  },
  {
    name: "Lodge",
    cost: ["clay", "clay", "papyrus", "textile"],
    functionality: ["compass"],
    type: "Technology",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_lodge_3.png"
  },
  {
    name: "Lodge",
    cost: ["clay", "clay", "papyrus", "textile"],
    functionality: ["compass"],
    type: "Technology",
    upgradeTo: null,
    era: 3,
    numPlayers: 6,
    picture: "3_lodge_6.png"
  },
  {
    name: "Study",
    cost: ["wood", "papyrus", "textile"],
    functionality: ["gear"],
    type: "Technology",
    upgradeTo: null,
    era: 3,
    numPlayers: 5,
    picture: "3_study_5.png"
  },
  {
    name: "Study",
    cost: ["wood", "papyrus", "textile"],
    functionality: ["gear"],
    type: "Technology",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_study_3.png"
  },//trading
  {
    name: "Lighthouse",
    cost: ["stone", "glass"],
    functionality: [1, 1, "Trading"],
    type: "Trading",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_lighthouse_3.png"
  },
  {
    name: "Lighthouse",
    cost: ["stone", "glass"],
    functionality: [1, 1, "Trading"],
    type: "Trading",
    upgradeTo: null,
    era: 3,
    numPlayers: 6,
    picture: "3_lighthouse_6.png"
  },
  {
    name: "Chamber of Commerce",
    cost: ["clay", "clay", "papyrus"],
    functionality: [2, 2, "Processed Resource"],
    type: "Trading",
    upgradeTo: null,
    era: 3,
    numPlayers: 4,
    picture: "3_chamber_of_commerce_4.png"
  },
  {
    name: "Chamber of Commerce",
    cost: ["clay", "clay", "papyrus"],
    functionality: [2, 2, "Processed Resource"],
    type: "Trading",
    upgradeTo: null,
    era: 3,
    numPlayers: 6,
    picture: "3_chamber_of_commerce_6.png"
  },
  {
    name: "Haven",
    cost: ["wood", "ore", "textile"],
    functionality: [1, 1, "Raw Resource"],
    type: "Trading",
    upgradeTo: null,
    era: 3,
    numPlayers: 4,
    picture: "3_haven_4.png"
  },
  {
    name: "Haven",
    cost: ["wood", "ore", "textile"],
    functionality: [1, 1, "Raw Resource"],
    type: "Trading",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_haven_3.png"
  },
  {
    name: "Arena",
    cost: ["stone", "stone", "ore"],
    functionality: [3, 1, "Wonder"],
    type: "Trading",
    upgradeTo: null,
    era: 3,
    numPlayers: 3,
    picture: "3_arena_3.png"
  },
  {
    name: "Arena",
    cost: ["stone", "stone", "ore"],
    functionality: [3, 1, "Wonder"],
    type: "Trading",
    upgradeTo: null,
    era: 3,
    numPlayers: 5,
    picture: "3_arena_5.png"
  },
  {
    name: "Arena",
    cost: ["stone", "stone", "ore"],
    functionality: [3, 1, "Wonder"],
    type: "Trading",
    upgradeTo: null,
    era: 3,
    numPlayers: 7,
    picture: "3_arena_7.png"
  },//guild
  {
    name: "Strategists Guild",
    cost: ["ore", "ore", "stone", "textile"],
    functionality: [1, "left", "right", "-1 War Token"],
    type: "Guild",
    upgradeTo: null,
    era: 3,
    numPlayers: null,
    picture: "3_strategists_guild.png"
  },
  {
    name: "Workers Guild",
    cost: ["ore", "ore", "clay", "stone", "wood"],
    functionality: [1, "left", "right", "Raw Resource"],
    type: "Guild",
    upgradeTo: null,
    era: 3,
    numPlayers: null,
    picture: "3_workers_guild.png"
  },
  {
    name: "Spies Guild",
    cost: ["clay", "clay", "clay", "glass"],
    functionality: [1, "left", "right", "War"],
    type: "Guild",
    upgradeTo: null,
    era: 3,
    numPlayers: null,
    picture: "3_spies_guild.png"
  },
  {
    name: "Magistrates Guild",
    cost: ["wood", "wood", "wood", "stone", "textile"],
    functionality: [1, "left", "right", "Victory Points"],
    type: "Guild",
    upgradeTo: null,
    era: 3,
    numPlayers: null,
    picture: "3_magistrates_guild.png"
  },
  {
    name: "Craftsmens Guild",
    cost: ["ore", "ore", "stone", "stone"],
    functionality: [2, "left", "right", "Processed Resource"],
    type: "Guild",
    upgradeTo: null,
    era: 3,
    numPlayers: null,
    picture: "3_craftsmens_guild.png"
  },
  {
    name: "Builders Guild",
    cost: ["stone", "stone", "clay", "clay", "glass"],
    functionality: [1, "left", "right", "self", "Wonder"],
    type: "Guild",
    upgradeTo: null,
    era: 3,
    numPlayers: null,
    picture: "3_builders_guild.png"
  },
  {
    name: "Scientists Guild",
    cost: ["wood", "wood", "ore", "ore", "papyrus"],
    functionality: ["Technology"],
    type: "Guild",
    upgradeTo: null,
    era: 3,
    numPlayers: null,
    picture: "3_scientists_guild.png"
  },
  {
    name: "Philosophers Guild",
    cost: ["clay", "clay", "clay", "papyrus", "textile"],
    functionality: [1, "left", "right", "Technology"],
    type: "Guild",
    upgradeTo: null,
    era: 3,
    numPlayers: null,
    picture: "3_philosophers_guild.png"
  },
  {
    name: "Traders Guild",
    cost: ["glass", "textile", "papyrus"],
    functionality: [1, "left", "right", "Trading"],
    type: "Guild",
    upgradeTo: null,
    era: 3,
    numPlayers: null,
    picture: "3_traders_guild.png"
  },
  {
    name: "Shipowners Guild",
    cost: ["wood", "wood", "wood", "glass", "papyrus"],
    functionality: [1, "Raw Resource", "Processed Resource", "Guild"],
    type: "Guild",
    upgradeTo: null,
    era: 3,
    numPlayers: null,
    picture: "3_shipowners_guild.png"
  }
];

ageIIICards.forEach(function(card){
  Card.create(card)
});
