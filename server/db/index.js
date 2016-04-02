'use strict';

var Sequelize = require('sequelize');
var gameDB;

if(process.env.HEROKU_POSTGRESQL_PUCE_URL){
  gameDB = new Sequelize(process.env.HEROKU_POSTGRESQL_PUCE_URL, {
    dialect: 'postgres',
    port: 5432,
    logging: false
  });
} else {
  gameDB = new Sequelize('gamedb', '', null, {
    dialect: 'postgres',
    port: 5432,
    logging: false
  });
}

module.exports = {
  promiseForGameDB: gameDB
                    .authenticate()
                    .then(function(){
                      console.log("we're connected . . . now!")
                    })
                    .catch(function(err){
                      console.log('problem connecting:', err)
                    }),
  db: gameDB
}
