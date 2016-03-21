'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Card = db.define('card', {
    name: Sequelize.STRING,
    cost: Sequelize.ARRAY(Sequelize.STRING),
    functionality: Sequelize.ARRAY(Sequelize.STRING),
    type: {
      type: Sequelize.ENUM,
      values: ["Raw Resource", "Processed Resource", "War", "Technologies", "Victory Points", "Trading", "Guilds"]
    },
    upgradeTo: Sequelize.STRING,
    era: Sequelize.STRING, //do we need this?
    numPlayers: Sequelize.ENUM(3,4,5,6,7),
    picture: Sequelize.STRING
  }, {
    timestamps: false
  });

  return Card;
};