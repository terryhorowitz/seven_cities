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
            }

            // console.log('left',scope.left);
        }


    };

});
