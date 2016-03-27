app.directive('otherPlayers', function ($rootScope, $state, $uibModal) {

    return {
        restrict: 'E',
        scope: {
            left: '=',
            right: '=',
            other: '='
        },
        templateUrl: 'js/other-players/other-players.html',
        link: function(scope){
            scope.showNeighbor = function(neighbor) {
                $uibModal.open({
                    animation: scope.animationsEnabled,
                    templateUrl: 'myModalContent',
                    size: 'large',
                    scope: scope
                })
                scope.neighborView = true;

                scope.neighbor = neighbor;
                scope.neighborWonders = [1, 2, 3];
                console.log('this is neighbor', scope.neighbor)
                scope.minuses = [];
                scope.pluses = 0;
                scope.coin = neighbor.money;

                //duplicate logic in game.js, ideally we could put these values in the player object in the backend
                scope.neighbor.tokens.forEach(function(token) {
                    if (token === -1) {
                        scope.minuses.push(token);
                    } else scope.pluses.push(token);
                })

            }

            // console.log('left',scope.left);
        }


    };

});
