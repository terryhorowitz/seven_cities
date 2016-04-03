'use strict';

app.factory('TradeFactory', function(){
  var TradeFactory = {};
  
  TradeFactory.isValidTrade = function (tradeInput, total) {
    console.log('validation', tradeInput, total)
    var combinedTrade = [].slice.call(tradeInput.left).concat([].slice.call(tradeInput.right)).concat([].slice.call(tradeInput.self)).sort(function(a,b){ return a > b });
    var totalCopy = [].slice.call(total).sort(function(a,b){ return a > b });
    for (var i = 0; i < totalCopy.length; i++){
    	if (combinedTrade[i] !== totalCopy[i]) return false;
    }
    return true;
  }
  
  return TradeFactory;
});