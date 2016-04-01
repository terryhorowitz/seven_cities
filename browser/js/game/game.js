app.config(function ($stateProvider) {

    // Register our *about* state.
    $stateProvider.state('game', {
        url: '/game',
        params: {roomname: null, playername: null},
        controller: 'GameController',
        templateUrl: 'js/game/game.html'
    });

});

app.controller('GameController', function ($scope, $state) {

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
    // $scope.me;
    $scope.myHand;
    $scope.rightNeighbor;
    $scope.leftNeighbor;
    $scope.wonderOptions = [1, 2, 3];
    $scope.nonNeighbors = [];
    $scope.submitted = false;
    $scope.background = {background: 'url(/img/map.jpg) no-repeat center center fixed', 'background-size': 'cover', 'min-height': '100%'};
    $scope.warResults = false;

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
        // console.log('game started')
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

      //{"left":null,"right":["ore"]}
      //{"left":null,"right":["papyrus"]}

          $scope.submitChoice = function(selection){
            $scope.submitted = true;
          socket.emit('submit choice', {choice: selection, cardId: $scope.cardSelection.id, playerId: $scope.playerId});
          $scope.playOptions = null;
        }
                
      socket.on('your options', function(options) {
        $scope.wonderTrades = null;
        $scope.tradeOptions = null;
        $scope.playOptions = options.map(function(option) {
          if (typeof option !== 'string' && option.wonder) {
            var wonderNeeds = [];
            var leftPayment = option.left || [];
            var rightPayment = option.right || [];
            option.total = leftPayment.concat(rightPayment)

            for (var i = 0; i < option.total.length; i++){
              var arr = [[],[]];
              arr[0].push(option.total[i]);
              wonderNeeds.push(arr);
            }
            for (var j = 0; j < wonderNeeds.length; j++){
              if (option.left && option.left.length && wonderNeeds[j][0][0] === option.left[0]){
                wonderNeeds[j][1].push('left');
                option.left.shift();
              }
              if (option.right && option.right.length && wonderNeeds[j][0][0] === option.right[0]){
                wonderNeeds[j][1].push('right');
                option.right.shift();
              }
            }
            $scope.tradeOptions = null;
            $scope.wonderTrades = wonderNeeds;
          } else if (option === "wonder paid by own resources"){
            return "Build Wonder"
          }
          else if (typeof option !== 'string' && !option.wonder) {
            var needed = [];
            for (var i = 0; i < option.total.length; i++){
              var arr = [[],[]];
              arr[0].push(option.total[i]);
              needed.push(arr);
            }
            for (var j = 0; j < needed.length; j++){
              if (option.left && option.left.length && needed[j][0][0] === option.left[0]){
                needed[j][1].push('left');
                option.left.shift();
              }
              if (option.right && option.right.length && needed[j][0][0] === option.right[0]){
                needed[j][1].push('right');
                option.right.shift();
              }
          }
            $scope.tradeOptions = needed;
          } else if (option === 'Discard') {
            return option;
          } else if (option === 'get free' || option === 'paid by own resources') {
            return 'Build for free';
          } else if (option === 'pay money') {
            return "Pay 1 coin";
          } else if (option === 'upgrade') {
            return 'Upgrade for free'
          } else if (option === 'build wonder') {
            return 'Build wonder';
          } else return "";
        })
        $scope.$digest();
      })
      
      $scope.trade = {}

      $scope.submitTrade = function(){
        var tradeObj = {};
        tradeObj.left = [];
        tradeObj.right = [];
        for (var key in $scope.trade){
          tradeObj[$scope.trade[key][0]].push($scope.trade[key][1]);
        }
        
        if (!tradeObj.left.length) tradeObj.left = null;
        if (!tradeObj.right.length) tradeObj.right = null;
        tradeObj.wonder = false;
        $scope.playOptions = null;
        socket.emit('submit choice', {choice: tradeObj, cardId: $scope.cardSelection.id, playerId: $scope.playerId});
      }; 
      
      $scope.tradeForWonder = {};
      $scope.submitWonderTrade = function () {
        var tradeObj = {};
        tradeObj.left = [];
        tradeObj.right = [];
        for (var key in $scope.tradeForWonder){
          tradeObj[$scope.tradeForWonder[key][0]].push($scope.tradeForWonder[key][1]);
        }
        
        if (!tradeObj.left.length) tradeObj.left = null;
        if (!tradeObj.right.length) tradeObj.right = null;
        tradeObj.wonder = true;
        $scope.playOptions = null;
        socket.emit('submit choice', {choice: tradeObj, cardId: $scope.cardSelection.id, playerId: $scope.playerId});
      }

      socket.on('err', function(data) {
        $scope.err = data.message;
        $scope.$digest();
      })

      socket.on('new round', function(data) {
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
        $scope.cardSelection = card;
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
      $scope.msgs = [];
      $scope.sendMsg = function() {
        $scope.msg.player = $scope.playername
        socket.emit('send msg', {'player': $scope.msg.player, 'content': $scope.msg.text})
        $scope.msg.text = ''
      } 

      $scope.hideChat = function() {
        if ($scope.minimizeChat) {
          document.getElementById('messageList').style.height = '250px';
          $scope.minimizeChat = false;
        }
        else {
          document.getElementById('messageList').style.height = '0px';
          document.getElementById('messageList').style.padding = '5px';
          $scope.minimizeChat = true;
        }
      }

      socket.on('get msg', function(data) {
        $scope.msgs.push(data)
        $scope.$digest()
        var objDiv = document.getElementById("messageList");
        objDiv.scrollTop = objDiv.scrollHeight
      })



      //************* war results *****************

      socket.on('war results', function(warResults) {
        console.log('@@@@@@@@@@war results', warResults);
        $scope.$broadcast('warHappened', warResults)

      });



});

