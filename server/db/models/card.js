'use strict';

var Sequelize = require('sequelize');

module.exports = function(db) {
  var Card = db.define('Card', {
    name: Sequelize.STRING,
    era: Sequelize.STRING, //do we need this?
    type: Sequelize.ENUM ("Raw Resource", "Processed Resource", "War", "Technologies", "Victory Points", "Trading", "Guilds")
  }, {
    timestamps: false
  });

  return Card;
};