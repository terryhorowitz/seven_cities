'use strict';

app.directive('chat', function () {
  return {
    restrict: 'E',
    templateUrl: '/js/chat/chat.html',
    scope: {
      playername: '='
    },
    link: function(scope) {
      scope.msgs = [];

      scope.sendMsg = function() {
        scope.msg.player = scope.playername
        scope.$emit('messageSent', {'player': scope.msg.player, 'content': scope.msg.text})
        scope.msg.text = ''
      } 

      scope.hideChat = function() {
        if (scope.minimizeChat) {
          document.getElementById('messageList').style.height = '250px';
          scope.minimizeChat = false;
        }
        else {
          document.getElementById('messageList').style.height = '0px';
          scope.minimizeChat = true;
        }
      }

      scope.$on('messageReceived', function(data, args) {
        scope.msgs.push(args)
        scope.$digest()
        var objDiv = document.getElementById("messageList");
        objDiv.scrollTop = objDiv.scrollHeight
      })
    }
  }
})