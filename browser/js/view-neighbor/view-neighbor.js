app.directive('viewNeighbor', function ($rootScope, $state, $uibModal) {

    return {
        restrict: 'E',
        templateUrl: 'js/view-neighbor/view-neighbor.html',
        scope: {},
        link: function(scope){
            console.log('here')
            scope.close = function() {
                console.log('here inside')
                // $uibModal.dismiss('cancel')
            }
            scope.test = function() {
                console.log('here inside')
                // $uibModal.dismiss('cancel')
            }

        }

    };

});
