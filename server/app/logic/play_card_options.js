'use strict';
var Game = require('../../db/models').Game
var Board = require('../../db/models').Board
var Deck = require('../../db/models').Deck
var Player = require('../../db/models').Player
var Card = require('../../db/models').Card
var Promise = require('bluebird');
var _ = require('lodash');
var db_getters = require('./db_getters.js');
var Resources = require('./game_resources.js')();

module.exports = function () {

  function checkSelectedCardOptions(playerId, cardId) {
    var player;
    return db_getters.getPlayer(playerId)
    .then(function(_player){
      player = _player;
      return Promise.join(player.getPermanent(), db_getters.getCard(cardId))
    })
    .spread(function(builtCards, card){
      if (!builtCards.length) {
        if (!card.cost) return "get free";
        else if (!!Number(card.cost[0])) {
          if (player.money >= card.cost[0]) return "pay money";
          else return "can't afford";
        }
      }
      else { 
        for (var i = 0; i < builtCards.length; i++) {
          if (builtCards[i].name === card.name) return "already have it";
          else if (!card.cost) return "get free";
          else if (!!Number(card.cost[0])) {
            if (player.money >= card.cost[0]) return "pay money";
            else return "can't afford";
          }
          else if (builtCards[i].upgradeTo) {
            if (builtCards[i].upgradeTo.indexOf(card.name)!==-1) return "upgrade";
          }
        }
      }
      return checkResourcePaymentMethods(player, card.cost);
    })
  }
  
  function checkResourcePaymentMethods(player, cost) {
    var costCopy = _.cloneDeep(cost);
    var playersResources = Resources.getGameResources(player.gameId)[player.id];
    console.log('early', playersResources)
    var ownResourcesCopy = _.cloneDeep(playersResources.self);
    for (var i = 0; i < cost.length; i++) {
      if (!!ownResourcesCopy[cost[i]]) {
        ownResourcesCopy[cost[i]]--;
        _.pullAt(costCopy, costCopy.indexOf(cost[i]))
      }
    }
    console.log('before recurse/exit', costCopy)
    var copyAllPlayerResources = _.cloneDeep(playersResources);
    if (!costCopy.length) return 'paid by own resources';
    else return checkOtherPossibilities(copyAllPlayerResources, costCopy);
  }
  
  function combiningFunc(objValue, srcValue){
      if (_.isArray(objValue)){
        return objValue.concat(srcValue);
      }
      else {
        if (objValue && srcValue){
          return objValue + srcValue;
        }
        else if (objValue){
          return objValue;
        }
        else if (srcValue) return srcValue;
      }
  }

  function filterCombo (rsc, cost){
    if (!rsc.combo) return [];
    return rsc.combo.filter(function(r){
      return r.some(function(e){
        return cost.indexOf(e) > -1;      
      })
    })
  }
  
  function filterResourceKeys (rscs, cost){
    for (var resource in rscs) {
      if (cost.indexOf(resource) === -1 && resource !== 'combo'){
        delete rscs[resource];
      }
    }
  }
  
  function checkOtherPossibilities(resources, leftOverCost){
    console.log('own stuff - should not mutate!!', resources)
    var ownResourcesComboCopy = _.cloneDeep(resources.self.combo) || [];
    var allResources = _.merge(_.cloneDeep(resources.left), _.cloneDeep(resources.right), combiningFunc);
    console.log('pre filter',allResources, ownResourcesComboCopy)
    allResources.combo = allResources.combo || [];
    allResources.combo = allResources.combo.concat(ownResourcesComboCopy);
    filterResourceKeys(allResources, leftOverCost);
    allResources.combo = filterCombo(allResources, leftOverCost);
    var costForRecursion = _.cloneDeep(leftOverCost);
    var resourcesForRecursion = _.cloneDeep(allResources);
    console.log('checking',resourcesForRecursion, costForRecursion)
    if (recursivelyCheckCombos(resourcesForRecursion, costForRecursion)){
      console.log('true things', resources, leftOverCost)
      filterResourceKeys(resources.left, leftOverCost);
      filterResourceKeys(resources.right, leftOverCost);
      resources.left.combo = filterCombo(resources.left, leftOverCost);
      resources.right.combo = filterCombo(resources.right, leftOverCost);
      resources.self.combo = filterCombo(resources.self, leftOverCost);
      return {
        self: resources.self.combo,
        left: resources.left,
        right: resources.right,
        cost: leftOverCost
      }
    }
    else return 'no trade available!';
  }
  
  function recursivelyCheckCombos(allResources, leftOverCost){
    var costCopy = _.cloneDeep(leftOverCost);
    console.log('pre for', allResources, leftOverCost)
    for (var i = 0; i < costCopy.length; i++){
      if (allResources[leftOverCost[i]]){
        allResources[leftOverCost[i]]--;
        _.pullAt(leftOverCost, leftOverCost.indexOf(leftOverCost[i]));
      }
    }
    console.log('recurse', leftOverCost, allResources)
    if (!leftOverCost.length) return true;
    if (!allResources.combo.length) return false;
    
    var comboToCheck = allResources.combo.pop();
    for (var j = 0; j < comboToCheck.length; j++){
      var cost = _.cloneDeep(leftOverCost);
      var rscCopy = _.cloneDeep(allResources);
      if (!rscCopy[comboToCheck[j]]) rscCopy[comboToCheck[j]] = 1;
      else rscCopy[comboToCheck[j]]++;
      if (recursivelyCheckCombos(rscCopy, costCopy)) return true;
      if (!recursivelyCheckCombos(rscCopy, costCopy)) return false;
    }
  }

  function checkIfPlayerCanBuildWonder(playerId){
    return db_getters.getPlayer(playerId)
    .then(function(player){
      if (player.wondersBuilt === 0) return checkResourcePaymentMethods(player, player.board.wonder1Cost);
      if (player.wondersBuilt === 1) return checkResourcePaymentMethods(player, player.board.wonder2Cost);
      if (player.wondersBuilt === 2) return checkResourcePaymentMethods(player, player.board.wonder3Cost);
      if (player.wondersBuilt === 3) return 'all built';
    })
  }
  
  return {
    checkSelectedCardOptions: checkSelectedCardOptions,
    checkIfPlayerCanBuildWonder: checkIfPlayerCanBuildWonder
  }
}