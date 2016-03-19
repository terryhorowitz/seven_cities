'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Card = db.define('card', {
    name: Sequelize.STRING,
    cost: Sequelize.ARRAY(Sequelize.STRING),
    functionality: Sequelize.ARRAY(Sequelize.STRING),
    type: {
      type: Sequelize.ENUM,
      values: ["Raw Resource", "Processed Resource", "War", "Technology", "Victory Points", "Trading", "Guild"]
    },
    upgradeTo: Sequelize.ARRAY(Sequelize.STRING),
    era: Sequelize.ENUM(1,2,3),
    numPlayers: Sequelize.ENUM(3,4,5,6,7),
    picture: Sequelize.STRING
  }, {
    timestamps: false
  });

  return Card;
};