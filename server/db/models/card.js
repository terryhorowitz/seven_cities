'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Card = db.define('Card', {
    name: Sequelize.STRING,
    functionality: {
      type: Sequelize.ENUM,
      values: []
    },
    era: Sequelize.STRING, //do we need this?
    type: {
      type: Sequelize.ENUM,
      values: ["Raw Resource", "Processed Resource", "War", "Technologies", "Victory Points", "Trading", "Guilds"]
    },
    numPlayers: Sequelize.ENUM(3,4,5,6,7)
  }, {
    timestamps: false
  });

  return Card;
};