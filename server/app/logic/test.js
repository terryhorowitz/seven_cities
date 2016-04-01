
'use strict';
var _ = require('lodash');

var p = [ { name: 1,
  player: 
     { dataValues: [Object],
       _previousDataValues: [Object],
       _changed: {},
       '$modelOptions': [Object],
       '$options': [Object],
       hasPrimaryKeys: true,
       __eagerlyLoadedAssociations: [],
       isNewRecord: false,
       Permanent: [Object],
       Temporary: [Object],
       LeftNeighbor: [Object],
       RightNeighbor: [Object],
       board: [Object] },
    points: 15,
    money: 12 },
  { name:2,
    player: 
     { dataValues: [Object],
       _previousDataValues: [Object],
       _changed: {},
       '$modelOptions': [Object],
       '$options': [Object],
       hasPrimaryKeys: true,
       __eagerlyLoadedAssociations: [],
       isNewRecord: false,
       Permanent: [Object],
       Temporary: [Object],
       LeftNeighbor: [Object],
       RightNeighbor: [Object],
       board: [Object] },
    points: 4,
    money: 9 },
  { name: 3,
    player: 
     { dataValues: [Object],
       _previousDataValues: [Object],
       _changed: {},
       '$modelOptions': [Object],
       '$options': [Object],
       hasPrimaryKeys: true,
       __eagerlyLoadedAssociations: [],
       isNewRecord: false,
       Permanent: [],
       Temporary: [Object],
       LeftNeighbor: [Object],
       RightNeighbor: [Object],
       board: [Object] },
    points: 15,
    money: 12 } ]

    // console.log(p)

var findWinner = function (allPlayers) {
    var topScore = allPlayers.sort(function(a,b) {
      return a.points<b.points;
    })
    var winner = _.filter(allPlayers, {'points': topScore[0].points });
    if (winner.length === 1) return winner[0].name
    else if (winner.length > 1) {
      var topMoney = winner.sort(function(a,b) {
        return a.money<b.money;
      })
      var moneyWinner = _.filter(allPlayers, {'money': topMoney[0].money });
      return moneyWinner;
    } else {
      return "There was an error determining the winner";
    }
  }

  console.log('the winner is', findWinner(p))


  // function maxBy(array, iteratee) {
  //     return (array && array.length)
  //       ? baseExtremum(array, getIteratee(iteratee), gt)
  //       : undefined;
  //   }

  //   function baseExtremum(array, iteratee, comparator) {
  //   var index = -1,
  //       length = array.length;

  //   while (++index < length) {
  //     var value = array[index],
  //         current = iteratee(value);

  //     if (current != null && (computed === undefined
  //           ? current === current
  //           : comparator(current, computed)
  //         )) {
  //       var computed = current,
  //           result = value;
  //     }
  //   }
  //   return result;
  // }

  // function getIteratee() {
  //     var result = lodash.iteratee || iteratee;
  //     result = result === iteratee ? baseIteratee : result;
  //     return arguments.length ? result(arguments[0], arguments[1]) : result;
  //   }
