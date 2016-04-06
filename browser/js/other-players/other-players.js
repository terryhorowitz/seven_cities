app.directive('otherPlayers', function ($rootScope, $state, $uibModal) {

    return {
        restrict: 'E',
        scope: {
            left: '=',
            right: '=',
            other: '='        },
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
                scope.minuses = neighbor.minuses;
                scope.pluses = neighbor.pluses;
                scope.money = neighbor.money;

                scope.background = {'background': 'url(img/background/' + scope.neighbor.board.name + '.png) no-repeat center center', 'background-size': 'cover'}

                // $scope.background = {background: 'url(img/background/' + $scope.me.board.name + '.png) no-repeat center center fixed', 'background-size': 'cover', 'min-height': '100%'};
                scope.expandPile = function (pile) {
                    if (!scope.clickedPile) scope.clickedPile = pile;
                    else scope.clickedPile = false;
                  }
                  

            }

        }

    };

});
