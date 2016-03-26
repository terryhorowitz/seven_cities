module.exports = {
  
    getGame: function(gameId){
        return Game.findOne({where: {id: gameId}, include: [{all: true}]})
    }, 
  
    getNeighbors: function(player){
      return Promise.join(player.getLeftNeighbor(), player.getRightNeighbor())
    },
  
    getPlayer: function (playerId){
      return Player.findOne({where: {id: playerId}, include: [{all:true}]})
      .then(function(_player){
        player = _player;
      })
    }, 
  
    getCard: function (cardId){
      return Card.findOne({where: {id: cardId}, include: [{all:true}]})
      .then(function(_card){
        card = _card;
      })
    }, 
  
    getPermanentFor: function(query, left, right){
     return Promise.join(left.getPermanent(query), right.getPermanent(query))    
    }, 
                         
    getTemporaryFor: function(query, left, right){
     return Promise.join(left.getTemporary(query), right.getTemporary(query))    
    }, 
                         
                         

  
}