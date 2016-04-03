app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('game', {
        url: '/game',
        params: {roomname: null, playername: null},
        controller: 'GameController',
        templateUrl: 'js/game/game.html'
    });

});

app.controller('GameController', function ($scope, $state, TradeFactory) {

    var socket = io(window.location.origin); 
    $scope.socket = socket;
    $scope.roomname = $state.params.roomname;
    $scope.playername = $state.params.playername;

    $scope.firstPlayer = false;
    $scope.currentEra = 0;
    $scope.builtCards;
    $scope.players;
    $scope.money;
    $scope.currentlyPlaying = false;
//    $scope.me;
    $scope.myHand;
    $scope.rightNeighbor;
    $scope.leftNeighbor;
    $scope.wonderOptions = [1, 2, 3];
    $scope.nonNeighbors = [];
    $scope.submitted = false;
    $scope.background = {background: 'url(/img/map.jpg) no-repeat center center fixed', 'background-size': 'cover', 'min-height': '100%'};
    $scope.warResults = false;
    $scope.alreadyBuiltForFree = {
        1: true,
        2: true,
        3: true
      }

    //a function to allow a players (first player in the room?) to initialize the game with the current number of players

    $scope.clearLocal = function() {
      localStorage.clear();
    }

    $scope.startGame = function() {
    	socket.emit('startGame')
    }

    socket.on('connect', function(){
      console.log('I have made a persistent two-way connection to the server!');
      var tempId = localStorage.getItem('playerId');
      if (tempId) $scope.playerId = tempId;
      socket.emit('create', {roomname: $scope.roomname, playername: $scope.playername, localId: tempId});

      socket.on('in room', function(data) {
        console.log('this is in room', data);
        $scope.inRoom = data.join(', ');
        $scope.$digest();
      })

      socket.on('your id', function(data) {
        $scope.playerId = data;
        localStorage.setItem('playerId', data)
      })

      socket.on('firstPlayer', function() {
      	$scope.firstPlayer = true;
      	$scope.$digest()
      })
      //need to initiate game when all players are ready (create a game in the db)
      socket.on('game initialized', function(data) {
        $scope.currentlyPlaying = true;
        $scope.players = data;
        //find myself
        for (var i = 0; i < data.length; i++) {
          var thisSocket = $scope.players[i].socket.slice(2);
          if (thisSocket == socket.id) {
            $scope.me = $scope.players[i];
            $scope.money = $scope.players[i].money;

            if ($scope.players[i].pluses) {
              $scope.pluses = $scope.players[i].pluses;
            } else {
              $scope.pluses = 0;
            }
            if ($scope.players[i].minuses) {
              $scope.minuses = $scope.players[i].minuses;
            } else {
              $scope.minuses = 0;
            }
        
          }
        }
        //find my neighbors (need to find myself first!)
        for (var i = 0; i < data.length; i++) {
          var thisSocket = $scope.players[i].socket.slice(2);
          if ($scope.players[i].socket == $scope.me.neighborL && thisSocket !== socket.id) {
            $scope.leftNeighbor = $scope.players[i];
          } else if ($scope.players[i].socket == $scope.me.neighborR && thisSocket !== socket.id) {
            $scope.rightNeighbor = $scope.players[i];
          } else if (thisSocket !== socket.id) {
            $scope.nonNeighbors.push($scope.players[i]);
          }
        }

        // console.log('left', $scope.leftNeighbor, 'right', $scope.rightNeighbor, 'nonNeighbors', $scope.nonNeighbors)
        // console.log('me',$scope.me)
        $scope.background = {background: 'url(img/background/' + $scope.me.board.name + '.png) no-repeat center center fixed', 'background-size': 'cover', 'min-height': '100%'};
            // console.log('backgd',$scope.background)

        $scope.$digest()
      })

      socket.on('your hand', function(data) {
        if(data.length === 7) {
          $scope.currentEra++;
        }
        $scope.myHand = data;
        $scope.waitingOn = null;
        $scope.$digest();
      })

      socket.on('waiting on', function(data) {
        if ($scope.waitingOn) {
          $scope.waitingOn += ', ' + data;
        } else {
          $scope.waitingOn = data;
        }
        $scope.$digest();
      })

        $scope.submitChoice = function(selection){
          $scope.submitted = true;
          if (selection === "Build (free once per era)") {
            $scope.alreadyBuiltForFree[$scope.currentEra] = false;
            selection = 'Build for free';
          }
          socket.emit('submit choice', {choice: selection, cardId: $scope.cardSelection.id, playerId: $scope.playerId});
          $scope.playOptions = null;
        }
                
      socket.on('your options', function(options) {
        $scope.hasWonderTrade = false;
        $scope.hasTrade = false;
        var opts = options.map(function(option) {
          if (typeof option !== 'string' && option.wonder) {
            $scope.hasWonderTrade = true;
            var leftArr = [], rightArr = [];
            for (var key in option.left){
              if (key !== 'combo'){
                while (option.left[key] > 0){
                  leftArr.push(key);
                  option.left[key]--;
                }
              }
            }
            for (var key in option.right){
              if (key !== 'combo'){
                while (option.right[key] > 0){
                  rightArr.push(key);
                  option.right[key]--;
                }
              }
            }
            $scope.leftWonderTradeOptions = {
              combo: option.left.combo,
              other: leftArr
            }
            $scope.rightWonderTradeOptions = {
              combo: option.right.combo,
              other: rightArr
            }
            $scope.playerWonderTradeOptions = option.self;
            $scope.wonderTradeCost = option.cost.join(', ');
            $scope.wonderTradeCostArr = option.cost;
          } else if (option === "wonder paid by own resources"){
            return "Build Wonder"
          }
          else if (typeof option !== 'string' && !option.wonder) {
            $scope.hasTrade = true;
            var leftArr = [], rightArr = [];
            for (var key in option.left){
              if (key !== 'combo'){
                while (option.left[key] > 0){
                  leftArr.push(key);
                  option.left[key]--;
                }
              }
            }
            for (var key in option.right){
              if (key !== 'combo'){
                while (option.right[key] > 0){
                  rightArr.push(key);
                  option.right[key]--;
                }
              }
            }
            $scope.leftTradeOptions = {
              combo: option.left.combo,
              other: leftArr
            }
            $scope.rightTradeOptions = {
              combo: option.right.combo,
              other: rightArr
            }
            $scope.playerTradeOptions = option.self;
            $scope.tradeCostArr = option.cost;
            $scope.tradeCost = option.cost.join(', ');
          } else if (option === 'Discard') {
            return option;
          } else if (option === 'get free' || option === 'paid by own resources') {
            return 'Build for free';
          } else if (option === 'pay money') {
            return "Pay 1 coin";
          } else if (option === 'upgrade') {
            return 'Upgrade for free'
          } else if (option === 'build wonder') {
            return 'Build wonder for free';
          } else return "";
        })
        $scope.playOptions = opts.filter(function(o){
          return typeof o === 'string' && o.length > 0;
        })
        if ($scope.me.board.name === "Olympia" && $scope.me.wondersBuilt >= 2 && $scope.alreadyBuiltForFree[$scope.currentEra]) {
          $scope.playOptions.push('Build (free once per era)')
        }
        $scope.$digest();
      })

      $scope.trade = {
        left: [],
        right: [],
        self: []
      };
      $scope.wonderTrade = {
        left: [],
        right: [],
        self: []
      };
      $scope.tradeAlert = null;
      $scope.submitTrade = function(){
        if (!TradeFactory.isValidTrade($scope.trade, $scope.tradeCostArr)){
          $scope.tradeAlert = {type: 'warning', msg: 'wrong resources'};
        }
        else {
          var tradeObj = {};
          tradeObj.left = $scope.trade.left.filter(function(e){ return e; });
          tradeObj.right = $scope.trade.right.filter(function(e){ return e; }); 
          if (!tradeObj.left.length) tradeObj.left = null;
          if (!tradeObj.right.length) tradeObj.right = null;
          tradeObj.wonder = false;
          $scope.playOptions = null;
          $scope.submitted = true;
          console.log('before emit trade', tradeObj)
          socket.emit('submit choice', {choice: tradeObj, cardId: $scope.cardSelection.id, playerId: $scope.playerId});
        }
      }; 
      $scope.wonderTradeAlert = null;
      $scope.submitWonderTrade = function () {
        if (!TradeFactory.isValidTrade($scope.wonderTrade, $scope.wonderTradeCostArr)){
          $scope.wonderTradeAlert = {type: 'warning', msg: 'wrong resources'};
        }
        else {
          var tradeObj = {};
          tradeObj.left = $scope.wonderTrade.left;
          tradeObj.right = $scope.wonderTrade.right;
          if (!tradeObj.left.length) tradeObj.left = null;
          if (!tradeObj.right.length) tradeObj.right = null;
          tradeObj.wonder = true;
          $scope.playOptions = null;
          $scope.submitted = true;
          socket.emit('submit choice', {choice: tradeObj, cardId: $scope.cardSelection.id, playerId: $scope.playerId}); 
        }
      }
      
      // $scope.tradeCollapse = true;
      $scope.toggleTradeCollapse = function () {
        $scope.wonderTradeCollapse = true;
        $scope.tradeCollapse ? $scope.tradeCollapse = false : $scope.tradeCollapse = true;
      }
      
      // $scope.wonderTradeCollapse = true;
      $scope.toggleWonderTradeCollapse = function () {
        $scope.tradeCollapse = true;
        $scope.wonderTradeCollapse ? $scope.wonderTradeCollapse = false : $scope.wonderTradeCollapse = true;
      }
      
      $scope.closeWonderTradeAlert = function(){
        $scope.wonderTradeAlert = null;
        $scope.$digest();
      }
      
      $scope.closeTradeAlert = function(){
        $scope.tradeAlert = null;
        $scope.$digest();
      }

      socket.on('err', function(data) {
        $scope.err = data.message;
        $scope.$digest();
      })

      socket.on('new round', function(data) {
        console.log('data in new round', data)
        $scope.submitted = false;
        $scope.players = data;
        for (var i = 0; i < data.length; i++) {
          var thisSocket = $scope.players[i].socket.slice(2);
          if (thisSocket == socket.id) {
            $scope.me = $scope.players[i];
            $scope.money = $scope.me.money;
            $scope.pluses = $scope.players[i].pluses;
            $scope.minuses = $scope.players[i].minuses;
        
          }
        }

        for (var i = 0; i < data.length; i++) {
          var thisSocket = $scope.players[i].socket.slice(2);
          if ($scope.players[i].socket == $scope.me.neighborL && thisSocket !== socket.id) {
            $scope.leftNeighbor = $scope.players[i];
          } else if ($scope.players[i].socket == $scope.me.neighborR && thisSocket !== socket.id) {
            $scope.rightNeighbor = $scope.players[i];
          } else if (thisSocket !== socket.id) {
            $scope.nonNeighbors.push($scope.players[i]);
          }
        }
        $scope.$digest();
      })
      //player submits their choice
      $scope.selectCard = function(card) {
        $scope.tradeCollapse = false;
        $scope.wonderTradeCollapse = false;
        $scope.cardSelection = card;
        console.log('this is card and id in seleect card', card, $scope.playerId)
        socket.emit('choice made', {player: $scope.playerId, card: card.id});
      };

      $scope.dismiss = function() {
        $scope.err = null;
      };


    });

      $scope.clickedPile = false;
      $scope.minimizeChat = true;

      $scope.expandPile = function (pile) {
        if (!$scope.clickedPile) $scope.clickedPile = pile;
        else $scope.clickedPile = false;
      }

      // chat stuff

      $scope.$on('messageSent', function(data, args) {
        socket.emit('send msg', args)
      });

      socket.on('get msg', function(message) {
        $scope.$broadcast('messageReceived', message)
      });


      $scope.set_wonder = function(wonder) {
        if ($scope.me && wonder <= $scope.me.wondersBuilt) {
          return {
            '-webkit-filter' : 'grayscale(100%)',
            'filter' : 'grayscale(100%)'  
          }
        }
      }

      //************* war results *****************

      socket.on('war results', function(warResults) {
        $scope.$broadcast('warHappened', warResults)
      });



      //************* game results *****************

      socket.on('game results', function(gameResults) {
        // console.log('@@@@@@@@@@game results', gameResults);
        $scope.$broadcast('gameEnded', gameResults);
      });



      //************* game ended *****************

      $scope.$on('leave game', function() {
        console.log('@@@@@@@@@@leaving game');
        socket.emit('delete game');
      });


});

