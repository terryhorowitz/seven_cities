
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
    points: 5,
    money: 6 },
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
    points: 4,
    money: 12 } ]

    // console.log(p)

var findWinner = function (allPlayers) {
    console.log('allPlayers', allPlayers)


var topScore = Math.max.apply(Math.array.map(function(allPlayers){return allPlayers.points;
}))


    var topScore = _.maxBy(p, function(p) { 
      console.log('inside lodash player is', p)
      return p.points;
       });
    console.log('topScore', topScore)
    var winner = _.filter(allPlayers, {'name': 1 });
    console.log('winner', winner);
    if (winner.length === 1) return winner.name
    else if (winner.length > 1) {
      var topMoney = _.maxBy(winner, function(player) { return player.money });
      return topMoney;
    } else {
      return "There was an error determining the winner";
    }
  }

  console.log(findWinner(p))


  function maxBy(array, iteratee) {
      return (array && array.length)
        ? baseExtremum(array, getIteratee(iteratee), gt)
        : undefined;
    }

    function baseExtremum(array, iteratee, comparator) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      var value = array[index],
          current = iteratee(value);

      if (current != null && (computed === undefined
            ? current === current
            : comparator(current, computed)
          )) {
        var computed = current,
            result = value;
      }
    }
    return result;
  }

  function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }
