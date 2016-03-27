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
                    templateUrl: 'myModalContent.html',
                    size: 'large',
                })
                scope.neighborView = true;
                console.log('this is neighbor', neighbor)
                scope.neighbor = neighbor;
            }

            console.log(scope.left);
        }


    };

});
